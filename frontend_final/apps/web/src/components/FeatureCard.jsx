
import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass glass-hover p-8 h-full flex flex-col items-start"
    >
      <div className="w-14 h-14 rounded-[var(--radius)] gradient-primary flex items-center justify-center mb-6 premium-shadow">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed flex-1">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
