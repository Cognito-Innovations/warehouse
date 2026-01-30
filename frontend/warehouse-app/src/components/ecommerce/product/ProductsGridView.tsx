import { Box} from "@mui/material";

import useProductStore from "@/store/productStore";
import { useGridSkeletonCount } from "@/hooks/useGridSkeletonCount";
import EcommerceProductsGrid from "../EcommerceProductsGrid";
import GridSkeletonLoader from "../skeleton-loader/GridSkeletonLoader";

const ProductsGridView = () => {
    const { products, isLoading, loadingMore } = useProductStore();

    const initialSkeletonCount = useGridSkeletonCount({ minCount: 10 });
    
    const loadMoreSkeletonCount = useGridSkeletonCount({ singleRow: true });

    if (isLoading && products.length === 0) {
        return (
            <Box sx={{ py: 2, px: 2, bgcolor: "white" }}>
                <GridSkeletonLoader count={initialSkeletonCount} />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: "white", py: 2 }}>
            <EcommerceProductsGrid
                products={products}
                loading={loadingMore}
            />
            {loadingMore && (
                 <Box sx={{ py: 2 }}>
                    <GridSkeletonLoader count={loadMoreSkeletonCount} />
                 </Box>
            )}
        </Box>
    );
};

export default ProductsGridView;