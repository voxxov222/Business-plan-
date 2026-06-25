import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, ShieldCheck, TrendingUp, Building, Clock, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { initAuth, googleSignIn, logout } from '../lib/auth';
import { sendEmail } from '../lib/gmail';
import { ThreeScene } from './ThreeScene';
import { FinancialCharts } from './Charts';
import { VoiceAssistant } from './VoiceAssistant';
import { ExecutiveSummary } from './ExecutiveSummary';
import { MarketAnalysis } from './MarketAnalysis';
import { MarketOpportunity } from './MarketOpportunity';
import { CommunityImpact } from './CommunityImpact';
import { ProductsServices } from './ProductsServices';
import { OperationsTech } from './OperationsTech';
import { SecurityArchitecture } from './SecurityArchitecture';
import { SmartSecurityDashboard } from './SmartSecurityDashboard';
import { DetailedFinancials } from './DetailedFinancials';
import { ProjectedRevenueGrowth } from './ProjectedRevenue';
import { SWOTAnalysis } from './SWOTAnalysis';
import { HistoricalComparison } from './HistoricalComparison';
import { CompetitorComparison } from './CompetitorComparison';
import { LoanReadinessDashboard } from './LoanReadinessDashboard';
import { LoanReadinessChecklist } from './LoanReadinessChecklist';
import { MarketingStrategy } from './MarketingStrategy';
import { WorkspaceActions } from './WorkspaceActions';
import { InvestorSentiment } from './InvestorSentiment';
import { NotebookLMBriefing } from './NotebookLMBriefing';
import { InvestorPortal } from './InvestorPortal';
import { InvestorROIVisualizer } from './InvestorROIVisualizer';

export const BusinessPlan = () => {
  const [needsAuth, setNeedsAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return () => { unsubscribe(); };
  }, []);

  const handleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleSendToBank = async () => {
    if (!user) {
      alert("Please sign in first to send the email.");
      return;
    }
    
    const confirm = window.confirm("Send this business plan to ATB Bank via your Gmail account?");
    if (!confirm) return;

    setIsSending(true);
    setSendSuccess(false);
    try {
      const subject = "Business Loan Application - 4405 36 Ave NW Convenience Store";
      const body = `
        <h1>Business Loan Application - ATB Bank</h1>
        <p>Please find the interactive business plan for the new convenience store located at 4405 36 Ave NW.</p>
        <h2>Key Highlights:</h2>
        <ul>
          <li><strong>Late-Night Safety Window:</strong> Operating safely after 10 PM to prevent robberies.</li>
          <li><strong>Low Overhead:</strong> Minimal financial risk through lean operations.</li>
          <li><strong>Prime Location:</strong> Taking over the former Circle K location.</li>
        </ul>
        <p>Interactive projections can be viewed at: ${window.location.origin}</p>
        <p>Thank you for your consideration.</p>
      `;
      
      // Sending to self as a demonstration, or user could input ATB's email
      await sendEmail(user.email, subject, body);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to send email:', err);
      alert('Failed to send email. Check console for details.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-sky-500/30 relative">
      <VoiceAssistant />

      {/* Navigation / Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 px-8 py-6 flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] tracking-[0.3em] uppercase text-sky-400 font-bold mb-2">Investment Proposal // ATB Financial</p>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-8 h-8 text-sky-400" />
            <span className="font-light text-3xl tracking-tighter text-white">SafeMart <span className="font-serif italic text-sky-400">Business Plan</span></span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <InvestorSentiment variant="compact" />
          </div>
          {needsAuth ? (
            <button 
              onClick={handleLogin}
              className="flex items-center space-x-2 border border-white/20 hover:bg-white/5 px-6 py-2 rounded-none text-[10px] tracking-widest uppercase font-bold transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-[10px] text-slate-400 hidden sm:block uppercase tracking-widest font-mono">{user?.email}</span>
              <button 
                onClick={logout}
                className="text-[10px] tracking-widest uppercase font-bold text-slate-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
              <button 
                onClick={handleSendToBank}
                disabled={isSending}
                className="flex items-center space-x-2 bg-sky-400 hover:bg-sky-300 disabled:bg-sky-900 px-6 py-2 rounded-none text-[10px] tracking-widest font-bold text-black transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] uppercase"
              >
                {isSending ? (
                  <span className="animate-pulse">Sending...</span>
                ) : sendSuccess ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sent Successfully!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit to ATB Bank</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-40 pb-24">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center mb-16 border border-white/10 bg-gradient-to-b from-transparent to-sky-950/20"
        >
          <div className="col-span-5 p-12 border-r border-white/10 flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex items-center space-x-2 border border-sky-500/50 text-sky-400 px-3 py-1 text-[10px] font-mono mb-8 uppercase tracking-widest">
                <MapPin className="w-3 h-3" />
                <span>4405 36 Ave NW</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-light tracking-tighter text-white mb-6 leading-tight">
                A Safer, Smarter <br/>
                <span className="font-serif italic text-sky-400">
                  Convenience Model.
                </span>
              </h1>
              <p className="text-sm leading-relaxed opacity-70 mb-12">
                Revitalizing a proven location with an innovative late-night safety protocol. High demand, low overhead, and zero compromise on security.
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] opacity-40 uppercase tracking-widest mb-1">Funding Requested</p>
                <p className="text-4xl font-light text-white">$150,000</p>
                <div className="h-1 bg-white/10 mt-2 w-full max-w-[200px]">
                  <div className="h-full bg-sky-400 w-[100%]"></div>
                </div>
              </div>
              <div>
                <p className="text-[10px] opacity-40 uppercase tracking-widest mb-1">ROI Timeline</p>
                <p className="text-4xl font-light text-white">12 <span className="text-lg font-serif italic text-sky-400">months</span></p>
              </div>
            </div>
          </div>
          <div className="col-span-7 h-[600px] w-full p-8 relative flex flex-col justify-center items-center">
             <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>
            <div className="w-full h-full relative z-10">
              <ThreeScene />
            </div>
            <div className="mt-8 text-center absolute bottom-8 z-20">
              <p className="text-[10px] tracking-widest text-sky-400 mb-2 uppercase">FIG. 01 // INTERACTIVE REVENUE PROJECTION</p>
              <p className="text-sm italic font-serif">5-Year Growth Outlook Model</p>
            </div>
          </div>
        </motion.div>

        {/* Summary Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="border border-white/10 bg-zinc-900/30 p-8 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-sky-400 mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Projected 3-Year Profit</span>
            </div>
            <p className="text-4xl font-light text-white">$350,000</p>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mt-2">Cumulative Net Margin</p>
          </div>
          
          <div className="border border-white/10 bg-zinc-900/30 p-8 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-sky-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Safety Score</span>
            </div>
            <p className="text-4xl font-light text-white">98<span className="text-lg opacity-40">/100</span></p>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mt-2">Based on Crime Prevention Specs</p>
          </div>
          
          <div className="border border-white/10 bg-zinc-900/30 p-8 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-sky-400 mb-4">
              <Building className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Initial Investment</span>
            </div>
            <p className="text-4xl font-light text-white">$150,000</p>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mt-2">Total Capital Required</p>
          </div>
        </motion.div>

        {/* Detailed Sections */}
        <ExecutiveSummary />
        <InvestorSentiment variant="full" />
        <NotebookLMBriefing />
        <MarketAnalysis />
        <MarketOpportunity />
        <CommunityImpact />
        <HistoricalComparison />
        <CompetitorComparison />
        <ProductsServices />
        <OperationsTech />
        <SecurityArchitecture />
        <SmartSecurityDashboard />
        <SWOTAnalysis />
        <MarketingStrategy />
        <DetailedFinancials />
        <InvestorROIVisualizer />
        <LoanReadinessDashboard />
        <LoanReadinessChecklist />
        <ProjectedRevenueGrowth />
        <InvestorPortal />
        <WorkspaceActions />
      </main>

      <footer className="h-16 border-t border-white/10 flex items-center px-8 justify-between mt-auto">
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)]"></div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#e0e0e0]">Credit Score: Good</span>
          </div>
          <div className="w-[1px] h-4 bg-white/10"></div>
          <div className="text-[10px] uppercase tracking-widest opacity-60">Presented to ATB Loan Committee</div>
        </div>
        <div className="text-[10px] font-mono opacity-20 hidden md:block">SYSTEM ARCHITECTURE v1.02 // BY: DREAM TO REALITY FRAMEWORK</div>
      </footer>
    </div>
  );
};
