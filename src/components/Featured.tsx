import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { Filter, Sparkles } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

interface FeaturedProps {
  selectedCategory: string | null;
}

const Featured: React.FC<FeaturedProps> = ({ selectedCategory }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        
        if (!productsSnapshot.empty) {
          const productsList = productsSnapshot.docs.map(doc => ({
            id: parseInt(doc.id),
            ...doc.data()
          })) as Product[];
          setProducts(productsList);
        } else {
          // If no products in Firestore, use the default products
          setProducts(defaultProducts);
          // Save default products to Firestore
          defaultProducts.forEach(async (product) => {
            try {
              await fetch('/api/products', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
              });
            } catch (error) {
              console.error('Error saving default product:', error);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map(product => product.category))];
  
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Sparkles className="h-6 w-6 text-rose-500 ml-2" />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <div className="flex space-x-2 overflow-x-auto pb-2 flex-nowrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                    ${activeCategory === category
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center text-gray-500 mt-8 p-8 bg-gray-50 rounded-lg">
                <p className="text-lg">No products found in this category.</p>
                <p className="mt-2">Try selecting a different category or check back later.</p>
              </div>
            )}
          </>
        )}
      </motion.div>
    </section>
  );
};

// Default products in case Firestore fails or is empty
const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Rose Quartz Facial Roller",
    price: 1499.99,
    image: "https://images.unsplash.com/photo-1562887245-138c2f45013e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Tools",
    description: "Premium rose quartz facial roller that helps reduce puffiness and promote natural glow.",
    rating: 4.8,
    stock: 15,
    isNew: true,
    discount: 0
  },
  {
    id: 2,
    name: "Hydrating Serum",
    price: 2499.99,
    image: "https://images.unsplash.com/photo-1570554886111-e80b8c3bb248?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Skincare",
    description: "Intensive hydrating serum with hyaluronic acid for plump, moisturized skin.",
    rating: 4.9,
    stock: 8,
    isNew: false,
    discount: 15
  },
  {
    id: 3,
    name: "Vitamin C Cream",
    price: 1999.99,
    image: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Skincare",
    description: "Brightening vitamin C cream that fades dark spots and evens skin tone.",
    rating: 4.7,
    stock: 20,
    isNew: false,
    discount: 0
  },
  {
    id: 4,
    name: "Natural Lip Balm",
    price: 699.99,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Makeup",
    description: "Nourishing lip balm with natural ingredients for soft, supple lips.",
    rating: 4.5,
    stock: 5,
    isNew: false,
    discount: 10
  },
  {
    id: 5,
    name: "Jade Gua Sha Tool",
    price: 999.99,
    image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Tools",
    description: "Traditional jade gua sha tool for facial massage and lymphatic drainage.",
    rating: 4.6,
    stock: 12,
    isNew: true,
    discount: 0
  },
  {
    id: 6,
    name: "Brightening Face Mask",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Skincare",
    description: "Illuminating face mask with pearl extract for radiant skin.",
    rating: 4.4,
    stock: 18,
    isNew: false,
    discount: 20
  },
  {
    id: 7,
    name: "Matte Lipstick",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Makeup",
    description: "Long-lasting matte lipstick in luxurious, wearable shades.",
    rating: 4.8,
    stock: 7,
    isNew: true,
    discount: 0
  },
  {
    id: 8,
    name: "Eye Cream",
    price: 1899.99,
    image: "https://images.unsplash.com/photo-1570179538662-31547dcdbb41?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Skincare",
    description: "Rich eye cream that targets fine lines and dark circles.",
    rating: 4.7,
    stock: 9,
    isNew: false,
    discount: 15
  }
];

export default Featured;