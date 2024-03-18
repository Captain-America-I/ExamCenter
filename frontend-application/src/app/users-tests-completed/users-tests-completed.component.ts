import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { QuestionsService } from '../questions.service';

@Component({
  selector: 'app-users-tests-completed',
  templateUrl: './users-tests-completed.component.html',
  styleUrls: ['./users-tests-completed.component.scss']
})
export class UsersTestsCompletedComponent implements AfterViewInit, OnDestroy, OnInit {
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataLoaded = false;
  constructor(private questionsService: QuestionsService, private router: Router, private spinner: NgxSpinnerService) { }

  usersMap = new Map();
  userNames: string[] = [];
  userTestCompleted = [];
  selectedUser: any;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  @ViewChild('instance', { static: false }) instance: NgbTypeahead;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.userNames
        : this.userNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  ngOnInit() {
    if (this.questionsService.isAdminLoggedIn) {
      this.dtOptions = {
        pagingType: 'simple_numbers',
        pageLength: 5,
        destroy: true
      };
      this.spinner.show();
      this.questionsService.getUsers().subscribe(res => {
        res.forEach(user => {
          this.usersMap.set(user.firstname + ' ' + user.lastname, user);
          this.userNames.push(user.firstname + ' ' + user.lastname);
        });
        this.spinner.hide();
      });
    } else {
      this.router.navigate(["admin"]);
    }
  }

  selectedItem(item) {
    this.spinner.show();
    console.log(this.usersMap.get(item.item).username);
    this.questionsService.getUsersTestCompleted(this.usersMap.get(item.item).username).subscribe(res => {
      this.userTestCompleted = res;
      this.rerender();
      this.spinner.hide();
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}
