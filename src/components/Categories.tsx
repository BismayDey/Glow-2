import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface CategoriesProps {
  onCategoryClick: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onCategoryClick }) => {
  const categories = [
    {
      id: 1,
      name: "Eyes",
      image:
        "https://jayatri.my.canva.site/glow/_assets/media/985c1e9406773b1760cdd99e813de1ff.jpg",
      category: "Makeup",
    },
    {
      id: 2,
      name: "Skincare",
      image: "https://i.postimg.cc/63QHgddS/images-2.jpg",
      category: "Skincare",
    },
    {
      id: 3,
      name: "Face",
      image:
        "https://jayatri.my.canva.site/glow/_assets/media/f2ea56a44bdc9ba1edeef55d5f5cf95a.jpg",
      category: "Makeup",
    },
    {
      id: 4,
      name: "Lips",
      image:
        "https://jayatri.my.canva.site/glow/_assets/media/418aeff29f3ef74441e5f3f1d5555e2a.jpg",
      category: "Makeup",
    },
    {
      id: 5,
      name: "Nails",
      image:
        "https://jayatri.my.canva.site/glow/_assets/media/e905c6762ec50ba6bcf8773c9109606a.jpg",
      category: "Tools",
    },
    { id: 6, image: "https://www.svgrepo.com/show/402023/kiss-mark.svg" },
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    triggerOnce: false,
    margin: "-100px 0px",
  });

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 bg-mauve-300 relative flex items-center justify-center"
    >
      <div className="relative m-10 min-h-[350px] cat">
        <motion.h2
          className="absolute text-[80px] z-[90] -left-[540px] -top-[100px] ani2 text-nowrap"
          style={{ fontFamily: "dorris", fontWeight: "600" }}
          initial={{ opacity: 0, x: -100 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          Shop by Category
        </motion.h2>

        <div className="w-[80px] h-[80px] overflow-hidden absolute -left-[480px] -top-[25px] z-[90] rotate-[50deg] a3">
          <motion.img
            src={categories[5].image}
            alt="1"
            className="absolute left-1/2 transform -translate-x-1/2"
            initial={{ width: 0 }}
            animate={isInView ? { width: "100%" } : { width: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.1 }}
          />
        </div>

        {categories.slice(0, 5).map((category, index) => (
          <div key={category.id}>
            <motion.p
              className={`absolute text-white text-4xl ${
                index === 0 ? "-left-[510px] bottom-[25px]" : ""
              } ${index === 1 ? "-left-[157px] bottom-[180px]" : ""} ${
                index === 2 ? "left-[125px] bottom-[302px]" : ""
              } ${index === 3 ? "left-[75px] bottom-[60px]" : ""} ${
                index === 4 ? "left-[360px] bottom-[145px]" : ""
              } z-[90]`}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            >
              {category.name}
            </motion.p>

            <div
              className={`absolute overflow-hidden z-30 ${
                index === 0 ? "w-[240px] h-[310px] -left-[510px] top-[5px]" : ""
              } ${
                index === 1
                  ? "w-[270px] h-[390px] -left-[325px] top-[35px]"
                  : ""
              } ${
                index === 2
                  ? "w-[260px] h-[400px] -left-[80px] -top-[20px]"
                  : ""
              } ${
                index === 3 ? "w-[280px] h-[400px] left-[150px] top-[20px]" : ""
              } ${
                index === 4
                  ? "w-[270px] h-[450px] left-[280px] top-[180px]"
                  : ""
              }`}
            >
              <motion.img
                src={category.image}
                alt={category.name}
                className="absolute left-1/2 transform -translate-x-1/2"
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : { width: 0 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
