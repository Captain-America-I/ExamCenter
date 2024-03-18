import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { QuestionsService } from '../questions.service';

@Component({
  selector: 'app-demo-test-audit',
  templateUrl: './demo-test-audit.component.html',
  styleUrls: ['./demo-test-audit.component.scss']
})
export class DemoTestAuditComponent implements OnInit {
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataLoaded = false;
  constructor(private questionsService: QuestionsService, private router: Router, private spinner: NgxSpinnerService) { }

  demoUserTestAudit: [];

  ngOnInit() {
    if (this.questionsService.isAdminLoggedIn) {
      this.spinner.show();
      this.questionsService.getDemoTestAudit().subscribe(res => {
        this.demoUserTestAudit = res;
        this.dtTrigger.next();
        this.dataLoaded = true;
        this.spinner.hide();
      });
    } else {
      this.router.navigate(["admin"]);
    }
  }


}
