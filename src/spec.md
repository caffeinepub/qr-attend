# Specification

## Summary
**Goal:** Make APK packaging and installation guidance easy to find in-app, and clarify how to produce an Android APK externally from the deployed PWA.

**Planned changes:**
- Add a bottom navigation item labeled “Delivery” (or “Delivery Notes”) that routes authenticated users (Teacher and Student) to the existing `/delivery` page within the standard AppLayout.
- Update the Delivery Notes page content to explicitly state that this platform does not produce a pre-built downloadable APK, and provide clear, copy-pasteable external APK generation steps using TWA (Bubblewrap) plus a link to https://www.pwabuilder.com, including the requirement to deploy to a public HTTPS URL first.

**User-visible outcome:** Authenticated users can open “Delivery/Delivery Notes” from bottom navigation and read clear English instructions for generating an Android APK externally (Bubblewrap/TWA or PWA Builder), with required prerequisites and command snippet available for copy/paste.
