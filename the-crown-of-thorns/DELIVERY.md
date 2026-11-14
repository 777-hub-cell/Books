# Delivery status — The Crown of Thorns

14 November 2026.

## Written and implemented

- Twelve chapters, fifty-two passages, fifty-nine choice/navigation links, four complete endings.
- 13,902 authored narrative words across alternatives; 9,055–9,352 words on a complete route. This is a complete short interactive book, not a full-length fantasy novel.
- Full manuscript in MANUSCRIPT.md; editable source in manuscript/ and compile.py.
- Original research in research/WRITING_RESEARCH.md.
- Continuity and clues in CONTINUITY.md; decisions, state and ending descriptions in BRANCHES.md.
- Browser-local save/load and chapter replay inherited from NIGHT's actual engine and tested.

## Repository delivery

Manuscript destination: https://github.com/777-hub-cell/Books/tree/main/the-crown-of-thorns

The repository was empty on initial inspection. It was initialised, then the manuscript, source, data, research, continuity and tests were committed together. The content commit is available in Git history; this file intentionally does not try to embed its own SHA.

Accessible recovered application repository: https://github.com/777-hub-cell/Night-play

Compatibility branch: `book/crown-of-thorns-20261114`.

Implementation commit: `056886259cca572717ee8d6f43901d7a592afa05`.

Draft review PR: https://github.com/777-hub-cell/Night-play/pull/1

The patch adds story data, a library entry, optional fixed-identity setup and verification files. The engine and The Last Call content remain unchanged. The PR is unmerged because live source linkage is unresolved.

## Verified

Exhaustive engine checks: 818 complete paths; 4,687 state visits; every passage and link reached; all four endings; save/load at every state; persistent survival, injury and memory consequences; ending gates; isolated forks and saves.

Real Chromium: fourteen cases passed, including all endings through UI controls on mobile and desktop, opening checks at five widths, reload, Previous, chapter replay, saves and existing Last Call setup. See QA.md for environment, coverage and limits. The temporary test session was stopped after use.

The recovered application's existing candidate-validation CI passed on the implementation commit: https://github.com/777-hub-cell/Night-play/actions/runs/43646567003 . This does not establish a production deployment.

## Deployment — blocked

The existing Vercel project `night-play` is `prj_spesdz3kqK5ljqoTz80Cl0jiPy8y`. Its latest deployment returned during this task, `dpl_3BbZJ5iifdM8Ww3ZLWdGaNMiM3rG`, identifies `Tomex777/Build` in Git metadata, branch `feature/night-play-phase1-web-games-20261013`, commit `33fcf5a047821e8b05f227c3d608982b2a7edff2`.

The connected GitHub account lists the recovered `777-hub-cell/Night-play` repository but cannot fetch `Tomex777/Build` (404). Current project details do not expose a verifiable replacement Git linkage. The recovered repository's README also distinguishes its candidate from deployed source. It would be unsafe to treat the candidate as the verified live application and replace the existing project with it.

No merge, production deployment, alias change, project relinking, environment change or new application was performed. There is no new live book URL to claim.

To finish: obtain access to the actual source, or establish the existing project's current replacement linkage; apply the compatibility patch there; rerun engine and browser tests against that source; follow its release workflow; deploy through the existing NIGHT Play project; verify the deployed story URL and save/load on that deployment. This is an infrastructure/access dependency, not a request for more plot or chapter decisions.
