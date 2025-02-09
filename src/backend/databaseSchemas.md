# iBaguette Study -- Database
This document outlines the Database for study.iBaguette.com.

## Structure

The Database should be able to support the new site being built as well as provide backwards compatible resources.
In order to do this, the system will be split into three sections:
- Database - This will be the main location for data to be stored via cloudflare.
- LegacyDBAPI - This API will provide functions to access the data similarly to how the previous system worked. This may involve handling large amounts of JSON data and converting to and from the database.
- StudyDBAPI - This API will provide functions for the new site to access the data. This will be in the form of an importable js library that can be used along side other backend infrastructure.

## Tables

The database will consist of several tables to organise data, one table may not work independantly.
- feedback
- files
- uploads
- user-tokens
- users
- sqlite-sequence (auto-generated)

## Database Schema

### feedback

This table will store user feedback for the site and could also act as an error log to store console information.

| Column Name            | Data Type | Constraints                                      |
|------------------------|----------|--------------------------------------------------|
| `feedback-id`         | INTEGER  | NOT NULL, UNIQUE, PRIMARY KEY (AUTOINCREMENT)   |
| `user-id`            | INTEGER  | FOREIGN KEY REFERENCES `users`(`user-id`)       |
| `submittion-datetime` | INTEGER  | -                                               |
| `content`            | TEXT     | NOT NULL                                        |

### files

This table will store individual files from an upload. A user may upload a single file, but in order to stay under cloudflare limitations the file can be split into several parts that can be stored seperately. These individual files will be recorded here.

| Column Name  | Data Type | Constraints                                      |
|-------------|----------|--------------------------------------------------|
| `file-id`   | INTEGER  | NOT NULL, UNIQUE, PRIMARY KEY (AUTOINCREMENT)   |
| `upload-id` | INTEGER  | NOT NULL, FOREIGN KEY REFERENCES `uploads`(`upload-id`) |
| `path`      | TEXT     | NOT NULL                                        |
| `data`      | TEXT     | -                                               |

### uploads

This table will store uploads. When the user uploads a file they should complete a form to populate majority of these fields.

| Column Name        | Data Type | Constraints                                      |
|--------------------|----------|--------------------------------------------------|
| `upload-id`       | INTEGER  | NOT NULL, UNIQUE, PRIMARY KEY (AUTOINCREMENT)   |
| `user-id`         | INTEGER  | NOT NULL, FOREIGN KEY REFERENCES `users`(`user-id`) |
| `auth-token`      | INTEGER  | NOT NULL                                        |
| `datetime`        | INTEGER  | NOT NULL                                        |
| `file-count`      | INTEGER  | -                                               |
| `title`          | TEXT     | NOT NULL                                        |
| `description`     | TEXT     | -                                               |
| `marks`          | TEXT     | -                                               |
| `grade`          | TEXT     | -                                               |
| `tos`            | TEXT     | NOT NULL, DEFAULT `'false'`                     |
| `hide-name`      | TEXT     | NOT NULL, DEFAULT `'true'`                      |
| `watermark`      | TEXT     | NOT NULL, DEFAULT `'true'`                      |
| `allow-indexing` | TEXT     | NOT NULL, DEFAULT `'true'`                      |
| `allow-ai-training` | TEXT  | NOT NULL, DEFAULT `'false'`                     |
| `report-analytics` | TEXT  | NOT NULL, DEFAULT `'false'`                     |
| `monetise`       | TEXT     | NOT NULL, DEFAULT `'true'`                      |
| `tier`           | TEXT     | -                                               |
| `subject`        | TEXT     | -                                               |
| `exam-board`     | TEXT     | -                                               |
| `resource-type`  | TEXT     | -                                               |

### user-tokens

This will store all user tokens. One user may have several valid tokens, this table will also store specialised tokens used for validation and resetting the users password.

| Column Name            | Data Type | Constraints                                      |
|------------------------|----------|--------------------------------------------------|
| `token-id`           | INTEGER  | NOT NULL, UNIQUE, PRIMARY KEY (AUTOINCREMENT)   |
| `user-id`            | INTEGER  | FOREIGN KEY REFERENCES `users`(`user-id`)       |
| `file-id`            | INTEGER  | -                                               |
| `token`             | TEXT     | NOT NULL                                        |
| `expiration-datetime` | INTEGER  | -                                               |
| `type`              | TEXT     | NOT NULL                                        |

### users

This table will store the users login information as well as account details.

| Column Name             | Data Type | Constraints                                      |
|-------------------------|----------|--------------------------------------------------|
| `user-id`             | INTEGER  | NOT NULL, UNIQUE, PRIMARY KEY (AUTOINCREMENT)   |
| `email`              | TEXT     | -                                               |
| `password`           | TEXT     | -                                               |
| `username`           | TEXT     | -                                               |
| `status`             | TEXT     | NOT NULL                                        |
| `verification-state` | TEXT     | NOT NULL                                        |
| `verified-datetime`  | INTEGER  | -                                               |
| `language`           | TEXT     | NOT NULL                                        |
| `last-reset-datetime` | INTEGER  | -                                               |
| `last-activity-datetime` | INTEGER | -                                               |
