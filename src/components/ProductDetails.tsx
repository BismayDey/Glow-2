import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  Check,
  Info,
  Clock,
  Truck,
  Shield,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Product } from "../types";
import toast from "react-hot-toast";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: any;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { user } = useAuth();
  const { dispatch: wishlistDispatch, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedEmiPeriod, setSelectedEmiPeriod] = useState(3);

  // EMI options
  const emiOptions = [
    { months: 3, interest: 0 },
    { months: 6, interest: 5 },
    { months: 9, interest: 8 },
    { months: 12, interest: 10 },
  ];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        if (!id) return;

        const productDoc = doc(db, "products", id);
        const productSnapshot = await getDoc(productDoc);

        if (productSnapshot.exists()) {
          setProduct({
            id: parseInt(productSnapshot.id),
            ...productSnapshot.data(),
          } as Product);
        } else {
          toast.error("Product not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    if (product) {
      fetchReviews();
    }
  }, [product, user]);

  const fetchReviews = async () => {
    try {
      if (!product) return;

      const reviewsQuery = query(
        collection(db, "reviews"),
        where("productId", "==", product.id.toString())
      );

      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsList: Review[] = [];

      reviewsSnapshot.forEach((doc) => {
        const reviewData = doc.data() as Omit<Review, "id">;
        const review = {
          id: doc.id,
          ...reviewData,
        };

        reviewsList.push(review);

        // Check if this is the current user's review
        if (user && reviewData.userId === user.uid) {
          setUserReview(review);
        }
      });

      setReviews(reviewsList);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity },
    });

    toast.success(`${product.name} added to cart!`);
  };

  const toggleWishlist = () => {
    if (!product) return;

    const isCurrentlyWishlisted = isInWishlist(product.id);
    if (isCurrentlyWishlisted) {
      wishlistDispatch({ type: "REMOVE_FROM_WISHLIST", payload: product.id });
      toast.success(`${product.name} removed from wishlist`);
    } else {
      wishlistDispatch({ type: "ADD_TO_WISHLIST", payload: product });
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (!product) return;

    try {
      if (userReview) {
        // Update existing review
        await updateDoc(doc(db, "reviews", userReview.id), {
          rating: newReview.rating,
          comment: newReview.comment,
          date: serverTimestamp(),
        });

        toast.success("Review updated successfully");
      } else {
        // Add new review
        await addDoc(collection(db, "reviews"), {
          productId: product.id.toString(),
          userId: user.uid,
          userName: user.displayName || "Anonymous",
          rating: newReview.rating,
          comment: newReview.comment,
          date: serverTimestamp(),
        });

        toast.success("Review added successfully");
      }

      // Refresh reviews
      fetchReviews();
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    try {
      await deleteDoc(doc(db, "reviews", userReview.id));
      toast.success("Review deleted successfully");
      setUserReview(null);
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const editReview = () => {
    if (!userReview) return;

    setNewReview({
      rating: userReview.rating,
      comment: userReview.comment,
    });

    setShowReviewForm(true);
  };

  const calculateEmi = (
    price: number,
    months: number,
    interestRate: number
  ) => {
    const principal = price;
    const interest = (principal * interestRate) / 100;
    const totalAmount = principal + interest;
    const monthlyPayment = totalAmount / months;

    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      totalInterest: interest.toFixed(2),
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discount / 100);
  const selectedEmi = emiOptions.find(
    (option) => option.months === selectedEmiPeriod
  );
  const emiDetails = selectedEmi
    ? calculateEmi(discountedPrice, selectedEmi.months, selectedEmi.interest)
    : null;
  const isWishlisted = isInWishlist(product.id);

  // Generate additional product images (in a real app, these would come from the database)
  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  ];

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : product.rating;

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-gray-600 hover:text-rose-500 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              onSlideChange={(swiper) => setSelectedImage(swiper.activeIndex)}
              className="aspect-square"
            >
              {productImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`${product.name} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-rose-500"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex flex-wrap items-start justify-between mb-2">
            <div>
              <span className="inline-block px-2 py-1 bg-rose-100 text-rose-800 text-xs font-medium rounded-full mb-2">
                {product.category}
              </span>
              {product.isNew && (
                <span className="inline-block ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  New Arrival
                </span>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-600">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-gray-900">
              ₹{discountedPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <>
                <span className="ml-2 text-lg text-gray-500 line-through">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          {product.stock < 10 && (
            <div className="flex items-center text-orange-500 text-sm mb-4">
              <Clock className="h-4 w-4 mr-1" />
              Only {product.stock} left in stock - order soon
            </div>
          )}

          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Total
                </span>
                <span className="text-lg font-semibold">
                  ₹{(discountedPrice * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 min-w-[150px] bg-rose-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-rose-600 transition flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleWishlist}
                className={`p-3 rounded-lg border ${
                  isWishlisted
                    ? "bg-rose-50 border-rose-300 text-rose-500"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } transition`}
              >
                <Heart
                  className={isWishlisted ? "h-5 w-5 fill-rose-500" : "h-5 w-5"}
                />
              </motion.button>
            </div>
          </div>

          {/* EMI Options */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">
              EMI Options Available
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {emiOptions.map((option) => (
                <button
                  key={option.months}
                  onClick={() => setSelectedEmiPeriod(option.months)}
                  className={`p-2 text-center rounded-lg border ${
                    selectedEmiPeriod === option.months
                      ? "bg-rose-50 border-rose-300 text-rose-700"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium">
                    {option.months} Months
                  </div>
                  <div className="text-xs text-gray-500">
                    {option.interest === 0
                      ? "No Interest"
                      : `${option.interest}% Interest`}
                  </div>
                </button>
              ))}
            </div>

            {emiDetails && (
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    Monthly Payment:
                  </span>
                  <span className="font-medium">
                    ₹{emiDetails.monthlyPayment}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="font-medium">₹{emiDetails.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Interest Amount:
                  </span>
                  <span className="font-medium">
                    ₹{emiDetails.totalInterest}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Delivery & Returns */}
          <div className="space-y-3">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium">Free Delivery</h4>
                <p className="text-sm text-gray-600">
                  Delivery within 3-5 business days
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium">30-Day Returns</h4>
                <p className="text-sm text-gray-600">
                  Return or exchange within 30 days
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Check className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium">100% Authentic</h4>
                <p className="text-sm text-gray-600">
                  All products are original and authentic
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {user && !showReviewForm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition"
            >
              {userReview ? "Edit Your Review" : "Write a Review"}
            </motion.button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 p-4 rounded-lg mb-6"
          >
            <h3 className="text-lg font-semibold mb-3">
              {userReview ? "Edit Your Review" : "Write a Review"}
            </h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= newReview.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Review
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Share your experience with this product..."
                  required
                ></textarea>
              </div>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition"
                >
                  {userReview ? "Update Review" : "Submit Review"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </motion.button>
                {userReview && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleDeleteReview}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition ml-auto"
                  >
                    Delete
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">
                        {review.userName}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {review.date && review.date.toDate
                        ? new Date(review.date.toDate()).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                  {user && user.uid === review.userId && !showReviewForm && (
                    <button
                      onClick={editReview}
                      className="text-sm text-rose-500 hover:text-rose-600"
                    >
                      Edit
                    </button>
                  )}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Info className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No reviews yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Be the first to review this product
            </p>
          </div>
        )}
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={`https://images.unsplash.com/photo-${
                    1570554913382 + index
                  }-930881f3d030?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
                  alt={`Related product ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 truncate">
                  Related Product {index + 1}
                </h3>
                <p className="text-rose-500 font-medium mt-1">₹1,299.99</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
