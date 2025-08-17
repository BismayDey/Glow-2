import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { Product } from "../types";

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: "ADD_TO_WISHLIST"; payload: Product }
  | { type: "REMOVE_FROM_WISHLIST"; payload: number }
  | { type: "CLEAR_WISHLIST" }
  | { type: "LOAD_WISHLIST"; payload: WishlistState };

const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
  isInWishlist: (id: number) => boolean;
} | null>(null);

const WISHLIST_STORAGE_KEY = "glow_wishlist";

const wishlistReducer = (
  state: WishlistState,
  action: WishlistAction
): WishlistState => {
  let newState: WishlistState;

  switch (action.type) {
    case "ADD_TO_WISHLIST": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return state; // Item already in wishlist
      }
      newState = {
        items: [...state.items, action.payload],
      };
      break;
    }
    case "REMOVE_FROM_WISHLIST": {
      newState = {
        items: state.items.filter((item) => item.id !== action.payload),
      };
      break;
    }
    case "CLEAR_WISHLIST":
      newState = {
        items: [],
      };
      break;
    case "LOAD_WISHLIST":
      newState = action.payload;
      break;
    default:
      return state;
  }

  // Save to localStorage
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newState));
  return newState;
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
  });

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist) as WishlistState;
        dispatch({ type: "LOAD_WISHLIST", payload: parsedWishlist });
      } catch (error) {
        console.error("Failed to parse saved wishlist:", error);
      }
    }
  }, []);

  const isInWishlist = (id: number): boolean => {
    return state.items.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ state, dispatch, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
