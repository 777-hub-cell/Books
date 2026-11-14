# Delivery status — The Dragon’s Guest

## Completed content

- Full short interactive book: 24 numbered chapters, 17,611 authored narrative words across all route variants; approximately 10,577–11,096 words on the three principal tested reading paths.
- Three fully written endings: canonical good **A House with Two Doors**, alternate good **The Open Mountain**, alternate sad **The Last Crossing**.
- `MANUSCRIPT.md`, `routes.json`, reproducible `compile.py`, runtime story data, branching and continuity records, and twelve-source independent writing research (four Reddit sources).
- Fixed adult heroine, explicit release before romance, no daughter replacement or magical absolution, permanent eye injury, two materially different investigation branches, and separated climaxes.

## Implementation candidate

Draft PR: https://github.com/777-hub-cell/Night-play/pull/2

Initial implementation commit: `b4f0da85d077bdf25d4c950ee531cd1818619f3c`.

Changes under `night-play-deploy-candidate/`: story JSON, library entry, small generic player additions for fixed protagonists and story-specific introduction text, two executable QA scripts, and a browser workflow. The engine itself and existing story data remain unchanged.

Reader route after integration: `/stories/?story=the-dragons-guest`. This relative route is not a claim that a deployment currently serves the book.

## Verification completed locally

`python compile.py` and `node test-story.cjs` pass. The exhaustive state traversal covers **125 passages, 137 choices and 29,515 reachable narrative states**, with all three endings and all authored choices reachable. Actual engine runs cover alternate stone locations, clerk survival/death, romance/friendship, eligibility failure with a good fallback, Voss survival/death, independent saves, malformed-save retention, read-only Previous and chapter forks without future knowledge.

Local graphical tests were attempted, not passed: Chromium startup is blocked by the execution runtime’s `socket() failed: Operation not permitted`. The committed GitHub workflow is the alternative browser-test route. Its result must be recorded separately once observed.

## Live delivery blocker

Read-only Vercel inspection identified:

- `night-play`, project `prj_spesdz3kqK5ljqoTz80Cl0jiPy8y`: latest inspected deployment `dpl_3BbZJ5iifdM8Ww3ZLWdGaNMiM3rG`, source metadata `Tomex777/Build`, commit `33fcf5a047821e8b05f227c3d608982b2a7edff2`.
- `night-play-combined-preview`, project `prj_J2thiZpQDrmSTx3llKkcYbPWETXG`: latest inspected deployment `dpl_5okDQCGBmeAmq7niX9jCZbWGL8sW`, source metadata `Tomex777/Build`, commit `e27d07b2b5c3fde1ffebff95fd021bcb2e8f2541`.
- `Tomex777/Build` returns GitHub 404 through the current authenticated connection. The accessible `777-hub-cell/Night-play` repository documents itself as a recovered copy. Direct clone attempts also lacked usable authentication.

The candidate is preserved in a draft branch for review. No live project was rebound, no duplicate application was deployed, and the draft was not merged. Full assignment completion therefore remains blocked at actual-source integration and deployment. Once the live repository is accessible, compare its current story engine with this candidate, apply the data and minimal player changes, rerun the browser workflow against it, and deploy through the already-existing project. Do not silently change project ownership or source bindings to bypass that check.
