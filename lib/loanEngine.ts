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
 * Calculates interest rate sensitivity analysis.
 * Returns monthly payment for different interest rate scenarios.
 */
export function calculateInterestSensitivity(
    principal: number,
    loanTermYears: number,
    baseInterestRate: number,
    fees: { originationFee: number; fixedProcessingFee: number }
): Array<{ rate: number; monthlyPayment: number }> {
    const totalMonths = loanTermYears * 12;
    const originationFeeAmount = principal * (fees.originationFee / 100);
    const effectivePrincipal = principal + originationFeeAmount + fees.fixedProcessingFee;

    const scenarios = [-1, -0.5, 0, 0.5, 1];

    return scenarios.map(adjustment => {
        const adjustedRate = baseInterestRate + adjustment;
        const monthlyPayment = calculatePMT(effectivePrincipal, adjustedRate, totalMonths);

        return {
            rate: adjustedRate,
            monthlyPayment: monthlyPayment
        };
    });
}

/**
 * Gets the interest rate for a specific month.
 * If no phases defined or month exceeds phases, use base rate.
 * If phases defined, use last phase's rate for remaining months.
 */
function getRateForMonth(
    monthIdx: number,
    baseRate: number,
    phases: { rate: number; duration: number }[]
): number {
    if (phases.length === 0) {
        return baseRate;
    }

    let accumulatedMonths = 0;
    for (const phase of phases) {
        if (monthIdx < accumulatedMonths + phase.duration) {
            return phase.rate;
        }
        accumulatedMonths += phase.duration;
    }

    return baseRate;
}

/**
 * Gets the extra payment amount for a specific month.
 * Returns 0 if month exceeds all defined phases.
 */
function getExtraPaymentForMonth(
    monthIdx: number,
    phases: { duration: number; monthlyAmount: number }[]
): number {
    if (phases.length === 0) {
        return 0;
    }

    let accumulatedMonths = 0;
    for (const phase of phases) {
        if (monthIdx < accumulatedMonths + phase.duration) {
            return phase.monthlyAmount;
        }
        accumulatedMonths += phase.duration;
    }

    // If monthIdx exceeds all phases, return 0 (no extra payment)
    return 0;
}

/**
 * Calculates the loan amortization schedule and summary.
 */
export function calculateLoan(input: LoanInput): LoanResult {
    const {
        principal,
        loanTermYears,
        startDate,
        baseInterestRate,
        interestPhases,
        extraPaymentPhases,
        oneTimePayments,
        fees,
        earlyRepaymentPenaltyConfig,
    } = input;
    const totalMonths = loanTermYears * 12;
    const startDateObj = parseDate(startDate || new Date().toISOString().slice(0, 10));

    // Calculate initial fees
    const originationFeeAmount = principal * (fees.originationFee / 100);
    const effectivePrincipal = principal + originationFeeAmount + fees.fixedProcessingFee;

    let currentBalance = effectivePrincipal;
    let totalInterest = 0;
    let totalPayment = 0;
    const schedule: ScheduleItem[] = [];

    let currentMonthIndex = 0;
    let currentPhasePMT = 0;
    let lastRate = -1;
    const maxMonths = totalMonths; // limit validation

    while (currentBalance > 10 && currentMonthIndex < maxMonths + 120) { // Safety buffer
        const currentRate = getRateForMonth(currentMonthIndex, baseInterestRate, interestPhases);
        const monthsRemaining = maxMonths - currentMonthIndex;

        // Recalculate PMT if rate changes or first month
        if (currentMonthIndex === 0 || Math.abs(currentRate - lastRate) > 0.0001) {
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
        let scheduledPayment = currentPhasePMT;
        let scheduledPrincipal = scheduledPayment - monthlyInterest;

        // Adjust if near end (Principal > Balance)
        if (scheduledPrincipal > currentBalance) {
            scheduledPrincipal = currentBalance;
            scheduledPayment = scheduledPrincipal + monthlyInterest;
        }

        // 3. Extra Payments from phases
        let extraPayment = getExtraPaymentForMonth(currentMonthIndex, extraPaymentPhases);

        // Check one-time payments
        const oneTime = oneTimePayments.find(p => p.monthIndex === currentMonthIndex);
        if (oneTime) {
            extraPayment += oneTime.amount;
        }

        let actualPrincipalPayment = scheduledPrincipal + extraPayment;

        // Cap at balance
        if (actualPrincipalPayment > currentBalance) {
            actualPrincipalPayment = currentBalance;
            extraPayment = Math.max(0, actualPrincipalPayment - scheduledPrincipal);
            scheduledPayment = monthlyInterest + scheduledPrincipal;
        }

        const totalMonthPayment = monthlyInterest + actualPrincipalPayment;

        // 4. Early Repayment Penalty (only when extra payment is made)
        let penalty = 0;
        if (earlyRepaymentPenaltyConfig.enabled && extraPayment > 0) {
            const penaltyEndMonth = earlyRepaymentPenaltyConfig.durationMonths || 0;
            if (currentMonthIndex < penaltyEndMonth) {
                const calculatedPenalty = currentBalance * (earlyRepaymentPenaltyConfig.rate / 100);
                const maxPenalty = earlyRepaymentPenaltyConfig.maxAmount || Infinity;
                penalty = Math.min(calculatedPenalty, maxPenalty);
            }
        }

        // Update state
        currentBalance -= actualPrincipalPayment;
        if (currentBalance < 0) currentBalance = 0;

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
