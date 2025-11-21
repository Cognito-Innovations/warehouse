import { useEffect } from "react";
import { Box} from "@mui/material";
import useProductStore from "@/store/productStore";
import GridSkeletonLoader from "../skeleton-loader/GridSkeletonLoader";
import useCategoryStore from "@/store/categoryStore";
import EcommerceProductsGrid from "../EcommerceProductsGrid";
import CategoryProductsByCategory from "../CategoryProductsByCategory";

const ProductsGridView = () => {
    const { isLoading } = useProductStore();
    const { selectedCategory } = useCategoryStore();



    // const selectedCategory = useCategoryStore(state=>state.selectedCategory);

    // const handleProductClick = (product: EcommerceProduct) => {
    //     router.push(`${ROUTES.PRODUCT}/${product.id}`);
    // };

    // // Filter products based on selected category
    // const filteredProductsByCategory = selectedCategory ? products.filter((product) => product.category.id === selectedCategory) : products;

    // // Filter out out-of-stock items for Today's Deal and Suggested for You
    // const inStockFilteredProducts = filteredProductsByCategory.filter((product) => product.stock_quantity > 0);

    // // Get products for Today's Deal (5 products from different categories, in stock only)
    // // If a category is selected, show products from that category only
    // const todaysDealProducts = selectedCategory ? inStockFilteredProducts.slice(0, 5) : getProductsFromDifferentCategories(inStockFilteredProducts, 5);

    // // Get products for Suggested for You (5 products from different categories, in stock only)
    // // If a category is selected, show products from that category only
    // const suggestedProducts = selectedCategory ? inStockFilteredProducts.slice(5, 10) : getProductsFromDifferentCategories(inStockFilteredProducts, 5);


    return (
        <>
            {isLoading ? (
                <Box sx={{ py: 2, px: 2, bgcolor: "white" }}>
                    <GridSkeletonLoader count={10} />
                </Box>
            ) : selectedCategory ? (
                <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
                    <p>TODO: working in progress</p>
                    {/* <EcommerceProductsGrid
                        products={filteredProductsByCategory}
                        onProductClick={handleProductClick}
                        loading={loadingNextPage}
                    /> */}
                </Box>
            ) : (
                <CategoryProductsByCategory/>
            )}
        </>
    );
};

export default ProductsGridView;