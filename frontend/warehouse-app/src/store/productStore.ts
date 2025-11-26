import { ecommerceService } from "@/services/ecommerce.service";
import { create } from "zustand";
import { GetProductsParams, ProductCacheData, ProductStore } from "./storeTypes";
import type { EcommerceProduct } from "@/types/ecommerce";

const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  selectedProduct: null,
  searchQuery: "",
  isLoading: false,
  loadingMore: false,
  error: null,
  offset: 0,
  hasMore: true,
  cache: {},

  handleProductSelect: (productId: string) => set({ selectedProduct: productId }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setError: (error: string | null) => set({ error }),

  getProducts: async ({ searchTerm, country, category, limit, offset }: GetProductsParams = {}) => {
    set({ isLoading: true, error: null });
    try {
      const products = await ecommerceService.getProducts(
        searchTerm,
        country,
        category,
        limit,
        offset
      );
      set({ products, isLoading: false });
      return products;
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "Failed to fetch products" });
      return [];
    }
  },

  fetchProducts: async (params: { category?: string; searchTerm?: string; country?: string }, reset = false) => {
    const state = get();
    if (!reset && state.loadingMore) return;
    if (reset && state.isLoading) return;

    const { category, searchTerm, country } = params;

    const cacheKey = JSON.stringify({
      category,
      searchTerm,
      country
    });

    const currentOffset = reset ? 0 : state.offset;

    if (reset) {
      if (state.cache[cacheKey]) {
        const cachedData = state.cache[cacheKey];
        set({
          products: cachedData.products,
          hasMore: cachedData.hasMore,
          offset: cachedData.offset,
          isLoading: false,
          error: null
        });
        return; 
      }
      set({ isLoading: true, products: [], offset: 0, hasMore: true, error: null });
    } else {
      set({ loadingMore: true, error: null });
    }

    try {
      const fetchedProducts: EcommerceProduct[] = await ecommerceService.getProducts(
        searchTerm,
        country,
        category || undefined, 
        20, 
        currentOffset
      );

      set((prevState) => {
        const newProducts = reset ? fetchedProducts : [...prevState.products, ...fetchedProducts];
        const newHasMore = fetchedProducts.length === 20;
        const newOffset = currentOffset + 20;

        const newCacheEntry: ProductCacheData = {
          products: newProducts,
          hasMore: newHasMore,
          offset: newOffset
        };

        const updatedCache = {
          ...prevState.cache,
          [cacheKey]: newCacheEntry
        };

        if (reset) {
          return {
            products: newProducts,
            isLoading: false,
            hasMore: newHasMore,
            offset: newOffset,
            cache: updatedCache
          };
        } else {
          return {
            products: newProducts,
            loadingMore: false,
            hasMore: newHasMore,
            offset: newOffset,
            cache: updatedCache
          };
        }
      });
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      const errorMessage = error.message || "Failed to fetch products";
      
      if (reset) {
        set({ isLoading: false, error: errorMessage });
      } else {
        set({ loadingMore: false, error: errorMessage });
      }
    }
  },
}));

export default useProductStore;
