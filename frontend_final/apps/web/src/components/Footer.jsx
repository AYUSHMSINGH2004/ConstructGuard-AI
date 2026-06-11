
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Mail } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  
  // Task 4: Show Only on Home Page
  if (location.pathname !== '/') {
    return null;
  }

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analysis', path: '/analysis' },
    { name: 'About', path: '/about' },
    { name: 'Defect Guide', path: '/defect-guide' }
  ];

  return (
    <footer className="mt-24 border-t border-white/10 bg-black/20 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary-light))/0.2] to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-[var(--radius)] gradient-primary flex items-center justify-center premium-shadow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">ConstructGuard AI</span>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
              Premium enterprise-grade structural defect detection for safer buildings and intelligent inspections.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-base text-muted-foreground hover:text-[hsl(var(--accent-blue))] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">Contact Information</h3>
            <div className="space-y-4">
              <a 
                href="mailto:ayushmsingh2004@gmail.com"
                className="flex items-center gap-3 text-base text-muted-foreground hover:text-[hsl(var(--accent-blue))] transition-colors duration-200 group"
              >
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <Mail className="w-4 h-4 text-[hsl(var(--accent-blue))]" />
                </div>
                <span>ayushmsingh2004@gmail.com</span>
              </a>
              <a 
                href="mailto:venkatasriramt@gmail.com"
                className="flex items-center gap-3 text-base text-muted-foreground hover:text-[hsl(var(--accent-blue))] transition-colors duration-200 group"
              >
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <Mail className="w-4 h-4 text-[hsl(var(--accent-blue))]" />
                </div>
                <span>venkatasriramt@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-sm font-medium text-muted-foreground text-center tracking-wide">
            © 2026 ConstructGuard AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
