'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoanInput, InterestPhase, ExtraPaymentPhase } from '@/types/loan';
import { Button, Input, Label, Card, Switch } from '@/components/ui/design-system';

export default function LoanForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoanInput>({
        principal: 2000000000,
        loanTermYears: 20,
        startDate: new Date().toISOString().split('T')[0],
        baseInterestRate: 8.5,
        interestPhases: [],
        extraPaymentPhases: [],
        oneTimePayments: [],
        fees: {
            originationFee: 0,
            earlyRepaymentPenalty: 0,
            fixedProcessingFee: 0,
        },
        earlyRepaymentPenaltyConfig: {
            enabled: false,
            rate: 1,
            maxAmount: 0,
            durationMonths: 12,
        },
    });

    const [validationErrors, setValidationErrors] = useState<{
        interestPhases?: string;
        extraPaymentPhases?: string;
    }>({});

    const [isFeesExpanded, setIsFeesExpanded] = useState(false);

    // Interest Phase handlers
    const handleInterestPhaseChange = (index: number, field: keyof InterestPhase, value: number) => {
        const newPhases = [...formData.interestPhases];
        newPhases[index] = { ...newPhases[index], [field]: value };
        setFormData({ ...formData, interestPhases: newPhases });
        validatePhases();
    };

    const addInterestPhase = () => {
        setFormData({
            ...formData,
            interestPhases: [
                ...formData.interestPhases,
                { id: Math.random().toString(), rate: formData.baseInterestRate, duration: 12 },
            ],
        });
    };

    const removeInterestPhase = (index: number) => {
        const newPhases = formData.interestPhases.filter((_, i) => i !== index);
        setFormData({ ...formData, interestPhases: newPhases });
        validatePhases();
    };

    // Extra Payment Phase handlers
    const handleExtraPaymentPhaseChange = (index: number, field: keyof ExtraPaymentPhase, value: number) => {
        const newPhases = [...formData.extraPaymentPhases];
        newPhases[index] = { ...newPhases[index], [field]: value };
        setFormData({ ...formData, extraPaymentPhases: newPhases });
        validatePhases();
    };

    const addExtraPaymentPhase = () => {
        setFormData({
            ...formData,
            extraPaymentPhases: [
                ...formData.extraPaymentPhases,
                { id: Math.random().toString(), duration: 12, monthlyAmount: 0 },
            ],
        });
    };

    const removeExtraPaymentPhase = (index: number) => {
        const newPhases = formData.extraPaymentPhases.filter((_, i) => i !== index);
        setFormData({ ...formData, extraPaymentPhases: newPhases });
        validatePhases();
    };

    // Validation
    const validatePhases = () => {
        const errors: typeof validationErrors = {};
        const totalMonths = formData.loanTermYears * 12;

        // Validate interest phases
        const interestTotal = formData.interestPhases.reduce((sum, phase) => sum + phase.duration, 0);
        if (interestTotal > totalMonths) {
            errors.interestPhases = `Tổng thời gian các giai đoạn lãi suất (${interestTotal} tháng) vượt quá thời hạn vay (${totalMonths} tháng)`;
        }

        // Validate extra payment phases
        const extraPaymentTotal = formData.extraPaymentPhases.reduce((sum, phase) => sum + phase.duration, 0);
        if (extraPaymentTotal > totalMonths) {
            errors.extraPaymentPhases = `Tổng thời gian các giai đoạn trả thêm (${extraPaymentTotal} tháng) vượt quá thời hạn vay (${totalMonths} tháng)`;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePhases()) {
            return;
        }

        // Encode data to URL query params
        const searchParams = new URLSearchParams();
        searchParams.set('data', JSON.stringify(formData));
        router.push(`/result?${searchParams.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-4">
            {/* Loan Info */}
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
                            onChange={(e) => {
                                setFormData({ ...formData, loanTermYears: Number(e.target.value) });
                                setTimeout(validatePhases, 0);
                            }}
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

            {/* Interest Configuration */}
            <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cấu hình lãi suất</h2>

                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <Label htmlFor="baseRate">Lãi suất mặc định (%/năm)</Label>
                        <Input
                            id="baseRate"
                            type="number"
                            step="0.1"
                            value={formData.baseInterestRate}
                            onChange={(e) => setFormData({ ...formData, baseInterestRate: Number(e.target.value) })}
                            required
                        />
                        <p className="text-xs text-blue-600 mt-1">
                            Áp dụng cho toàn bộ khoản vay nếu không có giai đoạn lãi suất nào được thêm
                        </p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <div>
                            <h3 className="font-semibold text-gray-900">Giai đoạn lãi suất (Tùy chọn)</h3>
                            <p className="text-sm text-gray-500">Thêm giai đoạn với lãi suất khác nhau</p>
                        </div>
                        <Button type="button" variant="secondary" onClick={addInterestPhase} className="text-sm">
                            + Thêm giai đoạn
                        </Button>
                    </div>

                    {formData.interestPhases.length > 0 && (
                        <div className="space-y-3">
                            {formData.interestPhases.map((phase, index) => (
                                <div key={phase.id} className="flex gap-3 items-end p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex-1">
                                        <Label>Lãi suất (%/năm)</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            value={phase.rate}
                                            onChange={(e) => handleInterestPhaseChange(index, 'rate', Number(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label>Thời gian (tháng)</Label>
                                        <Input
                                            type="number"
                                            value={phase.duration}
                                            onChange={(e) => handleInterestPhaseChange(index, 'duration', Number(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => removeInterestPhase(index)}
                                        className="text-red-500 border-red-200 hover:bg-red-50"
                                        title="Xóa giai đoạn"
                                    >
                                        ✕
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {validationErrors.interestPhases && (
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{validationErrors.interestPhases}</p>
                    )}
                </div>
            </Card>

            {/* Extra Payments */}
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Thanh toán thêm</h2>
                        <p className="text-sm text-gray-500">Trả thêm hàng tháng để rút ngắn thời gian vay</p>
                    </div>
                    <Button type="button" variant="secondary" onClick={addExtraPaymentPhase} className="text-sm">
                        + Thêm giai đoạn
                    </Button>
                </div>

                {formData.extraPaymentPhases.length > 0 ? (
                    <div className="space-y-3">
                        {formData.extraPaymentPhases.map((phase, index) => (
                            <div key={phase.id} className="flex gap-3 items-end p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex-1">
                                    <Label>Thời gian (tháng)</Label>
                                    <Input
                                        type="number"
                                        value={phase.duration}
                                        onChange={(e) => handleExtraPaymentPhaseChange(index, 'duration', Number(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label>Số tiền trả thêm (VND/tháng)</Label>
                                    <Input
                                        type="number"
                                        value={phase.monthlyAmount}
                                        onChange={(e) => handleExtraPaymentPhaseChange(index, 'monthlyAmount', Number(e.target.value))}
                                        required
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => removeExtraPaymentPhase(index)}
                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                    title="Xóa giai đoạn"
                                >
                                    ✕
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-sm">Chưa có giai đoạn trả thêm nào</p>
                        <p className="text-xs mt-1">Nhấn "Thêm giai đoạn" để bắt đầu</p>
                    </div>
                )}

                {validationErrors.extraPaymentPhases && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded mt-3">{validationErrors.extraPaymentPhases}</p>
                )}

                {/* Early Repayment Penalty Config */}
                <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <Label className="mb-0">Áp dụng phí phạt khi trả thêm?</Label>
                            <p className="text-sm text-gray-500">Tính phí khi thực hiện thanh toán thêm trong thời gian cam kết</p>
                        </div>
                        <Switch
                            checked={formData.earlyRepaymentPenaltyConfig.enabled}
                            onCheckedChange={(checked) => setFormData({
                                ...formData,
                                earlyRepaymentPenaltyConfig: { ...formData.earlyRepaymentPenaltyConfig, enabled: checked }
                            })}
                        />
                    </div>

                    {formData.earlyRepaymentPenaltyConfig.enabled && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Mức phí (%)</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={formData.earlyRepaymentPenaltyConfig.rate}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        earlyRepaymentPenaltyConfig: { ...formData.earlyRepaymentPenaltyConfig, rate: Number(e.target.value) }
                                    })}
                                />
                            </div>
                            <div>
                                <Label>Thời gian áp dụng (tháng)</Label>
                                <Input
                                    type="number"
                                    value={formData.earlyRepaymentPenaltyConfig.durationMonths}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        earlyRepaymentPenaltyConfig: { ...formData.earlyRepaymentPenaltyConfig, durationMonths: Number(e.target.value) }
                                    })}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Fees */}
            <Card>
                <button
                    type="button"
                    onClick={() => setIsFeesExpanded(!isFeesExpanded)}
                    className="w-full flex justify-between items-center text-left"
                >
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Phí vay</h2>
                        <p className="text-sm text-gray-500 mt-1">Tùy chọn: Thêm các khoản phí liên quan</p>
                    </div>
                    <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isFeesExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isFeesExpanded && (
                    <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                        <div>
                            <Label htmlFor="originationFee">Phí giải ngân (%)</Label>
                            <Input
                                id="originationFee"
                                type="number"
                                step="0.1"
                                value={formData.fees.originationFee}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    fees: { ...formData.fees, originationFee: Number(e.target.value) }
                                })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="earlyRepaymentPenalty">Phí phạt trả nợ trước hạn (%)</Label>
                            <Input
                                id="earlyRepaymentPenalty"
                                type="number"
                                step="0.1"
                                value={formData.fees.earlyRepaymentPenalty}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    fees: { ...formData.fees, earlyRepaymentPenalty: Number(e.target.value) }
                                })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="fixedProcessingFee">Phí xử lý cố định (VND)</Label>
                            <Input
                                id="fixedProcessingFee"
                                type="number"
                                value={formData.fees.fixedProcessingFee}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    fees: { ...formData.fees, fixedProcessingFee: Number(e.target.value) }
                                })}
                            />
                        </div>
                    </div>
                )}
            </Card>

            <div className="pt-4">
                <Button
                    type="submit"
                    className="w-full text-lg py-3 shadow-lg shadow-blue-500/20"
                    disabled={Object.keys(validationErrors).length > 0}
                >
                    Tính toán khoản vay
                </Button>
            </div>
        </form>
    );
}
