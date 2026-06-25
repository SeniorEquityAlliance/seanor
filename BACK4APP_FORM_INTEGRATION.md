# Back4App Form Integration

The contact/referral form is currently static and client-side only. It validates required fields in the browser, prevents default submission, and shows a success message. It does not store submissions, send email, or call a backend yet.

Future backend work should use Parse hosted at `www.back4app.com`.

Suggested Parse class name:

- `ContactSubmission`
- `ReferralSubmission`

Suggested fields:

- `firstName`
- `lastName`
- `email`
- `phone`
- `requesterType`
- `subject`
- `message`
- `consent`
- `sourcePage`
- `createdAt`

Security notes:

- Do not put master keys in frontend code.
- Use Back4App Cloud Code if sensitive routing, notifications, spam filtering, or email forwarding is needed.
- Consider reCAPTCHA, hCaptcha, or similar anti-spam protection later.
- Use environment variables or Back4App configuration for credentials and notification settings.
- Validate and sanitize form input server-side before storing or forwarding any submission.

## Environment Variables

Store Back4App and Parse values only in local environment variables, CI/CD secrets, or Back4App configuration. Never commit real key values to GitHub, and never paste them into frontend files.

Suggested variable names:

- `BACK4APP_PARSE_APPLICATION_ID`
- `BACK4APP_PARSE_CLIENT_KEY`
- `BACK4APP_PARSE_JAVASCRIPT_KEY`
- `BACK4APP_PARSE_DOTNET_KEY`
- `BACK4APP_PARSE_REST_API_KEY`
- `BACK4APP_PARSE_WEBHOOK_KEY`
- `BACK4APP_PARSE_FILE_KEY`
- `BACK4APP_PARSE_MASTER_KEY`
- `BACK4APP_PARSE_SERVER_URL`

Frontend code must not use `BACK4APP_PARSE_MASTER_KEY`, `BACK4APP_PARSE_REST_API_KEY`, or other privileged server-side secrets. If browser-side Parse SDK usage is later approved, expose only the minimum public client values required for that flow and document the decision before deployment.

The values shared by the project owner should be treated as sensitive credentials. If there is any concern they were exposed outside a private working context, rotate them in Back4App before connecting production forms.
