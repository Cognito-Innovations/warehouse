import { getCartItemPricingSummary } from "./priceUtils";

export interface CartTotals {
    subtotal: number;
    discount: number;
    deliveryFee: number;
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

    let subtotal = 0;
    let discount = 0;

    selectedItems.forEach((item) => {
        const p = getCartItemPricingSummary(item, currencySymbol);

        subtotal += p.originalUnitPrice * p.quantity;
        discount += p.discountTotal;
    });


    const discountedSubTotal = subtotal - discount;


    const total = discountedSubTotal + totalDeliveryFee

    return {
        subtotal: round(subtotal),
        discount: round(discount),
        deliveryFee: round(totalDeliveryFee),
        total: round(total),
    };
};

const round = (value: number) => Number(value.toFixed(2));

const emptyTotals = (): CartTotals => ({
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    total: 0,
});