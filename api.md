# API Endpoints and Responses
This is a document outlining the specification for the iBaguette Study API, with the expected inputs to each endpoint and the expected structure of server responses.

# New Endpoints
These are brand new endpoints that will be created for the API. Consider these as the first draft of the specification with changes to be made as necesssary/when things require.

> TODO....

# Existing endpoints
The Draggie Games API already has several endpoints and expected return values. For backwards compatibility, they should ideally be kept the same -- however for efficiency and making a better API, we may need to update and modernise them.

## DELETE /delete_account
Deletes the user's account.

### Input :
As `request.json`:

```json
{
    "token": "<auth_token>",
    "password": "<user_password>",
    "email": "<user_email>"
}
```

### Response
Returns `200` if successful, or `404` if the user does not exist.

```json
{
    "message": "User deleted successfully"
}
```


## POST /validate_token
Checks if the verification token sent via email is valid. 

### Input

As `json` as part of the `request`:

```json
{
    "token": "<verification_token>"
}
```

### Response
Returns `200` if successful, or `401 Unauthorised` if the token is invalid.

```json
{
    "message": "Verified successfully, you may close this tab.",
    "error": false,
    "username": "<username>",
    "email": "<email>"
}
```

```JSON
{
    "message": "[error 2] Invalid token",
    "error": true
}
```


## GET /api/v1/saturnian/game/accountInfo
Returns a subset of the account information for the Saturnian project.

### Input
Reads `Authorisation` string header from `request.headers`.

### Responses
Returns `200` if successful, or `401 Unauthorised` if the token is invalid.

#### Success
```json
{
    "message": "User found successfully, returning relevant data",
    "error": false,
    "Username": "<user.username>",
    "Email address": "<user.email>",
    "Codes redeemed": "<user.codes>",
    "Entitlements granted": "<user.entitlements>"
}
```

#### Failures
`401 Unauthorised` if no token is provided.
```json
{
    "message": "No access scopes provided",
    "error": true
}
```

`401 Unauthorised` if there is no user with that token:
```json
{
    "message": "No user found with that token",
    "error": true
}
```

## GET /api/v1/saturnian/game/gameData/licences/validation
Returns the value for the redeemed codes' values.

### Input
Reads `Authorisation` string header from `request.headers`.

> ℹ️ Some client implementations may also send `Token` in request arguments.

> ⚠️ Deprecated functionality: this endpoint also reads `token` from the `request.json` body. This is not recommended and should not be re-implemented, however, old clients may still be using this method.

### Responses

#### Success
Returns `200` if successful with the following JSON. If there are other entitlements, they will be included in the `entitlements` array.


```json
{
    "message": "Successfully retrieved entitlements for <user.username>",
    "error": false,
    "username": "<user.username>",
    "entitlements": [
        {
            "saturnian_alpha_tester": [
                {
                    "currentVersion": "<int>",
                    "currentVersionString": "<string>",
                    "downloadUrl": "<string>",
                    "type": "<string>",
                    "friendlyName": "<string>",
                    "id": "saturian_alpha_tester",
                    "folderName": "<string>",
                    "executableName": "<string>"
            ]
        }
    ]
}
```

#### Failures
May also return a range of `401 Unauthorised` responses with `"error": true` and a corresponding message in the `message` string field.

## POST /register
Registers a new user.

### Input
As `request.json`:

```json
{
    "email": "<user_email>",
    "username": "<user_username>",
    "password": "<user_password>",
    "language": "<user_language>"
}
```

### Logic
- Creates a new user with the given details:
    - Set `user.id` to the number of all users registered and + 1.
    - Set `email`, `username` to the inputted values
    - Hash the password with a salt and store it in `user.password`
    - Set `user.verification_pending` to `true`
    - Set `user.verification_pending_codes` to a unique uuid
- Send an email via the mailgun API to the user's email and format it with the pending token.

### Response

#### Success

