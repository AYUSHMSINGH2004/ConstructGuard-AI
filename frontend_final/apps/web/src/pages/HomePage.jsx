
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, Target, FileText, Database, Upload, Scan, 
  FileCheck, Download, Zap, Droplets, Layers, AlertTriangle,
  CheckCircle2, ArrowRight
} from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FeatureCard from '@/components/FeatureCard.jsx';
import StepCard from '@/components/StepCard.jsx';
import DefectCard from '@/components/DefectCard.jsx';
import StatCounter from '@/components/StatCounter.jsx';

const HomePage = () => {
  const features = [
    {
      icon: Brain,
      title: 'Deep Learning Vision',
      description: 'Enterprise-grade neural networks trained on proprietary datasets to identify minute structural anomalies.'
    },
    {
      icon: Target,
      title: 'Precision Accuracy',
      description: 'Cascaded architecture consistently achieves 76%+ verification confidence across all diagnostic classes.'
    },
    {
      icon: FileText,
      title: 'Automated Diagnostics',
      description: 'Generates detailed PDF engineering reports with severity mapping and remediation blueprints in seconds.'
    },
    {
      icon: Database,
      title: 'Explainable AI (GradCAM)',
      description: 'Advanced visualization highlights the exact structural regions influencing predictions, providing transparency, interpretability, and increased confidence in AI-assisted defect assessment.'
    }
  ];

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: 'Asset Ingestion',
      description: 'Securely upload high-resolution structural imagery via our encrypted portal.'
    },
    {
      number: 2,
      icon: Scan,
      title: 'AI Processing',
      description: 'Proprietary vision models parse surface layers and compute structural integrity vectors.'
    },
    {
      number: 3,
      icon: FileCheck,
      title: 'Defect Mapping',
      description: 'System tags anomalies, assigns severity indices, and calculates statistical confidence.'
    },
    {
      number: 4,
      icon: Download,
      title: 'Diagnostic Output',
      description: 'Export production-ready documentation for engineering teams and stakeholders.'
    }
  ];

  const defectCategories = [
    { icon: AlertTriangle, name: 'Major fracture', description: 'Deep structural separation requiring immediate engineering assessment.', riskLevel: 'Critical', href: '/defect-guide#major-crack' },
    { icon: Zap, name: 'Hairline stress', description: 'Superficial tension indications that warrant periodic observation.', riskLevel: 'Medium', href: '/defect-guide#minor-crack' },
    { icon: Droplets, name: 'Fungal colonies', description: 'Biological markers of sustained moisture intrusion.', riskLevel: 'High', href: '/defect-guide#mold' },
    { icon: Layers, name: 'Algal growth', description: 'Exterior biological accumulation common in shaded, damp zones.', riskLevel: 'Medium', href: '/defect-guide#algae' },
    { icon: Droplets, name: 'Active seepage', description: 'Direct fluid penetration compromising envelope integrity.', riskLevel: 'High', href: '/defect-guide#water-seepage' },
    { icon: AlertTriangle, name: 'Concrete spalling', description: 'Material displacement exposing structural reinforcement elements.', riskLevel: 'Critical', href: '/defect-guide#spalling' },
    { icon: Layers, name: 'Coating failure', description: 'Adhesion breakdown of protective surface treatments.', riskLevel: 'Low', href: '/defect-guide#peeling-paint' },
    { icon: Droplets, name: 'Chemical staining', description: 'Surface discoloration indicating oxidation or mineral efflorescence.', riskLevel: 'Medium', href: '/defect-guide#stains' },
    { icon: CheckCircle2, name: 'Verified baseline', description: 'Surface analyzed with zero detected structural compromises.', riskLevel: 'Low', href: '/defect-guide#healthy-surface' }
  ];

  return (
    <>
      <Helmet>
        <title>ConstructGuard AI | Enterprise Structural Intelligence</title>
        <meta name="description" content="Next-generation structural defect classification using proprietary deep learning architectures." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
          {/* Refined Ambient Glows */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--accent-blue))]/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[hsl(var(--accent-violet))]/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-white/10 mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-[hsl(var(--accent-blue))]"></span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform Release 2.0</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] mb-6 tracking-tight text-balance">
                  ConstructGuard <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--accent-blue))] to-[hsl(var(--accent-violet))]">AI</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-[60ch]">
                  Deploy enterprise-grade computer vision to classify architectural defects instantly. Secure, accurate, and scalable diagnostic reporting for engineering teams.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/analysis" className="w-full sm:w-auto">
                    <button className="w-full gradient-primary px-8 py-4 rounded-xl text-base font-bold shadow-lg flex items-center justify-center gap-2 group">
                      Launch Diagnostics
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link to="/about" className="w-full sm:w-auto">
                    <button className="w-full glass px-8 py-4 rounded-xl text-base font-bold text-foreground hover:bg-white/10 transition-colors border border-white/10">
                      Technical Architecture
                    </button>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-3xl font-extrabold text-foreground mb-1">76<span className="text-[hsl(var(--accent-blue))]">%</span></span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Precision</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-extrabold text-foreground mb-1">9</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Classifiers</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-extrabold text-foreground mb-1">&lt;15<span className="text-[hsl(var(--accent-blue))]">s</span></span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Latency</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative hidden lg:block"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--accent-blue))]/20 to-[hsl(var(--accent-violet))]/20 rounded-2xl blur-xl"></div>
                <div className="glass rounded-2xl overflow-hidden premium-shadow relative z-10 border border-white/10 p-2">
                  <img
                    src="https://images.unsplash.com/photo-1643125830582-d96afbee5adc"
                    alt="Civil engineer reviewing architectural defect patterns"
                    className="w-full h-auto rounded-xl object-cover"
                  />
                  
                  {/* Floating UI Elements */}
                  <div className="absolute top-8 -left-6 glass px-4 py-3 rounded-xl flex items-center gap-3 premium-shadow border border-white/10 animate-bounce" style={{ animationDuration: '4s' }}>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-sm font-bold text-white">System Active</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 tracking-tight text-balance">
                Enterprise Infrastructure
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Purpose-built AI models designed exclusively for structural engineering applications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-black/20 border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 tracking-tight text-balance">
                Diagnostic Pipeline
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Frictionless ingestion to actionable intelligence in four streamlined phases.
              </p>
            </div>

            <div className="max-w-3xl mx-auto flex flex-col items-center">
              {steps.map((step, index) => (
                <StepCard key={index} {...step} isLast={index === steps.length - 1} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 tracking-tight text-balance">
                  Taxonomy Index
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our models are trained to categorize structural degradation into nine specific, actionable classes.
                </p>
              </div>
              <Link to="/defect-guide">
                <button className="glass px-6 py-3 rounded-lg text-sm font-bold text-foreground hover:bg-white/10 transition-colors border border-white/10 whitespace-nowrap">
                  View Full Guide
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {defectCategories.map((defect, index) => (
                <DefectCard key={index} {...defect} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-black/20 border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 tracking-tight text-balance">
                Platform Telemetry
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCounter end={76} suffix="%" label="Verification Confidence" />
              <StatCounter end={9} label="Diagnostic Classes" />
              <StatCounter end={7808} suffix="+" label="Assets Processed" />
              <StatCounter end={15} prefix="<" suffix="s" label="Computation Latency" />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
