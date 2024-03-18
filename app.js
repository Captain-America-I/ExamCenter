var apiRoute = require('./src/api-routes/controller.js');
var dbConnection = require('./src/config/db-config.js');
var tuitionController = require('./src/api-routes/tuition/tuitioncontroller.js');
startup();

async function startup() {
	console.log('-- Starting Application  --');
	try {
		var compression = require('compression');
		var express = require('express'),
			app = express(),
			port = process.env.PORT || 3000;

		app.listen(port);
		app.use(
			express.urlencoded({
				extended: true
			})
		)
		app.use(express.static(process.cwd() + "/StudyCenter/dist/frontend-application/"));
		app.use(express.json())
		console.log('TestSeries Backend server started on: ' + port);
		app.use(compression());

		// Initialize api-routes
		await tuitionController.initialize(app);
		await apiRoute.initialize(app);
		// Intialize DB connection
		await dbConnection.dbConnection();

	} catch (err) {
		console.log('Application startup error : ', err);
	}


}