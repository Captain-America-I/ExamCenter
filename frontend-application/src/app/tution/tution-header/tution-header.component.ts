import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TutionService } from 'src/app/tution.service';

@Component({
  selector: 'app-tution-header',
  templateUrl: './tution-header.component.html',
  styleUrls: ['./tution-header.component.scss']
})
export class TutionHeaderComponent implements OnInit {

  constructor(private route: ActivatedRoute, public tuitionService: TutionService) {
   }

  ngOnInit() {
  }
}
