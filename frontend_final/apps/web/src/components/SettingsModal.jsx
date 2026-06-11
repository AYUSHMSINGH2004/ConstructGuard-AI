
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, AlertTriangle, CheckCircle, ExternalLink, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsModal = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) {
        setApiKey(savedKey);
        setHasKey(true);
      } else {
        setApiKey('');
        setHasKey(false);
      }
      setShowKey(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    const trimmedKey = apiKey.trim();
    
    if (trimmedKey) {
      localStorage.setItem('gemini_api_key', trimmedKey);
      setHasKey(true);
      toast({
        title: 'Configuration Updated',
        description: 'API Key saved successfully.',
      });
    } else {
      localStorage.removeItem('gemini_api_key');
      setHasKey(false);
      toast({
        title: 'Configuration Cleared',
        description: 'API Key removed.',
      });
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-[600px] overflow-hidden rounded-2xl glass premium-border premium-shadow"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--accent-blue))]/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[hsl(var(--accent-violet))]/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>

            <div className="relative p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <Settings className="w-5 h-5 text-[hsl(var(--accent-blue))]" />
                    </div>
                    <h2 id="modal-title" className="text-2xl font-bold text-foreground tracking-tight">
                      System Configuration
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium pl-11">
                    Manage AI authentication credentials
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 hover:rotate-90"
                  aria-label="Close settings modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* Input Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="apiKey" className="text-sm font-semibold text-foreground tracking-wide uppercase pl-1">
                      Gemini API Key
                    </label>
                    {hasKey ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5"/> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                        <AlertTriangle className="w-3.5 h-3.5"/> Required
                      </span>
                    )}
                  </div>
                  
                  <div className="relative w-full">
                    <input
                      id="apiKey"
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={handleInputChange}
                      placeholder="Enter API Key"
                      className="w-full h-14 pl-5 pr-14 premium-input text-base placeholder:text-muted-foreground/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[hsl(var(--accent-blue))] transition-colors p-2 rounded-xl hover:bg-white/5"
                      aria-label={showKey ? "Hide API Key" : "Show API Key"}
                    >
                      {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Info Text */}
                <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Obtain your access token from the{' '}
                    <a 
                      href="https://aistudio.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-cyan))] font-medium inline-flex items-center gap-1 transition-colors group"
                    >
                      Google AI Studio platform
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>.
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Credentials are encrypted and stored locally. Never shared with third parties.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-[var(--radius)] text-sm font-semibold text-muted-foreground hover:bg-white/5 hover:text-white transition-colors border border-transparent hover:border-white/10"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="gradient-primary px-8 py-2.5 rounded-[var(--radius)] text-sm font-bold shadow-lg flex items-center justify-center min-w-[140px]"
                  >
                    Save Configuration
                  </button>
                </div>
                
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
