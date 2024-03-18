import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuestionsService } from '../questions.service';
import { Quiz } from '../quiz.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuItems = new Set();
  clientName = "";

  constructor(private questionsService: QuestionsService, private router: Router, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    if (this.questionsService.loggedInUser && this.questionsService.userMenu === undefined) {
      this.spinner.show();
      this.questionsService.getUserMenu(this.questionsService.loggedInUser.username)
        .subscribe(quiz => {
          this.questionsService.userMenu = quiz;
          this.questionsService.userMenu.forEach(element => {
            this.menuItems.add(element.skill);
          });
          this.spinner.hide();
        });
    }
    if (this.questionsService.userMenu) {
      this.questionsService.userMenu.forEach(element => {
        this.menuItems.add(element.skill);
      });
    }
    this.clientName = this.questionsService.getClientName();

  }

  logOut() {
    this.questionsService.loggedInUser = undefined;
    this.questionsService.isUserLoggedIn = false;
    this.questionsService.userMenu = undefined;
    this.questionsService.demoUserUUID = "";
    this.questionsService.demoUserUUID = "";
    this.questionsService.isLogOff = "True";
    this.questionsService.isDemoUser = false;
    this.router.navigate(["login"]);
  }

}
