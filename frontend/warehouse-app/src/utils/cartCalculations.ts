import { getCartItemPricingSummary, roundCurrency } from "./priceUtils";
import { CurrencyInfo } from "@/types/ecommerce";

export interface CartTotals {
    subtotal: number;
    discount: number;
    deliveryFee: number;
    taxes: number;
    serviceCharge: number;
    total: number;
}

export const calculateCartTotals = (
    cartItems: any[],
    selectedItemIds: Set<string>,
    currency?: string,
    currencyInfo?: CurrencyInfo,
): CartTotals => {
    if (!cartItems || cartItems.length === 0)
        return emptyTotals();

    const selectedItems = cartItems.filter((item) => 
        selectedItemIds.has(item.product_id)
    );

    if (selectedItems.length === 0)
        return emptyTotals();

    let { threshold, deliveryFee: deliveryBase, serviceCharge: serviceBase } = getThresholdAndFees(currency);

    let subtotal = 0;
    let discount = 0;

    selectedItems.forEach((item) => {
        const p = getCartItemPricingSummary(item, currencyInfo);

        subtotal += p.originalUnitPrice * p.quantity;
        discount += p.discountTotal;
    });

    const discountedSubTotal = subtotal - discount;

    const deliveryFee = discountedSubTotal >= threshold ? 0 : deliveryBase;
    const taxes = discountedSubTotal * 0.02; // 2% tax
    const serviceCharge = serviceBase;

    const total = discountedSubTotal + deliveryFee + taxes + serviceCharge;

    return {
        subtotal: round(subtotal),
        discount: round(discount),
        deliveryFee: round(deliveryFee),
        taxes: round(taxes),
        serviceCharge: round(serviceCharge),
        total: round(total),
    };
};

const round = (value: number) => Number(value.toFixed(2));

const emptyTotals = (): CartTotals => ({
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    taxes: 0,
    serviceCharge: 0,
    total: 0,
});

const getThresholdAndFees = (currency?: string) => {
    if (currency === 'INR')
        return { threshold: 299, deliveryFee: 3, serviceCharge: 1 };
    return { threshold: 20, deliveryFee: 5, serviceCharge: 1 }
}