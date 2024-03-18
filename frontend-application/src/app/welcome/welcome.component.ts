import { Component, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuestionsService } from '../questions.service';
import { Feedback, Quiz } from '../quiz.model';
import { Utils } from '../utils';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  closeModal: string;
  reportIssueForm: FormGroup;
  issueSubmitSuccess = false;
  modalOption: NgbModalOptions = {};
  ratingMissing = false;
  isDemoUser = false;
  constructor(private spinner: NgxSpinnerService, private router: Router, public questionsService: QuestionsService, private modalService: NgbModal, private fb: FormBuilder, private deviceService: DeviceDetectorService) {

  }

  ngOnInit() {
    Utils.scrollToTop();
    this.spinner.show();
    if (this.questionsService.userToken == undefined) {
      this.router.navigate(["welcome"]);
    }
    if (!this.questionsService.isUserLoggedIn) {
      this.router.navigate(["login"]);
    }
    this.isDemoUser = (this.questionsService.loggedInUser && this.questionsService.loggedInUser.username == "demouser") ? true : false;
    this.questionsService.setToken();
    this.resetIssueModal();
    this.spinner.hide();
  }

  routeTo(path) {
    this.router.navigate([path]);
  }

  resetIssueModal() {
    this.reportIssueForm = this.fb.group({
      rating: [null, Validators.required],
      review: [null, null]
    });
    this.issueSubmitSuccess = false;
    this.ratingMissing = false;
  }

  triggerModal(content) {
    this.resetIssueModal();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.ariaLabelledBy = 'modal-basic-title';
    this.modalService.open(content, this.modalOption).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  submitFeedback() {
    if (this.reportIssueForm.valid) {
      let feedback = new Feedback(this.questionsService.loggedInUser.username, this.reportIssueForm.controls['rating'].value, this.reportIssueForm.controls['review'].value);
      this.questionsService.submitFeedback(feedback).subscribe(res => {
        if (res.status === 'Success') {
          this.issueSubmitSuccess = true;
          this.ratingMissing = false;
          this.reportIssueForm.disable();
        } else {
          // Error occured while saving Feedback details      
          console.log("Error occured while saving Feedback details");
        }
      });

    } else {
      this.ratingMissing = true;
      console.log("Form invalid")
    }
  }

  ratingClick() {
    this.ratingMissing = false;
  }
}
