export type InterestPhase = {
    id: string;
    rate: number; // Annual interest rate in percentage (e.g., 8.5 for 8.5%)
    duration: number; // Duration in months
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
    interestPhases: InterestPhase[];
    prepayment: {
        monthlyExtra: number;
        oneTimePayments: OneTimePayment[];
        penalty: {
            enabled: boolean;
            rate: number; // Percentage
            maxAmount?: number;
            durationMonths?: number; // Apply penalty for first N months
        };
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
