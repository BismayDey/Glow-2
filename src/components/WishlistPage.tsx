import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Star,
  Clock,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const WishlistPage: React.FC = () => {
  const { state, dispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "name" | "price" | "category" | "rating"
  >("name");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const removeFromWishlist = (id: number, name: string) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
    toast.success(`${name} removed from wishlist`);
  };

  const addToCart = (product: any) => {
    cartDispatch({ type: "ADD_TO_CART", payload: product });
    toast.success(`${product.name} added to cart!`);
  };

  const clearWishlist = () => {
    if (
      window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      dispatch({ type: "CLEAR_WISHLIST" });
      toast.success("Wishlist cleared");
    }
  };

  const moveAllToCart = () => {
    state.items.forEach((product) => {
      cartDispatch({ type: "ADD_TO_CART", payload: product });
    });
    dispatch({ type: "CLEAR_WISHLIST" });
    toast.success(`${state.items.length} items moved to cart!`);
  };

  // Get unique categories
  const categories = [
    "all",
    ...new Set(state.items.map((item) => item.category)),
  ];

  // Filter and sort items
  const filteredAndSortedItems = state.items
    .filter(
      (item) => filterCategory === "all" || item.category === filterCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "category":
          return a.category.localeCompare(b.category);
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="flex items-center text-gray-600 hover:text-rose-500 mr-6 transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </motion.button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bright text-gray-900 mb-2">
                  My Wishlist
                </h1>
                <p className="text-gray-600 flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-rose-500" />
                  {state.items.length}{" "}
                  {state.items.length === 1 ? "item" : "items"} saved
                </p>
              </div>
            </div>

            {state.items.length > 0 && (
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={moveAllToCart}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition flex items-center"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Move All to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearWishlist}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition"
                >
                  Clear All
                </motion.button>
              </div>
            )}
          </div>

          {/* Filters and Controls */}
          {state.items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-rose-500 focus:border-rose-500"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-rose-500 focus:border-rose-500"
                    >
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                      <option value="category">Category</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">View:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition ${
                        viewMode === "grid"
                          ? "bg-white text-rose-500 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition ${
                        viewMode === "list"
                          ? "bg-white text-rose-500 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Empty State */}
        {state.items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <Heart className="h-32 w-32 text-gray-200 mx-auto" />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Heart className="h-16 w-16 text-rose-300" />
                </motion.div>
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save your favorite products to your wishlist and shop them later.
              Start exploring our collection to find products you love!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium hover:from-rose-600 hover:to-pink-600 transition shadow-lg"
            >
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          /* Products Grid/List */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            <AnimatePresence>
              {filteredAndSortedItems.map((product) => {
                const discountedPrice =
                  product.price * (1 - product.discount / 100);

                return viewMode === "grid" ? (
                  /* Grid View */
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden group transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        whileHover={{ scale: 1.05 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Action buttons overlay */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            removeFromWishlist(product.id, product.name)
                          }
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-50 transition"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-gray-50 transition"
                        >
                          <ArrowLeft className="h-4 w-4 text-gray-600 rotate-180" />
                        </motion.button>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 space-y-2">
                        {product.isNew && (
                          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            New
                          </span>
                        )}
                        {product.discount > 0 && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Stock indicator */}
                      {product.stock < 10 && (
                        <div className="absolute bottom-4 left-4 flex items-center bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Only {product.stock} left
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-medium text-rose-500 bg-rose-50 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-600 ml-1">
                            {product.rating}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{discountedPrice.toFixed(2)}
                          </span>
                          {product.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addToCart(product)}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-4 rounded-xl font-medium hover:from-rose-600 hover:to-pink-600 transition flex items-center justify-center shadow-lg"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  /* List View */
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex items-center p-6">
                      <div className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-1 right-1 bg-red-500 text-white px-1 py-0.5 rounded text-xs font-medium">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>

                      <div className="flex-1 ml-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-rose-500 bg-rose-50 px-2 py-1 rounded-full">
                                {product.category}
                              </span>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs text-gray-600 ml-1">
                                  {product.rating}
                                </span>
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                              {product.description}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-gray-900">
                                ₹{discountedPrice.toFixed(2)}
                              </span>
                              {product.discount > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{product.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => addToCart(product)}
                              className="bg-rose-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-600 transition flex items-center"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate(`/product/${product.id}`)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                              View
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                removeFromWishlist(product.id, product.name)
                              }
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No results message for filtered items */}
        {state.items.length > 0 && filteredAndSortedItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items match your filters
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your category or sort preferences
            </p>
            <button
              onClick={() => {
                setFilterCategory("all");
                setSortBy("name");
              }}
              className="text-rose-500 hover:text-rose-600 font-medium"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
