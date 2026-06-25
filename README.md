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

The contact/referral form is currently static and client-side only. It validates fields in the browser, prevents default submission, and shows a success message. It does not store data or send email yet.

Future backend work should use Parse hosted on Back4App. See `BACK4APP_FORM_INTEGRATION.md` for the suggested class name, fields, and security notes.
