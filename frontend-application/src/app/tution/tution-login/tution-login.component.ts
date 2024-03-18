import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSpinnerService } from 'ngx-spinner';
import { Student } from 'src/app/modal/Student';
import { TutionService } from 'src/app/tution.service';
import { User } from '../../quiz.model';
import { Utils } from '../../utils';

@Component({
  selector: 'tution-login',
  templateUrl: './tution-login.component.html',
  styleUrls: ['./tution-login.component.scss']
})
export class tutionLoginComponent implements OnInit {


  loginForm: FormGroup;
  submitted = false;
  invalidCredientials = false;
  deviceInfo = null;
  clientName = "";

  @ViewChild('deviceConfirmModal', { static: false }) deviceConfirmModal: ElementRef;
  @ViewChild('newDeviceLoginModal', { static: false }) newDeviceLoginModal: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService, private modalService: NgbModal, public tuitionService: TutionService, private formBuilder: FormBuilder, private deviceService: DeviceDetectorService) {
    route.params.subscribe(params => {
      this.tuitionService.tutionId = params['tutionId'];
      this.tuitionService.tutionId = this.tuitionService.tutionId.toUpperCase();
      console.log("Tuition ID", this.tuitionService.tutionId);
      Utils.scrollToTop();
    }
    );
    this.tuitionService.getTuitionDetails(this.tuitionService.tutionId).subscribe(res => {
      this.tuitionService.tuitionDetails = res[0];
      console.log("Tuition Details", this.tuitionService.tuitionDetails);
    });
  }

  ngOnInit() {
    Utils.scrollToTop();
    this.loginForm = this.formBuilder.group({
      username: ['RAM14835', Validators.required],
      password: ['25252', Validators.required]
    });
    /*  if (this.tuitionService.isLogOff != 'True') {
       this.tuitionService.incrementUserVisit().subscribe(res => { });
     } */

    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.tuitionService.isMobileUser = this.deviceService.isMobile();
  }
  get f() { return this.loginForm.controls; }

  onSubmit(isDemoUser) {

    this.submitted = true;
    // stop here if form is invalid
    if (!isDemoUser) {
      if (this.loginForm.invalid) {
        return;
      }
    }
    this.spinner.show();
    let student: Student = new Student();
    this.tuitionService.isDemoUser = true;
    student.userName = this.loginForm.controls['username'].value;
    student.password = this.loginForm.controls['password'].value;
    this.tuitionService.authenticateStudentCredientials(student).subscribe(res => {
      if (res.status && res.status.userName) {
        this.tuitionService.isUserLoggedIn = true;
        this.tuitionService.loggedInUser = res.status;
        this.spinner.hide();
        this.clientName = this.tuitionService.getStudentName();
        //let status = this.checkDevice();
        let status = "allow";
        if (status === 'allow') {
          this.router.navigate(['tution/tutionwelcome']);
        } else if (status === 'notAllow') {
          this.openModal(this.newDeviceLoginModal);
        }
      } else {
        this.invalidCredientials = true;
        this.spinner.hide();
      }
    });

    if (isDemoUser) {
      //Audit changes
      let demoUser: any = {};
      demoUser.uuid = this.makeRandom();
      demoUser.userAgent = JSON.stringify(this.deviceInfo);
      if (this.deviceService.isMobile()) {
        demoUser.deviceType = "Mobile";
      } else if (this.deviceService.isDesktop()) {
        demoUser.deviceType = "Desktop";
      }
      console.log(demoUser);
      /*  this.tuitionService.demoUserLoginAudit(demoUser).subscribe(res => {
         this.tuitionService.demoUserUUID = demoUser.uuid;
       }); */

    }

  }

  checkDevice() {
    if (this.tuitionService.isDemoUser) {
      return "allow";
    } else {
      console.log("Is cookie vailable in DB", this.tuitionService.loggedInUser.uuid);
      let existingDBCookie = this.tuitionService.loggedInUser.uuid;
      let exisitingBrowserCookie = this.getBrowserCookie("EC_UIID");
      if (existingDBCookie && existingDBCookie != "") {
        if (existingDBCookie == exisitingBrowserCookie) {
          return "allow";
        } else {
          return "notAllow";
        }
      } else {
        // Show modal to user to confirm login from this device  
        this.openModal(this.deviceConfirmModal);
        return "confirmDevice";
      }
    }
  }

  getBrowserCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  // saveCookie() {
  //   const cookieName = "EC_UIID";
  //   const cookieValue = this.makeRandom();
  //   const daysToExpire = new Date(2147483647 * 1000).toUTCString();
  //   document.cookie = cookieName + '=' + cookieValue + '; expires=' + daysToExpire;
  //   let user = this.tuitionService.loggedInUser;
  //   user.cookie = cookieValue;
  //   this.tuitionService.updateCookie(user).subscribe(res => {
  //     this.router.navigate(['/tution/aaos/tutionwelcome'], { relativeTo: this.route });
  //     this.modalService.dismissAll();
  //   });

  // }

  makeRandom() {
    const lengthOfCode = 25;
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  openModal(content) {
    let modalOption: any = {}
    modalOption.backdrop = 'static';
    modalOption.keyboard = false;
    modalOption.ariaLabelledBy = 'modal-basic-title';
    this.modalService.open(content, modalOption).result.then((res) => {
    }, (res) => {
    });
  }

}
