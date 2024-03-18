import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassDetails } from 'src/app/quiz.model';
import { TutionService } from 'src/app/tution.service';

@Component({
  selector: 'tution-welcome',
  templateUrl: './tution-welcome.component.html',
  styleUrls: ['./tution-welcome.component.scss']
})
export class tutionWelcomeComponent implements OnInit {
  menuItems = new Set();
  constructor(private router: Router, private tuitionService: TutionService) { }
  
  classes : any = [];

  ngOnInit() {
      this.tuitionService.getEnrolledClasses(JSON.parse(this.tuitionService.loggedInUser.classId),this.tuitionService.loggedInUser.tutionId)
      .subscribe(res => {
       this.classes = res;
      });
  }

  routeTo(path) {
    this.router.navigate([path]);
  }

}
