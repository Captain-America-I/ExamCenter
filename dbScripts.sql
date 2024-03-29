CREATE TABLE "TUITION_ADMIN_DETAILS" (
	"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"USERNAME"	TEXT NOT NULL,
	"PASSWORD"	TEXT NOT NULL,
	"TUITION_ID"	TEXT NOT NULL,
	"FIRSTNAME"	TEXT NOT NULL,
	"LASTNAME"	TEXT NOT NULL,
	"EMAIL"	TEXT,
	"MOBILE"	TEXT,
	"CREATED_DATE"	TEXT,
	"LAST_UPDATED_DATE"	TEXT,
	"LAST_LOGIN_DATE"	TEXT
);

CREATE TABLE "TUITION_DETAILS" (
	"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"TUITION_ID"	TEXT NOT NULL,
	"TUITION_NAME"	TEXT NOT NULL,
	"OWNER_NAME"	TEXT,
	"EMAIL"	TEXT,
	"ADDRESS1"	TEXT,
	"ADDRESS2"	TEXT,
	"CITY"	TEXT,
	"STATE"	TEXT,
	"MOBILE_NO"	TEXT,
	"CREATED_DATE"	TEXT,
	"LAST_UPDATED_DATE"	TEXT,
	"STUDENT_LIMIT"	INTEGER
);