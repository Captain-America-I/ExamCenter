let dbCon;
function dbConnection() {
	try {
		// Connect to SQLite Database
		const sqlite3 = require('sqlite3').verbose();

		dbCon = new sqlite3.Database('database/testseries.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
			if (err) {
				console.error('Database Connection Error : ', err.message);
			} else {
				console.log('Connected to the SQLite database.');
			}

		});
	} catch (err) {
		console.log('dbConnection Error : ', err);
	}

}

module.exports.dbConnection = dbConnection;
module.exports.closeDBConnection = closeDBConnection;
module.exports.getDBConnection = getDBConnection;

function getDBConnection() {
	return dbCon;
}

function closeDBConnection() {
	dbCon.close((err) => {
		if (err) {
			console.error("DB Close Error : ", err.message);
		} else {
			console.log('Close the database connection.');
		}
	});
}






