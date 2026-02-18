'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { ScheduleItem } from '@/types/loan';

interface RemainingBalanceChartProps {
    schedule: ScheduleItem[];
}

export default function RemainingBalanceChart({ schedule }: RemainingBalanceChartProps) {
    // Downsample for performance
    const data = React.useMemo(() => {
        if (schedule.length <= 120) return schedule;
        const step = Math.ceil(schedule.length / 120);
        return schedule.filter((_, i) => i % step === 0 || i === schedule.length - 1);
    }, [schedule]);

    const formatCurrency = (val: number) => {
        if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)} Tỷ`;
        if (val >= 1000000) return `${(val / 1000000).toFixed(0)} Tr`;
        return val.toLocaleString();
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">DƯ NỢ GỐC CÒN LẠI</h3>

            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorRemainingBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis
                            dataKey="monthIndex"
                            tickFormatter={(val) => `${val}`}
                            stroke="#D1D5DB"
                            tick={{ fontSize: 11, fill: '#9CA3AF' }}
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
                            formatter={(val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)}
                            labelFormatter={(label) => `Tháng ${label}`}
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                padding: '12px'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            name="Dư nợ còn lại"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRemainingBalance)"
                            dot={false}
                            activeDot={{ r: 4, fill: '#F59E0B' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
