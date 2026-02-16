import { LoanInput, LoanResult, ScheduleItem } from '@/types/loan';

/**
 * Parses a date string (YYYY-MM-DD) and returns a Date object.
 */
function parseDate(dateString: string): Date {
    // Simple parse, assuming valid input from type='date'
    return new Date(dateString);
}

/**
 * Formats a date to "Tháng MM/YYYY" string.
 */
function formatMonthLabel(startDate: Date, monthIndex: number): string {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + monthIndex);
    return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
}

/**
 * Calculates the monthly payment (PMT) for a given principal, rate, and term.
 * Formula: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
function calculatePMT(principal: number, annualRate: number, months: number): number {
    if (annualRate === 0) return principal / months;
    const monthlyRate = annualRate / 100 / 12;
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    return principal * (numerator / denominator);
}

/**
 * Calculates the loan amortization schedule and summary.
 */
export function calculateLoan(input: LoanInput): LoanResult {
    const { principal, loanTermYears, startDate, interestPhases, prepayment } = input;
    const totalMonths = loanTermYears * 12;
    const startDateObj = parseDate(startDate || new Date().toISOString().slice(0, 10));

    let currentBalance = principal;
    let totalInterest = 0;
    let totalPayment = 0;
    const schedule: ScheduleItem[] = [];

    // Determine base interest rate for phases not covered
    // If phases don't cover full term, use the last phase's rate or a default?
    // User requirement says "Interest phases (multiple phases)".
    // We'll assume the last phase extends to the end if logic requires, or use a default logic.
    // Generally, if phases defined:
    // Phase 1: 0-12 months
    // Phase 2: 13-end

    // Flatten phases into a monthly look-up or iterate
    // Better: Iterate month by month from 0 to totalMonths (or until payoff)

    // We need to calculate the "Base Monthly Payment" required to pay off the loan
    // However, with multi-stage rates, PMT changes.
    // Strategy:
    // At month 0, calculate PMT based on current principal, current rate, and REMAINING term.
    // Re-calculate PMT whenever rate changes.

    // Note: Standard bank practice in Vietnam for multi-stage:
    // Fix PMT for a period based on that period's rate?
    // OR Fix Principal+Interest?
    // The requirement implies "Amortization", likely "Annuity" (fixed monthly payment).
    // But with variable rates, the "fixed" payment changes when rate changes.
    // Formula for PMT at month k:
    // PMT_k = calculatePMT(Balance_k, Rate_k, RemainingMonths)

    // Also handle Prepayments:
    // Prepay reduces Balance -> PMT stays same (term shortens) OR PMT reduces (term stays same)?
    // Requirement: "Ngày tất toán thay đổi" (Payoff date changes) -> Term shortens.
    // So PMT should be calculated based on ORIGINAL term logic, but Balance reduces faster.
    // WAIT. If I prepay, usually banks give option: Reduce Term or Reduce Payment.
    // Requirement example: "Ngày tất toán thay đổi" -> IMPLIES Reduce Term.
    // So we KEEP the PMT as if no prepayment happened, UNLESS rate changes.

    // ALGORITHM:
    // 1. Determine Rate for current month.
    // 2. If Rate changed from last month (or it's month 0), Re-calculate "Target PMT".
    //    Target PMT = calculatePMT(Balance_Theoretical_No_Prepay, Rate, Remaining_Original_Term)
    //    WAIT. If we reduce term, we just pay the SAME PMT as calculated originally.
    //    But if Rate changes, PMT MUST change to pay off in remaining ORIGINAL term.
    //    So: PMT is calculated based on CURRENT Balance (actual? or scheduled?) and Remaining ORIGINAL Term.
    //    If we chose "Reduce Term" option, usually we keep paying the committed PMT.

    // Let's look at `calc.md`:
    // "Thanh toán tháng k = PMT + Số tiền trả thêm hàng tháng"
    // "Ngày tất toán thay đổi (rút ngắn...)"
    // -> This confirms we keep PMT fixed (per phase) and add extra.
    // BUT what if rate changes?
    // Example 5.5:
    // Phase 1 (6%): PMT = 14,328,621.
    // Phase 2 (10%): PMT = 17,834,681. (Calculated based on balance at month 24 and remaining term).
    // So yes, PMT is recalculated at start of each phase based on Balance and Remaining Term.
    // 
    // Crucial: Used Balance is ACTUAL Balance (after prepayments)? or Scheduled Balance?
    // Usually, if you prepay, the bank calculates new PMT based on NEW Balance and REMAINING Term?
    // OR you keep old PMT and term shortens violently.
    // `calc.md` Example 3.2: "Thanh toán tháng 12 = 17,356... + 100,000,000".
    // "Dư nợ tháng 12 giảm... Ngày tất toán thay đổi".
    // This implies the monthly scheduled payment (without extra) remains 17,356... for that phase.
    // So prepayments do NOT lower the monthly payment immediately in the current phase?
    // They just shorten the term.
    // However, for the NEXT phase, since PMT is recalculated based on Balance, the PMT will drop if we prepaid?
    // Check `calc.md`. It doesn't explicitly specify cross-phase interaction with prepayment.
    // "Thanh toán = sẽ tính lại dựa trên dư nợ còn lại tại tháng 60 và lãi suất 8.5%"
    // So YES, at phase change, PMT is recalculated based on ACTUAL Balance.
    // Within a phase, PMT stays constant (unless rate changes).

    // REVISED ALGORITHM:
    // Iterate month m = 0..MaxTerm
    // 1. Identify current Rate.
    // 2. Determine "Scheduled PMT" for this month.
    //    - If m == 0 OR Rate changed from m-1:
    //      Calculate PMT based on Current Balance and Remaining Months (TotalTerm - m).
    //      Store this PMT as CurrentPhasePMT.
    //    - Use CurrentPhasePMT.
    // 3. Calculate Interest = Balance * Rate / 12.
    // 4. Calculate PrincipalComponent = ScheduledPMT - Interest.
    // 5. Add Prepayments (Monthly Extra + One-time).
    //    TotalPayment = ScheduledPMT + Extra.
    //    TotalPrincipalPaid = PrincipalComponent + Extra.
    //    (Ensure TotalPrincipalPaid doesn't exceed Balance).
    // 6. Calculate Penalty if applicable on Extra portion.
    // 7. Update Balance.
    // 8. Record Schedule Item.
    // 9. Stop if Balance <= 0.

    let currentMonthIndex = 0;
    let currentPhasePMT = 0;
    let lastRate = -1;
    const maxMonths = totalMonths; // limit validation

    // Helper to find rate for a month
    const getRateForMonth = (monthIdx: number): number => {
        let accumulatedMonths = 0; //12
        for (const phase of interestPhases) {
            if (monthIdx < accumulatedMonths + phase.duration) {
                return phase.rate;
            }
            accumulatedMonths += phase.duration;
        }
        // Fallback to last phase or 0? 
        // `calc.md`: "Giai đoạn 3 (mặc định): 8.5% lãi suất, 15 năm còn lại"
        // So distinct phases cover the whole term.
        return interestPhases.length > 0 ? interestPhases[interestPhases.length - 1].rate : 0;
    };

    while (currentBalance > 10 && currentMonthIndex < maxMonths + 120) { // Safety buffer
        const currentRate = getRateForMonth(currentMonthIndex);
        const monthsRemaining = maxMonths - currentMonthIndex;

        // Recalculate PMT if rate changes or first month
        // We also ideally recalculate if we want to ensure payoff exactly at end, 
        // but with prepayments, we stick to the "Schedule".
        // Does Prepayment force recalculation of PMT immediately?
        // Based on "Reduce Term" logic: NO. PMT stays same detailed in contract until rate change.
        // BUT at rate change, it recalculates.

        if (currentMonthIndex === 0 || Math.abs(currentRate - lastRate) > 0.0001) {
            // Recalculate PMT
            // Note: If balance is very low, PMT might be huge if we strictly follow formula?
            // No, PMT formula handles it.
            if (monthsRemaining > 0) {
                currentPhasePMT = calculatePMT(currentBalance, currentRate, monthsRemaining);
            } else {
                currentPhasePMT = currentBalance;
            }
            lastRate = currentRate;
        }

        // 1. Interest
        const monthlyInterest = currentBalance * (currentRate / 100 / 12);

        // 2. Scheduled Payment logic
        // If last month or balance low, pay off.
        let scheduledPayment = currentPhasePMT;
        let scheduledPrincipal = scheduledPayment - monthlyInterest;

        // Adjust if near end (Principal > Balance)
        if (scheduledPrincipal > currentBalance) {
            scheduledPrincipal = currentBalance;
            scheduledPayment = scheduledPrincipal + monthlyInterest;
        }

        // 3. Prepayments
        let extraPayment = prepayment.monthlyExtra;
        // Check one-time
        const oneTime = prepayment.oneTimePayments.find(p => p.monthIndex === currentMonthIndex);
        if (oneTime) {
            extraPayment += oneTime.amount;
        }

        let actualPrincipalPayment = scheduledPrincipal + extraPayment;

        // Cap at balance
        if (actualPrincipalPayment > currentBalance) {
            actualPrincipalPayment = currentBalance;
            extraPayment = Math.max(0, actualPrincipalPayment - scheduledPrincipal);
            // scheduledPayment might reduce if we just pay off balance
            scheduledPayment = monthlyInterest + scheduledPrincipal; // remains consistent
            // Total payment is just currentBalance + Interest
        }

        const totalMonthPayment = monthlyInterest + actualPrincipalPayment;

        // 4. Penalty
        // "Phí phạt tháng k = Dư nợ [TRƯỚC TRẢ?] * %"
        // Usually penalty is on the PREPAID amount, or on the BALANCE?
        // `calc.md` says: "Phí phạt tháng k = Dư nợ tháng k × (% Phí trên dư nợ / 100)"
        // Wait. "Nếu trả sớm trong 12 tháng đầu với dư nợ 1,996... Phí = 1,996... * 1%".
        // Is the penalty charged MONTHLY just for existing? NO.
        // It says "CẤU HÌNH PHÍ PHẠT TRẢ SỚM". Warning implies it applies WHEN repaying early?
        // "Phí phạt dựa trên % dư nợ".
        // Usually: Penalty = % * AmountPrepaid. OR Penalty = % * EntireBalance (if paying off all).
        // The `calc.md` example: "Trả sớm TRONG 12 tháng đầu...".
        // Example mentions "Dư nợ 1,996...".
        // This looks like Penalty is calculated on the REMAINING BALANCE at the time of prepayment?
        // OR is it only if we pay off COMPLETELY?
        // "Nếu trả thêm 100tr...".
        // Common bank rule: Fee on Prepaid Amount.
        // BUT `calc.md` says "Phí phạt tháng k = Dư nợ tháng k × (% Phí...)". This implies fee on the whole balance.
        // That sounds harsh for a partial prepayment.
        // However, I MUST implement as per explicit formula in `calc.md`.
        // Formula: "Phí phạt tháng k = Dư nợ tháng k × (% Phí trên dư nợ / 100)"
        // Context: "Khi thanh toán thêm...".
        // It's ambiguous if this applies every month or only when extra payment occurs.
        // Standard logic: Penalty applies ONLY when Extra Payment > 0.
        // Let's assume: If (extraPayment > 0), Calculate Penalty.
        // Formula says "Dư nợ tháng k" (Current Balance).
        // So: Penalty = CurrentBalance * Rate%.

        let penalty = 0;
        if (prepayment.penalty.enabled && extraPayment > 0) {
            // Check duration
            const penaltyEndMonth = prepayment.penalty.durationMonths || 0;
            if (currentMonthIndex < penaltyEndMonth) {
                const calculatedPenalty = currentBalance * (prepayment.penalty.rate / 100);
                const maxPenalty = prepayment.penalty.maxAmount || Infinity;
                penalty = Math.min(calculatedPenalty, maxPenalty);
            }
        }

        // Update state
        currentBalance -= actualPrincipalPayment;
        if (currentBalance < 0) currentBalance = 0; // Floating point safety

        totalInterest += monthlyInterest;
        totalPayment += totalMonthPayment + penalty;

        schedule.push({
            rate: currentRate,
            monthIndex: currentMonthIndex,
            monthLabel: formatMonthLabel(startDateObj, currentMonthIndex),
            payment: totalMonthPayment,
            interest: monthlyInterest,
            principal: actualPrincipalPayment,
            balance: currentBalance,
            totalInterest: totalInterest,
            prepaymentAmount: extraPayment,
            penaltyAmount: penalty,
        });

        currentMonthIndex++;

        // Safety break
        if (currentBalance <= 1000) { // Small threshold to avoid lingering small decimals
            // Treat as paid off?
            // Let loop handle it naturally, balance will be 0 next iteration.
            // Actually next iteration `currentBalance > 10` check handles it.
        }
    }

    return {
        monthlyPaymentFirstPhase: schedule.length > 0 ? schedule[0].payment : 0, // Approx
        totalInterest,
        totalPayment,
        payoffDate: schedule.length > 0 ? new Date(startDateObj.setMonth(startDateObj.getMonth() + schedule.length - 1)).toISOString() : '',
        payoffMonthCount: schedule.length,
        schedule,
    };
}
