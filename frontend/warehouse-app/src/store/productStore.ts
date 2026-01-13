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
  activeRequestKey: null as string | null,

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

  getCategoryProducts: async (categorySlug: string, currency?: string, countryCode?: string, limit = 5, userId?: string) => {
    try {
      const products = await ecommerceService.getProducts(currency, categorySlug, limit, undefined, userId, countryCode);
      return products;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch category products");
    }
  },

  getProducts: async ({ searchTerm, currency, category, countryCode, limit, offset, userId }: GetProductsParams = {}) => {
    set({ isLoading: true, error: null });
    try {
      const products = await ecommerceService.getProducts(
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
    const { category, searchTerm, currency, countryCode, userId } = params;

    const cacheKey = JSON.stringify({
      category,
      searchTerm,
      currency,
      countryCode,
      userId
    });

    const state = get();
    if (!reset && (state.loadingMore || state.isLoading)) return;
    
    set({
      activeRequestKey: cacheKey,
      products: reset ? [] : state.products,
      offset: reset ? 0 : state.offset,
      hasMore: reset ? true : state.hasMore,
    });

    const currentOffset = reset || get().activeRequestKey !== cacheKey ? 0 : get().offset;

    if (get().activeRequestKey !== cacheKey) return;

    if (reset) {
      if (get().activeRequestKey !== cacheKey) return;

      if (state.cache[cacheKey]) {
        const cachedData = state.cache[cacheKey];
        set({
          products: cachedData.products,
          hasMore: cachedData.hasMore,
          offset: cachedData.offset,
          isLoading: false,
          loadingMore: false,
          error: null
        });
        return; 
      }
      set({ isLoading: true, loadingMore: false, products: [], offset: 0, hasMore: true, error: null });
    } else {
      set({ loadingMore: true, error: null });
    }

    try {
      const fetchedProducts: EcommerceProduct[] = searchTerm
        ? await ecommerceService.searchProducts(
            searchTerm,
            currency,
            userId,
            countryCode,
            20,
            currentOffset
          )
        : await ecommerceService.getProducts(
            currency,
            category,
            20,
            currentOffset,
            userId,
            countryCode
          );

      if (get().activeRequestKey !== cacheKey) {
        return;
      }

      set((prevState) => {
        if (get().activeRequestKey !== cacheKey) return prevState;

        const mergedProducts = reset
          ? fetchedProducts
          : [...prevState.products, ...fetchedProducts];

        const uniqueProducts = Array.from(
          new Map(mergedProducts.map(p => [p.id, p])).values()
        );

        const newHasMore = fetchedProducts.length === 20;
        const newOffset = currentOffset + 20;

        const newCacheEntry: ProductCacheData = {
          products: uniqueProducts,
          hasMore: newHasMore,
          offset: newOffset
        };

        const updatedCache = {
          ...prevState.cache,
          [cacheKey]: newCacheEntry
        };

        return reset 
          ? {
            products: uniqueProducts,
            isLoading: false,
            hasMore: newHasMore,
            loadingMore: false,
            offset: newOffset,
            cache: updatedCache
          }
          : {
            products: uniqueProducts,
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
        if (product.category?.slug) {
          categoryProducts = await ecommerceService.getProducts(currency, product.category.slug, 6, undefined, userId, countryCode);
          const sameCategory = categoryProducts.filter((p: EcommerceProduct) => p.id !== product.id);
          previewProducts = [product, ...sameCategory.slice(0, 2)];
        }

        // Fetch Related Data
        if (product.sub_category?.slug) {
          const subcategoryProducts = await ecommerceService.getProducts(currency, product.sub_category.slug, 6, undefined, userId, countryCode);
          const sameSubcategory = subcategoryProducts.filter((p: EcommerceProduct) => p.id !== product.id);
          if (sameSubcategory.length > 0) relatedProducts = sameSubcategory.slice(0, 5);
        }

        if (relatedProducts.length === 0 && product.category?.slug && categoryProducts) {
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
  },

  clearProductCache: () => set({
    products: [],
    cache: {},
    offset: 0,
    hasMore: true,
    activeRequestKey: null
  }),
}));

export default useProductStore;
