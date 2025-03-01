BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "feedback" (
	"feedback-id"	INTEGER NOT NULL UNIQUE,
	"user-id"	INTEGER,
	"submittion-datetime"	INTEGER,
	"content"	TEXT NOT NULL,
	PRIMARY KEY("feedback-id" AUTOINCREMENT),
	FOREIGN KEY("user-id") REFERENCES "users"("user-id")
);
CREATE TABLE IF NOT EXISTS "uploads" (
	"upload-id"	INTEGER NOT NULL UNIQUE,
	"user-id"	INTEGER NOT NULL,
	"datetime"	INTEGER NOT NULL,
	"file-count"	INTEGER,
	"title"	TEXT NOT NULL,
	"description"	TEXT,
	"marks"	TEXT,
	"grade"	TEXT,
	"tos"	TEXT NOT NULL DEFAULT 'false',
	"hide-name"	TEXT NOT NULL DEFAULT 'true',
	"watermark"	TEXT NOT NULL DEFAULT 'true',
	"allow-indexing"	TEXT NOT NULL DEFAULT 'true',
	"allow-ai-training"	TEXT NOT NULL DEFAULT 'false',
	"report-analytics"	TEXT NOT NULL DEFAULT 'false',
	"monetise"	TEXT NOT NULL DEFAULT 'true',
	"tier"	TEXT,
	"subject"	TEXT,
	"exam-board"	TEXT,
	"resource-type"	TEXT,
	"path"	TEXT NOT NULL,
	"data"	TEXT,
	PRIMARY KEY("upload-id" AUTOINCREMENT),
	FOREIGN KEY("user-id") REFERENCES "users"("user-id")
);
CREATE TABLE IF NOT EXISTS "tokens" (
	"token-id"	INTEGER NOT NULL UNIQUE,
	"user-id"	INTEGER,
	"token"	TEXT NOT NULL,
	"expiration-datetime"	INTEGER,
	"type"	TEXT NOT NULL,
	PRIMARY KEY("token-id" AUTOINCREMENT),
	FOREIGN KEY("user-id") REFERENCES "users"("user-id")
);
CREATE TABLE IF NOT EXISTS "users" (
	"user-id"	INTEGER NOT NULL UNIQUE,
	"email"	TEXT,
	"password"	TEXT,
	"username"	TEXT,
	"status"	TEXT NOT NULL,
	"verification-state"	TEXT NOT NULL,
	"verified-datetime"	INTEGER,
	"language"	TEXT NOT NULL,
	"last-reset-datetime"	INTEGER,
	"last-activity-datetime"	INTEGER,
	PRIMARY KEY("user-id" AUTOINCREMENT)
);
COMMIT;
