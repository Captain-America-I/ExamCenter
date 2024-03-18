import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClassDetails, Quiz, SubjectDetails, TuitionAdminUser, TutionTestDetails, User } from './quiz.model';
import { Observable } from 'rxjs';
import { Student } from './modal/Student';
import { map } from 'rxjs/operators';
import { TuitionDetails } from './modal/tuitionDetails';


@Injectable({
  providedIn: 'root'
})
export class TutionService {

  quizzes: Quiz[];
  public userMenu: Quiz[];

  userToken: string;
  isAdminLoggedIn: boolean = false;
  isUserLoggedIn: boolean = false;
  loggedInUser: Student;
  loggedInAdminUser: TuitionAdminUser;
  demoUserUUID = "";
  isLogOff;
  isDemoUser = false;
  isMobileUser = false;
  tutionId: string = "";
  tuitionDetails = new TuitionDetails();

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

  public authenticateTuitionAdmin(user: TuitionAdminUser): Observable<any> {
    return this.http.post(this.getAPIUrl('authenticateTuitionAdmin'), user, { headers: this.getHeaders() })
  }

  public authenticateUserCredientials(user: User): Observable<any> {
    return this.http.post(this.getAPIUrl('authenticateUserCredientials'), user, { headers: this.getHeaders() })
  }

  public authenticateStudentCredientials(student: Student): Observable<any> {
    return this.http.post(this.getAPIUrl('authenticateStudentCredientials'), student, { headers: this.getHeaders() })
  }


  public getAllClassesDetails(tutionId): Observable<any> {
    return this.http.get(this.getAPIUrl('getAllClassesDetails/' + tutionId))
  }

  public deleteClass(id, tuitionId): Observable<any> {
    return this.http.get(this.getAPIUrl('deleteClass/' + id + '/' + tuitionId))
  }

  public addClass(classDetails: ClassDetails): Observable<any> {
    return this.http.post(this.getAPIUrl('addClass'), classDetails, { headers: this.getHeaders() })
  }

  public updateClassDetails(classDetails: ClassDetails): Observable<any> {
    return this.http.post(this.getAPIUrl('updateClassDetails'), classDetails, { headers: this.getHeaders() })
  }

  public getAllSubjectDetails(tutionId, classId): Observable<any> {
    return this.http.get(this.getAPIUrl('getAllSubjectDetails/' + tutionId + '/' + classId))
  }

  public deleteSubject(id, tuitionId, classId): Observable<any> {
    return this.http.get(this.getAPIUrl('deleteSubject/' + id + '/' + tuitionId + '/' + classId))
  }

  public addSubject(subjectDetails: SubjectDetails): Observable<any> {
    return this.http.post(this.getAPIUrl('addSubject'), subjectDetails, { headers: this.getHeaders() })
  }

  public updateSubject(subjectDetails: SubjectDetails): Observable<any> {
    return this.http.post(this.getAPIUrl('updateSubject'), subjectDetails, { headers: this.getHeaders() })
  }

  public getAllTestDetails(tutionId, subjectId): Observable<any> {
    return this.http.get(this.getAPIUrl('getAllTestDetails/' + tutionId + '/' + subjectId))
  }

  public deleteTest(id, tuitionId, subjectId): Observable<any> {
    return this.http.get(this.getAPIUrl('deleteTest/' + id + '/' + tuitionId + '/' + subjectId))
  }

  public addTest(tutionTestDetails: TutionTestDetails): Observable<any> {
    return this.http.post(this.getAPIUrl('addTest'), tutionTestDetails, { headers: this.getHeaders() })
  }

  public updateTest(tutionTestDetails: TutionTestDetails): Observable<any> {
    return this.http.post(this.getAPIUrl('updateTest'), tutionTestDetails, { headers: this.getHeaders() })
  }

  public uploadFile(fileObject, fileName): Observable<any> {
    let formData = new FormData();
    fileObject.fileName = fileName;
    formData.append('file', fileObject);
    console.log("fileObject : ", fileObject)
    return this.http.post(this.getAPIUrl('uploadFile'), formData, { headers: this.getHeaders() })
  }

  public getTuitionDetails(tutionId: string): Observable<any> {
    return this.http.get(this.getAPIUrl('getTuitionDetails/' + tutionId));
  }

  public getEnrolledClasses(id: string, tuitionId: string): Observable<any> {
    return this.http.get(this.getAPIUrl('getEnrolledClasses/' + id + "/" + tuitionId))
  }

  public getAllStudentDetails(tutionId): Observable<any> {
    return this.http.get(this.getAPIUrl('getAllStudentDetails/' + tutionId))
  }

  public deleteStudent(id, tuitionId, username): Observable<any> {
    return this.http.get(this.getAPIUrl('deleteStudent/' + id + '/' + tuitionId + '/' + username))
  }

  public addStudent(student: Student): Observable<any> {
    return this.http.post(this.getAPIUrl('addStudent'), student, { headers: this.getHeaders() })
  }

  public updateStudent(student: Student): Observable<any> {
    return this.http.post(this.getAPIUrl('updateStudent'), student, { headers: this.getHeaders() })
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



  getStudentName() {
    if (this.loggedInUser) {
      // Student Name
      let firstName = this.loggedInUser.firstName.charAt(0).toUpperCase() + this.loggedInUser.firstName.slice(1).toLowerCase();
      let lastname = this.loggedInUser.lastName.charAt(0).toUpperCase() + this.loggedInUser.lastName.slice(1).toLowerCase();
      return firstName + " " + lastname;
    }
  }

  getAdminName() {
    if (this.loggedInAdminUser) {
      // Admin Name
      let firstName = this.loggedInAdminUser.firstName.charAt(0).toUpperCase() + this.loggedInAdminUser.firstName.slice(1).toLowerCase();
      let lastname = this.loggedInAdminUser.lastName.charAt(0).toUpperCase() + this.loggedInAdminUser.lastName.slice(1).toLowerCase();
      return firstName + " " + lastname;
    }
  }

}
