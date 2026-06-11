
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const DefectCard = ({ icon: Icon, name, description, riskLevel, index = 0, href }) => {
  const navigate = useNavigate();
  
  const riskColors = {
    Critical: 'bg-destructive/20 text-destructive border border-destructive/30',
    High: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    Low: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
  };

  const handleClick = () => {
    if (href) {
      navigate(href);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={handleClick}
      className={`glass p-6 flex flex-col h-full ${
        href ? 'cursor-pointer glass-hover' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-[var(--radius)] gradient-primary flex items-center justify-center premium-shadow">
          <Icon className="w-6 h-6 text-white" />
        </div>
        {riskLevel && (
          <Badge className={`font-semibold tracking-wide ${riskColors[riskLevel] || riskColors.Low}`}>
            {riskLevel}
          </Badge>
        )}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">{name}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
    </motion.div>
  );
};

export default DefectCard;
