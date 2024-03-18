import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionsService } from '../questions.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {

  constructor(private router: Router, private questionsService: QuestionsService) { }

  ngOnInit() {
  }


  logOut() {
    this.questionsService.isAdminLoggedIn = false;
    this.router.navigate(["admin"]);
  }

}
