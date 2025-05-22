import React from 'react';
import { motion } from 'framer-motion';

const StarField = () => {
  const stars = Array.from({ length: 50 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 2 + Math.random() * 3,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
    />
  ));

  return <div className="fixed inset-0 pointer-events-none">{stars}</div>;
};

export default StarField;
