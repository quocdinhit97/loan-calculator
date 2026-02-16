import LoanForm from '@/components/loan/LoanForm';

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                    Công cụ Tính Lãi Suất Vay
                </h1>
                <p className="text-lg text-gray-600">
                    Tính toán chi tiết lịch trả nợ, so sánh các phương án vay và tối ưu kế hoạch tài chính của bạn.
                </p>
            </div>
            <LoanForm />
        </main>
    );
}
