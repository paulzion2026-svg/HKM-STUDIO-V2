# WINDSURF ENGINEERING ENFORCEMENT POLICY

This project prioritizes STABILITY over speed.

Any AI-assisted edits must follow the rules below.

---

## 🔒 PROTECTED CODE

The following are considered STABLE and WORKING.

THESE FILES MUST NOT BE MODIFIED unless explicitly authorized:

- src/main.ts
- src/app.module.ts
- src/config/**/*
- src/database/**/*
- src/auth/**/*
- src/common/**/*
- prisma/schema.prisma

If a task requires touching these files:
➡ STOP and request permission.

---

## 🧠 APPROVED CHANGE TYPES

Allowed:
- New modules
- New services
- New controllers
- New DTOs
- New utility files
- Additive logic that does not alter behavior

Not allowed:
- Refactors
- Renaming variables or methods
- Reformatting code
- “Cleanup” changes
- Architecture changes without approval

---

## 🧪 CHANGE MARKING STANDARD

All new code MUST be marked:

```ts
// NEW CODE START
// NEW CODE END
