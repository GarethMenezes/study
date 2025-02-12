# iBaguette Study -- Database
This document outlines the Database Internal API for study.iBaguette.com.

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

## Database API Structure

The API will be broken down into smaller importable modules to keep the system maintainable.
The worker will import the database API, this will be a middleman between functions and SQL, it can then call specific SQL from different files. The worker should only interact with the API to maintain database integrity, it should not interact directly with the d1.

- `worker.js` uses `database/dbapi.js`
- `database/dbapi.js` uses `database/db-interactions.js` and other files to access the database.
- `database/db-interactions.js` is responsible for executing SQL on behalf of the API. The API is resposible for maintaining database integrity.

## Database API Documentation (StudyDBAPI)

### async validateEmail(email: string)

This function checks if an `email` appears to be valid. It does not query any email database or API for this, only checking if the format is good. It takes in the `email` as a string and will return `true` of `false`.

Example usage:
```TYPESCRIPT
// Create an API instance and an email (string) to check
const db = new dbAPI(env);
const email:string = "user.name@doman.com";

// get if the string is valid, this will output "true" (boolean)
console.log(db.validateEmail(email));
```

### async validateUniformInput(username: string)

This function will validate a uniform user input (uniform meaning it contains no spaces). Intended use is for validating user input like usernames, passwords, descriptions, etc... It takes in a string and will output `true` or `false`, with `false` being if the string contained any characters that are not in the allowed set.

Set it will compare characters against:
```"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"```

Example usage:
```TYPESCRIPT
// Create an API instance and a string to compare
const db = new dbAPI(env);
const username:string = "Username String Here";

// get if the string is valid, then output it. This will output "true" (boolean)
console.log(db.validateUniformInput(username));
```

### async cleanTokens(userid: string)

Cleans up the tokens in the databse for this `user-id` as a string. This involves deleting all tokens for this `user-id` that have an `expiration-datetime` smaller then the current datetime. It will return either `false` if something went wrong or the amount of deletions that were made.

Example usage:
```TYPESCRIPT
// Create an API instance
const db = new dbAPI(env);

// Clean up expired tokens for the user with user-id "5"
console.log(db.cleanTokens("5"));
```

### async verifyPassword(password: string, hash: string)

This function will take in a password and a hash and compare them. This involves hashing the password with the same key as the hash and checking if they are equal. This is generally used to validate a password is correct, I.E., when a user is logging in.

Example usage:
```TYPESCRIPT
// Create an API instance
const db = new dbAPI(env);

// Create a password and its corresponding hash
const password: string = "MyPassword";
const hash: string = db.hashPassword(password);

// Compare the hash with the correct password (ouput will be true (boolean))
console.log(db.verifyPassword("MyPassword", hash));

// Compare the hash with an incorrect password (output will be false (boolean))
console.log(db.verifyPassword("WrongPassword", hash));
```

### async getUserBy___(user: string)

Possible Options are:
- getUserByUsername(user: string)
- getUserByUserID(id: string)
- getUserByEmail(email: string)

This function will return a users entire record based on the search results. If the users does not exist, it will return `false`, if multiple users are found, it will return the first users record.

Example usage:
```TYPESCRIPT
// Create an API instance
const db = new dbAPI(env);

// Get the user record for "MyUser"
console.log(getUserByUsername("MyUser"));
```

For a full list of return values, see the database schema for "users".

### async validateUser(userid?: string, username?: string)

`validateUser` takes in either a `userid` (string) or a `username` (string). This will get the users record, and return it for that user. This is similar to `getUserByUserID` and `getUserByUsername`, this function is prefered for these operations as it performs extra sanity checks. If the user is not found or if the inputs are invalid, it will return false.

Example usage:
```TYPESCRIPT
// Create an API instance
const db = new dbAPI(env);

// Get the user record for "MyUser"
console.log(validateUser(username="MyUser"));
```

### async newUserRegister(email: string, username: string, password: string)

This function attempts to insert a new user into the database. It takes in a users `email` (string), `username` (string) and `password` (string).

Possible returns:
- "INVALID-EMAIL" - This means either the users email already exists, or the email is invalid according to `db.validateEmail(email)`.
- "INVALID-USERNAME" - This means either the users username already exists, or the username is invalid according to `db.validateUniformInput(username)`
- "INVALID-PASSWORD" - This means the password is invalid according to `db.validateUniformInput(password)`. Note additional checks should be made to ensure the password meets requirements (TODO).
- "FAILED" - The database failed to add the entry.
- true - The entry was made and all inputs appeared valid.

Example usage:
```TYPESCRIPT
// Create an API instance
const db = new dbAPI(env);

// Create a new user and log the success
console.log(newUserRegister("a@a.a", "a", "a"));
```

****TODO: IMPLEMENT FURTHER PASSWORD REQUIREMENT CHECKS**

### sync initialiseDatabase(env: any)

This function should be called on worker startup taking in the env variable, it runs a script to re-generate the schema without overwriting previous data.
After creating the schema, the function will return all of the tables that currently exist inside the database, as well as information about those tables. Note it will only return this if the environment is in `"development"` mode.

### async validateToken(token: string) WRONG FILE???

This function will get if a token in the `tokens` table is real. Return Scenarios:
- The token is expired : Entry is deleted and the function returns `false`.   
- The token does not exist : Function returns `false`.
- More then one token was found : Function returns `false`.
- If the token is found to exist : Function returns `true`.

Example usage:
```TYPESCRIPT
// Create an API instance
const db = new dbAPI(env);

// Validate a token and log if it was found, function will return either true of false (boolean)
console.log(newUserRegister("xxx.xxx"));
```

### async generateToken(userid: number, type: string)

This function takes in a `user-id` and a `type`. It will return a generated 32 hexadecimal encoded `token`, a copy of this token is stored in the database and is valid for 1 hour. Alternatively, the function will return `false` if the function failed to validate the `user-id` is real or if the database fails to make the insertion.

The `type` of the `token` can be any string, however the convention to use here is:
- `TEST-TOKEN` - For testing purposes
- `USER-ACCESS` - For a user
- `PASSWORD-EMAIL` - To identify a users password reset email
- `VALIDATION-EMAIL` - To identifty a users email verification email

These will be sanity checked in the future once a convention is finalised.

## Database API Documentation (LegacyDBAPI)

TO BE IMPLEMENTED
