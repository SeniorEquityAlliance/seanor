# Back4App Form Integration

The contact/referral form validates required fields in the browser and submits to a keyless serverless proxy endpoint. The proxy creates a `ContactSubmission` PFObject in Parse using Back4App keys stored as server-side secrets.

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
- Do not create `ContactSubmission` directly from GitHub Pages if the project requires keys to remain private.
- Use Back4App Cloud Code if sensitive routing, notifications, spam filtering, or email forwarding is needed.
- Consider reCAPTCHA, hCaptcha, or similar anti-spam protection later.
- Use environment variables or Back4App configuration for credentials and notification settings.
- Validate and sanitize form input server-side before storing or forwarding any submission.

## Serverless Proxy Integration

Direct PFObject creation does not require Back4App Web Hosting, but it does require Parse credentials. Because this project must not expose those credentials publicly, use a proxy endpoint.

The included Cloudflare Worker at `cloudflare-worker/worker.js` accepts a keyless browser request and then calls Parse server-side:

```text
GitHub Pages form
-> Cloudflare Worker /contact-submission
-> Back4App Parse REST API /classes/ContactSubmission
```

Configure these as Cloudflare Worker secrets:

```bash
cd cloudflare-worker
wrangler secret put BACK4APP_PARSE_APPLICATION_ID
wrangler secret put BACK4APP_PARSE_MASTER_KEY
wrangler deploy
```

Optional fallback if the class permissions allow it:

```bash
wrangler secret put BACK4APP_PARSE_REST_API_KEY
```

The worker also uses this non-secret variable:

```js
BACK4APP_PARSE_SERVER_URL = "https://parseapi.back4app.com"
```

After the Worker is deployed, set the static site runtime config:

```js
window.SEA_CONTACT_FORM_ENDPOINT = "https://YOUR-WORKER.workers.dev/contact-submission";
```

## Server Endpoint Integration

The static site reads an optional browser variable named `SEA_CONTACT_FORM_ENDPOINT`. This should point to a keyless server endpoint controlled by the project owner. Do not set this value to a raw Parse REST class URL because that would require publishing Back4App keys in frontend code.

Example runtime configuration, stored outside the public repo or injected by a secure hosting layer:

```js
window.SEA_CONTACT_FORM_ENDPOINT = "https://YOUR-WORKER.workers.dev/contact-submission";
```

The committed `runtime-config.js` intentionally contains no secrets. If no endpoint is configured, the form validates locally and shows a phone fallback instead of pretending the submission was stored.

## Back4App Cloud Code Template

A starter Cloud Code handler is included at `back4app-cloud-code/cloud/main.js`. A Back4App Web Hosting route is included at `back4app-cloud-code/cloud/app.js`. Together, they expose a keyless `POST /contact-submission` endpoint and save validated submissions to the `ContactSubmission` Parse class with `useMasterKey: true` on the server side.

After deploying these files in Back4App and enabling Web Hosting, set `SEA_CONTACT_FORM_ENDPOINT` to the hosted `/contact-submission` URL. Keep all Parse credentials in Back4App or environment variables.

Back4App file layout:

```text
cloud/
  app.js
  main.js
  package.json
public/
  health.txt
```

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
