import React from 'react';
import { motion } from 'framer-motion';

interface BestsellersProps {
  onItemClick: () => void;
}

const Bestsellers: React.FC<BestsellersProps> = ({ onItemClick }) => {
  const bestsellers = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Lipstick",
      title: "Luxury Lipstick"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Makeup brushes",
      title: "Pro Brush Set"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Palette",
      title: "Eye Palette"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Products",
      title: "Skincare Set"
    }
  ];

  return (
    <section className="py-16 px-4 bg-mauve-100 relative">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-7xl font-bright mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Bestsellers
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative">
          {bestsellers.map((item, index) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="aspect-square overflow-hidden cursor-pointer relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={onItemClick}
              style={{
                position: 'relative',
                marginTop: index % 2 === 0 ? '0' : '-2rem',
                zIndex: index
              }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all z-10"></div>
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-white text-2xl font-bright text-center px-4">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Bestsellers;