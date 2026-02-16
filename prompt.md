You are a senior fullstack engineer.

I want you to build a complete production-ready web application based on the following requirements.

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- TypeScript
- Use Context7 to access the latest official documentation for:
  - Next.js 16
  - Tailwind CSS v4
  - React 19 (if applicable)
- Follow best practices from the latest documentation.

Do NOT use outdated syntax.
Do NOT use Pages Router.
Use App Router structure.

---

## Project Description

This is a loan amortization calculator web app.

The application has 2 pages:

### 1️⃣ Page 1 — Input Form Page

Route: `/`

This page allows the user to input loan information:

- Total principal
- Loan term (years)
- Interest phases (multiple phases)
    - Each phase:
        - interest rate %
        - duration (years or months)
- Prepayment percentage
- Monthly extra payment
- One-time payment (specific year)
- Advanced penalty toggle (optional)

The form must:

- Be fully controlled
- Support dynamic adding/removing interest phases
- Validate inputs
- Use clean UI
- Use Tailwind 4 utility classes
- Be responsive

When user clicks "Calculate" → navigate to page 2 and pass data using:
- URL search params OR
- Server actions OR
- React context (your choice but explain why)

---

### 2️⃣ Page 2 — Result Page

Route: `/result`

This page must render:

- Loan summary cards:
    - Next payment
    - Final payment date
    - Total interest
    - Total cost
- Loan amortization chart (principal vs interest over time)
- Detailed schedule table (month by month):
    - Month
    - Payment
    - Interest
    - Principal
    - Remaining balance
- Option to load all months (lazy render)
- Export to PDF button (mock implementation is fine)

The UI must strictly follow the layout in the provided design image (design.png).

Recreate:

- Sidebar left input panels
- Top summary cards
- Chart section
- Detailed table section
- Clean fintech dashboard style
- Rounded cards
- Soft gray background
- Blue primary color accents

---

## Calculation Logic

You will be provided with a file named `calc.md` that contains:

- All loan formulas
- Interest calculation logic
- Amortization formulas
- Prepayment handling logic

You MUST:

- Parse and implement ALL formulas exactly as defined
- Separate calculation logic into a dedicated module:
    `/lib/loanEngine.ts`
- Write clean, testable, pure functions
- No calculation logic inside React components

---

## Architecture Requirements

Use the following folder structure:

```
app/
page.tsx
result/
page.tsx
components/
ui/
loan/
lib/
loanEngine.ts
types/
loan.ts
```

Use:

- Server Components by default
- Client Components only where necessary
- Proper type definitions
- Memoization where appropriate
- Avoid unnecessary re-renders

---

## Chart Requirements

Use a modern lightweight chart library compatible with Next.js 16 (e.g. Recharts or similar).

The chart must show:

- Principal balance curve
- Total interest accumulation curve

Must be responsive.

---

## UI Requirements

- Tailwind CSS v4 only
- No inline CSS
- No external UI kits
- Follow design spacing and proportions from design.png
- Use consistent typography
- Implement hover states
- Add subtle transitions

---

## Additional Requirements

- Fully typed with TypeScript
- No any types
- Add comments explaining key logic
- Add example mock data
- Make sure it runs without errors
- Provide setup instructions at the end

---

## Important

Before writing code:

1. Use Context7 to fetch latest documentation for:
   - Next.js 16 App Router
   - Tailwind CSS 4 setup
2. Confirm correct configuration steps.
3. Then generate full project code.

Do not skip documentation validation step.

Start by:

- Designing data models
- Implementing calculation engine
- Then UI
- Then integration

# Note:
Write the code as if this project will be deployed to production.
Avoid shortcuts.
Follow clean architecture principles.
Think like a fintech SaaS product.