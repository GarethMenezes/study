# iBaguette Study -- Schemas
This document outlines the schemas for study.iBaguette.com, a platform for students to share and access educational resources.

## User Data
User data is to be migrated from the existing Draggie Games database. It holds the following fields:
| Field      | Description                                                                          | Data type | Optional | Possible values |
|------------|--------------------------------------------------------------------------------------|-----------|----------|-----------------|
| id         | The unique identifier for the user, starting from 1.                                 | int       | false    | any             |
| email      | The email address of the user.                                                       | string    | false    | any             |
| password   | The sha256 + salted password of the user (pbkdf2 or scrypt).                         | string    | false    | any             |
| username   | User's unique username.                                                              | string    | false    | any             |
| codes      | Array of games codes the user has redeemed as strings.                               | array     | true     | any             |
| tokens     | Array of authentication tokens the user has generated, as strings.                   | array     | true     | any             |
| tokens_expiration | Array of ints representing the expiration time of each corresponding token in `tokens`. | array | true | any |
| status     | The status of the user's account. (Unused)                                                   | string    | false    | active, banned |       
| verified   | Whether the user has verified their email address.                                    | bool      | false    | true, false     |
| verified_date | The unix timestamp of when the user verified their email.                           | float     | true     | any             |
| temp_account_reset_token | If the user has requested a password reset, this token is used to verify the request. | string/null | true | any string or null |
| entitlements | Array of entitlements the user has, as strings.                                       | array     | true     | any             |
| verification_pending | Whether the user clicked on verificaiton link in email.                               | bool      | false    | true, false     |
| verification_pending_codes | Unique uuid of the verification code sent to the user.                                | string    | true    | any             |
| user_lang  | The language the user has set for the site.                                           | string    | true     | en, fr, shakespeare, pirate, pseudo, ie, lolcat |
| last_time_reset_token | The unix timestamp of when the user last requested a password reset as a string (to be migrated to a float).    | string    | true     | any             |
| last_activity | The unix timestamp of the user's last activity from any endpoint.                    | float     | true     | any             |

### Generic User Schema


## Resource Upload
### Client
1) The user inputs data via a popup form on the site.

2) JS processes the input, converting it into a JSON payload.

3) The JSON is sent to the worker using an HTTP POST request.

#### Request Schema
```json
{
    "resourceData": {
        "user_name": "jesssG",              // User's name
        "auth_token": "AB7c64fe",           // Auth token (could also chck for auth cookie)
        "files": [                          // Array of file data
            {
                "name": "file1.pdf",        // Client-side name
                "data:": "gwdfkbkrgbwi3tyw3rwe=", // b64 encoded file data for the worker to process
                "description": "User's description of the file", // self-explanatory
                "resource_type": "exam_script",     // Type of resource (see table for all possible values)
                "marks": 98,                
                "grade": "a*",
            },
            {
                "name": "file2.pdf",
                "data:": "gwdfkbkrgbwi3tyw3rwe=",
                "description": "User's description of the file",
                "resource_type": "nea",
                "marks": 60,
            }
            ],
        "tier": "alevel",
        "subject": "english_lang_lit",
        "exam_board": "aqa",

        // Optional bool fields - use default values if not present
        "should_hide_name": true,
        "should_watermark": true,
        "should_allow_indexing": true,
        "should_allow_ai_training": false,
        "should_report_analytics": false,
        "should_monetise": true,
    }
}
```

| Field      | Description                                                                          | Data type | Optional/nullable? | Possible values |
|------------|--------------------------------------------------------------------------------------|-----------|--------------------|-----------------|
| user_name  | The username of the user                                                             | string    | false              | any             |
| auth_token | the stored authentication token. (this should/could be passed via cookie or header)  | string    | false              | any             |
| files      | Array of files to upload                                                             | array     | false              | any             |
| files.name | The name, as defined on the client's device, of the file                             | string    | false              | any             |
| files.data | The base64 encoded file data                                                         | string    | false              | any             |
| files.description | The user's description of the file                                              | string    | false              | any             |
| files.resource_type | The type of resource being uploaded                                           | string    | false              | exam_script, nea, personal_statement, notes, other |
| files.grade      | The grade obtained by the user                                                      | string    | true               | A*-U, 9-1 |
| files.marks      | The marks obtained for the resource                                                   | int       | true               | any             |
| tier       | The target level of education for that resource                                      | string    | false              | uni, alevel, gcse, ib, other (e.g. if personal statement) |
| subject    | The subject of the resource                                                         | string    | false              | All possible subjects |
| exam_board | The exam board the resource was made for                                             | string    | false              | OCR, AQA, Edexcel, CIE, WJEC, other |
| should_hide_name | Whether the user wants to dissociate their name from the resource                | bool      | true              | true, false (default) |
| should_watermark | If the user wants to add a watermark to their resource                            | bool      | true              | true, false (default) |
| should_allow_indexing | If the user wants the resource to be indexed by search engines                  | bool      | true              | true (default), false |
| should_allow_ai_training | If the user wants the resource to be used for AI training                        | bool      | true              | true, false (default) |
| should_report_analytics | If analytics about the resource should be reported back to the user             | bool      | true              | true, false (default) |
| should_monetise | Toggle to allow the resource to be monetised with ads                          | bool      | true              | true, false (default) |


### Worker code
The server would validate this:
- If auth token/cookie is not valid, return error
- Sanitise everything (!!!)
- Parse the name and other fields
- If the user is trusted:
    - Parse the file(s) and upload to prod/tier/subject/\<unique ID>/filename
- Else, place in an unreviewed/unverified section.

Then:
- Make D1 request to SQL database to add an entry with all the relevant data and verify it was added
- Cool thing: Ping/fetch Webhook(s) e.g. a discord channel with the data to notify public/devs of new resource submission
- Return to user that it was successful and has been added for final cleanup (if verified) OR is in review queue (unverified)
- Virustotal API thingy here

Once verified and checked
