// defines structure of application's model

export class Choice {
    constructor(public questionId: string, public choiceId: string, public value: string, public correctAnswer: string, public correctChoiceId: string, public answerExplanation: string, public correct?: boolean) { }
}

export class Question {
    constructor(public questionId: string, public qNo: string, public label: string, public program: boolean, public correct: boolean, public userChoice: string, public correctChoiceId: string, public answerExplanation: string, public choices: Choice[], public status: string) { }
}

// represents data to load
export class Quiz {
    constructor(public topiclabel: string, public topicName: string, public description: string, public imgName: string, public subTopics: SubTopics[], public skill: string) { }
}

// represents data app will collect each time user answers question
export class Answers {
    constructor(public topicName: string, public values: Choice[] = []) { }
}

export class IssueDetails {
    constructor(public topicName: string, public username: string, public questionId: string, public summary: string, public description: string) { }
}

export class SubTopics {
    constructor(public subTopic: string, public filename: string, public testComplete: string) { }
}

export class Feedback {
    constructor(public username: string, public rating: string, public review: string) { }
}
export class CreateUser {
    constructor(public firstname: string, public lastname: string, public mobile: string, public username: string, public password: string) { }
}
export class User {
    constructor(public username: string, public password: string, public firstname: string, public lastname: string, public cookie: string) { }
}

export class ResultsRequest {
    constructor(public answer: Answers, public user: User) { }
}

export class AdminDashboard {
    constructor(public userVisitedCount: string, public lastestHitToSite: string, public noOfIssuesReported: string, public noOfFeedbacks: string, public totalUsers: string) { }
}

export class TuitionDetails {
    constructor(public id: string, public tuitionId: string, public tuitionName: string, public ownerName: string, public email: string, public address1: string, public address2: string, public city: string, public state: string, public mobileNo: string, public createdDate: string, public lastUpdatedDate: string, public studentLimit: string) { }
}

export class TuitionAdminUser {
    constructor(public id: string, public firstName: string, public lastName: string, public userName: string, public password: string, public tuitionId: string, public email: string, public mobile: string, public createdDate: string, public lastUpdateDate: string) { }
}

export class ClassDetails {
    constructor(public id: string, public name: string, public description: string, public createdDate: string, public createdBy: string, public tuitionId: string) { }
}

export class SubjectDetails {
    constructor(public id: string, public name: string, public description: string, public createdDate: string, public createdBy: string, public classId: string, public tuitionId: string) { }

}

export class TutionTestDetails {
    constructor(public id: string, public testId: string, public testName: string, public description: string, public createdDate: string, public createdBy: string, public tutionId: string, public subjectId: string, public testStartDate: string, public testEndDate: string, public totalMarks: string, public isActive: string, public updateDate: string, public updatedBy: string, public difficultyId: string, public totalQuestions: string, public instructionsId: string, public jsonUploadStatus: string, public jsonFileName: string) { }
}
