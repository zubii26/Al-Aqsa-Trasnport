
export interface DiscountSettings {
    enabled: boolean;
    type: 'percentage' | 'fixed';
    value: number;
    startDate?: string;
    endDate?: string;
}

export interface PricingResult {
    price: number;
    originalPrice: number;
    discountApplied: number;
    discountType?: 'percentage' | 'fixed';
}

export const calculateFinalPrice = (
    basePrice: number,
    discountSettings?: DiscountSettings | null
): PricingResult => {
    const originalPrice = Math.round(basePrice);
    let finalPrice = originalPrice;
    let discountApplied = 0;
    let discountType: 'percentage' | 'fixed' | undefined;

    if (discountSettings?.enabled) {
        const now = new Date();
        const startDate = discountSettings.startDate ? new Date(discountSettings.startDate) : null;
        const endDate = discountSettings.endDate ? new Date(discountSettings.endDate) : null;

        const isValidDate = (!startDate || startDate <= now) && (!endDate || endDate >= now);

        if (isValidDate) {
            discountType = discountSettings.type;
            if (discountSettings.type === 'percentage') {
                discountApplied = Math.round(originalPrice * (discountSettings.value / 100));
                finalPrice = originalPrice - discountApplied;
            } else {
                discountApplied = discountSettings.value;
                finalPrice = Math.max(0, originalPrice - discountApplied);
            }
        }
    }

    return {
        price: finalPrice,
        originalPrice,
        discountApplied,
        discountType
    };
};
