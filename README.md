# Senior Equity Alliance Website

Static GitHub Pages-ready website for Senior Equity Alliance.

## Project Location

- Local folder: `~/Desktop/Codejects/SeniorEquityAlliance_website`
- GitHub organization: `SeniorEquityAlliance`
- GitHub repository: `SeniorEquityAlliance/seanor`
- Intended hosting: GitHub Pages from the `seanor` repository

## File Structure

- `index.html` - static homepage markup
- `styles.css` - responsive design system and layout
- `script.js` - mobile navigation and client-side form validation
- `assets/senior-equity-hero.jpg` - original generated hero image for this project
- `back4app-cloud-code/cloud/` and `back4app-cloud-code/public/` - Back4App Cloud Code and Web Hosting endpoint files for the `ContactSubmission` class
- `runtime-config.js` - public non-secret endpoint configuration for the contact form
- `config.example.js` - runtime endpoint configuration example, without Parse keys
- `cloudflare-worker/` - Cloudflare Worker proxy for creating `ContactSubmission` PFObjects without public keys
- `DEPLOYMENT_CONTRACT.md` - deployment safety rules
- `DESIGN_CONTRACT.md` - design system and clone-boundary rules
- `BACK4APP_FORM_INTEGRATION.md` - future Parse/Back4App form integration notes
- `robots.txt` - basic crawler policy
- `sitemap.xml` - basic sitemap placeholder for the GitHub Pages URL
- `.gitignore` - local system file ignores

## Local Preview

Open `index.html` directly in a browser, or run a lightweight local server:

```bash
cd ~/Desktop/Codejects/SeniorEquityAlliance_website
python3 -m http.server 8080
```

Then visit `http://localhost:8080/`.

## Deployment Safety Reminder

Before any push or Pages-related change, verify the remote:

```bash
git remote -v
```

The only allowed repository is `SeniorEquityAlliance/seanor`. Do not publish, mirror, or configure this website under any other organization, repository, Pages site, or domain.

## Form and Backend Status

The contact/referral form validates fields in the browser and submits through a keyless endpoint via `SEA_CONTACT_FORM_ENDPOINT`. Use the Cloudflare Worker proxy when Back4App keys must remain private.

Backend work should use Parse hosted on Back4App and save records to the `ContactSubmission` class. See `BACK4APP_FORM_INTEGRATION.md` for the fields, Cloud Code route, and security notes.
