
// Logic copied from src/lib/pricing-calc.ts for verification
interface DiscountSettings {
    enabled: boolean;
    type: 'percentage' | 'fixed';
    value: number;
    startDate?: string;
    endDate?: string;
}

interface PricingResult {
    price: number;
    originalPrice: number;
    discountApplied: number;
    discountType?: 'percentage' | 'fixed';
}

const calculateFinalPrice = (
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

// Test Runner
const runTests = () => {
    console.log('Starting Standalone Discount Logic Verification...\n');

    let passed = 0;
    let failed = 0;

    const assert = (description: string, actual: any, expected: any) => {
        if (JSON.stringify(actual) === JSON.stringify(expected)) {
            console.log(`✅ ${description}`);
            passed++;
        } else {
            console.error(`❌ ${description}`);
            console.error(`   Expected:`, expected);
            console.error(`   Actual:  `, actual);
            failed++;
        }
    };

    // Test 1: No Discount
    const noDiscountSettings: DiscountSettings = {
        enabled: false,
        type: 'percentage',
        value: 10
    };
    const res1 = calculateFinalPrice(100, noDiscountSettings);
    assert('No Discount (Disabled)', res1, {
        price: 100,
        originalPrice: 100,
        discountApplied: 0,
        discountType: undefined
    });

    // Test 2: Percentage Discount (20%)
    const percentSettings: DiscountSettings = {
        enabled: true,
        type: 'percentage',
        value: 20
    };
    const res2 = calculateFinalPrice(100, percentSettings);
    assert('Percentage Discount (20% of 100)', res2, {
        price: 80,
        originalPrice: 100,
        discountApplied: 20,
        discountType: 'percentage'
    });

    // Test 3: Fixed Discount (30 SAR)
    const fixedSettings: DiscountSettings = {
        enabled: true,
        type: 'fixed',
        value: 30
    };
    const res3 = calculateFinalPrice(100, fixedSettings);
    assert('Fixed Discount (30 SAR off 100)', res3, {
        price: 70,
        originalPrice: 100,
        discountApplied: 30,
        discountType: 'fixed'
    });

    // Test 4: Discount > Price (Fixed)
    const largeFixedSettings: DiscountSettings = {
        enabled: true,
        type: 'fixed',
        value: 150
    };
    const res4 = calculateFinalPrice(100, largeFixedSettings);
    assert('Fixed Discount > Price (Should be 0)', res4, {
        price: 0,
        originalPrice: 100,
        discountApplied: 150,
        discountType: 'fixed'
    });

    // Test 5: Future Date (Not yet active)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const futureSettings: DiscountSettings = {
        enabled: true,
        type: 'percentage',
        value: 50,
        startDate: futureDate.toISOString()
    };
    const res5 = calculateFinalPrice(100, futureSettings);
    assert('Future Start Date (Should not apply)', res5, {
        price: 100,
        originalPrice: 100,
        discountApplied: 0,
        discountType: undefined
    });

    // Test 6: Expired Date
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7);
    const expiredSettings: DiscountSettings = {
        enabled: true,
        type: 'percentage',
        value: 50,
        endDate: pastDate.toISOString()
    };
    const res6 = calculateFinalPrice(100, expiredSettings);
    assert('Expired End Date (Should not apply)', res6, {
        price: 100,
        originalPrice: 100,
        discountApplied: 0,
        discountType: undefined
    });

    // Test 7: Valid Date Range
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const validRangeSettings: DiscountSettings = {
        enabled: true,
        type: 'percentage',
        value: 10,
        startDate: yesterday.toISOString(),
        endDate: tomorrow.toISOString()
    };
    const res7 = calculateFinalPrice(100, validRangeSettings);
    assert('Valid Date Range (Should apply)', res7, {
        price: 90,
        originalPrice: 100,
        discountApplied: 10,
        discountType: 'percentage'
    });

    console.log(`\nSummary: ${passed} Passed, ${failed} Failed`);
    if (failed > 0) process.exit(1);
};

runTests();
