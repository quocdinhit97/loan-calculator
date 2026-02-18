'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Card } from '@/components/ui/design-system';
import { ScheduleItem } from '@/types/loan';

interface LoanChartProps {
    schedule: ScheduleItem[];
}

export default function LoanChart({ schedule }: LoanChartProps) {
    // Downsample data for better performance if schedule is long > 120 points
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
        <Card className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Biểu đồ dư nợ & lãi tích lũy</h3>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="monthIndex"
                            tickFormatter={(val) => `Tháng ${val}`}
                            stroke="#9CA3AF"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tickFormatter={formatCurrency}
                            stroke="#9CA3AF"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            formatter={(val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)}
                            labelFormatter={(label) => `Tháng thứ ${label}`}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            name="Dư nợ còn lại"
                            stroke="#3B82F6"
                            fillOpacity={1}
                            fill="url(#colorBalance)"
                        />
                        <Area
                            type="monotone"
                            dataKey="totalInterest"
                            name="Lãi tích lũy"
                            stroke="#EF4444"
                            fillOpacity={1}
                            fill="url(#colorInterest)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
