'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from 'recharts';

interface InterestSensitivityChartProps {
    sensitivityData: Array<{ rate: number; monthlyPayment: number }>;
    baseRate: number;
}

export default function InterestSensitivityChart({ sensitivityData, baseRate }: InterestSensitivityChartProps) {
    const formatCurrency = (val: number) => {
        if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)} Tỷ`;
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)} Tr`;
        return new Intl.NumberFormat('vi-VN').format(val);
    };

    const formatFullCurrency = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);
    };

    // Custom label renderer for bars
    const renderCustomLabel = (props: any) => {
        const { x, y, width, value } = props;
        return (
            <text
                x={x + width / 2}
                y={y - 8}
                fill="#111827"
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
            >
                {formatCurrency(value)}
            </text>
        );
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Độ nhạy Lãi suất</h3>
                <p className="text-sm text-gray-500">
                    Tác động của thay đổi lãi suất cuối kỳ đến số tiền trả hàng tháng
                </p>
            </div>

            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={sensitivityData}
                        margin={{ top: 30, right: 20, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis
                            dataKey="rate"
                            tickFormatter={(val) => `${val}%`}
                            stroke="#D1D5DB"
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={formatCurrency}
                            stroke="#D1D5DB"
                            tick={{ fontSize: 11, fill: '#9CA3AF' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            formatter={(val: number) => formatFullCurrency(val)}
                            labelFormatter={(label) => `Lãi suất: ${label}%`}
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                padding: '12px'
                            }}
                        />
                        <Bar
                            dataKey="monthlyPayment"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={80}
                        >
                            <LabelList
                                dataKey="monthlyPayment"
                                content={renderCustomLabel}
                            />
                            {sensitivityData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.rate === baseRate ? '#F59E0B' : '#D1D5DB'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-3 h-3 rounded bg-orange-500"></div>
                    <span>Lãi suất hiện tại ({baseRate}%)</span>
                </div>
            </div>
        </div>
    );
}
