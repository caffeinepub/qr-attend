# Specification

## Summary
**Goal:** Add a dedicated splash screen and a first-run registration flow that captures name + Student/Teacher role, then route users to the correct role-based dashboard and navigation.

**Planned changes:**
- Add an app launch splash screen shown before authentication/onboarding, then auto-route to registration (first-time) or login/dashboard (returning users) without navigation loops.
- Replace the current first-time profile setup dialog with a full Registration screen requiring a non-empty name and explicit role selection (Student or Teacher).
- Add backend support to save and fetch the authenticated user’s registration details (name + role).
- Implement role-based routing, dashboard experiences, and navigation visibility (Teacher vs Student), including access control/redirects for teacher-only pages.
- Update UI role wording from Admin/User to Teacher/Student consistently across registration, login, dashboard, and navigation (English only).

**User-visible outcome:** On launch, users see a splash screen, then first-time users complete registration (name + role). On subsequent visits/logins, the app routes them to the correct Student or Teacher dashboard with role-appropriate navigation and access controls.
