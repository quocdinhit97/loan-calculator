'use client';

import React, { useState } from 'react';
import { Card, Button } from '@/components/ui/design-system';
import { ScheduleItem } from '@/types/loan';

interface LoanTableProps {
    schedule: ScheduleItem[];
}

export default function LoanTable({ schedule }: LoanTableProps) {
    const [showAll, setShowAll] = useState(false);
    const displayCount = showAll ? schedule.length : 12; // Show first year by default

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
    };

    const handleExport = () => {
        alert('Tính năng xuất PDF đang được phát triển!');
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Chi tiết lịch trả nợ</h3>
                <Button variant="outline" onClick={handleExport} className="text-sm">
                    Xuất PDF
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Kỳ</th>
                            <th className="px-4 py-3">Tháng</th>
                            <th className="px-4 py-3">Lãi áp dụng</th>
                            <th className="px-4 py-3 text-right">Gốc</th>
                            <th className="px-4 py-3 text-right">Lãi</th>
                            <th className="px-4 py-3 text-right">Thanh toán</th>
                            <th className="px-4 py-3 text-right rounded-r-lg">Dư nợ còn lại</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {schedule.slice(0, displayCount).map((item) => (
                            <tr key={item.monthIndex} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900">{item.monthIndex + 1}</td>
                                <td className="px-4 py-3 text-gray-600">{item.monthLabel}</td>
                                <td className="px-4 py-3 text-gray-600">{item.rate}%</td>
                                <td className="px-4 py-3 text-right text-gray-900">{formatCurrency(item.principal)}</td>
                                <td className="px-4 py-3 text-right text-red-600">{formatCurrency(item.interest)}</td>
                                <td className="px-4 py-3 text-right font-medium text-blue-600">
                                    {formatCurrency(item.payment)}
                                    {item.penaltyAmount > 0 && (
                                        <span className="block text-xs text-orange-500">Phí: {formatCurrency(item.penaltyAmount)}</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-900 font-medium">{formatCurrency(item.balance)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {!showAll && schedule.length > displayCount && (
                <div className="mt-6 text-center">
                    <Button variant="secondary" onClick={() => setShowAll(true)} className="w-full sm:w-auto">
                        Xem toàn bộ lịch trả nợ ({schedule.length} tháng)
                    </Button>
                </div>
            )}

            {showAll && (
                <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => setShowAll(false)} className="w-full sm:w-auto">
                        Thu gọn
                    </Button>
                </div>
            )}
        </Card>
    );
}
