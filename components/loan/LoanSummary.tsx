import React from 'react';
import { Card } from '@/components/ui/design-system';
import { LoanResult } from '@/types/loan';
import {Calendar1, CalendarFold, CircleDollarSign, Sigma} from "lucide-react";

interface LoanSummaryProps {
    result: LoanResult;
}

export default function LoanSummary({ result }: LoanSummaryProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (isoString: string) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-blue-50 border-blue-100">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider flex gap-2 items-center">
                    <Calendar1 />
                    Thanh toán đầu tiên
                </p>
                <p className="text-3xl font-bold text-primary mt-1 font-mono">
                    {formatCurrency(result.monthlyPaymentFirstPhase)}
                </p>
                <p className="text-xs text-foreground mt-2">Dựa trên lãi suất giai đoạn đầu</p>
            </Card>

            <Card>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider flex gap-2 items-center">
                    <Sigma />
                    Tổng lãi phải trả</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(result.totalInterest)}</p>
            </Card>

            <Card>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider flex gap-2 items-center">
                    <CircleDollarSign />
                    Tổng chi phí vay</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(result.totalPayment)}</p>
                <p className="text-xs text-gray-500 mt-2">Bao gồm gốc + lãi + phí</p>
            </Card>

            <Card className="bg-green-50 border-green-100">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider flex gap-2 items-center">
                    <CalendarFold />
                    Ngày tất toán dự kiến</p>
                <p className="text-2xl font-bold text-green-700 mt-1">{formatDate(result.payoffDate)}</p>
                <p className="text-xs text-green-600 mt-2">Sau {result.payoffMonthCount} tháng</p>
            </Card>
        </div>
    );
}
