import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  EcommerceCategory,
  EcommerceProduct,
} from "../types/ecommerce";
import { ecommerceService } from "@/services/ecommerce.service";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const name = "auth-token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
};

// Product Store State
interface ProductState {
  categories: EcommerceCategory[];
  products: EcommerceProduct[];
  filteredProducts: EcommerceProduct[];
  searchQuery: string;
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;
  productsCount: number;
  hasMoreProducts: boolean;
  loadingNextPage: boolean;
}

// Product Store Actions
interface ProductActions {
  setCategories: (categories: EcommerceCategory[]) => void;
  setProducts: (products: EcommerceProduct[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  filterProducts: () => void;
  fetchCategories: () => Promise<void>;
  fetchProducts: (country?: string, searchTerm?: string) => Promise<void>;
  fetchProductsPage: (country?: string, offset?: number, limit?: number, append?: boolean, searchTerm?: string) => Promise<void>;
  resetProducts: () => void;
  fetchMoreProducts: (country?: string, searchTerm?: string) => Promise<void>;
}

// Combined Store
interface EcommerceStore
  extends ProductState,
    ProductActions {}

export const useEcommerceStore = create<EcommerceStore>()(
  persist(
    (set, get) => ({
      // Product State
      categories: [],
      products: [],
      filteredProducts: [],
      searchQuery: "",
      selectedCategory: null,
      loading: false,
      error: null,
      productsCount: 0,
      hasMoreProducts: true,
      loadingNextPage: false,

      // Product Actions
      setCategories: (categories) => set({ categories }),
      setProducts: (products) => set({ products }),
      setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().filterProducts();
      },
      setSelectedCategory: (categoryId) => {
        set({ selectedCategory: categoryId });
        get().filterProducts();
      },
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      filterProducts: () => {
        const { products, searchQuery, selectedCategory } = get();
        let filtered = products;

        if (searchQuery) {
          filtered = filtered.filter(
            (product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (product.description &&
                product.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())),
          );
        }

        if (selectedCategory) {
          filtered = filtered.filter(
            (product) => product.category.id === selectedCategory,
          );
        }

        set({ filteredProducts: filtered });
      },
      fetchCategories: async () => {
        try {
          const categories = await ecommerceService.getCategories();
          set({ categories });
        } catch (err: any) {
          console.error("Failed to fetch categories:", err);
          set({
            error: err.message || "Failed to fetch categories",
          });
        }
      },
      fetchProductsPage: async (country, offset = 0, limit = 20, append = false, searchTerm) => {
        set({ loadingNextPage: true });
        try {
          const products = await ecommerceService.getProducts(searchTerm, country, limit, offset);
          const current = get().products;
          const mergedProducts = append ? [...current, ...products] : products;
          set({
            products: mergedProducts,
            filteredProducts: mergedProducts,
            hasMoreProducts: products.length === limit,
            productsCount: append ? (current.length + products.length) : products.length,
          });
        } catch (err: any) {
          set({ error: err.message || "Failed to fetch products" });
        } finally {
          set({ loadingNextPage: false });
        }
      },
      fetchProducts: async (country, searchTerm) => {
        await get().fetchProductsPage(country, 0, 20, false, searchTerm);
      },
      fetchMoreProducts: async (country, searchTerm) => {
        const current = get().products;
        await get().fetchProductsPage(country, current.length, 20, true, searchTerm);
      },
      resetProducts: () => {
        set({ products: [], filteredProducts: [], productsCount: 0, hasMoreProducts: true });
      },
    }),
    {
      name: "ecommerce-store",
      // skipHydration: true,
      // onRehydrateStorage: () => (state) => {
      //   state?.filterProducts?.();
      // }
    }
  )
);

export const useProducts = () => {
  const products = useEcommerceStore((state) => state.products);
  const filteredProducts = useEcommerceStore((state) => state.filteredProducts);
  const categories = useEcommerceStore((state) => state.categories);
  const searchQuery = useEcommerceStore((state) => state.searchQuery);
  const selectedCategory = useEcommerceStore((state) => state.selectedCategory);
  const loading = useEcommerceStore((state) => state.loading);
  const error = useEcommerceStore((state) => state.error);
  const productsCount = useEcommerceStore((state) => state.productsCount);
  const hasMoreProducts = useEcommerceStore((state) => state.hasMoreProducts);
  const loadingNextPage = useEcommerceStore((state) => state.loadingNextPage);
  return {
    products,
    filteredProducts,
    categories,
    searchQuery,
    selectedCategory,
    loading,
    error,
    productsCount,
    hasMoreProducts,
    loadingNextPage,
  };
};

export const useProductActions = () => {
  const setSearchQuery = useEcommerceStore((state) => state.setSearchQuery);
  const setSelectedCategory = useEcommerceStore(
    (state) => state.setSelectedCategory,
  );
  const fetchCategories = useEcommerceStore((state) => state.fetchCategories);
  const fetchProducts = useEcommerceStore((state) => state.fetchProducts);
  const setLoading = useEcommerceStore((state) => state.setLoading);
  const setError = useEcommerceStore((state) => state.setError);
  const fetchMoreProducts = useEcommerceStore((state) => state.fetchMoreProducts);
  const resetProducts = useEcommerceStore((state) => state.resetProducts);
  return {
    setSearchQuery,
    setSelectedCategory,
    fetchCategories,
    fetchProducts,
    setLoading,
    setError,
    fetchMoreProducts,
    resetProducts,
  };
};
