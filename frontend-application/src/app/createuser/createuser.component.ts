import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionsService } from '../questions.service';
import { CreateUser } from '../quiz.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})
export class CreateuserComponent implements OnInit {
  createUserForm: FormGroup;
  submitted = false;
  isSuccess: boolean = false;
  isFaliure: boolean = false;
  name : string = "";
  firstName: string = "";
  lastname : string = "";
  username : string = "";
  password : string = "";
  constructor(private spinner: NgxSpinnerService,private router: Router,private formBuilder: FormBuilder,private questionsService: QuestionsService) { }

  ngOnInit() {
    if(this.questionsService.isAdminLoggedIn){

    }else {
      this.router.navigate(["admin"]);
    }
    this.createUserForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      mobile: ['', Validators.required],
      username: [''],
      password: [''],
      createdDate: [''],
    });
  }
  get f() { return this.createUserForm.controls; }

  onSubmit() {
    this.spinner.show();
    this.name = "";
    this.username  = "";
    this. password = "";
    
    this.isSuccess = false;
    // stop here if form is invalid
    if (this.createUserForm.invalid) {
        this.submitted = true;
        this.spinner.hide();
        return;
    }else {
      this.submitted = false;
     
      this.firstName = this.createUserForm.controls['firstname'].value;
      this.lastname = this.createUserForm.controls['lastname'].value;
      this.name = this.firstName + " " + this.lastname;
      this.username = this.generateUsername(this.firstName.substr(0,3),5);
      this.password = this.generatePassword();
      this.createUserForm.controls['username'].setValue(this.username);
      this.createUserForm.controls['password'].setValue(this.password);

      let createUser = new CreateUser(
        this.createUserForm.controls['firstname'].value,
        this.createUserForm.controls['lastname'].value,
        this.createUserForm.controls['mobile'].value,
        this.createUserForm.controls['username'].value,
        this.createUserForm.controls['password'].value
      );

      console.log("Create User Form", this.createUserForm);
     

      this.questionsService.createUser(createUser).subscribe(res => {
        if (res.status === 'Success') {
          this.isSuccess = true;
          this.createUserForm.reset();
          this.spinner.hide();
        } else {
          this.isFaliure = false;
          console.log("Error occured while creating a new user ");
          this.spinner.hide();
        }
      });
    }


  }

  generateUsername(name,length) {
    var result           = '';
    var characters       = '123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
    return (name+result).toUpperCase();
  }

  generatePassword(){
    return (Math.floor(Math.random()*90000) + 10000).toString();
  }

}
