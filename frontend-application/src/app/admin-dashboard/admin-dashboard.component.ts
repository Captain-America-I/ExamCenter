import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuestionsService } from '../questions.service';
import { AdminDashboard } from '../quiz.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private questionsService: QuestionsService, private router: Router, private spinner: NgxSpinnerService) { }
  adminDashboardDetails: AdminDashboard;

  ngOnInit() {
    if (this.questionsService.isAdminLoggedIn) {
      this.refreshData();
    } else {
      this.router.navigate(["admin"]);
    }
  }

  refreshData() {
    this.spinner.show();
    this.questionsService.getAdminDashboard().subscribe(res => {
      this.adminDashboardDetails = res;
      console.log(this.adminDashboardDetails);
      this.spinner.hide();
    });
  }

}
