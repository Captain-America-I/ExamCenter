import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { SubjectDetails } from 'src/app/quiz.model';
import { TutionService } from 'src/app/tution.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'app-manage-subject',
  templateUrl: './manage-subject.component.html',
  styleUrls: ['./manage-subject.component.scss']
})
export class ManageSubjectComponent implements OnInit {

  constructor(private tutionService: TutionService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) { }

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('instance', { static: false }) instance: NgbTypeahead;
  subjectForm: FormGroup;
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataLoaded = false;
  subjects: [];
  submitted = false;
  currentSubjectId = '';
  notificationMsg = '';
  showNotificationFlag = false;
  showNotificationErrorFlag = false;

  classesMap = new Map();
  classes: string[] = [];
  selectedClassName: any;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.classes
        : this.classes.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      destroy: true
    };
    // populate classes
    this.tutionService.getAllClassesDetails(this.tutionService.tutionId).subscribe(res => {
      res.forEach(classDetails => {
        this.classesMap.set(classDetails.NAME, classDetails);
        this.classes.push(classDetails.NAME);
      });
    });
    this.subjectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  reloadTableData() {
    this.spinner.show();
    let classId = this.classesMap.get(this.selectedClassName).ID;
    this.tutionService.getAllSubjectDetails(this.tutionService.tutionId, classId).subscribe(res => {
      this.subjects = res;
      this.rerender();
      this.spinner.hide();
    });
  }


  selectedItem(className) {
    this.spinner.show();
    let classId = this.classesMap.get(className.item).ID;
    this.tutionService.getAllSubjectDetails(this.tutionService.tutionId, classId).subscribe(res => {
      this.subjects = res;
      this.rerender();
      this.spinner.hide();
    });
  }

  showNotification(message) {
    this.notificationMsg = message;
    this.showNotificationFlag = true;
    Utils.scrollToTop();
    setTimeout(() => {
      this.notificationMsg = '';
      this.showNotificationFlag = false;
    }, 3000);
  }

  showErorNotification(message) {
    this.notificationMsg = message;
    this.showNotificationErrorFlag = true;
    Utils.scrollToTop();
    setTimeout(() => {
      this.notificationMsg = '';
      this.showNotificationErrorFlag = false;
    }, 3000);
  }

  addSubject() {
    if (this.classesMap.get(this.selectedClassName)) {
      if (this.currentSubjectId == '') {
        this.submitted = true;
        if (this.subjectForm.valid) {
          let classDetails = this.getSubjectDetailsObject();
          this.spinner.show();
          this.tutionService.addSubject(classDetails).subscribe(res => {
            this.spinner.hide();
            this.resetDetails();
            this.reloadTableData();
            this.showNotification('Subject added successfully.');
          });
        }
      } else {
        this.showErorNotification('Please reset fields');
      }
    } else {
      this.showErorNotification('Please select class');
    }
  }

  updateSubject() {
    if (this.classesMap.get(this.selectedClassName)) {
      if (this.currentSubjectId != '') {
        this.submitted = true;
        if (this.subjectForm.valid) {
          let subjectDetails = this.getSubjectDetailsObject();
          subjectDetails.id = this.currentSubjectId;
          this.spinner.show();
          this.tutionService.updateSubject(subjectDetails).subscribe(res => {
            this.spinner.hide();
            this.resetDetails();
            this.reloadTableData();
            this.showNotification('Subject updated successfully.');
          });
        }
      } else {
        this.showErorNotification('Please select Subject to update');
      }
    } else {
      this.showErorNotification('Please select class');
    }

  }

  deleteSubject() {
    if (this.classesMap.get(this.selectedClassName)) {
      if (this.currentSubjectId != '') {
        this.spinner.show();
        this.tutionService.deleteSubject(this.currentSubjectId, this.tutionService.tutionId, this.classesMap.get(this.selectedClassName).ID).subscribe(res => {
          this.resetDetails();
          this.spinner.hide();
          this.reloadTableData();
          this.showNotification('Subject deleted successfully.');
        });
      } else {
        this.showErorNotification('Please select subject to delete');
      }
    } else {
      this.showErorNotification('Please select class');
    }

  }

  resetDetails() {
    this.subjectForm.reset();
    this.currentSubjectId = '';
    this.submitted = false;
  }

  getSubjectDetailsObject() {
    let subjectDetails = new SubjectDetails("",
      this.subjectForm.controls['name'].value,
      this.subjectForm.controls['description'].value,
      '',
      this.tutionService.loggedInAdminUser.userName,
      this.classesMap.get(this.selectedClassName).ID,
      this.tutionService.tutionId
    );
    console.log("subjectDetails : ", subjectDetails);
    return subjectDetails;
  }

  onTableRowSelect(subjectDetails) {
    console.log(subjectDetails);
    this.currentSubjectId = subjectDetails.ID;
    this.subjectForm.patchValue({
      'name': subjectDetails.NAME,
      'description': subjectDetails.DESCRIPTION,
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }


}
