// This is the root component of the app
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionsService } from './questions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private router: Router, private questionsService: QuestionsService) {
  }


  ngOnInit() {
  }
}

