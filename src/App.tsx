import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Featured from './components/Featured';
import Categories from './components/Categories';
import Bestsellers from './components/Bestsellers';
import Footer from './components/Footer';
import ProductDetails from './components/ProductDetails';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveSection(category);
    // Scroll to featured section
    const featuredSection = document.getElementById('featured-section');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-rose-50 z-50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    className="relative w-32 h-32 mx-auto"
                  >
                    <motion.div
                      className="absolute inset-0 border-4 border-rose-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: 360,
                        borderRadius: ["50%", "30%", "50%"]
                      }}
                      transition={{
                        duration: 2,
                        ease: "easeInOut",
                        times: [0, 0.5, 1],
                        repeat: Infinity
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 border-4 border-rose-300 rounded-full"
                      animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: -360,
                        borderRadius: ["30%", "50%", "30%"]
                      }}
                      transition={{
                        duration: 2,
                        ease: "easeInOut",
                        times: [0, 0.5, 1],
                        repeat: Infinity
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.span 
                        className="text-rose-500 text-2xl font-bold"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        G
                      </motion.span>
                    </motion.div>
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-4xl font-bold text-rose-500 font-serif"
                  >
                    GLOW
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-2 text-gray-600"
                  >
                    Discover Your Natural Beauty
                  </motion.p>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 1 }}
                    className="h-1 bg-rose-300 mt-4 rounded-full"
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-b from-rose-50 to-white"
              >
                <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                <Routes>
                  <Route path="/" element={
                    <main className="pt-16">
                      <Hero />
                      <Bestsellers onItemClick={() => handleCategoryClick('All')} />
                      <Categories onCategoryClick={handleCategoryClick} />
                      <div id="featured-section">
                        <Featured selectedCategory={activeSection} />
                      </div>
                    </main>
                  } />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Footer />
                <Toaster 
                  position="bottom-right" 
                  toastOptions={{
                    style: {
                      background: '#FFF',
                      color: '#333',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      padding: '16px'
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;