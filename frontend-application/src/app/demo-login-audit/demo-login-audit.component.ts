import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { QuestionsService } from '../questions.service';

@Component({
  selector: 'app-demo-login-audit',
  templateUrl: './demo-login-audit.component.html',
  styleUrls: ['./demo-login-audit.component.scss']
})
export class DemoLoginAuditComponent implements OnInit {
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataLoaded = false;
  constructor(private questionsService: QuestionsService, private router: Router, private spinner: NgxSpinnerService) { }

  demoUserLoginAudit: [];

  ngOnInit() {
    if (this.questionsService.isAdminLoggedIn) {
      this.spinner.show();
      this.questionsService.getDemoUserAudit().subscribe(res => {
        this.demoUserLoginAudit = res;
        this.dtTrigger.next();
        this.dataLoaded = true;
        this.spinner.hide();
      });
    } else {
      this.router.navigate(["admin"]);
    }
  }

}
