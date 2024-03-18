import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TutionService } from 'src/app/tution.service';

@Component({
  selector: 'app-tution-admin-header',
  templateUrl: './tution-admin-header.component.html',
  styleUrls: ['./tution-admin-header.component.scss']
})
export class TutionAdminHeaderComponent implements OnInit {

  constructor(public tutionService: TutionService, private router: Router) { }

  adminName;

  ngOnInit() {
    this.adminName = this.tutionService.getAdminName();
  }

  logOut() {
    this.tutionService.isAdminLoggedIn = false;
    this.tutionService.loggedInAdminUser = undefined;
    this.router.navigate(["tution/admin"]);
  }
}
