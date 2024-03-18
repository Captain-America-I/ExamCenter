import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { QuestionsService } from '../questions.service';

@Component({
  selector: 'app-issuesreported',
  templateUrl: './issuesreported.component.html',
  styleUrls: ['./issuesreported.component.scss']
})
export class IssuesreportedComponent implements OnInit {
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataLoaded = false;
  constructor(private questionsService: QuestionsService, private router: Router, private spinner: NgxSpinnerService) { }

  issuesReported: [];

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 5
    };
    if (this.questionsService.isAdminLoggedIn) {
      this.spinner.show();
      this.questionsService.getIssuesRepoted().subscribe(res => {
        this.issuesReported = res.data;
        this.dtTrigger.next();
        this.dataLoaded = true;
        console.log(this.issuesReported);
        this.spinner.hide();
      });
    } else {
      this.router.navigate(["admin"]);
    }
  }
}
