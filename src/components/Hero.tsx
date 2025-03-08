import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "https://i.postimg.cc/zGhrckCL/royal-mile.jpg",
    "https://i.postimg.cc/3Jd7ghWF/photo-1739382445440-14faf9866596.jpg",
    "https://i.postimg.cc/J7TMD07h/premium-photo-1684318122845-3001d6449ca0.jpg",
    "https://i.postimg.cc/VNBcYLHm/photo-1739932900241-4d3362b5ed8e.jpg",
    "https://i.postimg.cc/PJFjB3VD/premium-photo-1726862990789-37855c97a0f3.jpg",
    "https://i.postimg.cc/Y0S7DKRk/photo-1740416265401-0f4f850ba062.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={heroImages[currentImageIndex]}
            alt="Hero background"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full h-full object-cover absolute inset-0"
          />
        </AnimatePresence>
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-7xl font-bright mb-6 text-white"
            >
              Discover Yourself
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white"
            >
              Explore our collection of premium skincare and cosmetics designed
              to enhance your natural radiance.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const featuredSection =
                  document.getElementById("featured-section");
                if (featuredSection) {
                  featuredSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-8 py-3 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition"
            >
              Shop Now
            </motion.button>
          </div>
        </div>
      </div>

      {/* What makes you glow section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="https://i.postimg.cc/ZK2mHQdt/photo-1739188366834-1281a22a1ac5.jpg"
                alt="Beauty model"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </motion.div>
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bright mb-6">
                What makes you glow
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Together we're building a safe, welcoming space in beauty and
                beyond. This is makeup made to feel good in, without hiding what
                makes you unique. And it's all vegan and cruelty free.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 border-2 border-rose-500 text-rose-500 rounded-full font-medium hover:bg-rose-50 transition"
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
