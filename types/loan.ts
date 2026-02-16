export type InterestPhase = {
    id: string;
    rate: number; // Annual interest rate in percentage (e.g., 8.5 for 8.5%)
    duration: number; // Duration in months
};

export type ExtraPaymentPhase = {
    id: string;
    duration: number; // Duration in months
    monthlyAmount: number; // Monthly extra payment amount for this phase
};

export type OneTimePayment = {
    id: string;
    amount: number;
    monthIndex: number; // 0-based index of the month (e.g., 11 for month 12)
};

export type LoanInput = {
    principal: number;
    loanTermYears: number;
    startDate: string; // ISO date string YYYY-MM-DD
    // Interest Rate Structure
    baseInterestRate: number; // Default/base interest rate (e.g., 8.5%)
    interestPhases: InterestPhase[]; // Optional phases that override base rate
    // Extra Payments
    extraPaymentPhases: ExtraPaymentPhase[]; // Multiple phases for extra payments
    oneTimePayments: OneTimePayment[]; // One-time extra payments
    // Fees
    fees: {
        originationFee: number; // Percentage (e.g., 1 for 1%)
        earlyRepaymentPenalty: number; // Percentage
        fixedProcessingFee: number; // Fixed amount
    };
    // Early Repayment Penalty (separate from fees, applied when making extra payments)
    earlyRepaymentPenaltyConfig: {
        enabled: boolean;
        rate: number; // Percentage
        maxAmount?: number;
        durationMonths?: number; // Apply penalty for first N months
    };
};

export type ScheduleItem = {
    rate: number;
    monthIndex: number;
    monthLabel: string; // e.g., "Tháng 1/2026"
    payment: number;
    interest: number;
    principal: number;
    balance: number;
    totalInterest: number;
    prepaymentAmount: number;
    penaltyAmount: number;
};

export type LoanResult = {
    monthlyPaymentFirstPhase: number;
    totalInterest: number;
    totalPayment: number;
    payoffDate: string; // ISO date string
    payoffMonthCount: number;
    schedule: ScheduleItem[];
};
