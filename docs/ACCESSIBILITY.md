## Accessibility Statement (WCAG 2.2 AA)

StageLog aims to be accessible to the widest possible audience, including people with disabilities. We have implemented and verified the following WCAG 2.2 AA measures:

- Keyboard navigation: Logical focus order, visible focus styles, skip links
- Semantics and landmarks: `lang` set, roles for navigation, main, dialogs
- Forms: Explicit labels, inline validation, `role="alert"` for errors
- Color/contrast: Theme variables ensure AA contrast in light and dark modes
- Motion and interaction: Respects `prefers-reduced-motion`, no interaction-only features
- Target sizes: Minimum 44px tap/click targets for primary controls
- Reflow/zoom: Supports 320px width and 400% zoom without loss of content
- Dynamic updates: ARIA live regions for toasts/analytics; focus management on views
- Modals: Focus trap, `aria-modal`, escape/close controls
- Data alternatives: Text summaries for analytics; icons have accessible names
- Shortcuts: Keyboard shortcuts are discoverable and can be disabled
- Session expectations: Timeouts and extension behavior documented

Known limitations and ongoing work
- Continuous monitoring via manual tests (NVDA/JAWS/VoiceOver) and automated tools (axe/Lighthouse/WAVE)
- If you encounter an accessibility issue, please open an issue with steps to reproduce; we will prioritize a fix.

Contact
For accessibility feedback or assistance, please open an issue or email the maintainer.


