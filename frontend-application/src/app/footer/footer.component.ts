import { Component, Input, OnInit } from '@angular/core';
import { QuestionsService } from '../questions.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public questionsService: QuestionsService) { }

  ngOnInit() {
    if (!this.questionsService.userVisitCount) {
      this.questionsService.getUserVisitedCount().subscribe(res => {
        console.log("User Visited Count : ", res)
        this.questionsService.userVisitCount = res.status.VISTED_USERS;
      });
    }
  }

}
