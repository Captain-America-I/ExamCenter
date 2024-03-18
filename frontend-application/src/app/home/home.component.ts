import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionsService } from '../questions.service';
import { Feedback, Quiz } from '../quiz.model';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Utils } from '../utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public quiz: Quiz[];
  topic: string;
  closeModal: string;
  reportIssueForm: FormGroup;
  issueSubmitSuccess = false;
  modalOption: NgbModalOptions = {};
  menuItems = new Set();
  isDemoUser = false;
  constructor(private spinner: NgxSpinnerService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private questionsService: QuestionsService, private modalService: NgbModal) {

    this.quiz = this.questionsService.getQuiz();

    route.params.subscribe(params => {
      this.topic = params['quizId'];
      console.log("Topic Name", params['quizId'])
      Utils.scrollToTop();
    }
    );

  }

  ngOnInit() {
    this.spinner.show();
    if (this.questionsService.userToken == undefined) {
      this.router.navigate(["welcome"]);
    }
    this.isDemoUser = (this.questionsService.loggedInUser.username == "demouser") ? true : false;
    this.resetIssueModal();
    this.spinner.hide();
    Utils.scrollToTop();
  }

  resetIssueModal() {
    this.reportIssueForm = this.fb.group({
      rating: [null, Validators.required],
      review: [null, null]
    });
    this.issueSubmitSuccess = false;
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
          this.reportIssueForm.disable();
        } else {
          // Error occured while saving Feedback details
        }
      });

    } else {
      console.log("Form invalid")
    }
  }


}