import { calculateLoan, calculateInterestSensitivity } from '@/lib/loanEngine';
import { LoanInput } from '@/types/loan';
import LoanSummary from '@/components/loan/LoanSummary';
import LoanChart from '@/components/loan/LoanChart';
import LoanTable from '@/components/loan/LoanTable';
import TotalCostDonut from '@/components/charts/TotalCostDonut';
import RemainingBalanceChart from '@/components/charts/RemainingBalanceChart';
import InterestSensitivityChart from '@/components/charts/InterestSensitivityChart';
import { Button } from '@/components/ui/design-system';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // Since we rely on searchParams

export default async function ResultPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams;
    const dataString = sp.data;

    if (typeof dataString !== 'string') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Dữ liệu không hợp lệ</h1>
                    <Link href="/">
                        <Button>Quay lại trang chủ</Button>
                    </Link>
                </div>
            </div>
        );
    }

    let result;
    let input: LoanInput;
    let sensitivityData;
    try {
        input = JSON.parse(dataString);
        result = calculateLoan(input);

        // Calculate interest rate sensitivity
        sensitivityData = calculateInterestSensitivity(
            input.principal,
            input.loanTermYears,
            input.baseInterestRate,
            input.fees
        );
    } catch (error) {
        console.error("Error parsing loan input:", error);
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi tính toán</h1>
                    <p className="text-gray-600 mb-4">Có lỗi xảy ra khi xử lý dữ liệu của bạn.</p>
                    <Link href="/">
                        <Button>Quay lại và thử lại</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Kết quả tính toán</h1>
                    <Link href="/">
                        <Button variant="outline">← Tính khoản vay khác</Button>
                    </Link>
                </div>

                <LoanSummary result={result} />

                <div className="grid grid-cols-1 gap-8">
                    {/* Main Amortization Chart */}
                    <LoanChart schedule={result.schedule} />

                    {/* New Analytics Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Total Cost Breakdown */}
                        <TotalCostDonut
                            principal={input.principal}
                            totalInterest={result.totalInterest}
                            totalPenalties={result.schedule.reduce((sum, item) => sum + item.penaltyAmount, 0)}
                        />

                        {/* Remaining Balance */}
                        <RemainingBalanceChart schedule={result.schedule} />
                    </div>

                    {/* Detailed Schedule Table */}
                    <LoanTable schedule={result.schedule} />

                    {/* Interest Sensitivity */}
                    <InterestSensitivityChart
                        sensitivityData={sensitivityData}
                        baseRate={input.baseInterestRate}
                    />
                </div>
            </div>
        </main>
    );
}
