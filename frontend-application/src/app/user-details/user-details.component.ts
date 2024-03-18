import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { QuestionsService } from '../questions.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataLoaded = false;
  slectedUser;
  removeDeviceKeySuccess = false;
  @ViewChild('viewUserDetails', { static: false }) viewUserDetails: ElementRef;

  constructor(private questionsService: QuestionsService, private router: Router, private spinner: NgxSpinnerService, private modalService: NgbModal) { }

  userDetails = [];

  ngOnInit() {
    if (this.questionsService.isAdminLoggedIn) {
      this.spinner.show();
      this.questionsService.getUsers().subscribe(res => {
        this.userDetails = res;
        this.dtTrigger.next();
        this.dataLoaded = true;
        this.spinner.hide();
      });
    } else {
      this.router.navigate(["admin"]);
    }
  }

  viewUser(user) {
    this.slectedUser = user;
    this.openModal(this.viewUserDetails);
  }

  openModal(content) {
    this.removeDeviceKeySuccess = false;
    let modalOption: any = {}
    modalOption.backdrop = 'static';
    modalOption.keyboard = false;
    modalOption.ariaLabelledBy = 'modal-basic-title';
    this.modalService.open(content, modalOption).result.then((res) => {
    }, (res) => {
    });
  }

  removeDeviceKey(username) {
    let user: any = {};
    user.username = username;
    this.questionsService.removeDeviceKey(user).subscribe(res => {
      if (res.status === 'success') {
        this.removeDeviceKeySuccess = true;
      }
    })
  }


}
