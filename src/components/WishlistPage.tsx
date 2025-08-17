import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const WishlistPage: React.FC = () => {
  const { state, dispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();
  const navigate = useNavigate();

  const removeFromWishlist = (id: number, name: string) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
    toast.success(`${name} removed from wishlist`);
  };

  const addToCart = (product: any) => {
    cartDispatch({ type: "ADD_TO_CART", payload: product });
    toast.success(`${product.name} added to cart!`);
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
    toast.success("Wishlist cleared");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-600 hover:text-rose-500 mr-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </button>
            <div>
              <h1 className="text-4xl font-bright text-gray-900">
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-2">
                {state.items.length}{" "}
                {state.items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {state.items.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearWishlist}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition"
            >
              Clear All
            </motion.button>
          )}
        </div>

        {state.items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Save your favorite products to your wishlist and shop them later
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition"
            >
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {state.items.map((product) => {
                const discountedPrice =
                  product.price * (1 - product.discount / 100);

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden group"
                  >
                    <div className="relative">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            removeFromWishlist(product.id, product.name)
                          }
                          className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </button>
                      </div>
                      {product.isNew && (
                        <div className="absolute top-2 left-2 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          New
                        </div>
                      )}
                      {product.discount > 0 && (
                        <div className="absolute bottom-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-rose-500 bg-rose-50 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600">
                            ★ {product.rating}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            ₹{discountedPrice.toFixed(2)}
                          </span>
                          {product.discount > 0 && (
                            <span className="text-sm text-gray-500 ml-2 line-through">
                              ₹{product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addToCart(product)}
                          className="flex-1 bg-rose-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-rose-600 transition flex items-center justify-center"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          View
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
