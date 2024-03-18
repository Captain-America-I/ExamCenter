//define, what'll be used later on
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Quiz, Answers, SubTopics, IssueDetails, Feedback, CreateUser, User, ResultsRequest, TuitionDetails, TuitionAdminUser } from './quiz.model';
import { Observable } from 'rxjs';


// @Injectable decorator (function that augments a piece of code) 
// tells Angular that this service will be available everywhere
@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  noOfQuestions = '30';
  window: any;
  quizzes: Quiz[];
  subtopics: SubTopics[];
  userToken: string;
  isAdminLoggedIn: boolean = false;
  isUserLoggedIn: boolean = false;
  loggedInUser: User;
  userVisitCount: String;
  public userMenu: Quiz[];
  demoUserUUID = "";
  isLogOff;
  isDemoUser = false;
  isMobileUser = false;

  constructor(private http: HttpClient) {
  }

  public getUserMenu(username: string): Observable<any> {
    return this.http.get(this.getAPIUrl('getUserMenu' + '/' + username)).pipe(
      map((result: any[]) => {
        this.quizzes = result;
        return result.map(r => new Quiz(r.topiclabel, r.topicName, r.description, r.imgName, r.subTopics, r.skill));
      })
    );
  }

  public getQuiz() {
    return this.quizzes;
  }

  public getQuestions(topicName: string): Observable<any> {
    return this.http.get(this.getAPIUrl('questions' + '/' + topicName + '/' + this.noOfQuestions))
  }

  public getResults(answers: Answers, user: User): Observable<any> {
    let req = new ResultsRequest(answers, user);
    return this.http.post(this.getAPIUrl('results'), req, { headers: this.getHeaders() })
  }


  public incrementUserVisit(): Observable<any> {
    return this.http.get(this.getAPIUrl('userVisited'))
  }

  public getUserVisitedCount(): Observable<any> {
    return this.http.get(this.getAPIUrl('getUserVisitedCount'))
  }

  public getAdminDashboard(): Observable<any> {
    return this.http.get(this.getAPIUrl('adminDashboardDetails'))
  }

  public getIssuesRepoted(): Observable<any> {
    return this.http.get(this.getAPIUrl('getIssuesRepoted'))
  }

  public getDemoUserAudit(): Observable<any> {
    return this.http.get(this.getAPIUrl('getDemoUserAudit'))
  }

  public getAllTuitionDetails(): Observable<any> {
    return this.http.get(this.getAPIUrl('getAllTuitionDetails'))
  }

  public deleteTuitionDetails(tuitionId): Observable<any> {
    return this.http.get(this.getAPIUrl('deleteTuitionDetails/' + tuitionId))
  }

  public getAllTuitionAdminUser(tuitionId): Observable<any> {
    return this.http.get(this.getAPIUrl('getAllTuitionAdminUser/' + tuitionId))
  }

  public deleteTuitionAdminUser(id, tuitionId, username): Observable<any> {
    return this.http.get(this.getAPIUrl('deleteTuitionAdminUser/' + id + '/' + tuitionId + '/' + username))
  }

  public getDemoTestAudit(): Observable<any> {
    return this.http.get(this.getAPIUrl('getDemoTestAudit'))
  }

  public getFeedbacks(): Observable<any> {
    return this.http.get(this.getAPIUrl('getFeedbacks'))
  }

  public getUsers(): Observable<any> {
    return this.http.get(this.getAPIUrl('getUsers'))
  }

  public getUsersTestCompleted(username): Observable<any> {
    return this.http.get(this.getAPIUrl('getUsersTestCompleted' + '/' + username))
  }

  public reportIssue(issueDetails: IssueDetails): Observable<any> {
    return this.http.post(this.getAPIUrl('reportIssue'), issueDetails, { headers: this.getHeaders() })
  }

  public addTuitionDetails(tuitionDetails: TuitionDetails): Observable<any> {
    return this.http.post(this.getAPIUrl('addTuitionDetails'), tuitionDetails, { headers: this.getHeaders() })
  }

  public updateTuitionDetails(tuitionDetails: TuitionDetails): Observable<any> {
    return this.http.post(this.getAPIUrl('updateTuitionDetails'), tuitionDetails, { headers: this.getHeaders() })
  }

  public addTuitionAdminUser(tuitionDetails: TuitionAdminUser): Observable<any> {
    return this.http.post(this.getAPIUrl('addTuitionAdminUser'), tuitionDetails, { headers: this.getHeaders() })
  }

  public updateTuitionAdminUser(tuitionDetails: TuitionAdminUser): Observable<any> {
    return this.http.post(this.getAPIUrl('updateTuitionAdminUser'), tuitionDetails, { headers: this.getHeaders() })
  }

  public submitFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(this.getAPIUrl('submitFeedback'), feedback, { headers: this.getHeaders() })
  }

  public createUser(createUser: CreateUser): Observable<any> {
    return this.http.post(this.getAPIUrl('createUser'), createUser, { headers: this.getHeaders() })
  }

  public authenticateAdminUserCredientials(user: User): Observable<any> {
    return this.http.post(this.getAPIUrl('authenticateAdminUserCredientials'), user, { headers: this.getHeaders() })
  }
  public authenticateUserCredientials(user: User): Observable<any> {
    return this.http.post(this.getAPIUrl('authenticateUserCredientials'), user, { headers: this.getHeaders() })
  }

  public authenticateUserByID(user: User): Observable<any> {
    return this.http.post(this.getAPIUrl('authenticateUserByID'), user, { headers: this.getHeaders() })
  }

  public updateCookie(user: User): Observable<any> {
    return this.http.post(this.getAPIUrl('updateCookie'), user, { headers: this.getHeaders() })
  }

  public removeDeviceKey(user: User): Observable<any> {
    return this.http.post(this.getAPIUrl('removeDeviceKey'), user, { headers: this.getHeaders() })
  }

  public demoUserLoginAudit(demoUser): Observable<any> {
    return this.http.post(this.getAPIUrl('demoUserLoginAudit'), demoUser, { headers: this.getHeaders() })
  }

  public demoUserTestAudit(demoUserTest): Observable<any> {
    return this.http.post(this.getAPIUrl('demoUserTestAudit'), demoUserTest, { headers: this.getHeaders() })
  }

  public demoQuestionAudit(demoTestQuestion): Observable<any> {
    return this.http.post(this.getAPIUrl('demoQuestionAudit'), demoTestQuestion, { headers: this.getHeaders() })
  }

  public demoSubmitTestAudit(demoSubmitTest): Observable<any> {
    return this.http.post(this.getAPIUrl('demoSubmitTestAudit'), demoSubmitTest, { headers: this.getHeaders() })
  }

  public demoRateTestAudit(demoRateTestAudit): Observable<any> {
    return this.http.post(this.getAPIUrl('demoRateTestAudit'), demoRateTestAudit, { headers: this.getHeaders() })
  }

  public getSelectedQuizObject(quizName: String) {
    if (this.quizzes) {
      for (let quiz of this.quizzes) {
        this.subtopics = quiz.subTopics;
        for (let subTopic of this.subtopics) {
          if (subTopic.filename == quizName) {
            return subTopic;
          }
        }
      }
    } else {
      return new SubTopics("", "", ""); // return dummy record when user directly hit quiz route
    }
  }

  getAPIUrl(apiName) {
    const parsedUrl = new URL(window.location.href);
    const baseUrl = parsedUrl.origin;
    console.log(baseUrl);
    return baseUrl.replace('4200', '3000') + '/api/' + apiName;
  }

  getHeaders() {
    let httpHeaders = new HttpHeaders({
      'Accept': 'Application/json',
      'Conent-Type': 'Application/json'
    });
    return httpHeaders;
  }

  setToken() {
    this.userToken = this.makeRandom(40);
  }

  makeRandom(lengthOfCode: number) {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  getClientName() {
    if (this.loggedInUser) {
      // Client Name
      let firstName = this.loggedInUser.firstname.charAt(0).toUpperCase() + this.loggedInUser.firstname.slice(1).toLowerCase();
      let lastname = this.loggedInUser.lastname.charAt(0).toUpperCase() + this.loggedInUser.lastname.slice(1).toLowerCase();
      return firstName + " " + lastname;
    }
  }

}
