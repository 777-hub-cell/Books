# The Crown of Thorns

A complete short interactive book for NIGHT Play Category A1. The manuscript has twelve chapters, fifty-two passages and four fully written endings. All-route word count is recorded in `implementation/crown-of-thorns.json`; actual reading routes are shorter because they exclude alternatives.

- `MANUSCRIPT.md`: complete review manuscript, including all conditional text and choices.
- `manuscript/scenes.md`, `manuscript/interludes.md`: authored scene source.
- `compile.py`: deterministic compiler; also supplies conditions, choices and consequences.
- `implementation/crown-of-thorns.json`: NIGHT story data.
- `research/WRITING_RESEARCH.md`: source log and its application to revisions.
- `CONTINUITY.md`: approved premise, local author developments, reserved shared-world facts, magic rules and clue/payoff table.
- `BRANCHES.md`: choice consequences, state and ending conditions.
- `QA.md`: exact completed checks and remaining restrictions.
- `DELIVERY.md`: repository and deployment status.

## Build and test

Run `python3 the-crown-of-thorns/compile.py` from the Books repository. The tests expect the recovered NIGHT repository beside it in a directory called `night-play`, or accept an absolute `NIGHT_STORIES_DIR` pointing at its `night-play-deploy-candidate/stories` folder.

Run `node the-crown-of-thorns/implementation/crown-contract.cjs` for the exhaustive engine contract. For browser tests, serve the candidate folder on port 8787, install Playwright in the test environment, and run `node the-crown-of-thorns/implementation/crown-browser.cjs`. `CROWN_TEST_URL` and `CHROMIUM_PATH` can override the defaults. The browser test interacts with real controls; it does not seed an ending into storage.

## Integration boundary

The accessible `777-hub-cell/Night-play` repository is a recovered-source repository. The last deployment returned by the existing `night-play` Vercel project identifies `Tomex777/Build` in its Git metadata. That repository returns 404 to the connected account. Current project details do not expose a verifiable replacement Git linkage. The compatibility patch belongs on a review branch until that source/linkage issue is resolved. Do not infer a production deployment from this manuscript or from a passing local contract.
