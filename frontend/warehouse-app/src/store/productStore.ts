import { ecommerceService } from "@/services/ecommerce.service";
import { create } from "zustand";

import { FetchProductsParams, GetProductsParams, ProductCacheData, ProductStore } from "./storeTypes";
import type { EcommerceProduct } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";

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

  currentDetailProduct: null,
  detailPreviewProducts: [],
  detailRelatedProducts: [],
  detailCache: {},
  isDetailLoading: true,
  arePreviewsLoading: true,
  detailError: null,
  isLoadingSlug: null,

  handleProductSelect: (productId: string) => set({ selectedProduct: productId }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setError: (error: string | null) => set({ error }),

  fetchProductBySlug: async (slug: string, currency?: string, userId?: string, countryCode?: string) => {
    try {
      const product = await ecommerceService.getProduct(slug, currency, userId, countryCode);
      return product;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch product");
    }
  },

  getCategoryProducts: async (categoryId: string, currency?: string, countryCode?: string, limit = 5, userId?: string) => {
    try {
      const products = await ecommerceService.getProducts(undefined, currency, categoryId, limit, undefined, userId, countryCode);
      return products;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch category products");
    }
  },

  getProducts: async ({ searchTerm, currency, category, countryCode, limit, offset, userId }: GetProductsParams = {}) => {
    set({ isLoading: true, error: null });
    try {
      const products = await ecommerceService.getProducts(
        searchTerm,
        currency,
        category,
        limit,
        offset,
        userId,
        countryCode
      );
      set({ products, isLoading: false });
      return products;
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "Failed to fetch products" });
      return [];
    }
  },

  fetchProducts: async (params: FetchProductsParams, reset = false) => {
    const state = get();
    if (!reset && state.loadingMore) return;
    if (reset && state.isLoading) return;

    const { category, searchTerm, currency, countryCode, userId } = params;

    const cacheKey = JSON.stringify({
      category,
      searchTerm,
      currency,
      countryCode,
      userId
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
        currency,
        category || undefined, 
        20, 
        currentOffset,
        userId,
        countryCode
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

        return reset 
          ? {
            products: newProducts,
            isLoading: false,
            hasMore: newHasMore,
            offset: newOffset,
            cache: updatedCache
          }
          : {
            products: newProducts,
            loadingMore: false,
            hasMore: newHasMore,
            offset: newOffset,
            cache: updatedCache
          };
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

  setCurrentDetailProduct: (product: EcommerceProduct) => {
    const state = get();
    
    set({ currentDetailProduct: product });
    
    const currentPreviews = state.detailPreviewProducts;
    const others = currentPreviews.filter(p => p.id !== product.id);
    set({ detailPreviewProducts: [product, ...others.slice(0, 2)] });
  },

  resetDetailState: () => {
    set({ 
      currentDetailProduct: null, 
      detailPreviewProducts: [], 
      detailRelatedProducts: [], 
      isDetailLoading: true, 
      arePreviewsLoading: true,
      detailError: null,
      isLoadingSlug: null
    });
  },

  loadProductPageData: async (slug: string, currency: string, countryCode?: string, userId?: string) => {
    const state = get();

    if (state.detailCache[slug]) {
      const cached = state.detailCache[slug];
      set({
        currentDetailProduct: cached.product,
        detailPreviewProducts: cached.previews,
        detailRelatedProducts: cached.related,
        isDetailLoading: false,
        arePreviewsLoading: false,
        detailError: null
      });
      return;
    }

    if (state.isLoadingSlug === slug) {
      return;
    }

    const existingProductInList = state.products.find((p) => p.slug === slug);

    set({ 
      isLoadingSlug: slug,
      currentDetailProduct: existingProductInList || null, 
      detailPreviewProducts: existingProductInList ? [existingProductInList] : [],
      isDetailLoading: true, 
      arePreviewsLoading: true, 
      detailError: null
    });

    try {
      const product = await ecommerceService.getProduct(slug, currency, userId, countryCode);
      set({ currentDetailProduct: product, isDetailLoading: false });

      // Fetch Preview Products
      let previewProducts: EcommerceProduct[] = [product];
      let relatedProducts: EcommerceProduct[] = [];
      let categoryProducts: EcommerceProduct[] | null = null;

      try {
        if (product.category) {
          categoryProducts = await ecommerceService.getProducts(undefined, currency, product.category.id, 6, undefined, userId, countryCode);
          const sameCategory = categoryProducts.filter((p: EcommerceProduct) => p.id !== product.id);
          previewProducts = [product, ...sameCategory.slice(0, 2)];
        }

        // Fetch Related Data
        if (product.sub_category) {
          const subcategoryProducts = await ecommerceService.getProducts(undefined, currency, product.sub_category.id, 6, undefined, userId, countryCode);
          const sameSubcategory = subcategoryProducts.filter((p: EcommerceProduct) => p.id !== product.id);
          if (sameSubcategory.length > 0) relatedProducts = sameSubcategory.slice(0, 5);
        }

        if (relatedProducts.length === 0 && product.category && categoryProducts) {
          const sameCategory = categoryProducts.filter((p: EcommerceProduct) => p.id !== product.id);
          relatedProducts = sameCategory.slice(0, 5);
        }
      } catch (err) {
        console.error("Failed to load preview products:", err);
      }

      set({
        detailPreviewProducts: previewProducts,
        detailRelatedProducts: relatedProducts,
        arePreviewsLoading: false,
        isLoadingSlug: null
      });

      set((prev) => ({
        detailCache: {
          ...prev.detailCache,
          [slug]: {
            product: product,
            previews: previewProducts,
            related: relatedProducts,
            timestamp: Date.now()
          }
        }
      }));

    } catch (error: any) {
      set({ 
        currentDetailProduct: existingProductInList || null,
        isDetailLoading: false, 
        arePreviewsLoading: false,
        detailError: error.message || ecommerceData.productDetail.productNotFound,
        isLoadingSlug: null
      });
    }
  }
}));

export default useProductStore;
