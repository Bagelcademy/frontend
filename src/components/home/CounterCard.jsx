import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';


const CounterCard = ({ icon: Icon, value, label, bgImage, gradient }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= value) {
                setCount(value);
                clearInterval(timer);
              } else {
                setCount(Math.floor(current));
              }
            }, duration / steps);
          }
        },
        { threshold: 0.1 }
      );
  
      if (countRef.current) {
        observer.observe(countRef.current);
      }
  
      return () => {
        if (countRef.current) {
          observer.unobserve(countRef.current);
        }
      };
    }, [value]);
  
    return (
      <motion.div
        ref={countRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group relative overflow-hidden rounded-2xl"
      >
        {/* Background Layer */}
        <div 
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: bgImage ? `url(${bgImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Gradient Overlay */}
        <div 
          className={`absolute inset-0 ${gradient || 'bg-gradient-to-r from-blue-500/90 to-purple-600/90'} 
          transition-opacity duration-300 group-hover:opacity-95`}
        />
  
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center p-8 backdrop-blur-sm">
          <div className="mb-4 p-4 rounded-full bg-white/20 backdrop-blur-sm transform transition-transform duration-300 group-hover:scale-110">
            <Icon className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-5xl font-bold text-white mb-2 transition-transform duration-300 group-hover:-translate-y-1">
            {count.toLocaleString()}+
          </h3>
          
          <p className="text-white/90 text-lg font-medium">
            {label}
          </p>
  
          {/* Decorative Elements */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        </div>
      </motion.div>
    );
  };

  export default CounterCard;