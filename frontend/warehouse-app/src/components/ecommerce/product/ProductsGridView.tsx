import { Box} from "@mui/material";

import useCategoryStore from "@/store/categoryStore";
import useProductStore from "@/store/productStore";
import EcommerceProductsGrid from "../EcommerceProductsGrid";
import CategoryProductsByCategory from "../CategoryProductsByCategory";
import GridSkeletonLoader from "../skeleton-loader/GridSkeletonLoader";

const ProductsGridView = () => {
    const { products, isLoading, loadingMore } = useProductStore();
    const { selectedCategory } = useCategoryStore();

    if (isLoading && products.length === 0) {
        return (
            <Box sx={{ py: 2, px: 2, bgcolor: "white" }}>
                <GridSkeletonLoader count={10} />
            </Box>
        );
    }

    if (selectedCategory) {
        return (
            <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
                <EcommerceProductsGrid
                    products={products}
                    loading={loadingMore}
                />
                {loadingMore && (
                     <Box sx={{ py: 2 }}>
                        <GridSkeletonLoader count={4} />
                     </Box>
                )}
            </Box>
        );
    }

    return <CategoryProductsByCategory />;
};

export default ProductsGridView;