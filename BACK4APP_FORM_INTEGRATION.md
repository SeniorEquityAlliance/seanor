# Back4App Form Integration

The contact/referral form validates required fields in the browser and is wired to send a `ContactSubmission` payload to a configurable server-side endpoint. The public GitHub Pages frontend must not contain Back4App keys.

Future backend work should use Parse hosted at `www.back4app.com`.

Parse class name:

- `ContactSubmission`

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
- Do not put REST API keys, webhook keys, or other privileged Back4App credentials in frontend code.
- Use Back4App Cloud Code if sensitive routing, notifications, spam filtering, or email forwarding is needed.
- Consider reCAPTCHA, hCaptcha, or similar anti-spam protection later.
- Use environment variables or Back4App configuration for credentials and notification settings.
- Validate and sanitize form input server-side before storing or forwarding any submission.

## Frontend Integration

The static site reads an optional browser variable named `SEA_CONTACT_FORM_ENDPOINT`. This should point to a keyless server endpoint controlled by the project owner. Do not set this value to a raw Parse REST class URL if that requires publishing Back4App keys in frontend code.

Example runtime configuration, stored outside the public repo or injected by a secure hosting layer:

```html
<script>
  window.SEA_CONTACT_FORM_ENDPOINT = "https://example-secure-endpoint.com/contact";
</script>
```

If no endpoint is configured, the form validates locally and shows a phone fallback instead of pretending the submission was stored.

## Back4App Cloud Code Template

A starter Cloud Code handler is included at `back4app-cloud-code/contact-submission.js`. It saves validated submissions to the `ContactSubmission` Parse class with `useMasterKey: true` on the server side.

After deploying that Cloud Code in Back4App, expose it only through a flow that does not require publishing privileged keys in this GitHub Pages frontend. If a thin serverless proxy is needed, keep all Parse credentials in that proxy's environment variables.

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
- `SEA_CONTACT_FORM_ENDPOINT`

Frontend code must not use `BACK4APP_PARSE_MASTER_KEY`, `BACK4APP_PARSE_REST_API_KEY`, or other privileged server-side secrets. If browser-side Parse SDK usage is later approved, expose only the minimum public client values required for that flow and document the decision before deployment.

The values shared by the project owner should be treated as sensitive credentials. If there is any concern they were exposed outside a private working context, rotate them in Back4App before connecting production forms.
