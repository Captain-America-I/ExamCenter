var dbService = require('../services/dbService.js');

function initialize(app) {
	try {
		const fs = require('fs');
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


		app.get("/api/getUserMenu/:username?", (req, res, next) => {
			var username = req.params['username'];
			var questionPath = "assets/Menu_Details.json";

			fs.readFile(questionPath, "utf8", (err, jsonString) => {
				if (err) {
					console.log("Error", err)
					next(err);
				} else {
					var dataObj = JSON.parse(jsonString);
					if (username === 'demouser') {
						dbService.getUsersCompletedTest(username).then(function (data) {
							if (data && data.length != 0) {
								let testIds = [];
								for (var k = 0; k < data.length; k++) {
									testIds.push(data[k].TEST_ID);
								}
								for (var i = 0; i < dataObj.length; i++) {
									for (var j = 0; j < dataObj[i].subTopics.length; j++) {
										if (testIds.indexOf(dataObj[i].subTopics[j].filename) > -1) {
											dataObj[i].subTopics[j].testComplete = "true";
										}
									}
								}
							}
							res.send(dataObj);
						});
					} else {
						res.send(dataObj);
					}
				}

			});
		});

		app.get("/api/questions/:testName/:maxQuestions?", (req, res, next) => {
			var testName = req.params['testName'];
			var maxQuestions = req.params['maxQuestions'];
			var questionPath = "assets/" + testName + ".json";
			fs.readFile(questionPath, "utf8", (err, jsonString) => {
				if (err) {
					console.log("Error", err)
					next(err);
				} else {
					var dataObj = JSON.parse(jsonString);

					var randomNumberArr = [];
					var questionResponse = [];
					var lengthOfrandomNumberArray = maxQuestions != undefined ? maxQuestions : dataObj.length;


					console.log("Question Length" + dataObj.length);
					for (var i = 0; i < dataObj.length; i++) {
						delete dataObj[i].correctChoiceId;
						delete dataObj[i].answerExplanation;
						questionResponse[i] = dataObj[i];
					}
					res.send(questionResponse);
				}

			});

		});

		// Increment user visited count API
		app.get("/api/userVisited", (req, res, next) => {
			dbService.incrementUserVisit().then(function (data) {
				return res.send({ status: data });
			});
		});

		// Get User Count
		app.get("/api/getUserVisitedCount", (req, res, next) => {
			dbService.getUserVisitedCount().then(function (data) {
				return res.send({ status: data });
			});
		});

		// Get Feedbacks Details
		app.get("/api/getFeedbacks", (req, res, next) => {
			dbService.getFeedbacks().then(function (data) {
				return res.send({ data });
			});
		});

		// Get Issue reported Details
		app.get("/api/getIssuesRepoted", (req, res, next) => {
			dbService.getIssuesRepoted().then(function (data) {
				return res.send({ data });
			});
		});


		// Results
		app.post("/api/results", (req, res, next) => {
			var questionPath = "assets/" + req.body.answer.topicName + ".json";
			var userAnswers = req.body.answer;
			var username = req.body.user.username;
			let jsonData = fs.readFileSync(questionPath);
			let map = new Map();
			var dataObj = JSON.parse(jsonData);
			for (let i = 0; i < dataObj.length; i++) {
				map.set(dataObj[i].questionId, dataObj[i]);
			}
			for (let j = 0; j < userAnswers.values.length; j++) {
				let question = map.get(userAnswers.values[j].questionId);
				if (userAnswers.values[j].choiceId == question.correctChoiceId) {
					userAnswers.values[j].correct = true;
				} else {
					userAnswers.values[j].correct = false;
				}
				userAnswers.values[j].correctChoiceId = question.correctChoiceId;
				userAnswers.values[j].answerExplanation = question.answerExplanation;
			}
			// Mark Test complete for user
			if (username != 'demouser') {
				dbService.markUserTestCompleted(username, req.body.answer.topicName).then(function (data) {
					console.log("-- Marked Test Complete -- : Username :" + username + " topic : " + topicName);
				});
			}

			return res.send(userAnswers);
		});

		// Report Issue
		app.post("/api/reportIssue", (req, res, next) => {
			var issueDetails = req.body;
			dbService.reportIssue(issueDetails).then(function (data) {
				return res.send({ status: data });
			});
		});

		// Feedback
		app.post("/api/submitFeedback", (req, res, next) => {
			var feedabk = req.body;
			dbService.feedbackSubmit(feedabk).then(function (data) {
				return res.send({ status: data });
			});
		});

		// createUser
		app.post("/api/createUser", (req, res, next) => {
			var createUser = req.body;
			dbService.createUser(createUser).then(function (data) {
				return res.send({ status: data });
			});
		});

		//authenticateAdminUserCredientials
		app.post("/api/authenticateAdminUserCredientials", (req, res, next) => {
			var user = req.body;
			dbService.authenticateAdminUserCredientials(user).then(function (data) {
				return res.send({ status: data });
			});
		});

		//authenticateUserByID
		app.post("/api/authenticateUserByID", (req, res, next) => {
			var user = req.body;
			dbService.authenticateUserByID(user).then(function (data) {
				return res.send({ status: data });
			});
		});

		//authenticateAdminUserCredientials
		app.post("/api/authenticateUserCredientials", (req, res, next) => {
			var user = req.body;
			dbService.authenticateUserCredientials(user).then(function (data) {
				return res.send({ status: data });
			});
		});

		//authenticateStudentCredientials
		app.post("/api/authenticateStudentCredientials", (req, res, next) => {
			var user = req.body;
			dbService.authenticateStudentCredientials(user).then(function (data) {
				return res.send({ status: data });
			});
		});

		//admin dashboard detials
		app.get("/api/adminDashboardDetails", (req, res, next) => {
			dbService.adminDashboardDetails().then(function (data) {
				return res.send(data);
			});
		});

		//get user details
		app.get("/api/getUsers", (req, res, next) => {
			dbService.getUsers().then(function (data) {
				return res.send(data);
			});
		});

		//get user test completed details
		app.get("/api/getUsersTestCompleted/:username?", (req, res, next) => {
			var username = req.params['username'];
			dbService.getUsersCompletedTest(username).then(function (data) {
				return res.send(data);
			});
		});

		// Demo user login Audit
		app.post("/api/demoUserLoginAudit", (req, res, next) => {
			var demoUser = req.body;
			dbService.demoUserLoginAudit(demoUser).then(function (data) {
				return res.send({ status: data });
			});
		});

		// Demo user Test Audit
		app.post("/api/demoUserTestAudit", (req, res, next) => {
			var demoUserTest = req.body;
			dbService.demoUserTestAudit(demoUserTest).then(function (data) {
				return res.send({ status: data });
			});
		});

		// Demo user Test Question Attempted Audit
		app.post("/api/demoQuestionAudit", (req, res, next) => {
			var demoTestQuestion = req.body;
			dbService.demoQuestionAudit(demoTestQuestion).then(function (data) {
				return res.send({ status: data });
			});
		});

		// Demo user Submit Test Audit
		app.post("/api/demoSubmitTestAudit", (req, res, next) => {
			var demoSubmitTest = req.body;
			dbService.demoSubmitTestAudit(demoSubmitTest).then(function (data) {
				return res.send({ status: data });
			});
		});

		// Demo user Rate Test Audit
		app.post("/api/demoRateTestAudit", (req, res, next) => {
			var demoRateTestAudit = req.body;
			dbService.demoRateTestAudit(demoRateTestAudit).then(function (data) {
				return res.send({ status: data });
			});
		});

		//get demo user audit for report
		app.get("/api/getDemoUserAudit", (req, res, next) => {
			dbService.getDemoUserAudit().then(function (data) {
				return res.send(data);
			});
		});

		//get demo user Test audit for report
		app.get("/api/getDemoTestAudit", (req, res, next) => {
			dbService.getDemoTestAudit().then(function (data) {
				return res.send(data);
			});
		});

		//updatecookie
		app.post("/api/updatecookie", (req, res, next) => {
			var user = req.body;
			dbService.updateCookie(user).then(function (data) {
				return res.send({ status: data });
			});
		});

		//Remove cookie
		app.post("/api/removeDeviceKey", (req, res, next) => {
			var user = req.body;
			dbService.removeDeviceKey(user).then(function (data) {
				return res.send({ status: data });
			});
		});

	} catch (err) {
		console.log('Controller Initialize error : ', err)
	}

	app.get('*', (req, res) => {
		res.sendFile(process.cwd() + "/StudyCenter/dist/frontend-application/index.html")
	});

}

module.exports.initialize = initialize;
