import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success(`${product.name} added to cart!`);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted 
      ? `${product.name} removed from wishlist` 
      : `${product.name} added to wishlist`
    );
  };

  const navigateToProduct = () => {
    navigate(`/product/${product.id}`);
  };

  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
      onClick={navigateToProduct}
    >
      <div className="relative">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={toggleWishlist}
            className="bg-white p-2 rounded-full shadow-md hover:bg-rose-50 transition"
          >
            <Heart 
              className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} 
            />
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
        <div className="flex justify-between items-start">
          <span className="text-sm text-rose-500 bg-rose-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mt-2 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
        {product.stock < 10 && (
          <div className="flex items-center text-orange-500 text-sm mt-2">
            <Clock className="h-4 w-4 mr-1" />
            Only {product.stock} left in stock
          </div>
        )}
        <div className="flex items-center justify-between mt-4">
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
          <motion.button
            onClick={addToCart}
            className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition"
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;