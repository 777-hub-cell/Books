# Delivery status — The Dragon’s Guest

## Completed content

- Full short interactive book: 24 numbered chapters, 17,611 authored narrative words across all route variants; approximately 10,577–11,096 words on the three principal tested reading paths.
- Three fully written endings: canonical good **A House with Two Doors**, alternate good **The Open Mountain**, alternate sad **The Last Crossing**.
- `MANUSCRIPT.md`, `routes.json`, reproducible `compile.py`, runtime story data, branching and continuity records, and twelve-source independent writing research (four Reddit sources).
- Fixed adult heroine, explicit release before romance, no daughter replacement or magical absolution, permanent eye injury, two materially different investigation branches, and separated climaxes.

## Implementation candidate

Draft PR: https://github.com/777-hub-cell/Night-play/pull/2

Initial implementation commit: `b4f0da85d077bdf25d4c950ee531cd1818619f3c`.

Final implementation candidate commit: `7d07bb8c552be6b7e2e314f65a08834bab2abf79`. Manuscript content was initially committed to Books as `291ef4dfa07d72d6e43af8f688508e7dbcb9ebac`; subsequent delivery documentation and the uninterrupted reading edition are preserved in the same directory’s history.

Changes under `night-play-deploy-candidate/`: story JSON, library entry, small generic player additions for fixed protagonists and story-specific introduction text, two executable QA scripts, and a browser workflow. The engine itself and existing story data remain unchanged.

Reader route after integration: `/stories/?story=the-dragons-guest`. This relative route is not a claim that a deployment currently serves the book.

## Verification completed locally

`python compile.py` and `node test-story.cjs` pass. The exhaustive state traversal covers **125 passages, 137 choices and 29,515 reachable narrative states**, with all three endings and all authored choices reachable. Actual engine runs cover alternate stone locations, clerk survival/death, romance/friendship, eligibility failure with a good fallback, Voss survival/death, independent saves, malformed-save retention, read-only Previous and chapter forks without future knowledge.

Local graphical execution is blocked by the runtime’s `socket() failed: Operation not permitted`. Browser verification instead succeeded on GitHub: [run 43647795752](https://github.com/777-hub-cell/Night-play/actions/runs/43647795752) at commit `006b6593443d80307647d21a43ae01ef4603c1ec` reports six actual UI playthroughs (all three endings at 390px and 1280px), five viewport sizes, save/reload, journal, chapter replay, saves-menu restoration and default Last Call regression. The 390px reader frame was visually inspected. [Evidence artifact](https://github.com/777-hub-cell/Night-play/actions/runs/43647795752/artifacts/14134073747) contains screenshots and result files, with the workflow’s 14-day retention.

Earlier test failures were diagnosed and corrected: the first runner image was unsupported by the pinned Playwright version; numbered choice controls needed their actual data identifiers; Chapters lives inside Reading options; and clearing storage before page reload raced the reader’s pagehide save. Tests now create independent runs through the actual Playthroughs menu. The last code change fits the new cover title within the mobile cover; it changes no story state or prose.

**Final-head verification: PASS.** [Browser and engine run 43647906214](https://github.com/777-hub-cell/Night-play/actions/runs/43647906214) completed successfully at final commit `7d07bb8c552be6b7e2e314f65a08834bab2abf79`, including all six control-driven playthroughs. [Final evidence artifact](https://github.com/777-hub-cell/Night-play/actions/runs/43647906214/artifacts/14134778253). The existing combined-candidate validation also passed at that head: [run 43647900736](https://github.com/777-hub-cell/Night-play/actions/runs/43647900736). These verify the recovered candidate; they do not establish a live deployment.

## Live delivery blocker

Read-only Vercel inspection identified:

- `night-play`, project `prj_spesdz3kqK5ljqoTz80Cl0jiPy8y`: latest inspected deployment `dpl_3BbZJ5iifdM8Ww3ZLWdGaNMiM3rG`, source metadata `Tomex777/Build`, commit `33fcf5a047821e8b05f227c3d608982b2a7edff2`.
- `night-play-combined-preview`, project `prj_J2thiZpQDrmSTx3llKkcYbPWETXG`: latest inspected deployment `dpl_5okDQCGBmeAmq7niX9jCZbWGL8sW`, source metadata `Tomex777/Build`, commit `e27d07b2b5c3fde1ffebff95fd021bcb2e8f2541`.
- `Tomex777/Build` returns GitHub 404 through the current authenticated connection. The accessible `777-hub-cell/Night-play` repository documents itself as a recovered copy. Direct clone attempts also lacked usable authentication.

The candidate is preserved in a draft branch for review. No live project was rebound, no duplicate application was deployed, and the draft was not merged. Full assignment completion therefore remains blocked at actual-source integration and deployment. Once the live repository is accessible, compare its current story engine with this candidate, apply the data and minimal player changes, rerun the browser workflow against it, and deploy through the already-existing project. Do not silently change project ownership or source bindings to bypass that check.
