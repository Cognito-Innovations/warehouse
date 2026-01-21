import { getCartItemPricingSummary } from "./priceUtils";
import { INR_CURRENCY } from "./constants";

export interface CartTotals {
    subtotal: number;
    // discount: number;
    deliveryFee: number;
    // taxes: number;
    // serviceCharge: number;
    total: number;
}

export const calculateCartTotals = (
    cartItems: any[],
    selectedItemIds: Set<string>,
    currency?: string,
    currencySymbol?: string,
    totalDeliveryFee: number = 0
): CartTotals => {
    if (!cartItems || cartItems.length === 0)
        return emptyTotals();

    const selectedItems = cartItems.filter((item) => 
        selectedItemIds.has(item.product_id)
    );

    if (selectedItems.length === 0)
        return emptyTotals();

    // const { threshold, deliveryFee: deliveryBase,
    //     // serviceCharge: serviceBase
    // } = getThresholdAndFees(currency);

    let subtotal = 0;
    // let discount = 0;
    // let deliveryFee = 0;

    selectedItems.forEach((item) => {
        const p = getCartItemPricingSummary(item, currencySymbol);

        subtotal += p.originalUnitPrice * p.quantity;
        // discount += p.discountTotal;
        // deliveryFee += item.delivery_fee || 0;
    });

    const discountedSubTotal = subtotal;

    // const deliveryFee = discountedSubTotal >= threshold ? 0 : deliveryBase;
    // const taxes = discountedSubTotal * 0.02; 2% tax
    // const serviceCharge = serviceBase;

    const total = discountedSubTotal + totalDeliveryFee
    //  + taxes + serviceCharge;

    return {
        subtotal: round(subtotal),
        // discount: round(discount),
        deliveryFee: round(totalDeliveryFee),
        // taxes: round(taxes),
        // serviceCharge: round(serviceCharge),
        total: round(total),
    };
};

const round = (value: number) => Number(value.toFixed(2));

const emptyTotals = (): CartTotals => ({
    subtotal: 0,
    // discount: 0,
    deliveryFee: 0,
    // taxes: 0,
    // serviceCharge: 0,
    total: 0,
});

const getThresholdAndFees = (currency?: string) => {
    if (currency === INR_CURRENCY.code)
        return { threshold: 299, deliveryFee: 3, serviceCharge: 1 };
    return { threshold: 20, deliveryFee: 5, serviceCharge: 1 }
}