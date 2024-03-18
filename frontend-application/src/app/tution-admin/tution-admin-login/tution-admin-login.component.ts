import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TuitionAdminUser } from 'src/app/quiz.model';
import { TutionService } from 'src/app/tution.service';

@Component({
  selector: 'app-tution-admin-login',
  templateUrl: './tution-admin-login.component.html',
  styleUrls: ['./tution-admin-login.component.scss']
})
export class TutionAdminLoginComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private tuitionService: TutionService,
    private formBuilder: FormBuilder, private router: Router) { }

  loginForm: FormGroup;
  submitted = false;
  invalidCredientials = false;


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      tuitionId: ['', Validators.required]
    });
  }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.spinner.hide();
      return;
    }

    let user = new TuitionAdminUser('', '', '',
      this.loginForm.controls['username'].value,
      this.loginForm.controls['password'].value, this.loginForm.controls['tuitionId'].value, '', '', '', ''
    );

    this.tuitionService.authenticateTuitionAdmin(user).subscribe(res => {
      if (res.status && res.status.USERNAME) {
        this.tuitionService.isAdminLoggedIn = true;
        let loggedInUser = new TuitionAdminUser('', res.status.FIRSTNAME, res.status.LASTNAME,
          res.status.USERNAME,
          '', res.status.TUITION_ID, res.status.EMAIL, res.status.MOBILE, '', ''
        );
        this.tuitionService.loggedInAdminUser = loggedInUser;
        this.tuitionService.tutionId = res.status.TUITION_ID;
        this.spinner.hide();
        this.router.navigate(["tution/admindashboard"]);
      } else {
        this.invalidCredientials = true;
        this.spinner.hide();
      }
    });
  }

}
