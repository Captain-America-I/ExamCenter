import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { Student } from 'src/app/modal/Student';
import { TutionService } from 'src/app/tution.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'app-manage-student',
  templateUrl: './manage-student.component.html',
  styleUrls: ['./manage-student.component.scss']
})
export class ManageStudentComponent implements OnInit {

  constructor(private tutionService: TutionService, private router: Router, private spinner: NgxSpinnerService, private formBuilder: FormBuilder) { }

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  studentForm: FormGroup;
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataLoaded = false;
  studentDetails = [];
  classes = [];
  submitted = false;
  currentStudentId = '';
  notificationMsg = '';
  showNotificationFlag = false;
  showNotificationErrorFlag = false;
  selectedClasses = [];


  ngOnInit() {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      destroy: true
    };
    this.reloadTableData();
    this.studentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [''],
      mobile: [''],
      username: [''],
      password: [''],
      address1: [''],
      address2: [''],
      city: [''],
      state: [''],
      isactive: [true],
      classid: [null],
    });
    this.spinner.show();
    this.tutionService.getAllClassesDetails(this.tutionService.tutionId).subscribe(res => {
      this.classes = res;
      this.spinner.hide();
      this.classes.forEach(c => {
        c.selected = false;
      })
    });

  }

  reloadTableData() {
    this.spinner.show();
    this.tutionService.getAllStudentDetails(this.tutionService.tutionId).subscribe(res => {
      this.studentDetails = res;
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

  addStudent() {
    if (this.currentStudentId == '') {
      this.submitted = true;
      if (this.studentForm.valid) {
        let student = this.getStudentObject();
        student.userName = this.generateUsername(this.studentForm.controls['firstName'].value.substr(0, 3), 5);
        student.password = this.generatePassword();
        this.spinner.show();
        this.tutionService.addStudent(student).subscribe(res => {
          this.spinner.hide();
          this.resetDetails();
          this.reloadTableData();
          this.showNotification('Student added successfully.');
        });
      }
    } else {
      this.showErorNotification('Please reset fields');
    }

  }

  updateStudent() {
    if (this.currentStudentId != '') {
      this.submitted = true;
      if (this.studentForm.valid) {
        let student = this.getStudentObject();
        student.id = this.currentStudentId;
        student.userName = this.studentForm.controls['username'].value;
        this.spinner.show();
        this.tutionService.updateStudent(student).subscribe(res => {
          this.spinner.hide();
          this.resetDetails();
          this.reloadTableData();
          this.showNotification('Student updated successfully.');
        });
      }
    } else {
      this.showErorNotification('Please select student to update');
    }


  }

  deleteStudent() {
    if (this.currentStudentId != '') {
      let username = this.studentForm.controls['username'].value;
      this.spinner.show();
      this.tutionService.deleteStudent(this.currentStudentId, this.tutionService.tutionId, username).subscribe(res => {
        this.resetDetails();
        this.spinner.hide();
        this.reloadTableData();
        this.showNotification('Student deleted successfully.');
      });
    } else {
      this.showErorNotification('Please select student to delete');
    }

  }

  resetDetails() {
    this.studentForm.reset();
    this.studentForm.controls['isactive'].setValue(true);
    this.currentStudentId = '';
    this.submitted = false;
    this.classes.forEach(c => {
      c.selected = false;
    })
  }
  getStudentObject() {
    let student = new Student();
    student.firstName = this.studentForm.controls['firstName'].value;
    student.lastName = this.studentForm.controls['lastName'].value;
    student.tutionId = this.tutionService.tutionId;
    student.email = this.studentForm.controls['email'].value;
    student.mobile = this.studentForm.controls['mobile'].value;
    student.address1 = this.studentForm.controls['address1'].value;
    student.address2 = this.studentForm.controls['address2'].value;
    student.city = this.studentForm.controls['city'].value;
    student.state = this.studentForm.controls['state'].value;
    student.isActive = this.studentForm.controls['isactive'].value ? 'Active' : 'Inactive';
    student.classId = JSON.stringify(this.selectedClasses);
    student.createdBy = this.tutionService.loggedInAdminUser.userName;
    student.updatedBy = this.tutionService.loggedInAdminUser.userName;
    return student;
  }

  onTableRowSelect(student) {
    this.currentStudentId = student.ID;
    this.studentForm.patchValue({
      'firstName': student.FIRSTNAME,
      'lastName': student.LASTNAME,
      'username': student.USERNAME,
      'password': student.PASSWORD,
      'email': student.EMAIL,
      'mobile': student.MOBILE,
      'isactive': student.IS_ACTIVE === "Active" ? true : false,
      'address1': student.ADDRESS1,
      'address2': student.ADDRESS2,
      'city': student.CITY,
      'state': student.STATE
    });
    this.selectedClasses = JSON.parse(student.CLASS_ID);
    console.log("onTableRowSelect", this.selectedClasses);
    this.classes.forEach(c => {
      c.selected = false;
      if (this.selectedClasses.includes(c.ID.toString())) {
        c.selected = true;
      }
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

  onClassSelect(event) {
    let classId = event.srcElement.value;
    if (!this.selectedClasses.includes(classId)) {
      this.selectedClasses.push(classId);
    } else if (this.selectedClasses.includes(classId)) {
      let index = this.selectedClasses.indexOf(classId);
      this.selectedClasses.splice(index, 1);
    }
    console.log(this.selectedClasses);
  }

}
