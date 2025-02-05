
### Client
The JS would load what the user has inputted via a popup form on the site. This is parsed and sent by the JS to the worker with json POST request, for instance:

```json
{
    "fileData": {
        "user_name": "jesssG",
        "auth_token": "AB7c64fe",
        "files": [
            "gwdfkbkrgbwi3tyw3rwe=",
            "niu34y7895f98374nf="
            ],
        "tier": "alevel",
        "subject": "english_lang_lit",
        "should_hide_name": true
    }
}
```


The server would validate this:

### Worker code
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
