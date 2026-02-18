'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TotalCostDonutProps {
    principal: number;
    totalInterest: number;
    totalPenalties: number;
}

export default function TotalCostDonut({ principal, totalInterest, totalPenalties }: TotalCostDonutProps) {
    const totalCost = principal + totalInterest + totalPenalties;

    const data = [
        { name: 'GỐC', value: principal, color: '#3B82F6' },
        { name: 'TỔNG LÃI', value: totalInterest, color: '#F59E0B' },
        { name: 'TỔNG PHÍ PHẠT', value: totalPenalties, color: '#EF4444' },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
    };

    const formatShortCurrency = (value: number) => {
        if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)} Tỷ`;
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)} Tr`;
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    const renderLabel = () => {
        return (
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan x="50%" dy="-0.5em" fontSize="11" fill="#9CA3AF" fontWeight="600">TỔNG CỘNG</tspan>
                <tspan x="50%" dy="1.5em" fontSize="18" fill="#111827" fontWeight="700">
                    {formatShortCurrency(totalCost)}
                </tspan>
            </text>
        );
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">PHÂN TÍCH TỔNG CHI PHÍ</h3>

            <div className="flex items-center gap-8">
                {/* Donut Chart */}
                <div className="flex-1" style={{ height: '280px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius="60%"
                                outerRadius="85%"
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => formatCurrency(value)}
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    padding: '12px'
                                }}
                            />
                            {renderLabel()}
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-4">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                            </div>
                            <span className="text-base font-bold text-gray-900">{formatShortCurrency(item.value)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
