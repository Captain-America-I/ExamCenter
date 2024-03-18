import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ClassDetails } from 'src/app/quiz.model';
import { TutionService } from 'src/app/tution.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'app-manage-class',
  templateUrl: './manage-class.component.html',
  styleUrls: ['./manage-class.component.scss']
})
export class ManageClassComponent implements OnInit {

  constructor(private tutionService: TutionService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) { }

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  classForm: FormGroup;
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataLoaded = false;
  classes: [];
  submitted = false;
  currentClassId = '';
  notificationMsg = '';
  showNotificationFlag = false;
  showNotificationErrorFlag = false;

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      destroy: true
    };
    this.reloadTableData();
    this.classForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  reloadTableData() {
    this.spinner.show();
    this.tutionService.getAllClassesDetails(this.tutionService.tutionId).subscribe(res => {
      this.classes = res;
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

  addClass() {
    if (this.currentClassId == '') {
      this.submitted = true;
      if (this.classForm.valid) {
        let classDetails = this.getClassDetailsObject();
        this.spinner.show();
        this.tutionService.addClass(classDetails).subscribe(res => {
          this.spinner.hide();
          this.resetDetails();
          this.reloadTableData();
          this.showNotification('Class added successfully.');
        });
      }
    } else {
      this.showErorNotification('Please reset fields');
    }
  }

  updateClass() {
    if (this.currentClassId != '') {
      this.submitted = true;
      if (this.classForm.valid) {
        let classDetails = this.getClassDetailsObject();
        classDetails.id = this.currentClassId;
        this.spinner.show();
        this.tutionService.updateClassDetails(classDetails).subscribe(res => {
          this.spinner.hide();
          this.resetDetails();
          this.reloadTableData();
          this.showNotification('Class updated successfully.');
        });
      }
    } else {
      this.showErorNotification('Please select class to update');
    }
  }

  deleteClass() {
    if (this.currentClassId != '') {
      this.spinner.show();
      this.tutionService.deleteClass(this.currentClassId, this.tutionService.tutionId).subscribe(res => {
        this.resetDetails();
        this.spinner.hide();
        this.reloadTableData();
        this.showNotification('Class deleted successfully.');
      });
    } else {
      this.showErorNotification('Please select class to delete');
    }
  }

  resetDetails() {
    this.classForm.reset();
    this.currentClassId = '';
    this.submitted = false;
  }

  getClassDetailsObject() {
    let classDetails = new ClassDetails("",
      this.classForm.controls['name'].value,
      this.classForm.controls['description'].value,
      '',
      this.tutionService.loggedInAdminUser.userName,
      this.tutionService.tutionId,
    );
    console.log("classDetails : ", classDetails);
    return classDetails;
  }

  onTableRowSelect(classDetails) {
    console.log(classDetails);
    this.currentClassId = classDetails.ID;
    this.classForm.patchValue({
      'name': classDetails.NAME,
      'description': classDetails.DESCRIPTION,
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
