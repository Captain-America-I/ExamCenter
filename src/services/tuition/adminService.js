var dbConfig = require('../../config/db-config.js');
var moment = require('moment-timezone');

async function addTuitionDetails(tuition) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('INSERT INTO TUITION_DETAILS (TUITION_ID,TUITION_NAME,OWNER_NAME,EMAIL,ADDRESS1,ADDRESS2,CITY,STATE,MOBILE_NO,CREATED_DATE,LAST_UPDATED_DATE,STUDENT_LIMIT) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', [tuition.tuitionId, tuition.tuitionName, tuition.ownerName, tuition.email, tuition.address1, tuition.address2, tuition.city, tuition.state, tuition.mobileNo, timestamp, timestamp, tuition.studentLimit], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function updateTuitionDetails(tuition) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('UPDATE TUITION_DETAILS SET TUITION_ID =?,TUITION_NAME=?,OWNER_NAME=?,EMAIL=?,ADDRESS1=?,ADDRESS2=?,CITY=?,STATE=?,MOBILE_NO=?,LAST_UPDATED_DATE=?,STUDENT_LIMIT=? WHERE ID=? ', [tuition.tuitionId, tuition.tuitionName, tuition.ownerName, tuition.email, tuition.address1, tuition.address2, tuition.city, tuition.state, tuition.mobileNo, timestamp, tuition.studentLimit, tuition.id], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function getAllTuitionDetails() {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().all('SELECT * FROM TUITION_DETAILS', (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getAllTuitionDetails : ", err.message);
            }
            tuitions = [];
            rows.forEach((row) => {
                tuitions.push(row);
            });
            resolve(tuitions);
        });
    });
}

async function deleteTuitionDetails(id) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('DELETE FROM TUITION_DETAILS WHERE ID =?', [id], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

// Tution Admin Services

async function addTuitionAdminUser(adminUser) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('INSERT INTO TUITION_ADMIN_DETAILS (USERNAME,PASSWORD,TUITION_ID,FIRSTNAME,LASTNAME,EMAIL,MOBILE,CREATED_DATE,LAST_UPDATED_DATE) VALUES(?,?,?,?,?,?,?,?,?)', [adminUser.userName, adminUser.password, adminUser.tuitionId, adminUser.firstName, adminUser.lastName, adminUser.email, adminUser.mobile, timestamp, timestamp], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function updateTuitionAdminUser(adminUser) {
    let timestamp = getCrrentTimeStamp();
    console.log("Admin user details :", adminUser);
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('UPDATE TUITION_ADMIN_DETAILS SET FIRSTNAME =?,LASTNAME=?,EMAIL=?,MOBILE=?,LAST_UPDATED_DATE=? WHERE ID=? AND TUITION_ID=?', [adminUser.firstName, adminUser.lastName, adminUser.email, adminUser.mobile, timestamp, adminUser.id, adminUser.tuitionId], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function getAllTuitionAdminUser(tuitionId) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().all('SELECT * FROM TUITION_ADMIN_DETAILS WHERE TUITION_ID=?', [tuitionId], (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getAllTuitionAdminUser : ", err.message);
            }
            tuitions = [];
            rows.forEach((row) => {
                tuitions.push(row);
            });
            resolve(tuitions);
        });
    });
}

async function deleteTuitionAdminUser(id, tuitionId, username) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('DELETE FROM TUITION_ADMIN_DETAILS WHERE ID =? AND TUITION_ID=? AND USERNAME=?', [id, tuitionId, username], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

function authenticateTuitionAdmin(user) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().get("SELECT FIRSTNAME,LASTNAME,USERNAME,TUITION_ID,EMAIL,MOBILE FROM TUITION_ADMIN_DETAILS WHERE USERNAME=? AND PASSWORD=? AND TUITION_ID=?", [user.userName, user.password, user.tuitionId], (err, row) => {
            if (err) {
                console.error("DB Retrieve Error : ", err.message);
            }
            data = row;
            if (data && data.FIRSTNAME && data.FIRSTNAME != "") {
                dbConfig.getDBConnection().run('UPDATE TUITION_ADMIN_DETAILS SET LAST_LOGIN_DATE = ? WHERE USERNAME=? AND TUITION_ID=?', [timestamp, data.USERNAME, data.TUITION_ID], (err) => {
                    if (err) {
                        console.log("Error while updating last login timestamp");
                    }
                });
            }
            resolve(data);
        });
    });
}

// Manage Class Services

async function addClass(classDetails) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('INSERT INTO CLASS_DETAILS (TUTION_ID,NAME,DESCRIPTION,CREATED_DATE,CREATED_BY) VALUES(?,?,?,?,?)', [classDetails.tuitionId, classDetails.name, classDetails.description, timestamp, classDetails.createdBy], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function getAllClassesDetails(tutionId) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().all('SELECT * FROM CLASS_DETAILS WHERE TUTION_ID=?', [tutionId], (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getAllClassesDetails : ", err.message);
            }
            classes = [];
            rows.forEach((row) => {
                classes.push(row);
            });
            resolve(classes);
        });
    });
}

async function deleteClass(id, tuitionId) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('DELETE FROM CLASS_DETAILS WHERE ID =? AND TUTION_ID=?', [id, tuitionId], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function updateClassDetails(classDetails) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('UPDATE CLASS_DETAILS SET NAME =?,DESCRIPTION=? WHERE ID=? AND TUTION_ID=?', [classDetails.name, classDetails.description, classDetails.id, classDetails.tuitionId], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

// Manage Subject Services

async function addSubject(subjectDetails) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('INSERT INTO SUBJECT_DETAILS (TUTION_ID,CLASS_ID,NAME,DESCRIPTION,CREATED_DATE,CREATED_BY) VALUES(?,?,?,?,?,?)', [subjectDetails.tuitionId, subjectDetails.classId, subjectDetails.name, subjectDetails.description, timestamp, subjectDetails.createdBy], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function getAllSubjectDetails(tutionId, classId) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().all('SELECT * FROM SUBJECT_DETAILS WHERE TUTION_ID=? AND CLASS_ID=?', [tutionId, classId], (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getAllSubjectDetails : ", err.message);
            }
            subjects = [];
            rows.forEach((row) => {
                subjects.push(row);
            });
            resolve(subjects);
        });
    });
}

async function deleteSubject(id, tuitionId, classId) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('DELETE FROM SUBJECT_DETAILS WHERE ID =? AND TUTION_ID=? AND CLASS_ID=?', [id, tuitionId, classId], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function updateSubject(subjectDetails) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('UPDATE SUBJECT_DETAILS SET NAME =?,DESCRIPTION=? WHERE ID=? AND TUTION_ID=? AND CLASS_ID=?', [subjectDetails.name, subjectDetails.description, subjectDetails.id, subjectDetails.tuitionId, subjectDetails.classId], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function getTuitionDetails(tutionId) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().all('SELECT TUITION_ID as tuitionId, TUITION_NAME as tuitionName, OWNER_NAME as ownerName, EMAIL as email, ADDRESS1 as address1, ADDRESS2 as address2, CITY as city, STATE as state, MOBILE_NO as mobile,STUDENT_LIMIT as studentLimit FROM TUITION_DETAILS WHERE TUITION_ID=?', [tutionId], (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getTuitionDetails : ", err.message);
            }
            resolve(rows);
        });
    });
}


// Manage Student Services

async function addStudent(studentDetails) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('INSERT INTO TUTION_STUDENT_DETAILS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,CLASS_ID,ADDRESS1,ADDRESS2,CITY,STATE,EMAIL,MOBILE,IS_ACTIVE,CREATED_DATE,CREATED_BY,UPDATED_DATE,UPDATED_BY,TUTION_ID) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [studentDetails.userName, studentDetails.password, studentDetails.firstName, studentDetails.lastName, studentDetails.classId, studentDetails.address1, studentDetails.address2, studentDetails.city, studentDetails.state, studentDetails.email, studentDetails.mobile, studentDetails.isActive, timestamp, studentDetails.createdBy, timestamp, studentDetails.updatedBy, studentDetails.tutionId], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function getAllStudentDetails(tutionId) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().all('SELECT * FROM TUTION_STUDENT_DETAILS WHERE TUTION_ID=?', [tutionId], (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getAllStudentDetails : ", err.message);
            }
            subjects = [];
            rows.forEach((row) => {
                subjects.push(row);
            });
            resolve(subjects);
        });
    });
}

async function deleteStudent(id, tuitionId, userName) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('DELETE FROM TUTION_STUDENT_DETAILS WHERE ID =? AND TUTION_ID=? AND USERNAME=?', [id, tuitionId, userName], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function updateStudent(studentDetails) {
    let timestamp = getCrrentTimeStamp();
    console.log("studentDetails-- ", studentDetails)
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('UPDATE TUTION_STUDENT_DETAILS SET FIRSTNAME =?,LASTNAME =?,CLASS_ID=?, ADDRESS1=?,ADDRESS2=?,CITY=?,STATE=?,EMAIL=?,MOBILE=?,IS_ACTIVE=?,UPDATED_DATE=?,UPDATED_BY=? WHERE ID=? AND TUTION_ID=? AND USERNAME=?', [studentDetails.firstName, studentDetails.lastName, studentDetails.classId, studentDetails.address1, studentDetails.address2, studentDetails.city, studentDetails.state, studentDetails.email, studentDetails.mobile, studentDetails.isActive, timestamp, studentDetails.updatedBy, studentDetails.id, studentDetails.tutionId, studentDetails.userName], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function getEnrolledClasses(id, tutionId) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT ID as id, TUTION_ID as tuitionId, name as name FROM CLASS_DETAILS WHERE ID in (' + id + ')  and  TUTION_ID = ? ';

        dbConfig.getDBConnection().all(query, [tutionId], (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getEnrolledClasses : ", err.message);
            }
            classes = [];
            rows.forEach((row) => {
                classes.push(row);
            });
            resolve(classes);
        });
    });
}

// Manage Test Services

async function addTest(testDetails) {
    let timestamp = getCrrentTimeStamp();
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('INSERT INTO TUTION_TEST_DETAILS (TEST_ID,TEST_NAME,DESCRIPTION,CREATED_DATE,CREATED_BY,TUTION_ID,SUBJECT_ID,TEST_START_DATE,TEST_END_DATE,TOTAL_MARKS,IS_ACTIVE,UPDATED_DATE,UPDATED_BY,DIFFICULTY_ID,TOTAL_QUESTIONS,INSTRUCTIONS_ID,JSON_UPLOAD_STATUS,JSON_FILE_NAME) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [testDetails.testId, testDetails.testName, testDetails.description, timestamp, testDetails.createdBy, testDetails.tutionId, testDetails.subjectId, testDetails.testStartDate, testDetails.testEndDate, testDetails.totalMarks, testDetails.isActive, timestamp, testDetails.updatedBy, testDetails.difficultyId, testDetails.totalQuestions, testDetails.instructionsId, testDetails.jsonUploadStatus, testDetails.jsonFileName], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function getAllTestDetails(tutionId, subjectId) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().all('SELECT * FROM TUTION_TEST_DETAILS WHERE TUTION_ID=? AND SUBJECT_ID=?', [tutionId, subjectId], (err, rows) => {
            if (err) {
                console.error("DB Retrieve Error getAllStudentDetails : ", err.message);
            }
            subjects = [];
            rows.forEach((row) => {
                subjects.push(row);
            });
            resolve(subjects);
        });
    });
}

async function deleteTest(id, tutionId, subjectId) {
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('DELETE FROM TUTION_TEST_DETAILS WHERE ID =? AND TUTION_ID=? AND SUBJECT_ID=?', [id, tutionId, subjectId], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}

async function updateTest(testDetails) {
    let timestamp = getCrrentTimeStamp();
    console.log("testDetails-- ", testDetails)
    return new Promise((resolve, reject) => {
        dbConfig.getDBConnection().run('UPDATE TUTION_TEST_DETAILS SET TEST_NAME =?,DESCRIPTION =?,TEST_START_DATE=?, TEST_END_DATE=?,TOTAL_MARKS=?,IS_ACTIVE=?,UPDATED_DATE=?,UPDATED_BY=?,DIFFICULTY_ID=?,TOTAL_QUESTIONS=?,INSTRUCTIONS_ID=? WHERE ID=? AND TUTION_ID=? AND SUBJECT_ID=? AND TEST_ID=?', [testDetails.testName, testDetails.description, testDetails.testStartDate, testDetails.testEndDate, testDetails.totalMarks, testDetails.isActive, timestamp, testDetails.updatedBy, testDetails.difficultyId, testDetails.totalQuestions, testDetails.instructionsId, testDetails.id, testDetails.tutionId, testDetails.subjectId, testDetails.testId], (err) => {
            if (err) {
                console.log(err);
                resolve("Failure");
            } else {
                resolve("Success");
            }
        });
    })
}


function getCrrentTimeStamp() {
    var timestamp = moment.tz(moment(), 'Asia/Kolkata').format('YYYY-MM-DD hh:mm:ss A');
    return timestamp;
}

module.exports.deleteTuitionDetails = deleteTuitionDetails;
module.exports.getAllTuitionDetails = getAllTuitionDetails;
module.exports.addTuitionDetails = addTuitionDetails;
module.exports.updateTuitionDetails = updateTuitionDetails;
module.exports.addTuitionAdminUser = addTuitionAdminUser;
module.exports.updateTuitionAdminUser = updateTuitionAdminUser;
module.exports.getAllTuitionAdminUser = getAllTuitionAdminUser;
module.exports.deleteTuitionAdminUser = deleteTuitionAdminUser;
module.exports.authenticateTuitionAdmin = authenticateTuitionAdmin;
module.exports.getAllClassesDetails = getAllClassesDetails;
module.exports.deleteClass = deleteClass;
module.exports.updateClassDetails = updateClassDetails;
module.exports.addClass = addClass;
module.exports.getAllSubjectDetails = getAllSubjectDetails;
module.exports.deleteSubject = deleteSubject;
module.exports.updateSubject = updateSubject;
module.exports.addSubject = addSubject;
module.exports.getTuitionDetails = getTuitionDetails;
module.exports.getAllStudentDetails = getAllStudentDetails;
module.exports.deleteStudent = deleteStudent;
module.exports.updateStudent = updateStudent;
module.exports.addStudent = addStudent;
module.exports.getAllTestDetails = getAllTestDetails;
module.exports.deleteTest = deleteTest;
module.exports.updateTest = updateTest;
module.exports.addTest = addTest;
module.exports.getEnrolledClasses = getEnrolledClasses;