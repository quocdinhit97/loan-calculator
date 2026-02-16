import { calculateLoan } from '@/lib/loanEngine';
import { LoanInput } from '@/types/loan';
import LoanSummary from '@/components/loan/LoanSummary';
import LoanChart from '@/components/loan/LoanChart';
import LoanTable from '@/components/loan/LoanTable';
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
    try {
        const input: LoanInput = JSON.parse(dataString);
        result = calculateLoan(input);
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-3">
                        <LoanChart schedule={result.schedule} />
                    </div>
                    <div className="lg:col-span-3">
                        <LoanTable schedule={result.schedule} />
                    </div>
                </div>
            </div>
        </main>
    );
}
