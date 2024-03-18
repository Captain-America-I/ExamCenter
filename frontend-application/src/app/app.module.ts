import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatGridListModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { QuestionFormComponent } from './question-form/question-form.component';
import { ResultsComponent } from './results/results.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { QuestionsComponent } from './questions/questions.component';
import { HomeComponent } from './home/home.component';
import { HighlightModule, HIGHLIGHT_OPTIONS, HighlightOptions } from "ngx-highlightjs";
import { HighlightService } from './highlight.service';
import { FormatTimePipe } from './pipes/timer.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { AnimatedCounterComponent } from './animated-counter/animated-counter.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { CreateuserComponent } from './createuser/createuser.component';
import { HeaderComponent } from './header/header.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { IssuesreportedComponent } from './issuesreported/issuesreported.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { UsersTestsCompletedComponent } from './users-tests-completed/users-tests-completed.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DemoLoginAuditComponent } from './demo-login-audit/demo-login-audit.component';
import { DemoTestAuditComponent } from './demo-test-audit/demo-test-audit.component';
import { DataTablesModule } from 'angular-datatables';
import { TutionDetailsComponent } from './tution-admin/tution-details/tution-details.component';
import { CreateTuitionAdminComponent } from './tution-admin/create-tuition-admin/create-tuition-admin.component';
import { tutionLoginComponent } from './tution/tution-login/tution-login.component';
import { tutionWelcomeComponent } from './tution/tution-welcome/tution-welcome.component';
import { tutionHomeComponent } from './tution/tution-home/tution-home.component';
import { TutionAdminDashboardComponent } from './tution-admin/tution-admin-dashboard/tution-admin-dashboard.component';
import { TutionAdminLoginComponent } from './tution-admin/tution-admin-login/tution-admin-login.component';
import { TutionComponent } from './tution-admin/tution/tution.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ManageClassComponent } from './tution-admin/manage-class/manage-class.component';
import { TutionAdminHeaderComponent } from './tution-admin/tution-admin-header/tution-admin-header.component';
import { ManageSubjectComponent } from './tution-admin/manage-subject/manage-subject.component';
import { ManageTestComponent } from './tution-admin/manage-test/manage-test.component';
import { TutionHeaderComponent } from './tution/tution-header/tution-header.component';
import { ManageStudentComponent } from './tution-admin/manage-student/manage-student.component';


const appRoutes: Routes = [
  { path: 'tution/tutionwelcome', component: tutionWelcomeComponent },
  { path: 'tution/:tutionId', component: tutionLoginComponent },
  { path: 'tution/tutionwelcome/:subjectName', component: tutionHomeComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'createuser', component: CreateuserComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admindashboard', component: AdminDashboardComponent },
  { path: 'userDetails', component: UserDetailsComponent },
  { path: 'issuesReported', component: IssuesreportedComponent },
  { path: 'feedbacks', component: FeedbacksComponent },
  { path: 'demoLoginAudit', component: DemoLoginAuditComponent },
  { path: 'demoTestAudit', component: DemoTestAuditComponent },
  { path: 'addTution', component: TutionDetailsComponent },
  { path: 'createTuitionAdmin', component: CreateTuitionAdminComponent },
  { path: 'userTestsCompeleted', component: UsersTestsCompletedComponent },
  { path: ':quizId', component: HomeComponent },
  { path: ':quizId/:fileName', component: QuestionsComponent },
  { path: '', redirectTo: 'login', pathMatch: 'prefix' }
];

@NgModule({
  declarations: [
    AppComponent,
    QuestionFormComponent,
    ResultsComponent,
    WelcomeComponent,
    HomeComponent,
    QuestionsComponent,
    FormatTimePipe,
    AnimatedCounterComponent,
    FooterComponent,
    LoginComponent,
    AdminComponent,
    CreateuserComponent,
    HeaderComponent,
    AdminHeaderComponent,
    AdminDashboardComponent,
    IssuesreportedComponent,
    FeedbacksComponent,
    UsersTestsCompletedComponent,
    UserDetailsComponent,
    DemoLoginAuditComponent,
    DemoTestAuditComponent,
    TutionDetailsComponent,
    CreateTuitionAdminComponent,
    tutionLoginComponent,
    tutionWelcomeComponent,
    tutionHomeComponent,
    TutionAdminDashboardComponent,
    TutionAdminLoginComponent,
    TutionComponent,
    ManageClassComponent,
    TutionAdminHeaderComponent,
    ManageSubjectComponent,
    ManageTestComponent,
    TutionHeaderComponent,
    ManageStudentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    NgxSpinnerModule,
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule,
    HighlightModule,
    DataTablesModule,
    AdminRoutingModule
  ],
  providers: [{
    provide: HIGHLIGHT_OPTIONS,
    useValue: <HighlightOptions>{
      lineNumbers: true
    }
  },
    HighlightService, NgxSpinnerService, DeviceDetectorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
