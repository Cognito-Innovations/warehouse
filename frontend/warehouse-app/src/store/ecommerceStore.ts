import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EcommerceCategory, EcommerceProduct, Cart, CartItem } from "../types/ecommerce";

// Product Store State
interface ProductState {
  categories: EcommerceCategory[];
  products: EcommerceProduct[];
  filteredProducts: EcommerceProduct[];
  searchQuery: string;
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;
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
  loadMockData: () => void;
}

// Cart Store State
interface CartState {
  cart: Cart | null;
  itemCount: number;
  totalAmount: number;
  loading: boolean;
  error: string | null;
}

// Cart Store Actions
interface CartActions {
  setCart: (cart: Cart) => void;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Combined Store
interface EcommerceStore extends ProductState, ProductActions, CartState, CartActions {}

// Mock Data
const mockCategories: EcommerceCategory[] = [
  {
    id: "1",
    name: "Fresh Vegetables",
    slug: "fresh-vegetables",
    description: "Fresh and organic vegetables",
    image_url: "",
    is_active: true,
    country: { id: "1", name: "India" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Fruits",
    slug: "fruits",
    description: "Fresh seasonal fruits",
    image_url: "",
    is_active: true,
    country: { id: "1", name: "India" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    name: "Dairy & Eggs",
    slug: "dairy-eggs",
    description: "Fresh dairy products",
    image_url: "",
    is_active: true,
    country: { id: "1", name: "India" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    name: "Beverages",
    slug: "beverages",
    description: "Drinks and beverages",
    image_url: "",
    is_active: true,
    country: { id: "1", name: "India" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
];

const mockProducts: EcommerceProduct[] = [
  {
    id: "1",
    name: "Organic Tomatoes",
    description: "Premium organic tomatoes, perfect for salads and cooking",
    slug: "organic-tomatoes",
    price: 120,
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEWR1NDJV3TiF-Jl2uFSvZBn4Qksj548cXjw&s",
    quantity: 1,
    measurement: "kg",
    discount_percentage: 10,
    category: mockCategories[0],
    sub_category: {
      id: "1",
      name: "Vegetables",
      slug: "vegetables",
      image_url: "",
      description: "Fresh vegetables",
      is_active: true,
      category: mockCategories[0],
      country: { id: "1", name: "India" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    country: { id: "1", name: "India" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Sweet Mangoes",
    description: "Fresh and sweet mangoes from the best orchards",
    slug: "sweet-mangoes",
    price: 200,
    image_url: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400",
    quantity: 1,
    measurement: "kg",
    discount_percentage: 15,
    category: mockCategories[1],
    sub_category: {
      id: "2",
      name: "Tropical Fruits",
      slug: "tropical-fruits",
      image_url: "",
      description: "Tropical fruits",
      is_active: true,
      category: mockCategories[1],
      country: { id: "1", name: "India" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    country: { id: "1", name: "India" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Fresh Milk",
    description: "Pure and fresh milk, perfect for your daily needs",
    slug: "fresh-milk",
    price: 60,
    image_url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
    quantity: 1,
    measurement: "liter",
    discount_percentage: 5,
    category: mockCategories[2],
    sub_category: {
      id: "3",
      name: "Dairy",
      slug: "dairy",
      image_url: "",
      description: "Dairy products",
      is_active: true,
      category: mockCategories[2],
      country: { id: "1", name: "India" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    country: { id: "1", name: "India" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Orange Juice",
    description: "Freshly squeezed orange juice, rich in vitamin C",
    slug: "orange-juice",
    price: 80,
    image_url: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400",
    quantity: 1,
    measurement: "liter",
    discount_percentage: 20,
    category: mockCategories[3],
    sub_category: {
      id: "4",
      name: "Juices",
      slug: "juices",
      image_url: "",
      description: "Fresh juices",
      is_active: true,
      category: mockCategories[3],
      country: { id: "1", name: "India" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    country: { id: "1", name: "India" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Banana Yellaki",
    description: "Ready to eat bananas, perfect for snacking",
    slug: "banana-yellaki",
    price: 124,
    image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
    quantity: 500,
    measurement: "g",
    discount_percentage: 62,
    category: mockCategories[1],
    sub_category: {
      id: "2",
      name: "Tropical Fruits",
      slug: "tropical-fruits",
      image_url: "",
      description: "Tropical fruits",
      is_active: true,
      category: mockCategories[1],
      country: { id: "1", name: "India" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    country: { id: "1", name: "India" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Grapes Blue",
    description: "Sweet-sour grapes perfect for juices",
    slug: "grapes-bangalore-blue",
    price: 38,
    image_url: "https://sahasa.in/wp-content/uploads/2020/11/economics-of-grape-farming..jpg",
    quantity: 200,
    measurement: "g",
    discount_percentage: 34,
    category: mockCategories[1],
    sub_category: {
      id: "2",
      name: "Tropical Fruits",
      slug: "tropical-fruits",
      image_url: "",
      description: "Tropical fruits",
      is_active: true,
      category: mockCategories[1],
      country: { id: "1", name: "India" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    country: { id: "1", name: "India" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useEcommerceStore = create<EcommerceStore>()(
  persist(
    (set, get) => ({
      // Product State
      categories: mockCategories,
      products: mockProducts,
      filteredProducts: mockProducts,
      searchQuery: "",
      selectedCategory: null,
      loading: false,
      error: null,

      // Cart State
      cart: null,
      itemCount: 0,
      totalAmount: 0,

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
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }

        if (selectedCategory) {
          filtered = filtered.filter(product => product.category.id === selectedCategory);
        }

        set({ filteredProducts: filtered });
      },
      loadMockData: () => {
        set({
          categories: mockCategories,
          products: mockProducts,
          filteredProducts: mockProducts,
          loading: false,
          error: null,
        });
      },

      // Cart Actions
      setCart: (cart) => {
        set({
          cart,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: cart.final_amount,
        });
      },
      addToCart: (productId, quantity = 1) => {
        const { products, cart } = get();
        const product = products.find(p => p.id === productId);
        
        if (!product) return;

        const currentCart = cart || {
          id: "demo-cart",
          user_id: "demo-user",
          total_items: 0,
          total_amount: 0,
          discount_amount: 0,
          final_amount: 0,
          status: "ACTIVE",
          items: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const existingItemIndex = currentCart.items.findIndex(item => item.product.id === productId);
        let updatedItems;

        if (existingItemIndex >= 0) {
          updatedItems = currentCart.items.map((item, index) => 
            index === existingItemIndex 
              ? { 
                  ...item, 
                  quantity: item.quantity + quantity, 
                  total_price: item.unit_price * (item.quantity + quantity),
                  discount_amount: (item.unit_price * (item.quantity + quantity) * product.discount_percentage) / 100
                }
              : item
          );
        } else {
          const discountAmount = (product.price * quantity * product.discount_percentage) / 100;
          const newItem: CartItem = {
            id: `item-${Date.now()}`,
            product,
            quantity,
            unit_price: product.price,
            total_price: product.price * quantity,
            discount_amount: discountAmount,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          updatedItems = [...currentCart.items, newItem];
        }

        const updatedCart = {
          ...currentCart,
          items: updatedItems,
          total_items: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          total_amount: updatedItems.reduce((sum, item) => sum + item.total_price, 0),
          discount_amount: updatedItems.reduce((sum, item) => sum + item.discount_amount, 0),
          final_amount: updatedItems.reduce((sum, item) => sum + item.total_price, 0) - updatedItems.reduce((sum, item) => sum + item.discount_amount, 0),
        };

        get().setCart(updatedCart);
      },
      updateCartItem: (itemId, quantity) => {
        const { cart } = get();
        if (!cart) return;

        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        const updatedItems = cart.items.map(item => {
          if (item.id === itemId) {
            const discountAmount = (item.unit_price * quantity * item.product.discount_percentage) / 100;
            return {
              ...item,
              quantity,
              total_price: item.unit_price * quantity,
              discount_amount: discountAmount,
            };
          }
          return item;
        });

        const updatedCart = {
          ...cart,
          items: updatedItems,
          total_items: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          total_amount: updatedItems.reduce((sum, item) => sum + item.total_price, 0),
          discount_amount: updatedItems.reduce((sum, item) => sum + item.discount_amount, 0),
          final_amount: updatedItems.reduce((sum, item) => sum + item.total_price, 0) - updatedItems.reduce((sum, item) => sum + item.discount_amount, 0),
        };

        get().setCart(updatedCart);
      },
      removeFromCart: (itemId) => {
        const { cart } = get();
        if (!cart) return;

        const updatedItems = cart.items.filter(item => item.id !== itemId);
        const updatedCart = {
          ...cart,
          items: updatedItems,
          total_items: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          total_amount: updatedItems.reduce((sum, item) => sum + item.total_price, 0),
          discount_amount: updatedItems.reduce((sum, item) => sum + item.discount_amount, 0),
          final_amount: updatedItems.reduce((sum, item) => sum + item.total_price, 0) - updatedItems.reduce((sum, item) => sum + item.discount_amount, 0),
        };

        get().setCart(updatedCart);
      },
      clearCart: () => {
        set({
          cart: null,
          itemCount: 0,
          totalAmount: 0,
        });
      },
    }),
    {
      name: "ecommerce-store",
      partialize: (state) => ({
        cart: state.cart,
        itemCount: state.itemCount,
        totalAmount: state.totalAmount,
      }),
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
  return {
    products,
    filteredProducts,
    categories,
    searchQuery,
    selectedCategory,
    loading,
    error,
  };
};

export const useCart = () => {
  const cart = useEcommerceStore((state) => state.cart);
  const itemCount = useEcommerceStore((state) => state.itemCount);
  const totalAmount = useEcommerceStore((state) => state.totalAmount);
  const loading = useEcommerceStore((state) => state.loading);
  const error = useEcommerceStore((state) => state.error);
  return { cart, itemCount, totalAmount, loading, error };
};

export const useCartActions = () => {
  const addToCart = useEcommerceStore((state) => state.addToCart);
  const updateCartItem = useEcommerceStore((state) => state.updateCartItem);
  const removeFromCart = useEcommerceStore((state) => state.removeFromCart);
  const clearCart = useEcommerceStore((state) => state.clearCart);
  const setCart = useEcommerceStore((state) => state.setCart);
  return { addToCart, updateCartItem, removeFromCart, clearCart, setCart };
};

export const useProductActions = () => {
  const setSearchQuery = useEcommerceStore((state) => state.setSearchQuery);
  const setSelectedCategory = useEcommerceStore((state) => state.setSelectedCategory);
  const loadMockData = useEcommerceStore((state) => state.loadMockData);
  const setLoading = useEcommerceStore((state) => state.setLoading);
  const setError = useEcommerceStore((state) => state.setError);
  return { setSearchQuery, setSelectedCategory, loadMockData, setLoading, setError };
};
