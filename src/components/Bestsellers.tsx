import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BestsellersProps {
  onItemClick: () => void;
}

const Bestsellers: React.FC<BestsellersProps> = ({ onItemClick }) => {
  const bestsellers = [
    {
      id: 1,
      image:
        'https://jayatri.my.canva.site/glow/_assets/media/4ecf593dbe67b748f62176d245559aac.jpg',
      alt: 'Lipstick',
    },
    {
      id: 2,
      image:
        'https://jayatri.my.canva.site/glow/_assets/media/087bde5b68bf14ef23690d25f1e83fc3.jpg',
      alt: 'Makeup brushes',
    },
    {
      id: 3,
      image:
        'https://jayatri.my.canva.site/glow/_assets/media/809213e13e1def088e64ed20d2548601.jpg',
      alt: 'Palette',
    },
    {
      id: 4,
      image:
        'https://jayatri.my.canva.site/glow/_assets/media/86cdcff27e15da5980fca04349b6449f.jpg',
      alt: 'Products',
    },
    {
      id: 5,
      image:
        'https://jayatri.my.canva.site/glow/_assets/media/cc585429b5217eca24ee1b2dd63f7c3d.jpg',
    },
    {
      id: 6,
      image:
        'https://jayatri.my.canva.site/glow/_assets/media/76b4a586e9d865a7d1d77a2f1825ad96.jpg',
    },
    { id: 7, image: 'https://www.svgrepo.com/show/402023/kiss-mark.svg' },
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    triggerOnce: false,
    margin: '-100px 0px',
  });

  return (
    <section
      ref={sectionRef}
      className='py-16 px-4 bg-mauve-100 relative flex items-center justify-center'>
      <div className='relative m-10 min-h-[500px] best'>
        <motion.h2
          className='absolute text-[80px] z-[90] -left-[580px] -top-[25px]'
          style={{ fontFamily: 'dorris', fontWeight: '600' }}
          initial={{ opacity: 0, x: -100 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 1, ease: 'easeInOut' }}>
          BestSellers
        </motion.h2>

        <motion.div
          className='w-[440px] h-[540px] overflow-hidden absolute -left-[550px] top-10 z-50'
          initial={{ opacity: 0, x: -100 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 0.7, delay: 0.2 }}>
          <img
            src={bestsellers[0].image}
            alt='1'
            className='absolute -top-10 left-1/2 transform -translate-x-1/2'
          />
        </motion.div>

        <motion.div
          className='w-[300px] h-[300px] absolute overflow-hidden -left-[125px] -top-[70px] z-30'
          initial={{ opacity: 0, x: -100 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 0.7, delay: 0.4 }}>
          <img
            src={bestsellers[1].image}
            alt='2'
            className='object-cover absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'
          />
        </motion.div>

        <motion.div
          className='w-[300px] h-[350px] top-[170px] absolute overflow-hidden -left-[170px] z-40'
          initial={{ opacity: 0, x: -100 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 0.7, delay: 0.6 }}>
          <img
            src={bestsellers[2].image}
            alt='3'
            className='w-[200%] h-[125%] object-cover absolute left-1/2 transform -translate-x-1/2'
          />
        </motion.div>

        <motion.div
          className='w-[250px] h-[280px] absolute overflow-hidden -top-[80px] left-[128px]'
          initial={{ opacity: 0, x: -100 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 0.7, delay: 0.8 }}>
          <img
            src={bestsellers[3].image}
            alt='4'
            className='object-cover absolute left-1/2 -top-[70px] transform -translate-x-1/2'
          />
        </motion.div>

        <motion.div
          className='w-[250px] h-[320px] absolute overflow-hidden z-50 left-[305px] top-[35px]'
          initial={{ opacity: 0, x: -100 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 0.7, delay: 1.0 }}>
          <img
            src={bestsellers[4].image}
            alt='5'
            className='object-cover absolute left-1/2 -top-[40px] transform -translate-x-1/2'
          />
        </motion.div>

        <motion.div
          className='w-[515px] h-[235px] overflow-hidden absolute z-40 top-[320px] left-[90px]'
          initial={{ opacity: 0, x: -100 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 0.7, delay: 1.2 }}>
          <img
            src={bestsellers[5].image}
            alt='6'
            className='absolute -top-10 left-1/2 transform -translate-x-1/2'
          />
        </motion.div>

        <motion.div
          className='absolute z-50 w-[70px] h-[70px] top-[170px] left-[200px]'
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          transition={{ duration: 0.5, ease: 'easeOut', delay: 1.4 }}>
          <img src={bestsellers[6].image} alt='kiss' />
        </motion.div>
      </div>
    </section>
  );
};

export default Bestsellers;
