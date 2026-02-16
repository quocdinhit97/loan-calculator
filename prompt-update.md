You are a senior frontend + fintech logic engineer.

We already have a Next.js 16 + Tailwind CSS 4 loan calculator app.
Now I want you to refactor and upgrade the Home Page form.

Use Context7 to verify latest Next.js 16 App Router and Tailwind 4 best practices before modifying anything.

Do NOT rewrite the entire project.
Only refactor and extend the existing Home Page and related logic.

--------------------------------------------------
GOAL
--------------------------------------------------

We need to:

1) Separate "Extra Payment" and "Fees" into 2 independent blocks
2) Upgrade Extra Payment to support multiple phases
3) Upgrade Interest Rate to support default rate + dynamic phases

--------------------------------------------------
1️⃣ EXTRA PAYMENT (NEW STRUCTURE)
--------------------------------------------------

Replace current single "Monthly Extra" input with:

Block Title: "Extra Payments"

This block must support multiple phases.

Each phase contains:

- duration (months)
- monthly extra payment amount

Example:
- First 12 months → 10,000,000 VND
- Next 12 months → 5,000,000 VND
- Remaining months → default 0

Requirements:

- User can click "Add Extra Payment Phase"
- User can remove any phase
- Phases are ordered sequentially
- Remaining months automatically default to 0 extra payment
- Validate that total phase duration does not exceed loan duration
- UI must be clean card-style blocks
- Use Tailwind 4 utilities only
- Responsive

If total duration of phases < loan duration:
Remaining months = 0 extra payment.

--------------------------------------------------
2️⃣ FEES BLOCK (SEPARATE)
--------------------------------------------------

Create a new separate block below Extra Payments:

Block Title: "Fees"

Include:

- Origination fee (%)
- Early repayment penalty (%)
- Fixed processing fee (amount)

These are independent from extra payments.

Keep it simple and clean.

--------------------------------------------------
3️⃣ INTEREST RATE STRUCTURE (IMPORTANT)
--------------------------------------------------

Current behavior: single interest rate.

New behavior:

Default interest rate: 8.5%

User can optionally add interest phases.

Structure:

Base Rate (always exists)
- interestRate: number (default 8.5)

Optional Phases:
User can click "Add Interest Phase"

Each phase contains:
- duration (months)
- interest rate %

Example:
- 12 months → 9%
- next 12 months → 10%
- remaining months → use last defined rate (10%)

Rules:

- If no phases added → whole loan uses base rate
- If phases added:
    Apply them sequentially
- If total phase duration < loan duration:
    Remaining months use the last phase’s rate
- Validate total duration does not exceed loan duration

--------------------------------------------------
4️⃣ LOGIC UPDATE (CRITICAL)
--------------------------------------------------

You MUST update loanEngine.ts:

- Modify amortization logic to:
    - Handle dynamic extra payment per month
    - Handle dynamic interest rate per month
- Build a month-by-month resolver:
    getInterestRateForMonth(monthIndex)
    getExtraPaymentForMonth(monthIndex)

Do NOT put calculation logic inside components.

Keep pure functions.

--------------------------------------------------
5️⃣ UI REQUIREMENTS
--------------------------------------------------

- Keep fintech clean style
- Rounded cards
- Soft gray background
- Blue accent
- Smooth add/remove animation (optional but preferred)
- Clearly separated sections:
    - Loan Info
    - Interest Configuration
    - Extra Payments
    - Fees

--------------------------------------------------
6️⃣ VALIDATION RULES
--------------------------------------------------

- Total interest phases duration <= loan duration
- Total extra payment phases duration <= loan duration
- No negative values
- Show inline validation messages
- Disable submit if invalid

--------------------------------------------------
7️⃣ OUTPUT
--------------------------------------------------

Provide:

1) Updated TypeScript types
2) Updated loanEngine.ts
3) Updated Home Page component
4) Explanation of new calculation flow
5) Ensure no breaking change to Result page

--------------------------------------------------
IMPORTANT
--------------------------------------------------

Do not simplify the logic.
Do not remove existing functionality.
Do not break routing.
Do not use outdated syntax.

Start by updating types.
Then update calculation engine.
Then update UI.
