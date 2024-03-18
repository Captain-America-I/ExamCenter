import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TutionService } from 'src/app/tution.service';

@Component({
  selector: 'app-tution-admin-dashboard',
  templateUrl: './tution-admin-dashboard.component.html',
  styleUrls: ['./tution-admin-dashboard.component.scss']
})
export class TutionAdminDashboardComponent implements OnInit {

  constructor(private tuitionService: TutionService, private router: Router) { }


  ngOnInit() {

  }


}
