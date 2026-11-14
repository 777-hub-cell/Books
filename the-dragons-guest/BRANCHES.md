# Branch and state record

The source contains 24 numbered chapters with mutually exclusive scene variants. The compiler paginates authored paragraphs into 125 engine passages. Route choices are in `routes.json`; conditions never evaluate executable code.

| Decision | Persistent consequence |
| --- | --- |
| Ferry / wall | Message preserves Sef’s tools and transport; rubbing supplies modern physical evidence for the village-plans route. |
| Gate / rest | Both lead to explicit release; demanding the boundary before shelter begins the trust history differently. |
| Daughter / receipts | A distinct domestic history scene or discovery of the killed sacrifices; trust versus early documentary knowledge. |
| Brace / gong | Immediate help limits injury but lets the great stone be stolen; alarm preserves it but worsens the eye wound. Both outcomes persist through all three climaxes. |
| Merrow / refuse | Conditional ally unlocks the weighing-house investigation and helps rescue logistics. Refusal retains a complete independent village-investigation route. |
| Renounce / charter | Public end now invites the early beacon; charter first preserves a documentary route without pretending a spell forces the killing. |
| Archive / channel | Modern accounts and Oswin versus independent historical drawings. No generic clue meter substitutes for the actual sources. |
| Ledger / clerk | Oswin dies with sealed evidence saved, or lives with the ledger burned. Either can support a hearing by a different evidentiary means. |
| Return / petitions | Separate mountain intimacy scene or organising scene with Sef. Both preserve Edda’s established departure and independence. |
| Romance / friendship | Explicit opt-in. No romantic prose appears on friendship route. Friendship is a substantial good outcome. |
| Hearing / refuge / direct | Separate multi-chapter climaxes, not three labels attached to one final scene. |
| Own case / family claims | Cleared conviction before funds move, or protected pension accounts with her clearance delayed. |
| People / papers | Transport all waiting families before records, or preserve records at the cost of a cold walk for the last families. |
| Save Voss / drain | Voss alive for trial or dead in the works; all families are evacuated in either branch, with different immediate tasks. |

## Canonical eligibility

`romance == true`, `trust >= 3`, and at least one of:

- sealed ledger saved;
- Oswin alive;
- independent village plans plus the original fresh rubbing.

Trust is an internal record of specific responsive acts, not purchasable affection. The threshold is explained at the assembly through an authored requirement. Locked options remain visible with a reason. The refuge and warned direct-rescue options are always available. Failure to meet canonical eligibility never strands a run.

## Testing model

`test-story.cjs` traverses every reachable combination of typed variables and passage, using the actual recovered engine’s condition/effect functions; it verifies every passage, choice and ending is reachable. Separate complete engine runs test realised paragraphs, state persistence, invalid-save preservation, read-only Previous and independent chapter forks. `browser-test.cjs` exercises visible reader controls at mobile and desktop sizes, not seeded ending-only states.

Counts and executable test output are in `test-results.json`; browser evidence must be recorded separately and is never inferred from the graph test. A route reads roughly 10,500–11,100 words; the all-route narrative is 17,611 words. This is a complete short interactive book, not a claim of a conventional 80,000-word novel.
