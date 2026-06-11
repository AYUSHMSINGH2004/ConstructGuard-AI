
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Key, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('gemini_api_key', apiKey);
    
    toast({
      title: 'Success',
      description: 'API Key saved successfully.',
    });
  };

  return (
    <>
      <Helmet>
        <title>Settings - ConstructGuard AI</title>
        <meta name="description" content="Manage your API configuration and system settings." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 pt-32 pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
                Settings
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your system configuration and preferences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-effect rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center space-x-3 mb-6 border-b border-border/50 pb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-teal-purple flex items-center justify-center glow-teal">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Gemini API Configuration</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your Gemini API key to enable AI-powered features.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="apiKey" className="text-foreground text-base">Gemini API Key</Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy................................"
                      className="pr-12 bg-background/50 border-border text-foreground placeholder:text-muted-foreground h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      aria-label={showKey ? "Hide API Key" : "Show API Key"}
                    >
                      {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SettingsPage;
