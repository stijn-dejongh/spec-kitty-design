# Brand Voice Rules

Source: `tmp/README.md` (CONTENT FUNDAMENTALS section)

## Principles

1. **Sentence case always.** Headlines, labels, button text — never title case.
   Exception: two-word CTA buttons may use Title Case ("Get Started", "Book Demo").

2. **No emoji.** Not in UI, not in docs, not in commit messages.

3. **No exclamation marks.** The brand voice is composed and credible, not exclamatory.

4. **Concrete > abstract.**
   - Wrong: "Improved team productivity"
   - Correct: "Developers spend time building, not being blocked on finalized requirements"

5. **POV.**
   - Primary: "Spec Kitty" (third-person product)
   - Reader: "you" / "your team"
   - Never: "I" / "we" as default POV

6. **Canonical noun capitalization.** When referring to SK concepts, capitalize:
   Specs, Plans, Work Packages, Missions, Decision Moments, Charter, Doctrine, Teamspace.
   Use lowercase when referring to the generic concept ("a spec", "any mission").

7. **CLI flow text.** Use literal `->` (hyphen + greater-than) in mono:
   `spec -> plan -> tasks -> implement -> review -> merge`
   Never use an arrow character or SVG.

8. **Eyebrow labels.** ALL-CAPS in mono with wide tracking:
   `COMPETITIVE MATRIX`, `BY THE NUMBERS`, `v1.x — STABLE RELEASE`

9. **Inline code.** Mid-sentence code uses backticks with a faint pill:
   `spec-kitty orchestrator`, `kitty-specs`, `meta.json`

## Anti-patterns

| Wrong | Correct |
|---|---|
| "Bring Structure To AI-Assisted Delivery" | "Bring structure to AI-assisted delivery" |
| "All checks passed! 🎉" | "All checks passed." |
| "We help teams ship faster" | "Spec Kitty helps teams ship faster" |
| "improved developer velocity" | "developers spend time building, not waiting" |
| "create a mission" | "create a Mission" (when referring to the SK concept) |

## Quality test

A new contributor should write correct brand copy without looking at examples. If they
naturally reach for title case or an emoji, the guidance has not been internalized.
