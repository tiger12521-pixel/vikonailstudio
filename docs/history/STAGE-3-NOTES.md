# Stage 3 - JavaScript Modules and Version Information

## JavaScript structure

```text
js/
├── main.js
├── components/
│   └── booking.js
├── config/
│   ├── app-info.js
│   └── booking-config.js
├── services/
│   └── booking-api.js
└── utils/
    └── date.js
```

### Where to modify each feature

- `js/main.js`
  - Application entry point only.
  - Register future modules here.
- `js/components/booking.js`
  - Booking HTML generation, week buttons, and display flow.
- `js/services/booking-api.js`
  - Booking API request URL and fetch error handling.
- `js/config/booking-config.js`
  - Weekday text, default availability, and days per page.
- `js/utils/date.js`
  - Shared date conversion and date-shift functions.
- `js/config/app-info.js`
  - Loads `version.json` and prints deployment information in Console.

## Version information

The single source of truth is:

```text
version.json
```

Open the deployed website, press `F12`, and select **Console**. The page prints:

```text
Version
Build
Commit
Branch
Environment
```

The request adds a timestamp and uses `cache: no-store`, so an old cached
`version.json` should not be reused during verification.

## Updating a release locally

Run this after choosing the new release number:

```bash
npm run version:update -- v1.0.1
```

The script updates:

- release version
- ISO build time
- current Git short commit
- current Git branch
- local environment name

Then review and commit `version.json` with the release changes.

## Cloudflare Pages automation option

The update script also recognizes these Cloudflare Pages variables when it runs
inside the Pages build environment:

```text
CF_PAGES_COMMIT_SHA
CF_PAGES_BRANCH
CF_PAGES_URL
```

To use automatic deployment metadata later, configure the Pages build command
to run the version update step as part of a build workflow. Do not change the
current Cloudflare build settings until that workflow is deliberately enabled
and tested.

## Compatibility notes

- `index.html` now loads `js/main.js` as an ES module.
- The booking API URL and HTML IDs are unchanged.
- CSS files and visual layout are unchanged from Stage 2.
- `server.js`, Pages Functions, and booking data behavior are unchanged.
