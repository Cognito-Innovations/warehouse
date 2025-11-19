import { EcommerceProduct } from "@/types/ecommerce";

export const getProductsFromDifferentCategories = (
  productList: EcommerceProduct[],
  count: number = 5
): EcommerceProduct[] => {
  const categoryMap = new Map<string, EcommerceProduct[]>();

  // Group products by category
  productList.forEach((product) => {
    const categoryId = product.category.id;
    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, []);
    }
    categoryMap.get(categoryId)!.push(product);
  });
  const selectedProducts: EcommerceProduct[] = [];
  const categoryIds = Array.from(categoryMap.keys());

  // Pick one product from each category until we have enough
  let categoryIndex = 0;
  while (selectedProducts.length < count && categoryIds.length > 0) {
    const categoryId = categoryIds[categoryIndex % categoryIds.length];
    const categoryProducts = categoryMap.get(categoryId)!;

    if (categoryProducts.length > 0) {
      // Pick a product that hasn't been selected yet
      const availableProducts = categoryProducts.filter(
        (p) => !selectedProducts.some((sp) => sp.id === p.id)
      );

      if (availableProducts.length > 0) {
        selectedProducts.push(availableProducts[0]);
      } else {
        // If all products from this category are selected, remove it
        categoryIds.splice(categoryIndex % categoryIds.length, 1);
        if (categoryIds.length === 0) break;
      }
    }

    categoryIndex++;

    // Safety check to prevent infinite loop
    if (categoryIndex > 100) break;
  }
  return selectedProducts.slice(0, count);
};