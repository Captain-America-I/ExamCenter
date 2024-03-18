import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { TutionTestDetails } from 'src/app/quiz.model';
import { TutionService } from 'src/app/tution.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'app-manage-test',
  templateUrl: './manage-test.component.html',
  styleUrls: ['./manage-test.component.scss']
})
export class ManageTestComponent implements OnInit {


  constructor(private tutionService: TutionService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) { }

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  testDetailsForm: FormGroup;
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataLoaded = false;
  tests = [];
  submitted = false;
  selectedTestId = '';
  currentTestId = '';
  notificationMsg = '';
  showNotificationFlag = false;
  showNotificationErrorFlag = false;
  classes = [];
  subjects = [];
  classSelected = false;
  selectedClassId;
  selectedSubjectId;
  jsonUploadStatus = "NOT_UPLOADED";
  jsonFileName = "";
  fileToUpload: File;

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      destroy: true
    };
    this.tutionService.tutionId = 'AAOS'
    // populate Classes
    this.spinner.show();
    this.tutionService.getAllClassesDetails(this.tutionService.tutionId).subscribe(res => {
      this.classes = res;
      this.spinner.hide();
    });

    // populate subjects

    this.testDetailsForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      startdate: [''],
      enddate: [''],
      isactive: [true],
      totalmarks: [],
      fileName: []
    });
  }


  getSubjectsForClass(classDetails) {
    this.selectedClassId = classDetails.ID;
    this.spinner.show();
    this.tests = [];
    this.rerender();
    this.tutionService.getAllSubjectDetails(this.tutionService.tutionId, classDetails.ID).subscribe(res => {
      this.subjects = res;
      this.spinner.hide();
      this.classSelected = true;
    });
  }

  getTestForSubject(subject) {
    this.selectedSubjectId = subject.ID;
    this.spinner.show();
    this.tutionService.getAllTestDetails(this.tutionService.tutionId, subject.ID).subscribe(res => {
      this.tests = res;
      this.rerender();
      this.spinner.hide();

    });
  }

  reloadTableData() {
    this.spinner.show();
    this.tutionService.getAllTestDetails(this.tutionService.tutionId, this.selectedSubjectId).subscribe(res => {
      this.tests = res;
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

  addTest() {
    if (this.selectedSubjectId) {
      if (this.currentTestId == '') {
        this.submitted = true;
        if (this.testDetailsForm.valid) {
          let testDetails = this.getTestDetailsObject();
          this.spinner.show();
          this.tutionService.addTest(testDetails).subscribe(res => {
            if (this.fileToUpload) {
              this.uploadFile(testDetails.testId, 'Test added successfully.');
            } else {
              this.spinner.hide();
              this.resetDetails();
              this.reloadTableData();
              this.showNotification('Test added successfully.');
            }
          });
        }
      } else {
        this.showErorNotification('Please reset fields');
      }
    } else {
      this.showErorNotification('Please select Subject');
    }
  }

  updateTest() {
    if (this.selectedSubjectId) {
      if (this.currentTestId != '') {
        this.submitted = true;
        if (this.testDetailsForm.valid) {
          let testDetails = this.getTestDetailsObject();
          testDetails.id = this.currentTestId;
          testDetails.testId = this.selectedTestId;
          this.spinner.show();
          this.tutionService.updateTest(testDetails).subscribe(res => {
            if (this.fileToUpload) {
              this.uploadFile(testDetails.testId, 'Test updated successfully.');
            } else {
              this.spinner.hide();
              this.resetDetails();
              this.reloadTableData();
              this.showNotification('Test updated successfully.');
            }
          });
        }
      } else {
        this.showErorNotification('Please select Delete to update');
      }
    } else {
      this.showErorNotification('Please select Subject');
    }

  }

  deleteTest() {
    if (this.selectedSubjectId) {
      if (this.currentTestId != '') {
        this.spinner.show();
        this.tutionService.deleteTest(this.currentTestId, this.tutionService.tutionId, this.selectedSubjectId).subscribe(res => {
          this.resetDetails();
          this.spinner.hide();
          this.reloadTableData();
          this.showNotification('Test deleted successfully.');
        });
      } else {
        this.showErorNotification('Please select Test to delete');
      }
    } else {
      this.showErorNotification('Please select Subject');
    }

  }

  uploadFile(fileName, notificationMsg) {
    this.tutionService.uploadFile(this.fileToUpload, fileName).subscribe(res => {
      this.spinner.hide();
      this.resetDetails();
      this.reloadTableData();
      this.showNotification(notificationMsg);
      console.log("file uploaded successfully..!");
    });
  }

  resetDetails() {
    this.testDetailsForm.reset();
    this.currentTestId = '';
    this.selectedTestId = '';
    this.submitted = false;
    this.testDetailsForm.controls['isactive'].setValue(true);
  }

  getTestDetailsObject() {
    let tutionTestDetails = new TutionTestDetails("",
      this.generateTestId(),
      this.testDetailsForm.controls['name'].value,
      this.testDetailsForm.controls['description'].value,
      '',
      this.tutionService.loggedInAdminUser.userName,
      this.tutionService.tutionId, this.selectedSubjectId, this.formatDate(this.testDetailsForm.controls['startdate'].value), this.formatDate(this.testDetailsForm.controls['enddate'].value), this.testDetailsForm.controls['totalmarks'].value, this.testDetailsForm.controls['isactive'].value ? 'Active' : 'Inactive', '', this.tutionService.loggedInAdminUser.userName, '', '', '', this.jsonUploadStatus, this.jsonFileName);
    console.log("TutionTestDetails : ", tutionTestDetails);
    return tutionTestDetails;
  }

  onTableRowSelect(tutionTestDetails) {
    console.log(tutionTestDetails);
    this.currentTestId = tutionTestDetails.ID;
    this.selectedTestId = tutionTestDetails.TEST_ID;
    this.testDetailsForm.patchValue({
      'name': tutionTestDetails.TEST_NAME,
      'description': tutionTestDetails.DESCRIPTION,
      'startdate': this.getDateJson(tutionTestDetails.TEST_START_DATE),
      'enddate': this.getDateJson(tutionTestDetails.TEST_END_DATE),
      'totalmarks': tutionTestDetails.TOTAL_MARKS,
      'isactive': tutionTestDetails.IS_ACTIVE === "Active" ? true : false,
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

  generateTestId() {
    const lengthOfCode = 30;
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  formatDate(date) {
    return date ? date.year + "-" + ('0' + date.month).slice(-2) + "-" + ('0' + date.day).slice(-2) : null
  }

  getDateJson(date) {
    let dateJson = { 'day': 0, 'month': 0, 'year': 0 };
    if (date && date != '') {
      let dateArr = date.split('-');
      console.log(dateArr)
      dateJson.day = Number.parseInt(dateArr[2]);
      dateJson.month = Number.parseInt(dateArr[1]);
      dateJson.year = Number.parseInt(dateArr[0]);
      return dateJson;
    } else return "";

  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log("File to upload : ", this.fileToUpload);
    this.testDetailsForm.controls['fileName'].setValue(null);
  }

  removeFile() {
    this.fileToUpload = null;
  }

  reviewFile() {

  }


}
