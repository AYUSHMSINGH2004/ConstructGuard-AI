import React, { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import Header from '@/components/Header.jsx';
import SettingsModal from '@/components/SettingsModal.jsx';
import HomePage from '@/pages/HomePage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import DefectGuidePage from '@/pages/DefectGuidePage.jsx';
import AnalysisPage from '@/pages/AnalysisPage.jsx';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const handleOpenSettingsEvent = () => setIsSettingsOpen(true);
    window.addEventListener('open-settings', handleOpenSettingsEvent);
    
    return () => {
      window.removeEventListener('open-settings', handleOpenSettingsEvent);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      
      <Header isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen} />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/defect-guide" element={<DefectGuidePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      
      <Toaster />
    </Router>
  );
}

export default App;