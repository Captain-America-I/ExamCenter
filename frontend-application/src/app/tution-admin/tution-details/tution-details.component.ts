import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { QuestionsService } from 'src/app/questions.service';
import { TuitionDetails } from 'src/app/quiz.model';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'app-tution-details',
  templateUrl: './tution-details.component.html',
  styleUrls: ['./tution-details.component.scss']
})
export class TutionDetailsComponent implements OnInit {

  constructor(private questionsService: QuestionsService, private router: Router, private spinner: NgxSpinnerService, private formBuilder: FormBuilder) { }

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  tuitionDetailsForm: FormGroup;
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataLoaded = false;
  tuitionDetails: [];
  submitted = false;
  currentTuitionId = '';
  notificationMsg = '';
  showNotificationFlag = false;
  showNotificationErrorFlag = false;

  ngOnInit() {
    if (this.questionsService.isAdminLoggedIn) {
      this.dtOptions = {
        pagingType: 'simple_numbers',
        pageLength: 10,
        destroy: true
      };
      this.reloadTableData();
      this.tuitionDetailsForm = this.formBuilder.group({
        tuitionId: ['', Validators.required],
        tuitionName: ['', Validators.required],
        ownerName: ['', Validators.required],
        email: [''],
        mobileNo: [''],
        address1: [''],
        address2: [''],
        city: [''],
        state: [''],
        studentLimit: ['']
      });
    } else {
      this.router.navigate(["admin"]);
    }
  }

  reloadTableData() {
    this.spinner.show();
    this.questionsService.getAllTuitionDetails().subscribe(res => {
      this.tuitionDetails = res;
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
    if (this.currentTuitionId == '') {
      this.submitted = true;
      if (this.tuitionDetailsForm.valid) {
        let tuitionDetails = this.getTuitionDetailsObject();
        this.spinner.show();
        this.questionsService.addTuitionDetails(tuitionDetails).subscribe(res => {
          this.spinner.hide();
          this.resetDetails();
          this.reloadTableData();
          this.showNotification('Tuition added successfully.');
        });
      }
    } else {
      this.showErorNotification('Please reset fields');
    }
  }

  updateTuition() {
    if (this.currentTuitionId != '') {
      this.submitted = true;
      if (this.tuitionDetailsForm.valid) {
        let tuitionDetails = this.getTuitionDetailsObject();
        tuitionDetails.id = this.currentTuitionId;
        this.spinner.show();
        this.questionsService.updateTuitionDetails(tuitionDetails).subscribe(res => {
          this.spinner.hide();
          this.resetDetails();
          this.reloadTableData();
          this.showNotification('Tuition updated successfully.');
        });
      }
    } else {
      this.showErorNotification('Please select tuition to update');
    }
  }

  deleteTuition() {
    if (this.currentTuitionId != '') {
      this.spinner.show();
      this.questionsService.deleteTuitionDetails(this.currentTuitionId).subscribe(res => {
        this.resetDetails();
        this.spinner.hide();
        this.reloadTableData();
        this.showNotification('Tuition deleted successfully.');
      });
    } else {
      this.showErorNotification('Please select tuition to delete');
    }
  }

  resetDetails() {
    this.tuitionDetailsForm.reset();
    this.currentTuitionId = '';
    this.submitted = false;
  }

  getTuitionDetailsObject() {
    let tuitionDetails = new TuitionDetails("",
      this.tuitionDetailsForm.controls['tuitionId'].value,
      this.tuitionDetailsForm.controls['tuitionName'].value,
      this.tuitionDetailsForm.controls['ownerName'].value,
      this.tuitionDetailsForm.controls['email'].value,
      this.tuitionDetailsForm.controls['address1'].value,
      this.tuitionDetailsForm.controls['address2'].value,
      this.tuitionDetailsForm.controls['city'].value,
      this.tuitionDetailsForm.controls['state'].value,
      this.tuitionDetailsForm.controls['mobileNo'].value,
      '', '', this.tuitionDetailsForm.controls['studentLimit'].value,
    );
    console.log("tuitionDetails : ", tuitionDetails);
    return tuitionDetails;
  }

  onTableRowSelect(tuitionDetails) {
    console.log(tuitionDetails);
    this.currentTuitionId = tuitionDetails.ID;
    this.tuitionDetailsForm.patchValue({
      'tuitionId': tuitionDetails.TUITION_ID,
      'tuitionName': tuitionDetails.TUITION_NAME,
      'ownerName': tuitionDetails.OWNER_NAME,
      'email': tuitionDetails.EMAIL,
      'address1': tuitionDetails.ADDRESS1,
      'address2': tuitionDetails.ADDRESS2,
      'city': tuitionDetails.CITY,
      'state': tuitionDetails.STATE,
      'mobileNo': tuitionDetails.MOBILE_NO,
      'studentLimit': tuitionDetails.STUDENT_LIMIT
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
