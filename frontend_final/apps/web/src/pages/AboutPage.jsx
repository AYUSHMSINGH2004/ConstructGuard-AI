
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, Eye, Shield, Zap, TrendingUp,
  ShieldCheck, Layers, Search, FileText, Maximize2, X, Database
} from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FeatureCard from '@/components/FeatureCard.jsx';

// Reusable Table Component for Dataset Section
const DatasetTable = ({ title, data }) => (
  <div className="glass rounded-xl overflow-hidden premium-shadow flex flex-col h-full">
    <div className="bg-white/5 px-6 py-4 border-b border-white/10">
      <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">{title}</h3>
    </div>
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5">
            <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Classification</th>
            <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Samples</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, index) => (
            <tr key={index} className={`${row.isTotal ? 'bg-white/5' : 'hover:bg-white/[0.02]'} transition-colors`}>
              <td className={`px-6 py-4 text-sm ${row.isTotal ? 'font-bold text-[hsl(var(--accent-blue))]' : 'font-medium text-foreground'}`}>
                {row.name}
              </td>
              <td className={`px-6 py-4 text-sm text-right tabular-nums ${row.isTotal ? 'font-bold text-[hsl(var(--accent-blue))]' : 'text-muted-foreground'}`}>
                {row.count.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AboutPage = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isLightboxOpen]);

  const prototypeSteps = [
    {
      step: 1,
      icon: ShieldCheck,
      title: 'Security Gatekeeping',
      desc: 'Gemini 2.5 Flash validates construction-related images.'
    },
    {
      step: 2,
      icon: Layers,
      title: 'Cascaded CNN Architecture',
      desc: 'Router Model forwards to Moisture/Structural Specialist Models.'
    },
    {
      step: 3,
      icon: Search,
      title: 'Explainable AI (XAI)',
      desc: 'GradCAM visualization highlights decision regions.'
    },
    {
      step: 4,
      icon: FileText,
      title: 'Generative Reporting',
      desc: 'Gemini 2.5 Flash creates engineering-style diagnostic reports with Executive Summary, Defect Description, Risk Assessment, Recommended Actions, Engineering Recommendations.'
    }
  ];

  const structuralDefects = [
    { name: "Major Crack", count: 593 },
    { name: "Minor Crack", count: 624 },
    { name: "Total Structural", count: 1217, isTotal: true }
  ];

  const moistureDefects = [
    { name: "Water Seepage", count: 177 },
    { name: "Mold", count: 192 },
    { name: "Algae", count: 609 },
    { name: "Stain", count: 521 },
    { name: "Total Moisture", count: 1499, isTotal: true }
  ];

  const surfaceDefects = [
    { name: "Peeling Paint", count: 776 },
    { name: "Spalling", count: 500 },
    { name: "Total Surface", count: 1276, isTotal: true }
  ];

  const healthyCondition = [
    { name: "Healthy Surface", count: 600 },
    { name: "Total Healthy", count: 600, isTotal: true }
  ];

  const routerLevel = [
    { name: "Healthy", count: 600 },
    { name: "Moisture", count: 1499 },
    { name: "Structural", count: 1717 },
    { name: "Surface", count: 776 },
    { name: "Total Images", count: 4592, isTotal: true }
  ];

  const finalSummary = [
    { name: "Training Dataset", count: 3677 },
    { name: "Validation Dataset", count: 915 }
  ];

  const technologies = [
    {
      icon: Brain,
      title: 'Cascaded Neural Networks',
      description: 'Multi-stage convolutional architectures trained on proprietary engineering datasets. Advanced feature extraction for micro-fracture and anomaly isolation.'
    },
    {
      icon: Sparkles,
      title: 'LLM Report Synthesis',
      description: 'Generative models parse visual vectors to draft authoritative diagnostic text, including root cause hypotheses and standard remediation protocol.'
    },
    {
      icon: Eye,
      title: 'Model Interpretability',
      description: 'GradCAM spatial mapping highlights exact pixel clusters influencing classification, ensuring absolute transparency in automated decisioning.'
    }
  ];

  const classificationReport = [
    { class: 'Algal growth', precision: 0.72, recall: 0.68, f1: 0.70, support: 105 },
    { class: 'Major fracture', precision: 0.81, recall: 0.75, f1: 0.78, support: 98 },
    { class: 'Hairline stress', precision: 0.75, recall: 0.80, f1: 0.77, support: 110 },
    { class: 'Fungal colonies', precision: 0.69, recall: 0.71, f1: 0.70, support: 95 },
    { class: 'Coating failure', precision: 0.78, recall: 0.74, f1: 0.76, support: 102 },
    { class: 'Verified baseline', precision: 0.85, recall: 0.88, f1: 0.86, support: 120 },
    { class: 'Concrete spalling', precision: 0.73, recall: 0.69, f1: 0.71, support: 90 },
    { class: 'Chemical staining', precision: 0.71, recall: 0.65, f1: 0.68, support: 95 },
    { class: 'Active seepage', precision: 0.77, recall: 0.76, f1: 0.76, support: 100 }
  ];

  const missionPoints = [
    {
      icon: Shield,
      title: 'Risk Mitigation',
      description: 'Preemptive anomaly detection prevents catastrophic failure cascades and secures long-term asset viability.'
    },
    {
      icon: Zap,
      title: 'Operational Velocity',
      description: 'Compress manual field inspection cycles from days to minutes, optimizing workforce allocation.'
    },
    {
      icon: Brain,
      title: 'Augmented Engineering',
      description: 'Statistical baselines and deterministic modeling provide engineers with verifiable secondary opinions.'
    },
    {
      icon: TrendingUp,
      title: 'Lifecycle Economics',
      description: 'Predictive analytics transition maintenance from reactive to proactive, drastically reducing capital expenditure.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Technical Architecture | ConstructGuard AI</title>
        <meta name="description" content="Explore the neural network architecture, validation metrics, and core technology behind our structural analysis platform." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col relative">
        <Header />

        <main className="flex-1">
          {/* HERO SECTION */}
          <section className="pt-32 pb-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[hsl(var(--accent-blue))]/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 pt-12"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-white/10 mb-8 mx-auto">
                  <Eye className="w-4 h-4 text-[hsl(var(--accent-blue))]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">System Architecture</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-8 tracking-tight text-balance max-w-4xl mx-auto">
                  Built on deterministic AI models.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  ConstructGuard AI integrates computer vision, large language models, and statistical interpretability modules for production-grade accuracy.
                </p>
              </motion.div>
            </div>
          </section>

          {/* NEW SECTION 2 & 3: PROTOTYPE SOLUTION & WORKFLOW DIAGRAM */}
          <section className="py-24 bg-black/20 border-y border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight">
                  Prototype Solution
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  End-to-end operational sequence from ingestion to reporting.
                </p>
              </motion.div>

              {/* Step Cards Layout */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                {/* Connecting Line (Desktop) */}
                <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>

                {prototypeSteps.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="relative z-10 flex flex-col"
                    >
                      <div className="glass p-6 rounded-2xl border border-white/10 premium-shadow flex-1 h-full flex flex-col group hover:border-[hsl(var(--accent-blue))]/30 transition-colors">
                        <div className="w-14 h-14 rounded-xl bg-[hsl(var(--accent-blue))]/10 border border-[hsl(var(--accent-blue))]/20 flex items-center justify-center mb-6 group-hover:bg-[hsl(var(--accent-blue))]/20 transition-colors shrink-0">
                          <Icon className="w-6 h-6 text-[hsl(var(--accent-blue))]" />
                        </div>
                        <div className="text-[10px] font-bold text-[hsl(var(--accent-blue))] uppercase tracking-widest mb-2">
                          Step 0{item.step}
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-auto">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* System Workflow Diagram Subsection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-extrabold text-foreground mb-8 tracking-tight border-b border-white/10 pb-4">
                  System Workflow Diagram
                </h3>
                
                <div className="max-w-5xl mx-auto flex flex-col items-center">
                  <div 
                    className="w-full glass p-2 rounded-2xl premium-shadow border border-white/10 relative group cursor-pointer overflow-hidden"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-sm">
                      <div className="flex items-center gap-2 bg-[hsl(var(--accent-blue))]/90 text-white px-4 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <Maximize2 className="w-4 h-4" />
                        <span>Enlarge Diagram</span>
                      </div>
                    </div>
                    <img 
                      src="https://horizons-cdn.hostinger.com/44c53d15-d884-43f1-bc08-5530aea59e44/1caad8df36bde90af229e7816a2f97ef.png" 
                      alt="Flowchart showing ConstructGuard AI cascaded analysis workflow" 
                      className="w-full h-auto object-cover rounded-xl bg-[#050B14]"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Figure: ConstructGuard AI End-to-End Cascaded Analysis Workflow
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* EXISTING SECTION: AI Models & Technology Stack */}
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight">
                  Stack Components
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  A multi-modal approach to defect processing.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {technologies.map((tech, index) => (
                  <FeatureCard key={index} {...tech} index={index} />
                ))}
              </div>
            </div>
          </section>

          {/* NEW SECTION 1: TRAINING DATASET */}
          <section className="py-24 bg-black/20 border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-[hsl(var(--accent-blue))]/30 bg-[hsl(var(--accent-blue))]/10 mb-6">
                  <Database className="w-4 h-4 text-[hsl(var(--accent-blue))]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--accent-blue))]">ConstructGuard_Cascaded</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight">
                  Training Dataset
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                  The model architecture relies on a specialized dataset comprising <strong className="text-foreground">7,808</strong> strictly curated structural images. The data is partitioned across multi-stage categorizations to support the cascaded design logic.
                </p>
              </motion.div>

              <div className="space-y-12">
                {/* Distribution Grid */}
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-6 border-b border-white/10 pb-4">Dataset Distribution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DatasetTable title="Structural Defects" data={structuralDefects} />
                    <DatasetTable title="Moisture-Related Defects" data={moistureDefects} />
                    <DatasetTable title="Surface Defects" data={surfaceDefects} />
                    <DatasetTable title="Healthy Condition" data={healthyCondition} />
                  </div>
                </div>

                {/* Router & Final Summaries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-6 border-b border-white/10 pb-4">Router-Level Categories</h3>
                    <DatasetTable title="Broad Pathways" data={routerLevel} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-6 border-b border-white/10 pb-4">Aggregate Output</h3>
                    <DatasetTable title="Aggregate Output" data={finalSummary} />
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* EXISTING SECTION: Model Evaluation Results */}
          <section className="py-24 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight">
                  Validation Telemetry
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Benchmark performance evaluated against strict engineering control sets.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-xl overflow-hidden mb-12 premium-shadow"
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-6 py-5 text-sm font-bold text-foreground tracking-wide uppercase">Taxonomy Class</th>
                        <th className="px-6 py-5 text-sm font-bold text-foreground tracking-wide uppercase text-center">Precision</th>
                        <th className="px-6 py-5 text-sm font-bold text-foreground tracking-wide uppercase text-center">Recall</th>
                        <th className="px-6 py-5 text-sm font-bold text-foreground tracking-wide uppercase text-center">F1-Score</th>
                        <th className="px-6 py-5 text-sm font-bold text-foreground tracking-wide uppercase text-center">Volume</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {classificationReport.map((row, index) => (
                        <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 text-sm font-semibold text-foreground">{row.class}</td>
                          <td className="px-6 py-4 text-sm text-center text-muted-foreground tabular-nums">
                            {row.precision.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-muted-foreground tabular-nums">
                            {row.recall.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-muted-foreground tabular-nums">
                            {row.f1.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-muted-foreground tabular-nums">
                            {row.support}
                          </td>
                        </tr>
                      ))}
                      
                      {/* Summary Rows */}
                      <tr className="border-t border-white/10 bg-white/5">
                        <td className="px-6 py-5 text-sm font-bold text-foreground">Global Accuracy</td>
                        <td colSpan={2}></td>
                        <td className="px-6 py-5 text-sm text-center font-extrabold text-[hsl(var(--accent-blue))] tabular-nums">
                          0.76
                        </td>
                        <td className="px-6 py-5 text-sm text-center font-medium text-muted-foreground tabular-nums">
                          915
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-xl p-6 flex flex-col premium-shadow"
                >
                  <div className="flex-1 bg-[#050B14] rounded-lg overflow-hidden mb-6 flex items-center justify-center p-2 border border-white/5">
                    <img 
                      src="https://horizons-cdn.hostinger.com/44c53d15-d884-43f1-bc08-5530aea59e44/6657ee55a0e765f1c1d4d5ba09eb3fed.jpg" 
                      alt="Confusion Matrix of Cascaded AI Model Validation Results" 
                      className="w-full h-auto max-h-[350px] object-contain rounded-md"
                    />
                  </div>
                  <p className="text-xs font-bold text-center text-muted-foreground tracking-wider uppercase">
                    Class-wise Matrix Distribution
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="glass rounded-xl p-6 flex flex-col premium-shadow"
                >
                  <div className="flex-1 bg-[#050B14] rounded-lg overflow-hidden mb-6 flex items-center justify-center p-2 border border-white/5">
                    <img 
                      src="https://horizons-cdn.hostinger.com/44c53d15-d884-43f1-bc08-5530aea59e44/0b9ac08571f2df592fdb822f961ffe76.jpg" 
                      alt="Kernel Density Estimation (KDE) Analysis of Model Performance" 
                      className="w-full h-auto max-h-[350px] object-contain rounded-md"
                    />
                  </div>
                  <p className="text-xs font-bold text-center text-muted-foreground tracking-wider uppercase">
                    Confidence Density Estimation
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* EXISTING SECTION: Strategic Mandate */}
          <section className="py-24 bg-black/20 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight">
                  Strategic Mandate
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Automating safety infrastructure.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {missionPoints.map((point, index) => (
                  <FeatureCard key={index} {...point} index={index} />
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />

        {/* Lightbox for System Workflow Diagram */}
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm"
              onClick={() => setIsLightboxOpen(false)}
            >
              <button 
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/20 text-white"
                onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
                aria-label="Close lightbox"
              >
                <X className="w-6 h-6" />
              </button>
              <motion.img
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                src="https://horizons-cdn.hostinger.com/44c53d15-d884-43f1-bc08-5530aea59e44/1caad8df36bde90af229e7816a2f97ef.png"
                alt="Flowchart showing ConstructGuard AI cascaded analysis workflow"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AboutPage;
