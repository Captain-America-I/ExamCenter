var dbConfig = require('../config/db-config.js');
var moment = require('moment-timezone');

function incrementUserVisit() {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('UPDATE USER_VISITED_COUNT SET USER_COUNT = USER_COUNT +1,DATE_TIME=?', [timestamp], (err) => {
            if (err) {
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })

}

async function getUserVisitedCount() {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().get('SELECT USER_COUNT AS VISTED_USERS FROM USER_VISITED_COUNT', (err, row) => {
            if (err) {
                console.error("DB Retrieve Error : ", err.message);
            }
            data = row;
            resolve(data);
        });
    });
}

async function getLastUserWebsiteVisitTimestamp() {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().get('SELECT DATE_TIME AS TIME_STAMP FROM USER_VISITED_COUNT', (err, row) => {
            if (err) {
                console.error("DB Retrieve Error : ", err.message);
            }
            data = row;
            resolve(data);
        });
    });
}

async function getIssuesReportedCount() {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().get('SELECT COUNT(*) AS NO_ISSUES FROM ISSUES_REPORTED', (err, row) => {
            if (err) {
                console.error("DB Retrieve Error : ", err.message);
            }
            data = row;
            resolve(data);
        });
    });
}

async function getFeedbacksCount() {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().get('SELECT COUNT(*) AS NO_FEEDBACKS FROM USER_FEEDBACK', (err, row) => {
            if (err) {
                console.error("DB Retrieve Error : ", err.message);
            }
            data = row;
            resolve(data);
        });
    });
}

async function getLastUserWebsiteVisitTimestamp() {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().get('SELECT max(DATE_TIME) AS TIME_STAMP FROM USER_VISITED_COUNT', (err, row) => {
            if (err) {
                console.error("DB Retrieve Error : ", err.message);
            }
            data = row;
            resolve(data);
        });
    });
}

function reportIssue(issueDetails) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('INSERT INTO ISSUES_REPORTED VALUES(NULL,?,?,?,?,?,?)', [issueDetails.topicName, issueDetails.questionId, issueDetails.summary, issueDetails.description, timestamp, issueDetails.username], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })

}

function feedbackSubmit(feedback) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('INSERT INTO USER_FEEDBACK VALUES(NULL,?,?,?,?)', [feedback.rating, feedback.review, timestamp, feedback.username], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })

}

function createUser(createUser) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('INSERT INTO USER_DETAILS (firstname,lastname,mobile,username,password,timestamp) VALUES(?,?,?,?,?,?)', [createUser.firstname, createUser.lastname, createUser.mobile, createUser.username, createUser.password, timestamp], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

function authenticateAdminUserCredientials(user) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().get("SELECT COUNT(USERNAME) AS count FROM ADMIN_DETAILS WHERE USERNAME=? AND PASSWORD=?", [user.username, user.password], (err, row) => {
            if (err) {
                console.error("DB Retrieve Error : ", err.message);
            }
            data = row;
            resolve(data);
        });
    });
}

function authenticateUserCredientials(user) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().get("SELECT firstname,lastname,username,cookie FROM USER_DETAILS WHERE USERNAME=? AND PASSWORD=?", [user.username, user.password], (err, row) => {
            if (err) {
                console.error("DB Retrieve Error : ", err.message);
            }
            data = row;
            if (data && data.firstname && data.firstname != "") {
                dbConfig.getDBConnection().run('UPDATE USER_DETAILS SET LAST_LOGIN_TIMESTAMP = ? WHERE USERNAME=?', [timestamp, data.username], (err) => {
                    if (err) {
                        console.log("Error while updating last login timestamp");
                    }
                });
            }
            resolve(data);
        });
    });
}

function authenticateStudentCredientials(user) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().get("Select username as userName, password as password, firstname as firstName, lastname as lastName, CLASS_ID as classId, ADDRESS1 as address1, ADDRESS2 as address2, CITY as city, STATE as state, EMAIL as email, mobile as mobile, IS_ACTIVE as isActive, UUID as uuid, CREATED_DATE as createdDate, created_by as createdBy, UPDATED_DATE as updatedDate, UPDATED_BY as updatedBy , LAST_LOGIN_DATE as lastLoginDate , TUTION_ID as tutionId  from TUTION_STUDENT_DETAILS WHERE username=? AND password=?", [user.userName, user.password], (err, row) => {
            if (err) {
                console.error("DB Retrieve Error : ", err.message);
            }
            data = row;
            console.log(data)
            if (data && data.firstName && data.firstName != "") {
                dbConfig.getDBConnection().run('UPDATE TUTION_STUDENT_DETAILS SET LAST_LOGIN_DATE = ? WHERE USERNAME=?', [timestamp, data.userName], (err) => {
                    if (err) {
                        console.log("Error while updating last login timestamp");
                    }
                });
            }
            resolve(data);
        });
    });
}

function authenticateUserByID(user) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().get("SELECT firstname,lastname,username,cookie FROM USER_DETAILS WHERE COOKIE=?", [user.cookie], (err, row) => {
            if (err) {
                console.error("DB Retrieve Error : ", err.message);
            }
            data = row;
            if (data && data.firstname && data.firstname != "") {
                dbConfig.getDBConnection().run('UPDATE USER_DETAILS SET LAST_LOGIN_TIMESTAMP = ? WHERE USERNAME=?', [timestamp, data.username], (err) => {
                    if (err) {
                        console.log("Error while updating last login timestamp");
                    }
                });
            }
            resolve(data);
        });
    });
}

function removeDeviceKey(user) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('UPDATE USER_DETAILS SET COOKIE = ? WHERE USERNAME=?', ['', user.username], (err) => {
            if (err) {
                console.log("Error while Removing device key");
            }
            resolve('success');
        });
    });
}

function adminDashboardDetails() {
    return new Promise((resolve, reject) => {
        let adminDetails = {};
        getUserVisitedCount().then(function (data) {
            adminDetails.userVisitedCount = data.VISTED_USERS;
            getLastUserWebsiteVisitTimestamp().then(function (data) {
                adminDetails.lastestHitToSite = data.TIME_STAMP;
                getIssuesReportedCount().then(function (data) {
                    adminDetails.noOfIssuesReported = data.NO_ISSUES;
                    getFeedbacksCount().then(function (data) {
                        adminDetails.noOfFeedbacks = data.NO_FEEDBACKS;
                        dbConfig.getDBConnection().get("SELECT COUNT(*) as TOTAL_USERS FROM USER_DETAILS", (err, row) => {
                            if (err) {
                                console.error("DB Retrieve Error : ", err.message);
                            }
                            data = row;
                            adminDetails.totalUsers = data.TOTAL_USERS;
                            resolve(adminDetails);
                        });
                    });
                });

            });
        });

    });
}

function getCrrentTimeStamp() {
    var timestamp = moment.tz(moment(), 'Asia/Kolkata').format('YYYY-MM-DD hh:mm:ss A');
    return timestamp;
}

function markUserTestCompleted(username, testId) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('INSERT INTO USER_TESTS_COMPLETED VALUES(?,?,?)', [username, testId, timestamp], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function getUsersCompletedTest(username) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().all('SELECT * FROM USER_TESTS_COMPLETED WHERE USERNAME = ?', [username], (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getUsersCompletedTest : ", err.message);
            }
            testIds = [];
            rows.forEach((row) => {
                testIds.push(row);
            });
            resolve(testIds);
        });
    });
}

async function getFeedbacks() {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().all('SELECT * FROM USER_FEEDBACK', (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getFeedbacks : ", err.message);
            }
            feedbacks = [];
            rows.forEach((row) => {
                feedbacks.push(row);
            });
            resolve(feedbacks);
        });
    });
}

async function getUsers() {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().all('SELECT * FROM USER_DETAILS', (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getUsers : ", err.message);
            }
            users = [];
            rows.forEach((row) => {
                users.push(row);
            });
            resolve(users);
        });
    });
}

async function getIssuesRepoted() {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().all('SELECT * FROM ISSUES_REPORTED', (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getIssuesRepoted : ", err.message);
            }
            feedbacks = [];
            rows.forEach((row) => {
                feedbacks.push(row);
            });
            resolve(feedbacks);
        });
    });
}

function demoUserLoginAudit(demoUser) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('INSERT INTO DEMO_USER_LOGIN_AUDIT VALUES(NULL,?,?,?,?)', [timestamp, demoUser.deviceType, demoUser.userAgent, demoUser.uuid], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })

}

function demoUserTestAudit(demoUserTest) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('INSERT INTO DEMO_USER_TEST_AUDIT (UUID,TEST_ID,TIMESTAMP) VALUES(?,?,?)', [demoUserTest.uuid, demoUserTest.testId, timestamp], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

function demoQuestionAudit(demoTestQuestion) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('UPDATE DEMO_USER_TEST_AUDIT SET QUESTIONS_ATTEMPTED = ? WHERE UUID=? AND TEST_ID=?', [demoTestQuestion.questionCount, demoTestQuestion.uuid, demoTestQuestion.testId], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })

}

function demoSubmitTestAudit(demoSubmitTest) {
    console.log("demoSubmitTest", demoSubmitTest);
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('UPDATE DEMO_USER_TEST_AUDIT SET IS_TEST_COMPLETE=?,TIME_TAKEN=?,CORRECT_ANSWERS=?,PERCENTAGE=?  WHERE UUID=? AND TEST_ID=?', ['True', demoSubmitTest.timeTaken, demoSubmitTest.correctAnswers, demoSubmitTest.percentage, demoSubmitTest.uuid, demoSubmitTest.testId], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })

}

function demoRateTestAudit(demoRateTest) {
    console.log("demoRateTest", demoRateTest);
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('UPDATE DEMO_USER_TEST_AUDIT SET RATING=? WHERE UUID=? AND TEST_ID=?', [demoRateTest.rating, demoRateTest.uuid, demoRateTest.testId], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })

}

async function getDemoUserAudit() {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().all('SELECT * FROM DEMO_USER_LOGIN_AUDIT', (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getDemoUserAudit : ", err.message);
            }
            feedbacks = [];
            rows.forEach((row) => {
                feedbacks.push(row);
            });
            resolve(feedbacks);
        });
    });
}

async function getDemoTestAudit() {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().all('SELECT * FROM DEMO_USER_TEST_AUDIT', (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getDemoTestAudit : ", err.message);
            }
            feedbacks = [];
            rows.forEach((row) => {
                feedbacks.push(row);
            });
            resolve(feedbacks);
        });
    });
}


function updateCookie(user) {
    console.log("user", user);
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('UPDATE USER_DETAILS SET cookie = ? WHERE USERNAME=?', [user.cookie, user.username], (err) => {
            if (err) {
                console.log("Error while updating last login timestamp");
            } else {
                resolve("Success");
            }
        });
    })

}


module.exports.incrementUserVisit = incrementUserVisit;
module.exports.getUserVisitedCount = getUserVisitedCount;
module.exports.reportIssue = reportIssue;
module.exports.feedbackSubmit = feedbackSubmit;
module.exports.createUser = createUser;
module.exports.authenticateAdminUserCredientials = authenticateAdminUserCredientials;
module.exports.authenticateUserCredientials = authenticateUserCredientials;
module.exports.authenticateStudentCredientials = authenticateStudentCredientials;
module.exports.markUserTestCompleted = markUserTestCompleted;
module.exports.getUsersCompletedTest = getUsersCompletedTest;
module.exports.adminDashboardDetails = adminDashboardDetails;
module.exports.getLastUserWebsiteVisitTimestamp = getLastUserWebsiteVisitTimestamp;
module.exports.getIssuesReportedCount = getIssuesReportedCount;
module.exports.getFeedbacksCount = getFeedbacksCount;
module.exports.getFeedbacks = getFeedbacks;
module.exports.getIssuesRepoted = getIssuesRepoted;
module.exports.getUsers = getUsers;
module.exports.demoUserLoginAudit = demoUserLoginAudit;
module.exports.demoUserTestAudit = demoUserTestAudit;
module.exports.demoQuestionAudit = demoQuestionAudit;
module.exports.demoSubmitTestAudit = demoSubmitTestAudit;
module.exports.getDemoUserAudit = getDemoUserAudit;
module.exports.getDemoTestAudit = getDemoTestAudit;
module.exports.updateCookie = updateCookie;
module.exports.removeDeviceKey = removeDeviceKey;
module.exports.authenticateUserByID = authenticateUserByID;
module.exports.demoRateTestAudit = demoRateTestAudit;
