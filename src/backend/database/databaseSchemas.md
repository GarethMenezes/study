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
- uploads
- user-tokens
- users
- sqlite-sequence (auto-generated)

## Database Schema

### feedback

This table will store user feedback for the site and could also act as an error log to store console information. Field `content` will likely be in json to store multiple details.

| Column Name            | Data Type | Constraints                                      |
|------------------------|----------|--------------------------------------------------|
| `feedback-id`         | INTEGER  | NOT NULL, UNIQUE, PRIMARY KEY (AUTOINCREMENT)   |
| `user-id`            | INTEGER  | FOREIGN KEY REFERENCES `users`(`user-id`)       |
| `submittion-datetime` | INTEGER  | -                                               |
| `content`            | TEXT     | NOT NULL                                        |

### uploads

This table will store uploads. When the user uploads a file they should complete a form to populate majority of these fields.
If the user uploads a file that is too large and needs to be "chunked" the client side should split the file into chunks that are then re-assembled on the R2. This keeps the upload with a single file and ensures it is under cloudflares restrictions.

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
| `path`      | TEXT     | NOT NULL                                        |
| `data`      | TEXT     | -                                               |


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
