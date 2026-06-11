
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { AlertTriangle, Droplets, Layers, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const DefectGuidePage = () => {
  const [openItems, setOpenItems] = useState([]);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setOpenItems((prev) => [...prev, hash]);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, []);

  const handleAccordionChange = (values) => {
    setOpenItems(values);
  };

  const structuralDefects = [
    {
      id: 'major-crack',
      name: 'Major crack',
      description: 'Structural cracks wider than 3mm that penetrate through the full depth of concrete or masonry. These indicate serious structural movement, foundation settlement, or load-bearing capacity issues.',
      symptoms: 'Wide visible gaps, stepped patterns in masonry, horizontal cracks in walls, vertical cracks near corners, displacement of structural elements.',
      precautions: 'Immediate structural assessment required. Avoid loading affected areas. Monitor crack width progression. Install crack gauges for ongoing measurement.',
      treatment: 'Structural engineer evaluation mandatory. May require epoxy injection, carbon fiber reinforcement, underpinning, or partial reconstruction depending on severity and location.'
    },
    {
      id: 'minor-crack',
      name: 'Minor crack',
      description: 'Surface-level cracks less than 3mm wide, typically caused by shrinkage, thermal expansion, or minor settlement. While not immediately critical, these can progress if left untreated.',
      symptoms: 'Hairline fractures, surface crazing, isolated cracks in plaster or render, non-progressive patterns.',
      precautions: 'Document crack locations and widths. Monitor for progression over 3-6 months. Check for moisture ingress through cracks.',
      treatment: 'Clean and fill with flexible sealant or epoxy filler. Apply waterproof coating if exterior. Address underlying moisture or movement issues to prevent recurrence.'
    }
  ];

  const moistureDefects = [
    {
      id: 'water-seepage',
      name: 'Water seepage',
      description: 'Active moisture penetration through building envelope due to failed waterproofing, damaged membranes, or hydrostatic pressure. Leads to structural deterioration and secondary defects.',
      symptoms: 'Damp patches, efflorescence, water staining, peeling paint, musty odors, visible water entry during rain.',
      precautions: 'Identify and stop water source immediately. Improve drainage and ventilation. Remove wet materials to prevent mold growth.',
      treatment: 'Repair waterproofing membranes, seal cracks and joints, install drainage systems, apply crystalline waterproofing, improve surface grading and gutters.'
    },
    {
      id: 'mold',
      name: 'Mold',
      description: 'Fungal growth resulting from prolonged moisture exposure and poor ventilation. Health hazard requiring prompt remediation. Indicates underlying moisture problems.',
      symptoms: 'Black, green, or white patches, musty smell, respiratory irritation, visible spores, growth on organic materials.',
      precautions: 'Wear protective equipment during inspection. Improve ventilation immediately. Reduce indoor humidity below 60%. Fix water leaks promptly.',
      treatment: 'Remove contaminated materials if porous. Clean hard surfaces with antimicrobial solution. Fix moisture source. Install dehumidifiers and improve ventilation. Professional remediation for extensive growth.'
    },
    {
      id: 'algae',
      name: 'Algae',
      description: 'Photosynthetic organisms growing on exterior surfaces exposed to moisture and sunlight. Primarily aesthetic issue but indicates persistent dampness.',
      symptoms: 'Green or brown discoloration on exterior walls, slippery surfaces, growth in shaded damp areas.',
      precautions: 'Improve drainage away from walls. Trim vegetation to increase sunlight exposure. Ensure proper roof drainage.',
      treatment: 'Pressure wash with biocide solution. Apply algae-resistant coating. Improve surface drainage. Increase air circulation around affected areas.'
    },
    {
      id: 'stains',
      name: 'Stains',
      description: 'Discoloration from water damage, rust bleeding, chemical reactions, or organic matter. May indicate active or historical moisture issues requiring investigation.',
      symptoms: 'Brown, yellow, or rust-colored marks, irregular patterns, concentrated near joints or penetrations.',
      precautions: 'Determine if staining is active or historical. Check for ongoing moisture sources. Test for efflorescence or mineral deposits.',
      treatment: 'Clean with appropriate solution based on stain type. Seal source of staining. Apply stain-blocking primer before repainting. Address underlying moisture or corrosion issues.'
    }
  ];

  const surfaceDefects = [
    {
      id: 'peeling-paint',
      name: 'Peeling paint',
      description: 'Coating failure where paint separates from substrate due to moisture, poor surface preparation, incompatible products, or age. Exposes substrate to further deterioration.',
      symptoms: 'Flaking, blistering, curling edges, loss of adhesion, exposed substrate beneath.',
      precautions: 'Remove loose paint to prevent further delamination. Protect exposed areas from moisture. Test remaining paint for lead if building pre-1978.',
      treatment: 'Scrape and sand to sound surface. Prime bare substrate. Address moisture issues before repainting. Use compatible paint systems. Ensure proper surface preparation and drying time.'
    },
    {
      id: 'spalling',
      name: 'Spalling',
      description: 'Concrete deterioration where surface layers flake or break away, often exposing reinforcement. Caused by corrosion, freeze-thaw cycles, or chemical attack. Accelerates structural degradation.',
      symptoms: 'Surface flaking, exposed aggregate, visible rebar, rust staining, hollow sound when tapped.',
      precautions: 'Remove loose concrete immediately. Protect exposed rebar from further corrosion. Assess extent of reinforcement corrosion.',
      treatment: 'Remove deteriorated concrete to sound substrate. Clean and treat corroded rebar. Apply corrosion inhibitor. Patch with polymer-modified repair mortar. Apply protective coating to prevent recurrence.'
    }
  ];

  const healthyConditions = [
    {
      id: 'healthy-surface',
      name: 'Healthy Surface',
      description: 'A structurally sound surface with no visible defects, moisture damage, biological growth, cracks, or deterioration.',
      symptoms: 'No visible cracks, no moisture intrusion, no biological growth, intact paint and finish, good structural condition.',
      precautions: 'Monitor environmental exposure, maintain drainage systems.',
      treatment: 'Continue routine inspections, perform preventive maintenance.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Defect guide - ConstructGuard AI</title>
        <meta name="description" content="Comprehensive guide to structural defects including symptoms, precautions, and treatment recommendations for cracks, moisture damage, and surface deterioration." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6" style={{ letterSpacing: '-0.02em' }}>
                Structural defect guide
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Detailed information on defect types, symptoms, prevention strategies, and treatment recommendations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-12"
            >
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-teal-purple flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Structural defects</h2>
                </div>
                <Accordion type="multiple" value={openItems} onValueChange={handleAccordionChange} className="space-y-4">
                  {structuralDefects.map((defect) => (
                    <AccordionItem key={defect.id} id={defect.id} value={defect.id} className="glass-effect rounded-xl border-0 overflow-hidden scroll-mt-24">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30 transition-colors">
                        <span className="text-lg font-semibold text-foreground">{defect.name}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4 text-muted-foreground">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                            <p className="text-sm leading-relaxed">{defect.description}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Symptoms / Characteristics</h4>
                            <p className="text-sm leading-relaxed">{defect.symptoms}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Precautions / Prevention</h4>
                            <p className="text-sm leading-relaxed">{defect.precautions}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Treatment / Maintenance</h4>
                            <p className="text-sm leading-relaxed">{defect.treatment}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-teal-purple flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Moisture-related defects</h2>
                </div>
                <Accordion type="multiple" value={openItems} onValueChange={handleAccordionChange} className="space-y-4">
                  {moistureDefects.map((defect) => (
                    <AccordionItem key={defect.id} id={defect.id} value={defect.id} className="glass-effect rounded-xl border-0 overflow-hidden scroll-mt-24">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30 transition-colors">
                        <span className="text-lg font-semibold text-foreground">{defect.name}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4 text-muted-foreground">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                            <p className="text-sm leading-relaxed">{defect.description}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Symptoms / Characteristics</h4>
                            <p className="text-sm leading-relaxed">{defect.symptoms}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Precautions / Prevention</h4>
                            <p className="text-sm leading-relaxed">{defect.precautions}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Treatment / Maintenance</h4>
                            <p className="text-sm leading-relaxed">{defect.treatment}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-teal-purple flex items-center justify-center">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Surface defects</h2>
                </div>
                <Accordion type="multiple" value={openItems} onValueChange={handleAccordionChange} className="space-y-4">
                  {surfaceDefects.map((defect) => (
                    <AccordionItem key={defect.id} id={defect.id} value={defect.id} className="glass-effect rounded-xl border-0 overflow-hidden scroll-mt-24">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30 transition-colors">
                        <span className="text-lg font-semibold text-foreground">{defect.name}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4 text-muted-foreground">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                            <p className="text-sm leading-relaxed">{defect.description}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Symptoms / Characteristics</h4>
                            <p className="text-sm leading-relaxed">{defect.symptoms}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Precautions / Prevention</h4>
                            <p className="text-sm leading-relaxed">{defect.precautions}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Treatment / Maintenance</h4>
                            <p className="text-sm leading-relaxed">{defect.treatment}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-teal-purple flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Healthy condition</h2>
                </div>
                <Accordion type="multiple" value={openItems} onValueChange={handleAccordionChange} className="space-y-4">
                  {healthyConditions.map((condition) => (
                    <AccordionItem key={condition.id} id={condition.id} value={condition.id} className="glass-effect rounded-xl border-0 overflow-hidden scroll-mt-24">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30 transition-colors">
                        <span className="text-lg font-semibold text-foreground">{condition.name}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4 text-muted-foreground">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                            <p className="text-sm leading-relaxed">{condition.description}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Symptoms / Characteristics</h4>
                            <p className="text-sm leading-relaxed">{condition.symptoms}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Precautions / Prevention</h4>
                            <p className="text-sm leading-relaxed">{condition.precautions}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Treatment / Maintenance</h4>
                            <p className="text-sm leading-relaxed">{condition.treatment}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default DefectGuidePage;
