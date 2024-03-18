import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuestionsService } from '../questions.service';
import { User } from '../quiz.model';
import { Utils } from '../utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  invalidCredientials = false;
  deviceInfo = null;
  clientName = "";
  @ViewChild('deviceConfirmModal', { static: false }) deviceConfirmModal: ElementRef;
  @ViewChild('newDeviceLoginModal', { static: false }) newDeviceLoginModal: ElementRef;

  constructor(private router: Router, private spinner: NgxSpinnerService, private modalService: NgbModal, private questionsService: QuestionsService, private formBuilder: FormBuilder, private deviceService: DeviceDetectorService) {

  }

  ngOnInit() {
    Utils.scrollToTop();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.questionsService.isLogOff != 'True') {
      this.questionsService.incrementUserVisit().subscribe(res => { });
    }

    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.questionsService.isMobileUser = this.deviceService.isMobile();

    let exisitingBrowserCookie = this.getBrowserCookie("EC_UIID");

    if (exisitingBrowserCookie) {
      // Login using UUID
      let user = new User('', '', '', '', exisitingBrowserCookie);
      this.questionsService.authenticateUserByID(user).subscribe(res => {
        if (res.status && res.status.username) {
          this.questionsService.isUserLoggedIn = true;
          this.questionsService.loggedInUser = new User(res.status.username, '', res.status.firstname, res.status.lastname, res.status.cookie);
          this.spinner.hide();
          this.router.navigate(["welcome"]);
          this.clientName = this.questionsService.getClientName();
        }
      });

    }

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
    let user;
    if (isDemoUser) {
      this.questionsService.isDemoUser = true;
      user = new User(
        'demouser', 'Demo@123', '', '', ''
      );
    } else {
      user = new User(
        this.loginForm.controls['username'].value,
        this.loginForm.controls['password'].value, '', '', ''
      );
    }

    this.questionsService.authenticateUserCredientials(user).subscribe(res => {
      if (res.status && res.status.username) {
        this.questionsService.isUserLoggedIn = true;
        this.questionsService.loggedInUser = new User(user.username, '', res.status.firstname, res.status.lastname, res.status.cookie);
        this.spinner.hide();
        this.clientName = this.questionsService.getClientName();
        let status = this.checkDevice();
        if (status === 'allow') {
          this.router.navigate(["welcome"]);
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
      this.questionsService.demoUserLoginAudit(demoUser).subscribe(res => {
        this.questionsService.demoUserUUID = demoUser.uuid;
      });

    }

  }

  checkDevice() {
    if (this.questionsService.isDemoUser) {
      return "allow";
    } else {
      console.log("Is cookie vailable in DB", this.questionsService.loggedInUser.cookie);
      let existingDBCookie = this.questionsService.loggedInUser.cookie;
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

  saveCookie() {
    const cookieName = "EC_UIID";
    const cookieValue = this.makeRandom();
    const daysToExpire = new Date(2147483647 * 1000).toUTCString();
    document.cookie = cookieName + '=' + cookieValue + '; expires=' + daysToExpire;
    let user = this.questionsService.loggedInUser;
    user.cookie = cookieValue;
    this.questionsService.updateCookie(user).subscribe(res => {
      this.router.navigate(["welcome"]);
      this.modalService.dismissAll();
    });

  }

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
