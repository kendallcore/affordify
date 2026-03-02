# SPEC-001: Implement Privacy Policy Page

## Status: FINALIZED
## Date: 2026-03-01
## Author: Antigravity

---

## 1. Overview
Implement a dedicated Privacy Policy page for the Affordify website using the provided legal text. The page should be accessible at `/privacy` and maintain the premium aesthetic of the brand.

## 2. Requirements
- Create a new route at `src/app/privacy/page.tsx`.
- Use the provided Privacy Policy content.
- Support fixed navigation (Navbar) and Footer.
- Styling:
    - Font: Poppins for headings, Inter for body.
    - Colors: Royal Blue, Soft Gray, Off-White.
    - Responsive layout (max-width: 4xl for readability).
    - Table of contents with anchor links.
    - Professional typography (spacing, line heights).
- Placeholders:
    - Update "visiting __________" to point to the contact email `kendall.core01@gmail.com`.
    - Ensure all links are functional within the Next.js app or externally.

## 3. Technical Design
- **Component:** `PrivacyPage` (Server Component).
- **Layout:** Use a central content column with a side or top navigation (Table of Contents).
- **Animation:** Subtle fade-in using Framer Motion.
- **Data:** The text content will be hardcoded in the component for now, as it is a static legal page.

## 4. Acceptance Criteria
- [ ] Page renders at `/privacy`.
- [ ] Content is correctly formatted and readable.
- [ ] Navigation and Footer are present.
- [ ] All placeholders are resolved appropriately.
- [ ] Design matches the "Affordify" brand identity.
