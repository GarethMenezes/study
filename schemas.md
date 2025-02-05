
## Resource Upload
### Client
1) The user inputs data via a popup form on the site.

2) JS processes the input, converting it into a JSON payload.

3) The JSON is sent to the worker using an HTTP POST request.

#### Request Schema
```json
{
    "fileData": {
        "user_name": "jesssG",
        "auth_token": "AB7c64fe",
        "files": [
            "gwdfkbkrgbwi3tyw3rwe=",
            "niu34y7895f98374nf="
            ],
        "type": "exam_script",
        "tier": "alevel",
        "subject": "english_lang_lit",
        "grade": "a*",
        "marks": 98,
        "exam_board": "aqa",
        "should_hide_name": true,
        "should_watermark": true,
        "should_allow_indexing": true,
        "should_allow_ai_training": false,
        "should_report_analytics": false,
        "should_monetise": true,
    }
}
```


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
