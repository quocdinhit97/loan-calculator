/**
 * Format number as Vietnamese currency (VND)
 */
export function formatVND(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value);
}

/**
 * Parse formatted VND string to number
 */
export function parseVND(value: string): number {
    return Number(value.replace(/[^\d]/g, ''));
}
