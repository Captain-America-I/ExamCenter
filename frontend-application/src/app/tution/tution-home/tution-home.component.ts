import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TutionService } from 'src/app/tution.service';
import { Utils } from '../../utils';

@Component({
  selector: 'tution-home',
  templateUrl: './tution-home.component.html',
  styleUrls: ['./tution-home.component.scss']
})
export class tutionHomeComponent implements OnInit {
  subjectName: any = "";
  menuItems = new Set();
  constructor(public tuitionService: TutionService, private router: Router, private route: ActivatedRoute) {
    route.params.subscribe(params => {
      this.subjectName = params['subjectName'];
      console.log("subjectName", params['subjectName'])
      Utils.scrollToTop();
    }
    );
  }

  ngOnInit() {
    this.tuitionService.getUserMenu(this.tuitionService.loggedInUser.userName)
      .subscribe(quiz => {
        this.tuitionService.userMenu = quiz;
        this.tuitionService.userMenu.forEach(element => {
          this.menuItems.add(element.skill);
        });
      });
  }

  routeTo(path) {
    this.router.navigate([path]);
  }

  onSubmit(chapterName) {
    let path = "/" + this.subjectName + "/" + this.subjectName + "-" + chapterName;
    this.router.navigate([path]);

  }
}
