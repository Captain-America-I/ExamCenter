import { Component, Input, OnInit } from '@angular/core';
import { QuestionsService } from '../questions.service';
import { Answers, Question } from '../quiz.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Utils } from '../utils';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  // used to make answers available to parent component (= questions)
  // so that parent can pass it to child component (= results)
  @Input() answers: Answers;
  @Input() questions: Question[];
  @Input() timeSpent: string;
  @Input() testId: string;
  @Input() testName: string;

  numberOfCorrectAnswers: any = 0;
  totalNumberOfQuestionsAttempted: any = 0;
  percentage: any = 0;
  performanceText = "";
  performanceTextclass = "";
  showResults = false;
  testFeedbackForm: FormGroup;

  constructor(public questionsService: QuestionsService, private spinner: NgxSpinnerService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.spinner.show();
    this.questionsService.getResults(this.answers, this.questionsService.loggedInUser).subscribe(response => {
      this.answers = response;
      this.populateAnswers();
      this.totalNumberOfQuestionsAttempted = this.questions.length;
      setTimeout(() => {
        this.updateStyles();
        Utils.scrollToTop();
        if (this.questionsService.demoUserUUID != "") {
          // Audit Questions Answered
          let demoSubmitTest: any = {};
          demoSubmitTest.uuid = this.questionsService.demoUserUUID;
          demoSubmitTest.testId = this.testId;
          demoSubmitTest.timeTaken = this.timeSpent;
          demoSubmitTest.percentage = this.percentage;
          demoSubmitTest.correctAnswers = this.numberOfCorrectAnswers;

          this.questionsService.demoSubmitTestAudit(demoSubmitTest).subscribe(res => {

          });
        }
      }, 500);
    });
    this.resetTestFeedbackForm();
  }


  populateAnswers() {
    for (let index = 0; index < this.questions.length; index++) {
      if (this.answers.values[index] != undefined && this.questions[index].questionId == this.answers.values[index].questionId) {
        this.questions[index].correct = this.answers.values[index].correct;
        this.questions[index].userChoice = this.answers.values[index].choiceId;
        this.questions[index].correctChoiceId = this.answers.values[index].correctChoiceId;
        this.questions[index].answerExplanation = this.answers.values[index].answerExplanation;
      }
    }
  }


  updateStyles() {
    for (let index = 0; index < this.questions.length; index++) {
      for (let j = 0; j < this.questions[index].choices.length; j++) {

        if (this.questions[index].correct && this.questions[index].userChoice == this.questions[index].choices[j].choiceId) {
          var someElement = document.getElementById(this.questions[index].questionId + this.questions[index].choices[j].choiceId);
          someElement.className += " correct";
          var correctIcon = document.getElementById(this.questions[index].questionId + this.questions[index].choices[j].choiceId + "correctIcon");
          correctIcon.removeAttribute("hidden");
          this.numberOfCorrectAnswers++;
        }

        if (!this.questions[index].correct && this.questions[index].userChoice == this.questions[index].choices[j].choiceId) {
          var someElement = document.getElementById(this.questions[index].questionId + this.questions[index].choices[j].choiceId);
          someElement.className += " in-correct";
          var correctIcon = document.getElementById(this.questions[index].questionId + this.questions[index].choices[j].choiceId + "inCorrectIcon");
          correctIcon.removeAttribute("hidden");
        }

        if (!this.questions[index].correct && this.questions[index].correctChoiceId == this.questions[index].choices[j].choiceId) {
          var someElement = document.getElementById(this.questions[index].questionId + this.questions[index].choices[j].choiceId);
          someElement.className += " actual-correct";
        }
      }
    }
    this.spinner.hide();
    this.percentage = Math.round((this.numberOfCorrectAnswers / this.totalNumberOfQuestionsAttempted) * 100);
    this.setPerformance();
  }

  counter(i: number) {
    return new Array(i);
  }

  setPerformance() {
    if ((this.percentage > 0 && this.percentage <= 35) || this.percentage == 0) {
      this.performanceText = "You should work harder!";
      this.performanceTextclass = "text-danger";
    } else if (this.percentage > 35 && this.percentage <= 50) {
      this.performanceText = "You are not fully prepared yet";
      this.performanceTextclass = "text-primary";
    } else if (this.percentage > 50 && this.percentage <= 75) {
      this.performanceText = "There is still scope for improvement";
      this.performanceTextclass = "text-warning";
    } else if (this.percentage > 75 && this.percentage <= 85) {
      this.performanceText = "You have done good, you are at the last step to achieve your goal";
      this.performanceTextclass = "text-info";
    } else if (this.percentage > 85) {
      this.performanceText = "Excellent! You have done great!";
      this.performanceTextclass = "text-success";
    }

  }

  getPerformaceClass() {
    return this.performanceTextclass;
  }

  resetTestFeedbackForm() {
    this.testFeedbackForm = this.fb.group({
      rating: [null, null]
    });
  }

  ratingClick(event) {
    if (this.questionsService.demoUserUUID != "") {
      let demoRateTestAudit: any = {};
      demoRateTestAudit.rating = this.testFeedbackForm.controls['rating'].value;
      demoRateTestAudit.testId = this.testId;
      demoRateTestAudit.uuid = this.questionsService.demoUserUUID;
      this.questionsService.demoRateTestAudit(demoRateTestAudit)
        .subscribe(res => {
        });
    }
  }

}