
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const StepCard = ({ number, icon: Icon, title, description, isLast = false, index = 0 }) => {
  return (
    <div className="relative w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        className="glass glass-hover p-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:space-x-6 gap-4 sm:gap-0">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-[var(--radius)] gradient-primary flex items-center justify-center text-2xl font-bold text-white premium-shadow">
              {number}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <Icon className="w-5 h-5 text-[hsl(var(--accent-blue))]" />
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight">{title}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
      </motion.div>
      
      {!isLast && (
        <div className="flex items-center justify-center my-6">
          <div className="p-3 rounded-full bg-white/5 border border-white/10 premium-shadow">
            <ArrowDown className="w-5 h-5 text-[hsl(var(--accent-blue))] animate-bounce" />
          </div>
        </div>
      )}
    </div>
  );
};

export default StepCard;
