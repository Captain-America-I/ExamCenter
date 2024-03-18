import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuestionsService } from '../questions.service';
import { User } from '../quiz.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  invalidCredientials = false;
  constructor(private spinner: NgxSpinnerService, private questionsService: QuestionsService,
    private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
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

    let user = new User(
      this.loginForm.controls['username'].value,
      this.loginForm.controls['password'].value, '', '', ''
    );

    this.questionsService.authenticateAdminUserCredientials(user).subscribe(res => {
      if (res.status.count == 1) {
        this.questionsService.isAdminLoggedIn = true;
        this.spinner.hide();
        this.router.navigate(["admindashboard"]);
      } else {
        this.invalidCredientials = true;
        this.spinner.hide();
      }
    });
  }

}
