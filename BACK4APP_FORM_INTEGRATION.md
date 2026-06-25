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
