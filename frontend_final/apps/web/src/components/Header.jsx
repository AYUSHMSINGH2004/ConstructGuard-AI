
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = ({ isSettingsOpen, setIsSettingsOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Defect Guide', path: '/defect-guide' },
    { name: 'Analysis', path: '/analysis' }
  ];

  const mobileLinks = [...navLinks];

  const isActive = (path) => location.pathname === path;

  // Fallback to custom event if Header is rendered from a page component without props
  const handleOpenSettings = () => {
    if (typeof setIsSettingsOpen === 'function') {
      setIsSettingsOpen(true);
    } else {
      window.dispatchEvent(new CustomEvent('open-settings'));
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass premium-shadow border-t-0 border-l-0 border-r-0 rounded-none' 
          : 'bg-transparent border-b border-transparent'
      }`}
      style={{
        background: isScrolled ? 'linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.85) 100%)' : 'transparent'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-[var(--radius)] gradient-primary flex items-center justify-center premium-shadow group-hover:scale-105 transition-transform duration-300">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight group-hover:text-[hsl(var(--accent-blue))] transition-colors duration-300">
              ConstructGuard AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors relative py-2 ${
                  isActive(link.path)
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--accent-blue))] rounded-full premium-shadow"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleOpenSettings}
              className="text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 border border-transparent hover:border-white/10"
              aria-label="Open Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleOpenSettings}
              className="text-muted-foreground hover:text-white rounded-full transition-colors"
              aria-label="Open Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-white transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10 overflow-hidden rounded-none"
          >
            <div className="px-4 py-4 space-y-2">
              {mobileLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-white/10 text-white premium-border'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
