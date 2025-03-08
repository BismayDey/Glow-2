import React from 'react';
import { motion } from 'framer-motion';

interface CategoriesProps {
  onCategoryClick: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onCategoryClick }) => {
  const categories = [
    {
      id: 1,
      name: 'Eyes',
      image: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Makeup'
    },
    {
      id: 2,
      name: 'Skincare',
      image: 'https://images.unsplash.com/photo-1570554913382-930881f3d030?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Skincare'
    },
    {
      id: 3,
      name: 'Face',
      image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Makeup'
    },
    {
      id: 4,
      name: 'Lips',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Makeup'
    },
    {
      id: 5,
      name: 'Nails',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Tools'
    }
  ];

  return (
    <section className="py-16 px-4 bg-mauve-50 relative">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-7xl font-bright mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Shop by Category
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="relative aspect-square overflow-hidden cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => onCategoryClick(category.category)}
              style={{
                position: 'relative',
                marginTop: index % 2 === 0 ? '0' : '-2rem',
                zIndex: index
              }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all z-10"></div>
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-white text-3xl font-bright">{category.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;