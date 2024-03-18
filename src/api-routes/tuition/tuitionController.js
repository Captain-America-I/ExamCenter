var adminService = require('../../services/tuition/adminService.js');

function initialize(app) {
    try {
        const fs = require('fs');
        const multer = require("multer")
        // Add headers
        app.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', '*');

            next();
        });

        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                // Uploads is the Upload_folder_name
                cb(null, "uploads")
            },
            filename: function (req, file, cb) {
                console.log("file.testId : ", file)
                cb(null, file.testId + ".json")
            }
        })

        // Define the maximum size for uploading
        const maxSize = 60 * 1000 * 1000; // 60 MB

        var upload = multer({
            storage: storage,
            limits: { fileSize: maxSize },
            fileFilter: function (req, file, cb) {
                // Set the filetypes, it is optional
                if (file.mimetype.split("/")[1] === "json") {
                    cb(null, true);
                } else {
                    cb("Error: File upload only supports the "
                        + "following filetypes - " + filetypes, false);
                }
            }
        });

        // Upload File
        app.post('/api/uploadFile', upload.single("file"), (req, res) => {
            console.log("request : ", req);
            return res.send({ status: "File uploaded successfully!" });
        });

        //get All Tuition Details
        app.get("/api/getAllTuitionDetails", (req, res, next) => {
            adminService.getAllTuitionDetails().then(function (data) {
                return res.send(data);
            });
        });

        // Add Tuition Details
        app.post("/api/addTuitionDetails", (req, res, next) => {
            var tuition = req.body;
            adminService.addTuitionDetails(tuition).then(function (data) {
                return res.send({ status: data });
            });
        });

        // Update Tuition Details
        app.post("/api/updateTuitionDetails", (req, res, next) => {
            var tuition = req.body;
            adminService.updateTuitionDetails(tuition).then(function (data) {
                return res.send({ status: data });
            });
        });

        //Delete Tuition Details
        app.get("/api/deleteTuitionDetails/:tuitionId", (req, res, next) => {
            var tuitionId = req.params['tuitionId'];
            adminService.deleteTuitionDetails(tuitionId).then(function (data) {
                return res.send({ status: data });
            });
        });

        // --- Tution Admin User API's

        //get All Tuition Admin users
        app.get("/api/getAllTuitionAdminUser/:tuitionId", (req, res, next) => {
            var tuitionId = req.params['tuitionId'];
            adminService.getAllTuitionAdminUser(tuitionId).then(function (data) {
                return res.send(data);
            });
        });

        // Add Tuition Admin User
        app.post("/api/addTuitionAdminUser", (req, res, next) => {
            var adminUser = req.body;
            adminService.addTuitionAdminUser(adminUser).then(function (data) {
                return res.send({ status: data });
            });
        });

        // Update Tuition Admin user
        app.post("/api/updateTuitionAdminUser", (req, res, next) => {
            var adminUser = req.body;
            adminService.updateTuitionAdminUser(adminUser).then(function (data) {
                return res.send({ status: data });
            });
        });

        //Delete Tuition Admin user
        app.get("/api/deleteTuitionAdminUser/:id/:tuitionId/:username", (req, res, next) => {
            var id = req.params['id'];
            var tuitionId = req.params['tuitionId'];
            var username = req.params['username'];
            adminService.deleteTuitionAdminUser(id, tuitionId, username).then(function (data) {
                return res.send({ status: data });
            });
        });

        //Authenticate Tution Admin user
        app.post("/api/authenticateTuitionAdmin", (req, res, next) => {
            var user = req.body;
            adminService.authenticateTuitionAdmin(user).then(function (data) {
                return res.send({ status: data });
            });
        });

        /* Manage Class Services */
        //get All Classes
        app.get("/api/getAllClassesDetails/:tuitionId", (req, res, next) => {
            var tuitionId = req.params['tuitionId'];
            adminService.getAllClassesDetails(tuitionId).then(function (data) {
                return res.send(data);
            });
        });

        // Add Class
        app.post("/api/addClass", (req, res, next) => {
            var classDetails = req.body;
            adminService.addClass(classDetails).then(function (data) {
                return res.send({ status: data });
            });
        });

        // Update Class
        app.post("/api/updateClassDetails", (req, res, next) => {
            var classDetails = req.body;
            adminService.updateClassDetails(classDetails).then(function (data) {
                return res.send({ status: data });
            });
        });

        //Delete Class
        app.get("/api/deleteClass/:id/:tuitionId", (req, res, next) => {
            var id = req.params['id'];
            var tuitionId = req.params['tuitionId'];
            adminService.deleteClass(id, tuitionId).then(function (data) {
                return res.send({ status: data });
            });
        });

        /* Manage Subject Services */
        //get All Classes
        app.get("/api/getAllSubjectDetails/:tuitionId/:classId", (req, res, next) => {
            var tuitionId = req.params['tuitionId'];
            var classId = req.params['classId'];
            adminService.getAllSubjectDetails(tuitionId, classId).then(function (data) {
                return res.send(data);
            });
        });

        // Add Subject
        app.post("/api/addSubject", (req, res, next) => {
            var subjectDetails = req.body;
            adminService.addSubject(subjectDetails).then(function (data) {
                return res.send({ status: data });
            });
        });

        // Update Subject
        app.post("/api/updateSubject", (req, res, next) => {
            var subjectDetails = req.body;
            adminService.updateSubject(subjectDetails).then(function (data) {
                return res.send({ status: data });
            });
        });

        //Delete Subject
        app.get("/api/deleteSubject/:id/:tuitionId/:classId", (req, res, next) => {
            var id = req.params['id'];
            var tuitionId = req.params['tuitionId'];
            var classId = req.params['classId'];
            adminService.deleteSubject(id, tuitionId, classId).then(function (data) {
                return res.send({ status: data });
            });
        });

        //Get Tution Details
        app.get("/api/getTuitionDetails/:tuitionId", (req, res, next) => {
            var tuitionId = req.params['tuitionId'];
            adminService.getTuitionDetails(tuitionId).then(function (data) {
                return res.send(data);
            });
        });

        //Get Enrolled classes
        app.get("/api/getEnrolledClasses/:id/:tuitionId", (req, res, next) => {
            var id = req.params['id'];
            var tuitionId = req.params['tuitionId'];
            adminService.getEnrolledClasses(id, tuitionId).then(function (data) {
                return res.send(data);
            });
        });

        /* Manage Student Services */
        //get All Students
        app.get("/api/getAllStudentDetails/:tuitionId", (req, res, next) => {
            var tuitionId = req.params['tuitionId'];
            adminService.getAllStudentDetails(tuitionId).then(function (data) {
                return res.send(data);
            });
        });

        // Add Student
        app.post("/api/addStudent", (req, res, next) => {
            var studentDetails = req.body;
            adminService.addStudent(studentDetails).then(function (data) {
                return res.send({ status: data });
            });
        });

        // Update Student
        app.post("/api/updateStudent", (req, res, next) => {
            var studentDetails = req.body;
            adminService.updateStudent(studentDetails).then(function (data) {
                return res.send({ status: data });
            });
        });

        //Delete Student
        app.get("/api/deleteStudent/:id/:tuitionId/:userName", (req, res, next) => {
            var id = req.params['id'];
            var tuitionId = req.params['tuitionId'];
            var userName = req.params['userName'];
            adminService.deleteStudent(id, tuitionId, userName).then(function (data) {
                return res.send({ status: data });
            });
        });

        /* Manage Test Services */
        //get All Tests
        app.get("/api/getAllTestDetails/:tuitionId/:subjectId", (req, res, next) => {
            var tuitionId = req.params['tuitionId'];
            var subjectId = req.params['subjectId'];
            adminService.getAllTestDetails(tuitionId, subjectId).then(function (data) {
                return res.send(data);
            });
        });

        // Add Test
        app.post("/api/addTest", (req, res, next) => {
            var testDetails = req.body;
            adminService.addTest(testDetails).then(function (data) {
                return res.send({ status: data });
            });
        });

        // Update Test
        app.post("/api/updateTest", (req, res, next) => {
            var testDetails = req.body;
            adminService.updateTest(testDetails).then(function (data) {
                return res.send({ status: data });
            });
        });

        //Delete Test
        app.get("/api/deleteTest/:id/:tutionId/:subjectId", (req, res, next) => {
            var id = req.params['id'];
            var tutionId = req.params['tutionId'];
            var subjectId = req.params['subjectId'];
            adminService.deleteTest(id, tutionId, subjectId).then(function (data) {
                return res.send({ status: data });
            });
        });


    } catch (err) {
        console.log('Controller Initialize error : ', err)
    }
}

module.exports.initialize = initialize;

