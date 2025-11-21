import { ecommerceService } from "@/services/ecommerce.service";
import {create} from "zustand";
import { GetProductsParams, ProductStore } from "./storeTypes";

const useProductStore = create<ProductStore>((set) =>({
    //TODO: Define initial set of products
    products:[],
    selectedProduct: null,
    isLoading: false,
    
    //TODO: correct the typscript type of selectedProduct
    handleProductSelect: (productId) =>set({selectedProduct: productId}),
    //TODO: Define the typescript interface instead of "any"
    //TODO: Resolve the typescript error on getProducts
    getProducts: async ({ searchTerm, country, limit, offset }: GetProductsParams = {}) => {
        set({ isLoading: true });
        const products = await ecommerceService.getProducts(
        searchTerm,
        country,
        limit,
        offset
        );
        set({ products });
        set({isLoading: false});
  },
}));

export default useProductStore;
