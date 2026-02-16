'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoanInput, InterestPhase } from '@/types/loan';
import { Button, Input, Label, Card, Switch } from '@/components/ui/design-system';

export default function LoanForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoanInput>({
        principal: 2000000000,
        loanTermYears: 20,
        startDate: new Date().toISOString().split('T')[0],
        interestPhases: [{ id: '1', rate: 8.5, duration: 240 }],
        prepayment: {
            monthlyExtra: 0,
            oneTimePayments: [],
            penalty: {
                enabled: false,
                rate: 1,
                maxAmount: 0,
                durationMonths: 12,
            },
        },
    });

    const handlePhaseChange = (index: number, field: keyof InterestPhase, value: number) => {
        const newPhases = [...formData.interestPhases];
        newPhases[index] = { ...newPhases[index], [field]: value };
        setFormData({ ...formData, interestPhases: newPhases });
    };

    const addPhase = () => {
        setFormData({
            ...formData,
            interestPhases: [
                ...formData.interestPhases,
                { id: Math.random().toString(), rate: 8.5, duration: 12 },
            ],
        });
    };

    const removePhase = (index: number) => {
        if (formData.interestPhases.length <= 1) return;
        const newPhases = formData.interestPhases.filter((_, i) => i !== index);
        setFormData({ ...formData, interestPhases: newPhases });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Encode data to URL query params
        const searchParams = new URLSearchParams();
        searchParams.set('data', JSON.stringify(formData));
        router.push(`/result?${searchParams.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-4">
            <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin khoản vay</h2>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="principal">Số tiền vay (VND)</Label>
                        <Input
                            id="principal"
                            type="number"
                            value={formData.principal}
                            onChange={(e) => setFormData({ ...formData, principal: Number(e.target.value) })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="term">Thời hạn vay (năm)</Label>
                        <Input
                            id="term"
                            type="number"
                            value={formData.loanTermYears}
                            onChange={(e) => setFormData({ ...formData, loanTermYears: Number(e.target.value) })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="date">Ngày giải ngân</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            required
                        />
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Lãi suất</h2>
                    <Button type="button" variant="secondary" onClick={addPhase} className="text-sm">
                        + Thêm giai đoạn
                    </Button>
                </div>

                <div className="space-y-4">
                    {formData.interestPhases.map((phase, index) => (
                        <div key={phase.id} className="flex gap-4 items-end p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                                <Label>Lãi suất %/năm</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={phase.rate}
                                    onChange={(e) => handlePhaseChange(index, 'rate', Number(e.target.value))}
                                />
                            </div>
                            <div className="flex-1">
                                <Label>Thời gian (tháng)</Label>
                                <Input
                                    type="number"
                                    value={phase.duration}
                                    onChange={(e) => handlePhaseChange(index, 'duration', Number(e.target.value))}
                                />
                            </div>
                            {formData.interestPhases.length > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => removePhase(index)}
                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                    title="Xóa"
                                >
                                    X
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Thanh toán thêm & Phí phạt</h2>

                <div className="space-y-4">
                    <div>
                        <Label>Trả thêm hàng tháng (VND)</Label>
                        <Input
                            type="number"
                            value={formData.prepayment.monthlyExtra}
                            onChange={(e) => setFormData({
                                ...formData,
                                prepayment: { ...formData.prepayment, monthlyExtra: Number(e.target.value) }
                            })}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <Label className="mb-0">Áp dụng phí phạt trả sớm?</Label>
                            <p className="text-sm text-gray-500">Tính phí nếu trả trước hạn trong thời gian cam kết</p>
                        </div>
                        <Switch
                            checked={formData.prepayment.penalty.enabled}
                            onCheckedChange={(checked) => setFormData({
                                ...formData,
                                prepayment: { ...formData.prepayment, penalty: { ...formData.prepayment.penalty, enabled: checked } }
                            })}
                        />
                    </div>

                    {formData.prepayment.penalty.enabled && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div>
                                <Label>Mức phí (%)</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={formData.prepayment.penalty.rate}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        prepayment: { ...formData.prepayment, penalty: { ...formData.prepayment.penalty, rate: Number(e.target.value) } }
                                    })}
                                />
                            </div>
                            <div>
                                <Label>Thời gian phạt (tháng)</Label>
                                <Input
                                    type="number"
                                    value={formData.prepayment.penalty.durationMonths}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        prepayment: { ...formData.prepayment, penalty: { ...formData.prepayment.penalty, durationMonths: Number(e.target.value) } }
                                    })}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <div className="pt-4">
                <Button type="submit" className="w-full text-lg py-3 shadow-lg shadow-blue-500/20">
                    Tính toán khoản vay
                </Button>
            </div>
        </form>
    );
}
