# Verification record

## Engine tests

Command: `NIGHT_ENGINE=/absolute/path/to/stories/engine.js node test-story.cjs`

Result: PASS locally, and PASS in the candidate’s GitHub workflow. Engine is the recovered NIGHT Stories engine; its source is unchanged by this assignment.

Coverage: 125 passages; 137 links/options, comprising 29 consequential options at 14 decision points and the remaining pagination links; 29,515 reachable combinations of narrative variables and passage. Every authored option and all three endings are reachable. Nonterminal nodes always have an unconditional way forward.

Complete runs include canonical hearing; independent village evidence; clerk rescue; sealed-ledger recovery with clerk death; friendship refuge; romantic refuge without a dynasty; tragic rescue with Voss alive; tragic evacuation with Voss dead; and a low-trust, no-evidence run that retains a complete good ending.

Persistence checks use the real engine: three independent saves, load equivalence, correct discovered endings, chapter-seven fork without future romance or truth knowledge, read-only navigation preserving state, and malformed data retained rather than silently overwritten.

## Compiler and source checks

Python compiler executes; Python compilation and JavaScript syntax checks pass. Every scene has prose and every scene is assigned routing or a terminal ending. Conditional source annotations compile into engine conditions and never appear in playable prose. No executable expressions are embedded in the story JSON.

## Browser verification

`browser-test.cjs` is committed with the implementation candidate. It attempts actual control-driven playthroughs at 390px and 1280px for each of three endings, plus opening/layout checks at 320px, 360px and 412px. Each complete run also reloads during healing, checks read-back state, opens the journal, and forks chapter seven using the Chapters dialog. The default Last Call setup is checked for its two identity inputs and required four-point allocation.

Local execution is blocked by the host’s Chromium process-singleton socket restriction. GitHub run `43647795752`, at implementation commit `006b6593443d80307647d21a43ae01ef4603c1ec`, completed successfully: **six complete UI playthroughs, five viewport sizes, save/reload, journal, chapter replay, saves-menu restoration and default Last Call regression**. The 390px opening frame was retrieved from the successful job log and visually inspected: reading measure, paragraph spacing, controls and bottom continuation fit without clipping. Full screenshots and machine results are retained in that run’s evidence artifact. Final-head recheck and evidence links are recorded in DELIVERY.md.

## Editorial checks

- Daughter appears alive in humorous domestic scenes before the accusation is reconstructed.
- Edda is an adult with a job, brother, ambitions, boundaries and choices independent of Ordan’s grief.
- No romance precedes explicit release, departure and an independent decision to engage.
- The attack’s mistaken feeding theory differs from the established nine-heartbeat transformation vulnerability.
- Wound care does not regrow the eye. Injured heat channels explain later risk.
- Linnet’s death is engineered through records and interests; it cannot be repaired by one conversation.
- Sacrifices are actual killings; blame is not removed by a late secret.
- Different evidence, survivor and theft outcomes remain present in the endings.
- Canonical genealogy creates Teren and the later dragon line while reserving A3’s precise kingdom, generations, chosen girl’s parentage and selecting-artifact mechanism.
- Alternate outcomes establish no competing shared-universe dynasty.
- No ending claims love or self-sacrifice cancels the dead.

This is an authorial and technical review, not an assertion of external editorial approval or a live production playthrough.

Final-head recheck: all browser and engine checks pass at `7d07bb8c552be6b7e2e314f65a08834bab2abf79`, GitHub run `43647906214`. The existing combined-candidate workflow also passes (`43647900736`). See DELIVERY.md for durable run links and the time-limited screenshot artifact.
