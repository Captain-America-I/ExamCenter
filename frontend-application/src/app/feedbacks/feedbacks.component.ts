import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuestionsService } from '../questions.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss']
})
export class FeedbacksComponent implements OnInit {
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataLoaded = false;
  constructor(private http: HttpClient,private questionsService: QuestionsService, private router: Router, private spinner: NgxSpinnerService) { }

  userFeedbacks: [];
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 5
    };
    if (this.questionsService.isAdminLoggedIn) {
      this.spinner.show();
      this.questionsService.getFeedbacks().subscribe(res => {
        this.userFeedbacks = res.data;
        this.dtTrigger.next();
        console.log(this.userFeedbacks);
        this.dataLoaded = true;
        this.spinner.hide();
      });
    } else {
      this.router.navigate(["admin"]);
    }
  }

}
