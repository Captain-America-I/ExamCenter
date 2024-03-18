import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuestionsService } from 'src/app/questions.service';
import { TuitionAdminUser } from 'src/app/quiz.model';
import { Utils } from 'src/app/utils';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';

@Component({
  selector: 'app-create-tuition-admin',
  templateUrl: './create-tuition-admin.component.html',
  styleUrls: ['./create-tuition-admin.component.scss']
})
export class CreateTuitionAdminComponent implements OnInit {
  constructor(private questionsService: QuestionsService, private router: Router, private spinner: NgxSpinnerService, private formBuilder: FormBuilder) { }
  @ViewChild('instance', { static: false }) instance: NgbTypeahead;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  tuitionAdminForm: FormGroup;
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataLoaded = false;
  tuitionDetails: [];
  submitted = false;
  currentTuitionAdminId = '';
  notificationMsg = '';
  showNotificationFlag = false;
  showNotificationErrorFlag = false;

  tuitionsMap = new Map();
  tuitions: string[] = [];
  tuitionAdmins = [];
  selectedTuitionName: any;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.tuitions
        : this.tuitions.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }


  ngOnInit() {
    if (this.questionsService.isAdminLoggedIn) {
      this.dtOptions = {
        pagingType: 'simple_numbers',
        pageLength: 10,
        destroy: true
      };
      // populate tuitions
      this.questionsService.getAllTuitionDetails().subscribe(res => {
        res.forEach(tuition => {
          this.tuitionsMap.set(tuition.TUITION_NAME, tuition);
          this.tuitions.push(tuition.TUITION_NAME);
        });
      });
      this.tuitionAdminForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [''],
        mobile: [''],
        username: [''],
        password: ['']
      });
    } else {
      this.router.navigate(["admin"]);
    }
  }

  reloadTableData() {
    this.spinner.show();
    let tuitionId = this.tuitionsMap.get(this.selectedTuitionName).TUITION_ID;
    this.questionsService.getAllTuitionAdminUser(tuitionId).subscribe(res => {
      this.tuitionAdmins = res;
      this.rerender();
      this.spinner.hide();
    });
  }

  selectedItem(tuitionName) {
    this.spinner.show();
    let tuitionId = this.tuitionsMap.get(tuitionName.item).TUITION_ID;
    this.questionsService.getAllTuitionAdminUser(tuitionId).subscribe(res => {
      this.tuitionAdmins = res;
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

  addTuition() {
    if (this.tuitionsMap.get(this.selectedTuitionName)) {
      if (this.currentTuitionAdminId == '') {
        this.submitted = true;
        if (this.tuitionAdminForm.valid) {
          let tuitionDetails = this.getTuitionAdminObject();
          this.spinner.show();
          this.questionsService.addTuitionAdminUser(tuitionDetails).subscribe(res => {
            this.spinner.hide();
            this.resetDetails();
            this.reloadTableData();
            this.showNotification('Tuition admin added successfully.');
          });
        }
      } else {
        this.showErorNotification('Please reset fields');
      }
    } else {
      this.showErorNotification('Please select tuition');
    }
  }

  updateTuition() {
    if (this.tuitionsMap.get(this.selectedTuitionName)) {
      if (this.currentTuitionAdminId != '') {
        this.submitted = true;
        if (this.tuitionAdminForm.valid) {
          let tuitionAdminUser = this.getTuitionAdminObject();
          tuitionAdminUser.id = this.currentTuitionAdminId;
          tuitionAdminUser.tuitionId = this.tuitionsMap.get(this.selectedTuitionName).TUITION_ID;
          this.spinner.show();
          this.questionsService.updateTuitionAdminUser(tuitionAdminUser).subscribe(res => {
            this.spinner.hide();
            this.resetDetails();
            this.reloadTableData();
            this.showNotification('Tuition admin updated successfully.');
          });
        }
      } else {
        this.showErorNotification('Please select tuition admin to update');
      }
    } else {
      this.showErorNotification('Please select tuition');
    }

  }

  deleteTuition() {
    if (this.tuitionsMap.get(this.selectedTuitionName)) {
      if (this.currentTuitionAdminId != '') {
        let tuitionId = this.tuitionsMap.get(this.selectedTuitionName).TUITION_ID;
        let username = this.tuitionAdminForm.controls['username'].value;
        this.spinner.show();
        this.questionsService.deleteTuitionAdminUser(this.currentTuitionAdminId, tuitionId, username).subscribe(res => {
          this.resetDetails();
          this.spinner.hide();
          this.reloadTableData();
          this.showNotification('Tuition admin deleted successfully.');
        });
      } else {
        this.showErorNotification('Please select tuition admin to delete');
      }
    } else {
      this.showErorNotification('Please select tuition');
    }
  }

  resetDetails() {
    this.tuitionAdminForm.reset();
    this.currentTuitionAdminId = '';
    this.submitted = false;
  }
  getTuitionAdminObject() {
    let tuitionAdminUser = new TuitionAdminUser("",
      this.tuitionAdminForm.controls['firstName'].value,
      this.tuitionAdminForm.controls['lastName'].value,
      this.generateUsername(this.tuitionAdminForm.controls['firstName'].value.substr(0, 3), 5),
      this.generatePassword(),
      this.tuitionsMap.get(this.selectedTuitionName).TUITION_ID,
      this.tuitionAdminForm.controls['email'].value,
      this.tuitionAdminForm.controls['mobile'].value,
      '', ''
    );
    return tuitionAdminUser;
  }

  onTableRowSelect(tuitionAdminUser) {
    this.currentTuitionAdminId = tuitionAdminUser.ID;
    this.tuitionAdminForm.patchValue({
      'firstName': tuitionAdminUser.FIRSTNAME,
      'lastName': tuitionAdminUser.LASTNAME,
      'username': tuitionAdminUser.USERNAME,
      'password': tuitionAdminUser.PASSWORD,
      'email': tuitionAdminUser.EMAIL,
      'mobile': tuitionAdminUser.MOBILE,
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

  generateUsername(name, length) {
    var result = '';
    var characters = '123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return (name + result).toUpperCase();
  }

  generatePassword() {
    return (Math.floor(Math.random() * 90000) + 10000).toString();
  }
}
