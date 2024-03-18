import { Component, OnInit, ViewChild, Pipe, PipeTransform, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionFormComponent } from '../question-form/question-form.component';
import { QuestionsService } from '../questions.service';
import { Quiz, Answers, Choice, Question, IssueDetails, SubTopics } from '../quiz.model';
import { timer, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Utils } from '../utils';
@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  @ViewChild(QuestionFormComponent, { static: false }) child: QuestionFormComponent
  @ViewChild('mydiv', { static: false }) mydiv: ElementRef;
  @ViewChild('submitModal', { static: false }) submitModal: ElementRef;
  quiz: Quiz;
  topic: SubTopics;
  answers: Answers;
  questions: Question[];
  currentQuestionIndex: number;
  showResults = false;
  questionCompletionPercentage: number;
  // Timer variables
  countDown: Subscription;
  counter = 0;
  tick = 1000;
  closeModal: string;
  reportIssueForm: FormGroup;
  issueSubmitSuccess = false;
  modalOption: NgbModalOptions = {};
  isUSerCompletedTest = false;
  timeSpent = "";
  testName = "";
  // inject both the active route and the questions service
  constructor(@Inject(DOCUMENT) document, private route: ActivatedRoute, public questionsService: QuestionsService, private modalService: NgbModal, private fb: FormBuilder, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit() {
    if (this.questionsService.userToken == undefined) {
      this.router.navigate(["welcome"]);
      return;
    }

    this.countDown = timer(0, this.tick).subscribe(() => ++this.counter);
    this.topic = this.questionsService.getSelectedQuizObject(this.route.snapshot.params.fileName);
    console.log("this.topic", this.topic);
    this.isUSerCompletedTest = this.topic.testComplete == "true" ? true : false;
    if (!this.isUSerCompletedTest) {
      //Demo user Test Audit
      if (this.questionsService.demoUserUUID != "") {
        let demoUserTest: any = {};
        demoUserTest.testId = this.topic.filename;
        demoUserTest.uuid = this.questionsService.demoUserUUID;
        this.questionsService.demoUserTestAudit(demoUserTest)
          .subscribe(res => {

          });
      }

      this.spinner.show();
      //read from the dynamic route and load the proper quiz data
      this.questionsService.getQuestions(this.topic.filename)
        .subscribe(questions => {
          this.questions = questions;
          this.questionCompletionPercentage = Math.floor(100 / this.questions.length);
          this.answers = new Answers(this.topic.filename);
          this.currentQuestionIndex = 0;
          // document.getElementById('mydiv').classList.add("w-20");
          // Add Question numbers
          this.questions.forEach((q, index) => {
            q.qNo = (index + 1).toString();
            q.status = 'notVisited';
          })
          this.spinner.hide();
        });

    }

    this.resetIssueModal();
    this.testName = this.getTestName(this.topic.filename);
  }

  public getTestName(value: string): string {
    var topic = value.split("-")[0]
    var subTopic = value.split("-")[1]
    return topic.charAt(0).toUpperCase() + topic.slice(1) + " (" + subTopic.charAt(0).toUpperCase() + subTopic.slice(1) + ")";
  }

  resetIssueModal() {
    this.reportIssueForm = this.fb.group({
      summary: [null, Validators.required],
      description: [null, Validators.required]
    });
    this.issueSubmitSuccess = false;
  }

  updateChoice(choice: Choice) {
    if (choice) {
      choice.questionId = this.questions[this.currentQuestionIndex].questionId;
      this.answers.values[this.currentQuestionIndex] = choice;
    }
  }

  nextOrViewResults() {
    if (this.answers.values[this.currentQuestionIndex]) {
      this.questions[this.currentQuestionIndex].status = 'answered';
    } else {
      this.questions[this.currentQuestionIndex].status = 'notAnswered';
    }

    if ((this.currentQuestionIndex + 1) != this.questions.length) {
      this.currentQuestionIndex++;
    }
    this.child.populateAnswer(this.answers.values[this.currentQuestionIndex]);
    if (this.questionsService.demoUserUUID != "") {
      // Audit Questions Answered
      let demoTestQuestion: any = {};
      demoTestQuestion.uuid = this.questionsService.demoUserUUID;
      demoTestQuestion.testId = this.topic.filename;
      demoTestQuestion.questionCount = this.getQuestionsStatusTotal('answered');
      this.questionsService.demoQuestionAudit(demoTestQuestion).subscribe(res => {

      });
    }
    Utils.scrollToTop();
  }

  submitResponses() {
    if (this.getQuestionsStatusTotal('answered') != this.questions.length) {
      this.triggerModal(this.submitModal);
      return;
    }
    this.timeSpent = this.counter.toString();
    this.showResults = true;
    return;
  }

  previousQuestion() {
    this.currentQuestionIndex--;
    this.child.populateAnswer(this.answers.values[this.currentQuestionIndex]);
    Utils.scrollToTop();
  }

  reset() {
    this.quiz = undefined;
    this.questions = undefined;
    this.answers = undefined;
    this.currentQuestionIndex = undefined;
    this.countDown = null;
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

  submitIssue() {
    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (this.reportIssueForm.valid) {
      let issueDetails = new IssueDetails(this.testName, this.questionsService.loggedInUser.username, this.questions[this.currentQuestionIndex].questionId, this.reportIssueForm.controls['summary'].value, this.reportIssueForm.controls['description'].value);
      this.questionsService.reportIssue(issueDetails).subscribe(res => {
        if (res.status === 'Success') {
          this.issueSubmitSuccess = true;
          this.reportIssueForm.disable();
        } else {
          // Error occured while saving issue details
        }
      });

    } else {
      console.log("Form invalid")
    }
  }

  skipQuestion() {
    if (this.answers.values[this.currentQuestionIndex]) {
      this.questions[this.currentQuestionIndex].status = 'answeredReview';
    } else {
      this.questions[this.currentQuestionIndex].status = 'notAnsweredReview';
    }
    this.currentQuestionIndex++;
    this.child.populateAnswer(this.answers.values[this.currentQuestionIndex]);
  }

  showQuestion(index) {
    this.currentQuestionIndex = index;
    this.child.populateAnswer(this.answers.values[this.currentQuestionIndex]);
  }

  clearResponse() {
    this.child.clearResponse();
    if (this.answers.values[this.currentQuestionIndex]) {
      this.answers.values.splice(this.currentQuestionIndex);
    }
  }

  getQuestionsStatusTotal(status) {
    let count = 0;
    this.questions.forEach(q => {
      if (q.status === status) {
        count = count + 1;
      }
    });
    return count;
  }

}
