
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Upload, Image as ImageIcon, AlertTriangle, Info, 
  FileText, CheckCircle2, Clock, RefreshCw, 
  Loader2, ListChecks, ShieldCheck, Download, AlertCircle, 
  ArrowRight, ShieldAlert, ClipboardList, Zap, Search, 
  Wrench, ShieldPlus, PenTool
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { analyzeDefectWithBackend } from '@/hooks/useGeminiAPI.js';

const AnalysisGuidelines = () => {
  const guidelines = [
    "Ensure image is well-lit using natural or even artificial light.",
    "Avoid blurry shots; maintain sharp focus on the structural surface.",
    "Center the primary defect clearly within the camera frame.",
    "Include surrounding context (avoid extreme close-ups without baseline).",
    "Shoot perpendicular to the surface to minimize perspective distortion.",
    "Minimize harsh shadows, glare, or reflections on the target area.",
    "Crack Detection: Capture both ends of the fracture if possible.",
    "Water Seepage: Ensure moisture boundaries or stains are visible.",
    "Keep the line of sight clear of physical obstructions.",
    "Maintain an optimal capture distance of 1 to 2 meters.",
    "Use high-resolution image sensors (1080p minimum recommended).",
    "Supported formats exclusively: JPG, JPEG, and PNG."
  ];

  const categories = [
    "Algae", "Mold", "Major Crack", "Minor Crack", "Peeling Paint", 
    "Spalling", "Stain", "Water Seepage", "Healthy Surface"
  ];

  return (
    <div className="glass rounded-2xl p-6 premium-shadow border border-white/10 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[hsl(var(--accent-blue))]/10 rounded-full blur-2xl"></div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent-blue))]/10 flex items-center justify-center border border-[hsl(var(--accent-blue))]/20">
          <Info className="w-5 h-5 text-[hsl(var(--accent-blue))]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground tracking-wide">Analysis Guidelines</h2>
          <p className="text-xs text-muted-foreground">Guidelines for Best Results</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <ListChecks className="w-3.5 h-3.5 text-muted-foreground" /> Capture Protocol
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1">
            {guidelines.map((text, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-[10px] font-bold text-[hsl(var(--accent-blue))] bg-[hsl(var(--accent-blue))]/10 w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" /> Supported Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <span key={i} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-1 rounded-md">
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[hsl(var(--accent-blue))]/10 border border-[hsl(var(--accent-blue))]/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[hsl(var(--accent-blue))] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-[hsl(var(--accent-blue))] uppercase tracking-wider mb-1">Important Notice</h4>
            <p className="text-[10px] text-[hsl(var(--accent-blue))]/80 leading-relaxed">
              AI-assisted diagnostics provide statistical probabilities based on visual vectors. Final structural validation and remediation planning must be conducted by licensed engineering professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalysisPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Workflow States: 'idle' | 'analyzing' | 'complete' | 'error' | 'validation_failed'
  const [workflowState, setWorkflowState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  
  const [predictionResult, setPredictionResult] = useState(null);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [reportStatus, setReportStatus] = useState('pending'); // 'pending', 'success', 'warning'
  
  const { toast } = useToast();

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid format',
          description: 'System strictly requires JPG, PNG, or JPEG visual data.',
          variant: 'destructive'
        });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      resetAnalysis();
    }
  };

  const resetAnalysis = () => {
    setWorkflowState('idle');
    setErrorMessage('');
    setValidationMessage('');
    setPredictionResult(null);
    setGeneratedReport(null);
    setReportStatus('pending');
  };

  const handleResetAll = () => {
    resetAnalysis();
    setSelectedImage(null);
    setImagePreview(null);
  };

  const executeAnalysisFlow = async () => {
    if (!selectedImage) return;

    const apiKey = localStorage.getItem('gemini_api_key') || '';

    if (!apiKey) {
      setErrorMessage('Gemini API key missing. Open Settings and save your key first.');
      setWorkflowState('error');
      return;
    }

    const startTime = Date.now();
    const analysisId = `CG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    try {
      setWorkflowState('analyzing');
      setReportStatus('pending');

      // CASE 3: Prediction Fails Completely
      let backendResult;
      try {
        backendResult = await analyzeDefectWithBackend(selectedImage, apiKey);
      } catch (err) {
        console.error("Backend prediction error:", err);
        setErrorMessage('Analysis could not be completed at this time. Please try again later.');
        setWorkflowState('error');
        return;
      }

      // VALIDATION CHECK
      if (backendResult.status === 'failed' || backendResult.is_valid === false) {
        setValidationMessage(backendResult.message || 'The uploaded image did not pass structural validation criteria.');
        setWorkflowState('validation_failed');
        return;
      }

      // Process successful prediction
      const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);
      const rawDefect = backendResult.defect || 'unknown';
      const defectName = rawDefect
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const probabilityValues = backendResult.probabilities
        ? Object.values(backendResult.probabilities)
        : [];

      const topProbability =
        probabilityValues.length > 0
          ? Math.max(...probabilityValues)
          : Number(backendResult.router_confidence || 0);

      const severityMap = {
        algae: 'Low',
        stain: 'Low',
        plain: 'Low',
        peeling: 'Medium',
        mold: 'High',
        water_seepage: 'High',
        minor_crack: 'Medium',
        spalling: 'High',
        major_crack: 'Critical',
      };

      const prediction = {
        defectName,
        severity: severityMap[rawDefect] || 'Medium',
        confidence:
          topProbability > 1
            ? topProbability.toFixed(1)
            : (topProbability * 100).toFixed(1),
        processingTime: `${processingTime}s`,
        timestamp: new Date().toISOString(),
        analysisId
      };

      setPredictionResult(prediction);

      // CASE 1 & 2: Handle Report Generation
      try {
        if (!backendResult.report) {
          throw new Error("Report data missing from response");
        }
        
        let reportData = backendResult.report;
        if (typeof reportData === 'string') {
          try {
            reportData = JSON.parse(reportData);
          } catch (e) {
            console.warn("Failed to parse report string as JSON, using fallback");
          }
        }

        setGeneratedReport(reportData);
        setReportStatus('success');
        setWorkflowState('complete');

        toast({
          title: 'Diagnostic Complete',
          description: `Classified anomaly: ${prediction.defectName}. Report ready.`,
        });
      } catch (reportErr) {
        console.warn("Report generation failed, but prediction succeeded:", reportErr);
        setGeneratedReport(null);
        setReportStatus('warning');
        setWorkflowState('complete');

        toast({
          title: 'Report Unavailable',
          description: 'Prediction completed successfully. The detailed AI-generated report is temporarily unavailable due to high demand. Please try again later.',
        });
      }

    } catch (err) {
      console.error("Unexpected pipeline error:", err);
      setErrorMessage('Analysis could not be completed at this time. Please try again later.');
      setWorkflowState('error');
    }
  };

  const getSeverityBadgeClass = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'critical': return 'severity-badge-critical';
      case 'high': return 'severity-badge-high';
      case 'medium': return 'severity-badge-medium';
      case 'low': return 'severity-badge-low';
      default: return 'severity-badge-low';
    }
  };

  const generatePDF = () => {
    if (!predictionResult) return;
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = margin;

    // --- Helper Functions for PDF ---
    const addHeader = (title) => {
      doc.setFillColor(15, 23, 42); // Dark slate
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("ConstructGuard AI", margin, 22);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text("Structural Assessment Document", margin, 30);
      
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text(title, pageWidth - margin, 26, { align: "right" });
      
      return 50; // New Y
    };

    const addSectionTitle = (title, currentY) => {
      if (currentY > pageHeight - 30) {
        doc.addPage();
        currentY = addHeader("Diagnostic Report - Cont.");
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text(title, margin, currentY);
      
      // Underline
      doc.setDrawColor(226, 232, 240); // Slate 200
      doc.setLineWidth(0.5);
      doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
      
      return currentY + 10;
    };

    const addParagraph = (text, currentY, fontSize = 10, isBold = false) => {
      if (!text) return currentY;
      
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(51, 65, 85); // Slate 700
      
      const lines = doc.splitTextToSize(text, pageWidth - (margin * 2));
      
      for (let i = 0; i < lines.length; i++) {
        if (currentY > pageHeight - margin) {
          doc.addPage();
          currentY = addHeader("Diagnostic Report - Cont.");
        }
        doc.text(lines[i], margin, currentY);
        currentY += (fontSize * 0.45); // Line height
      }
      return currentY + 4; // Paragraph spacing
    };

    const addList = (items, currentY, ordered = false) => {
      if (!items || !Array.isArray(items) || items.length === 0) return currentY;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);

      for (let i = 0; i < items.length; i++) {
        if (currentY > pageHeight - margin) {
          doc.addPage();
          currentY = addHeader("Diagnostic Report - Cont.");
        }
        const bullet = ordered ? `${i + 1}. ` : "• ";
        const text = items[i];
        
        const bulletWidth = doc.getTextWidth(bullet);
        const lines = doc.splitTextToSize(text, pageWidth - (margin * 2) - bulletWidth);
        
        doc.text(bullet, margin, currentY);
        for (let j = 0; j < lines.length; j++) {
          if (currentY > pageHeight - margin) {
            doc.addPage();
            currentY = addHeader("Diagnostic Report - Cont.");
            doc.text("  (cont.)", margin, currentY);
            currentY += 6;
          }
          doc.text(lines[j], margin + bulletWidth, currentY);
          currentY += 4.5;
        }
        currentY += 2;
      }
      return currentY + 2;
    };

    // --- PAGE 1 ---
    y = addHeader("Inspection Report");

    // Metadata
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Analysis ID: ${predictionResult.analysisId}`, margin, y);
    doc.text(`Date: ${new Date(predictionResult.timestamp).toLocaleString()}`, pageWidth - margin, y, { align: "right" });
    y += 15;

    // Image
    if (imagePreview) {
      try {
        const imgProps = doc.getImageProperties(imagePreview);
        const imgRatio = imgProps.width / imgProps.height;
        let finalWidth = 120;
        let finalHeight = 120 / imgRatio;
        
        if (finalHeight > 80) {
          finalHeight = 80;
          finalWidth = 80 * imgRatio;
        }
        
        const xOffset = (pageWidth - finalWidth) / 2;
        
        doc.setDrawColor(226, 232, 240);
        doc.rect(xOffset - 1, y - 1, finalWidth + 2, finalHeight + 2); // Border
        doc.addImage(imagePreview, xOffset, y, finalWidth, finalHeight);
        y += finalHeight + 15;
      } catch (e) {
        console.error("Failed to add image to PDF", e);
      }
    }

    // Detection Summary Card
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 35, 3, 3, 'FD');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("DETECTION SUMMARY", margin + 5, y + 8);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    
    doc.text("Condition:", margin + 5, y + 16);
    doc.setFont("helvetica", "bold");
    doc.text(predictionResult.defectName, margin + 25, y + 16);
    
    doc.setFont("helvetica", "normal");
    doc.text("Confidence:", pageWidth/2, y + 16);
    doc.setFont("helvetica", "bold");
    doc.text(`${predictionResult.confidence}%`, pageWidth/2 + 22, y + 16);
    
    doc.setFont("helvetica", "normal");
    doc.text("Severity:", margin + 5, y + 24);
    
    if (predictionResult.severity === 'Critical') doc.setTextColor(225, 29, 72);
    else if (predictionResult.severity === 'High') doc.setTextColor(249, 115, 22);
    else if (predictionResult.severity === 'Medium') doc.setTextColor(234, 179, 8);
    else doc.setTextColor(16, 185, 129);
    
    doc.setFont("helvetica", "bold");
    doc.text(predictionResult.severity.toUpperCase(), margin + 25, y + 24);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(16, 185, 129); // Green
    doc.text("Status: Completed Successfully", pageWidth/2, y + 24);
    
    y += 50;

    // Print structured report sections if available
    if (generatedReport && typeof generatedReport === 'object' && reportStatus === 'success') {
      
      if (generatedReport.executive_summary) {
        y = addSectionTitle("Executive Summary", y);
        y = addParagraph(generatedReport.executive_summary, y);
        y += 5;
      }
      
      if (generatedReport.detected_condition) {
        y = addSectionTitle("Detected Condition Details", y);
        y = addParagraph(generatedReport.detected_condition, y);
        y += 5;
      }

      if (generatedReport.risk_assessment) {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = addHeader("Diagnostic Report - Cont.");
        }
        doc.setFillColor(254, 242, 242); // Rose 50
        doc.setDrawColor(254, 205, 211); // Rose 200
        
        // Calculate box height based on content
        const summaryLines = doc.splitTextToSize(generatedReport.risk_assessment.summary || "", pageWidth - (margin * 2) - 8);
        const consequenceLines = doc.splitTextToSize(generatedReport.risk_assessment.consequences || "", pageWidth - (margin * 2) - 8);
        const boxHeight = 20 + (summaryLines.length * 4.5) + (consequenceLines.length * 4.5);
        
        doc.roundedRect(margin, y, pageWidth - (margin * 2), boxHeight, 2, 2, 'FD');
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(159, 18, 57); // Rose 800
        doc.text(`Risk Assessment: ${generatedReport.risk_assessment.risk_level || 'Unknown'}`, margin + 4, y + 6);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(159, 18, 57);
        
        let currentBoxY = y + 12;
        for(let i=0; i<summaryLines.length; i++) {
            doc.text(summaryLines[i], margin + 4, currentBoxY);
            currentBoxY += 4.5;
        }
        currentBoxY += 2;
        for(let i=0; i<consequenceLines.length; i++) {
            doc.text(consequenceLines[i], margin + 4, currentBoxY);
            currentBoxY += 4.5;
        }
        
        y += boxHeight + 10;
      }

      if (generatedReport.probable_causes && generatedReport.probable_causes.length > 0) {
        y = addSectionTitle("Probable Causes", y);
        y = addList(generatedReport.probable_causes, y, false);
        y += 5;
      }

      if (generatedReport.recommended_treatment && generatedReport.recommended_treatment.length > 0) {
        y = addSectionTitle("Recommended Treatment", y);
        y = addList(generatedReport.recommended_treatment, y, true);
        y += 5;
      }

      if (generatedReport.preventive_maintenance && generatedReport.preventive_maintenance.length > 0) {
        y = addSectionTitle("Preventive Maintenance", y);
        y = addList(generatedReport.preventive_maintenance, y, false);
        y += 5;
      }

      if (generatedReport.professional_recommendation) {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = addHeader("Diagnostic Report - Cont.");
        }
        y += 5;
        doc.setFillColor(241, 245, 249); // Slate 100
        
        const recLines = doc.splitTextToSize(generatedReport.professional_recommendation, pageWidth - (margin * 2) - 8);
        const boxHeight = 15 + (recLines.length * 4.5);
        
        doc.roundedRect(margin, y, pageWidth - (margin * 2), boxHeight, 2, 2, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text("Professional Recommendation:", margin + 4, y + 6);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        
        let currentBoxY = y + 12;
        for(let i=0; i<recLines.length; i++) {
            doc.text(recLines[i], margin + 4, currentBoxY);
            currentBoxY += 4.5;
        }
        y += boxHeight + 10;
      }

    } else if (generatedReport && reportStatus === 'success') {
      // Fallback if report is just a string
      y = addSectionTitle("Detailed Analysis", y);
      y = addParagraph(typeof generatedReport === 'string' ? generatedReport : JSON.stringify(generatedReport), y);
    } else {
      y = addParagraph("Detailed AI-generated report was unavailable at the time of export.", y);
    }
    
    // Add Footer to all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `ConstructGuard AI Automated Diagnostic - Page ${i} of ${pageCount}`, 
        pageWidth / 2, 
        pageHeight - 10, 
        { align: "center" }
      );
    }
    
    doc.save(`ConstructGuard_Report_${predictionResult.analysisId}.pdf`);
    
    toast({
      title: 'Export Successful',
      description: 'Diagnostic report PDF has been downloaded.',
    });
  };

  return (
    <>
      <Helmet>
        <title>Diagnostics Workspace | ConstructGuard AI</title>
        <meta name="description" content="Secure portal for uploading structural imagery and generating automated defect classifications." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
          <div className="absolute top-1/4 -right-64 w-[800px] h-[800px] bg-[hsl(var(--accent-blue))]/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center max-w-3xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
                Diagnostics Workspace
              </h1>
              <p className="text-base text-muted-foreground">
                Upload structural imagery to generate professional engineering diagnostic reports.
              </p>
            </motion.div>

            {workflowState === 'idle' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="lg:col-span-5"
                >
                  <AnalysisGuidelines />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:col-span-7"
                >
                  <div className="glass p-8 rounded-2xl flex flex-col premium-shadow border border-white/10 h-full">
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                      <h2 className="text-base font-bold text-foreground tracking-wide flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-[hsl(var(--accent-blue))]" /> Target Asset
                      </h2>
                    </div>
                    
                    {!selectedImage ? (
                      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-[hsl(var(--accent-blue))]/50 transition-colors cursor-pointer bg-black/20 flex-1 flex flex-col items-center justify-center group relative overflow-hidden min-h-[300px]">
                        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--accent-blue))]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center w-full h-full justify-center relative z-10">
                          <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-105 group-hover:bg-white/10 premium-shadow">
                            <Upload className="w-8 h-8 text-[hsl(var(--accent-blue))]" />
                          </div>
                          <p className="text-foreground font-bold mb-1 text-lg tracking-wide">
                            Upload Image for Analysis
                          </p>
                          <p className="text-sm text-muted-foreground mb-6 font-medium">
                            Drag and drop or click to browse
                          </p>
                          <span className="text-xs uppercase tracking-widest font-bold bg-white/10 px-3 py-1.5 rounded-md border border-white/5">JPG / PNG</span>
                        </label>
                      </div>
                    ) : (
                      <div className="flex flex-col flex-1 min-h-[300px]">
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#050B14] flex-1 relative flex items-center justify-center p-2 shadow-inner">
                          <img
                            src={imagePreview}
                            alt="Asset pending structural verification"
                            className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                          />
                        </div>
                        <div className="mt-6 flex gap-4">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleImageSelect}
                            onClick={(e) => { e.target.value = null; }}
                            className="hidden"
                            id="image-change"
                          />
                          <button 
                            type="button"
                            onClick={() => document.getElementById('image-change').click()}
                            className="flex-1 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" /> Change Image
                          </button>
                          <button
                            onClick={executeAnalysisFlow}
                            className="flex-[2] py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gradient-primary premium-shadow"
                          >
                            Analyze Structure <ArrowRight className="w-4 h-4 ml-2" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {workflowState === 'analyzing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-12 rounded-2xl border border-white/10 premium-shadow flex flex-col items-center justify-center min-h-[400px] text-center"
              >
                <div className="relative w-24 h-24 flex items-center justify-center mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-[hsl(var(--accent-blue))] border-t-transparent animate-spin-slow"></div>
                  <Loader2 className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Analyzing Structural Asset</h2>
                <p className="text-muted-foreground max-w-md">
                  Processing image through diagnostic models and generating professional engineering report...
                </p>
              </motion.div>
            )}

            {workflowState === 'validation_failed' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-12 rounded-2xl border border-amber-500/30 premium-shadow flex flex-col items-center justify-center min-h-[400px] text-center bg-amber-500/5"
              >
                <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
                  <AlertTriangle className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Analysis Cannot Be Performed</h2>
                <p className="text-muted-foreground max-w-md mb-8 text-lg">
                  {validationMessage}
                </p>
                <button 
                  onClick={handleResetAll} 
                  className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Upload Another Image
                </button>
              </motion.div>
            )}

            {workflowState === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-12 rounded-2xl border border-rose-500/20 premium-shadow flex flex-col items-center justify-center min-h-[400px] text-center bg-rose-500/5"
              >
                <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20">
                  <ShieldAlert className="w-10 h-10 text-rose-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Analysis Failed</h2>
                <p className="text-muted-foreground max-w-md mb-8 text-lg">
                  {errorMessage}
                </p>
                <button 
                  onClick={resetAnalysis} 
                  className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              </motion.div>
            )}

            {workflowState === 'complete' && predictionResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* 1. DIAGNOSTIC REPORT Header & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 tracking-tight">
                      <FileText className="w-6 h-6 text-[hsl(var(--accent-blue))]" />
                      DIAGNOSTIC REPORT
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">ConstructGuard AI Structural Assessment</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleResetAll}
                      className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors text-foreground"
                    >
                      Analyze Another
                    </button>
                    <button
                      onClick={generatePDF}
                      className="px-4 py-2 rounded-lg gradient-primary text-sm font-semibold flex items-center gap-2 premium-shadow"
                    >
                      <Download className="w-4 h-4" /> Download Report PDF
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Image & Summary */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* 2. Report Metadata */}
                    <div className="flex justify-between items-center text-xs text-muted-foreground bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(predictionResult.timestamp).toLocaleDateString()}</span>
                      <span className="font-mono bg-black/30 px-2 py-0.5 rounded border border-white/5">{predictionResult.analysisId}</span>
                    </div>

                    <div className="report-card !mb-0">
                      <div className="p-2 bg-[#050B14] border-b border-white/10">
                        <img
                          src={imagePreview}
                          alt="Analyzed structural asset"
                          className="w-full h-auto rounded-lg object-contain max-h-[250px]"
                        />
                      </div>
                    </div>

                    {/* 3. DETECTION SUMMARY Card */}
                    <div className="report-card">
                      <div className="report-card-header">
                        <ClipboardList className="w-4 h-4 text-[hsl(var(--accent-blue))]" />
                        <h3 className="report-card-title">Detection Summary</h3>
                      </div>
                      
                      <div className="p-6 space-y-5">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Detected Defect</p>
                          <p className="text-xl font-bold text-foreground">{predictionResult.defectName}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Confidence</p>
                            <p className="text-lg font-bold text-foreground">{predictionResult.confidence}%</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Severity</p>
                            <span className={`severity-badge ${getSeverityBadgeClass(predictionResult.severity)} mt-0.5`}>
                              {predictionResult.severity}
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Analysis Status</p>
                          <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Completed
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Detailed Report Sections */}
                  <div className="lg:col-span-8">
                    
                    {reportStatus === 'warning' ? (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-8 flex flex-col items-center justify-center text-center h-[300px]">
                        <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
                        <h4 className="text-lg font-semibold text-foreground mb-2">Report Temporarily Unavailable</h4>
                        <p className="text-muted-foreground max-w-md">
                          Prediction completed successfully. The detailed AI-generated report is temporarily unavailable due to high demand on the generation service. Please try again later.
                        </p>
                      </div>
                    ) : generatedReport && typeof generatedReport === 'object' ? (
                      <div className="space-y-6">
                        
                        {/* 4. EXECUTIVE SUMMARY Section */}
                        {generatedReport.executive_summary && (
                          <div className="report-card">
                            <div className="report-card-header">
                              <FileText className="w-4 h-4 text-emerald-400" />
                              <h3 className="report-card-title">Executive Summary</h3>
                            </div>
                            <div className="report-card-content text-foreground font-medium">
                              {generatedReport.executive_summary}
                            </div>
                          </div>
                        )}

                        {/* 5. DETECTED CONDITION Section */}
                        {generatedReport.detected_condition && (
                          <div className="report-card">
                            <div className="report-card-header">
                              <Search className="w-4 h-4 text-[hsl(var(--accent-blue))]" />
                              <h3 className="report-card-title">Detected Condition</h3>
                            </div>
                            <div className="report-card-content">
                              {generatedReport.detected_condition}
                            </div>
                          </div>
                        )}

                        {/* 6. RISK ASSESSMENT Section */}
                        {generatedReport.risk_assessment && (
                          <div className="report-card border-rose-500/30 shadow-[0_0_15px_rgba(225,29,72,0.1)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-rose-500/5 pointer-events-none"></div>
                            <div className="report-card-header bg-rose-500/10 border-rose-500/20 flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <AlertTriangle className="w-4 h-4 text-rose-400" />
                                <h3 className="report-card-title text-rose-400">Risk Assessment</h3>
                              </div>
                              {generatedReport.risk_assessment.risk_level && (
                                <span className={`severity-badge ${getSeverityBadgeClass(generatedReport.risk_assessment.risk_level)}`}>
                                  {generatedReport.risk_assessment.risk_level}
                                </span>
                              )}
                            </div>
                            <div className="report-card-content relative z-10 space-y-4">
                              {generatedReport.risk_assessment.summary && (
                                <div>
                                  <p className="text-xs font-bold text-rose-400/80 uppercase tracking-wider mb-1">Summary</p>
                                  <p className="text-foreground">{generatedReport.risk_assessment.summary}</p>
                                </div>
                              )}
                              {generatedReport.risk_assessment.consequences && (
                                <div>
                                  <p className="text-xs font-bold text-rose-400/80 uppercase tracking-wider mb-1">Potential Consequences</p>
                                  <p className="text-foreground">{generatedReport.risk_assessment.consequences}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 7. PROBABLE CAUSES Section */}
                        {generatedReport.probable_causes && generatedReport.probable_causes.length > 0 && (
                          <div className="report-card">
                            <div className="report-card-header">
                              <Zap className="w-4 h-4 text-amber-400" />
                              <h3 className="report-card-title">Probable Causes</h3>
                            </div>
                            <div className="report-card-content">
                              <ul className="space-y-3">
                                {generatedReport.probable_causes.map((cause, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50 mt-2 shrink-0"></div>
                                    <span>{cause}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* 8. RECOMMENDED TREATMENT Section */}
                        {generatedReport.recommended_treatment && generatedReport.recommended_treatment.length > 0 && (
                          <div className="report-card border-[hsl(var(--accent-blue))]/30">
                            <div className="report-card-header bg-[hsl(var(--accent-blue))]/5">
                              <Wrench className="w-4 h-4 text-[hsl(var(--accent-blue))]" />
                              <h3 className="report-card-title text-[hsl(var(--accent-blue))]">Recommended Treatment</h3>
                            </div>
                            <div className="report-card-content text-foreground">
                              <ol className="space-y-4">
                                {generatedReport.recommended_treatment.map((step, idx) => (
                                  <li key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                    <div className="w-6 h-6 rounded-md bg-[hsl(var(--accent-blue))]/20 text-[hsl(var(--accent-blue))] text-xs font-bold flex items-center justify-center shrink-0">
                                      {idx + 1}
                                    </div>
                                    <span className="pt-0.5">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        )}

                        {/* 9. PREVENTIVE MAINTENANCE Section */}
                        {generatedReport.preventive_maintenance && generatedReport.preventive_maintenance.length > 0 && (
                          <div className="report-card">
                            <div className="report-card-header">
                              <ShieldPlus className="w-4 h-4 text-indigo-400" />
                              <h3 className="report-card-title">Preventive Maintenance</h3>
                            </div>
                            <div className="report-card-content">
                              <ul className="space-y-3">
                                {generatedReport.preventive_maintenance.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 mt-2 shrink-0"></div>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* 10. PROFESSIONAL RECOMMENDATION Section */}
                        {generatedReport.professional_recommendation && (
                          <div className="report-card bg-white/5 border-white/20">
                            <div className="report-card-header bg-transparent border-none pb-0 pt-6">
                              <PenTool className="w-4 h-4 text-foreground" />
                              <h3 className="report-card-title text-foreground">Professional Recommendation</h3>
                            </div>
                            <div className="report-card-content font-medium text-foreground italic pt-3">
                              "{generatedReport.professional_recommendation}"
                            </div>
                          </div>
                        )}
                        
                      </div>
                    ) : (
                      /* Fallback unstructured render */
                      <div className="report-card">
                        <div className="report-card-header">
                          <FileText className="w-4 h-4 text-foreground" />
                          <h3 className="report-card-title">Detailed Analysis</h3>
                        </div>
                        <div className="report-card-content whitespace-pre-wrap font-light">
                          {typeof generatedReport === 'string' ? generatedReport : JSON.stringify(generatedReport)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </main>
      </div>
    </>
  );
};

export default AnalysisPage;
