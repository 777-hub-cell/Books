# Verification — 14 November 2026

## Passed

`node implementation/crown-contract.cjs` against the recovered, unchanged NIGHT engine:

- 52/52 passages reached and 59/59 choice links offered on at least one reachable route.
- 4,687 state visits; 818 complete paths; no dead ends or unintended cycles.
- Ending paths: 178 shared return, 128 lone vessel, 256 destruction, 256 renewal.
- Every visited state round-tripped through the actual engine save/load functions.
- Survival, permanent injury, retained recognition, original evidence, consent support and ending gates checked.
- Early identity withheld in rendered narrative until the chamber revelation.
- Chapter forks do not inherit future discoveries or inventory.
- Previous is read-only; re-entering a visited scene does not pay effects twice.
- Separate playthroughs retain separate state and saves.
- Existing The Last Call data validates and its editable identity/four-point setup still works.
- Actual complete routes contain 9,055–9,352 narrative words. The 13,902-word all-route total includes alternatives and conditional variants.

`node implementation/crown-browser.cjs` ran in real Chromium in an isolated Vercel test session (Node v24.22.3, Playwright 1.65.1). It used the existing reader, engine and CSS, not a replacement application. Final result: **14/14 cases passed**.

- Opening, library entry, hidden initial identity, reload and no horizontal overflow: widths 320, 360, 390, 412 and 1280.
- All four endings reached by clicking actual controls at 390 and 1280 widths: eight complete UI playthroughs.
- Mid-route reload preserves progress; Previous shows saved prose without rolling back the live state.
- Chapter replay creates a separate run; the original and fork both appear in Playthroughs.
- Last Call name fields and four-point allocation remain functional in Chromium.
- No page-level JavaScript exceptions occurred in the Crown test cases.
- Screenshots were captured for openings and endings. The 390px opening was visually inspected: readable inherited typography, adequate margins, accessible top controls and no text overlap. Screenshots remain internal test evidence, not manuscript assets.

## Test environment corrections

The first local launch failed because the installed Playwright browser was missing; the system Chromium then failed at process-singleton socket creation under local execution restrictions. Browser testing moved to a disposable Vercel sandbox with no published application or exposed port. The browser CDN redirect and required Linux libraries were provisioned there. An initial Last Call regression check used the wrong test storage key (`last-call` rather than its actual `the-last-call` ID); the harness was corrected and all fourteen cases rerun successfully. No product code was changed to hide that harness failure.

## Boundaries

The recovered application's existing GitHub Actions validation also passed for implementation commit `056886259cca572717ee8d6f43901d7a592afa05`: https://github.com/777-hub-cell/Night-play/actions/runs/43646567003 . That workflow checks candidate routes, API bridge files, JavaScript and JSON; it is separate from the full engine and Chromium tests run for this book.

These are actual browser tests with mobile viewport/touch emulation, not tests on physical phones. A passing state graph does not certify literary quality. There has been no independent developmental edit or reader panel. No production deployment or production end-to-end test is claimed. Existing multiplayer/backend areas were not modified or retested as part of a story-content change.

The Vercel test session is stopped after verification. Its temporary server is not a deliverable URL. Deployment of the book to the existing NIGHT Play project still requires resolution of the source repository/linkage described in DELIVERY.md.
