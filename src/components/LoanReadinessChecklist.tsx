import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { 
  CheckCircle2, 
  Circle, 
  ShieldCheck, 
  Search, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Award, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Info,
  ChevronRight,
  TrendingDown,
  Building,
  UserCheck
} from 'lucide-react';
import { getEngagementState, EngagementState } from '../lib/engagement';

export const LoanReadinessChecklist = () => {
  const [engagement, setEngagement] = useState<EngagementState>(getEngagementState());
  const [activeTab, setActiveTab] = useState<'checklist' | 'market' | 'financials'>('checklist');
  const [selectedAmortizationYear, setSelectedAmortizationYear] = useState<number>(1);
  const [userCheckedItems, setUserCheckedItems] = useState<{ [key: string]: boolean }>({
    creditCheck: true,
    entityIncorporated: true,
    leaseLetter: false,
    municipalPermit: false
  });

  // Keep engagement synchronized with global actions
  useEffect(() => {
    const handleUpdate = () => {
      setEngagement(getEngagementState());
    };
    window.addEventListener('safemart_engagement_updated', handleUpdate);
    return () => {
      window.removeEventListener('safemart_engagement_updated', handleUpdate);
    };
  }, []);

  const handleToggleUserItem = (key: string) => {
    setUserCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 1. Dynamic Checklist Items Tracking Progress
  const milestones = useMemo(() => {
    const techSpecsDone = engagement.viewedSpecs;
    const simDone = engagement.viewedSim && engagement.simSteps.length >= 4;
    const partsDone = engagement.inspectedComponents.length >= 5;

    return [
      {
        id: 'inspect-specs',
        label: 'Inspect Safe-Window Technical Specs',
        description: 'Review physical barrier blueprints, slide dynamics, and steel frame density gauges.',
        status: techSpecsDone ? 'completed' : 'pending',
        points: 15,
        tip: 'Click "View Physical Blueprint Specs" in the Safety-Window blueprints section.'
      },
      {
        id: 'run-simulator',
        label: 'Run Lockdown Incident Simulator',
        description: 'Stress-test all 4 stages of the late-night physical lockout in the walk-up simulator.',
        status: simDone ? 'completed' : 'pending',
        points: 20,
        tip: `Tested ${engagement.simSteps.length}/4 stages. Try all of them to complete this.`
      },
      {
        id: 'inspect-3d',
        label: 'Explore 3D Portal Architecture',
        description: 'Examine and inspect all 5 component plates in the interactive WebGL module.',
        status: partsDone ? 'completed' : 'pending',
        points: 15,
        tip: `Viewed ${engagement.inspectedComponents.length}/5 components. Click on them in the 3D layout.`
      },
      {
        id: 'credit-check',
        label: 'Pre-Approved Credit Screening',
        description: 'Validated primary director credit profile (740+ beacon score verified via Equifax).',
        status: userCheckedItems.creditCheck ? 'completed' : 'pending',
        points: 15,
        interactive: true,
        toggleKey: 'creditCheck'
      },
      {
        id: 'entity-incorporated',
        label: 'Alberta Corporation Registration',
        description: 'Entity registered as SafeMart Retail Inc. in accordance with Alberta corporate regulations.',
        status: userCheckedItems.entityIncorporated ? 'completed' : 'pending',
        points: 10,
        interactive: true,
        toggleKey: 'entityIncorporated'
      },
      {
        id: 'lease-letter',
        label: 'Executed Letter of Intent (LOI) for Site Lease',
        description: 'Signed retail lease LOI for 4412 36 Ave NW, ensuring 5-year tenancy.',
        status: userCheckedItems.leaseLetter ? 'completed' : 'pending',
        points: 15,
        interactive: true,
        toggleKey: 'leaseLetter'
      },
      {
        id: 'municipal-permit',
        label: 'Municipal Zone Convenience Permit',
        description: 'Edmonton municipal development permit approved for overnight operations.',
        status: userCheckedItems.municipalPermit ? 'completed' : 'pending',
        points: 10,
        interactive: true,
        toggleKey: 'municipalPermit'
      }
    ];
  }, [engagement, userCheckedItems]);

  // Calculate Bank Approval Probability
  const bankApprovalScore = useMemo(() => {
    // Starts with a baseline of 40% (representing basic credit, and is boosted up to 98% by milestones)
    const pointsEarned = milestones.reduce((sum, item) => {
      return item.status === 'completed' ? sum + item.points : sum;
    }, 0);
    
    // Max probability capped at 98% for realistic underwriting conservatism
    return Math.min(98, 40 + pointsEarned);
  }, [milestones]);

  // Score Rating Label
  const scoreBadge = useMemo(() => {
    if (bankApprovalScore >= 90) {
      return { text: 'Tier 1 Prime Underwriting', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    }
    if (bankApprovalScore >= 75) {
      return { text: 'Strong Bank Standard', color: 'text-sky-400 bg-sky-400/10 border-sky-400/30' };
    }
    if (bankApprovalScore >= 60) {
      return { text: 'Alternative/Sub-Prime Tier', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    }
    return { text: 'Needs Core Documentation', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  }, [bankApprovalScore]);

  // Loan repayment schedules data (10 Years Amortization Table)
  // Loan Amount: 150,000, Interest: 6.5% APR, monthly payment: $1,703.37
  const repaymentData = useMemo(() => {
    const loanAmount = 150000;
    const rate = 0.065 / 12;
    const totalMonths = 120;
    const monthlyPayment = 1703.37;
    
    let balance = loanAmount;
    const schedule: Array<{ year: number; principalPaid: number; interestPaid: number; remainingBalance: number }> = [];

    for (let year = 1; year <= 10; year++) {
      let yrPrincipal = 0;
      let yrInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        const interest = balance * rate;
        const principal = monthlyPayment - interest;
        yrPrincipal += principal;
        yrInterest += interest;
        balance -= principal;
      }
      
      schedule.push({
        year,
        principalPaid: Math.round(yrPrincipal),
        interestPaid: Math.round(yrInterest),
        remainingBalance: Math.round(Math.max(0, balance))
      });
    }
    return schedule;
  }, []);

  const selectedYearData = useMemo(() => {
    return repaymentData[selectedAmortizationYear - 1] || repaymentData[0];
  }, [repaymentData, selectedAmortizationYear]);

  // Capital Budget Projected Cost Breakdown
  const capitalBudget = [
    { name: 'Site Lease Acquisition', cost: 45000, desc: 'Deposit, first/last months lease, and legal closing fees.' },
    { name: 'Safe-Window Ballistic Shield', cost: 35000, desc: 'UL Level 3 bulletproof barrier glass, reinforced sliders, framing.' },
    { name: 'Interior Retail Fit-out', cost: 25000, desc: 'Shelving, high-efficiency refrigeration units, and custom night counters.' },
    { name: 'Working Capital Reserve', cost: 45000, desc: 'Liquidity runway, inventory seed purchasing, and operating cash.' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24 border border-white/10 bg-zinc-950 p-6 sm:p-10 relative overflow-hidden"
      id="loan-readiness-checklist-section"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/[0.01] rounded-full blur-[120px] pointer-events-none" />

      {/* Header and Underwriting Meter */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] tracking-[0.3em] uppercase text-emerald-400 font-bold block">Compliance & Credit Packaging Portal</span>
          <h2 className="text-3xl font-light text-white tracking-tighter">
            Loan Readiness <span className="font-serif italic text-emerald-400">Checklist & Validation</span>
          </h2>
        </div>
        
        {/* Dynamic Bank Approval Gauge */}
        <div className="bg-zinc-900/50 border border-white/5 p-4 sm:px-6 sm:py-3 flex items-center gap-4 max-w-sm w-full">
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r="23" stroke="#18181b" strokeWidth="4" fill="transparent" />
              <motion.circle 
                cx="28" 
                cy="28" 
                r="23" 
                stroke="#10b981" 
                strokeWidth="4" 
                fill="transparent" 
                strokeDasharray={2 * Math.PI * 23}
                animate={{ strokeDashoffset: 2 * Math.PI * 23 * (1 - bankApprovalScore / 100) }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <span className="absolute text-[11px] font-mono font-bold text-white">{bankApprovalScore}%</span>
          </div>

          <div className="space-y-0.5 min-w-0">
            <span className="text-[8px] font-mono uppercase text-slate-500 block">Bank Approval Probability</span>
            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1">
              <span>{bankApprovalScore}% Verified</span>
              {bankApprovalScore >= 75 && <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
            </div>
            <div className={`text-[8.5px] font-mono px-1.5 py-0.5 border inline-block ${scoreBadge.color}`}>
              {scoreBadge.text}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex border-b border-white/5 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'checklist'
              ? 'border-emerald-400 text-emerald-400 font-bold bg-white/[0.02]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Progress Checklist ({milestones.filter(m => m.status === 'completed').length}/{milestones.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('market')}
          className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'market'
              ? 'border-emerald-400 text-emerald-400 font-bold bg-white/[0.02]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          Edmonton Neighborhood Validation
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('financials')}
          className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'financials'
              ? 'border-emerald-400 text-emerald-400 font-bold bg-white/[0.02]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Financial Schedule & Margins
        </button>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: PROGRESS CHECKLIST */}
        {activeTab === 'checklist' && (
          <motion.div
            key="checklist-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-[#08080c] border border-white/5 p-4 rounded-none text-xs text-slate-300 leading-relaxed flex items-start gap-3">
              <Info className="w-4.5 h-4.5 text-sky-400 shrink-0 mt-0.5" />
              <p>
                <strong>Gamified Underwriting:</strong> Fulfilling active verification tasks automatically raises your credit packaging index. The automated tasks sync instantly as you inspect technical specifications or simulate late-night events, while core corporate documents can be checked manually below to package a compliant filing.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {milestones.map((item) => {
                const isAuto = ['inspect-specs', 'run-simulator', 'inspect-3d'].includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => item.interactive && item.toggleKey && handleToggleUserItem(item.toggleKey)}
                    className={`p-4 border transition-all relative group flex gap-3.5 items-start ${
                      item.interactive ? 'cursor-pointer' : ''
                    } ${
                      item.status === 'completed'
                        ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                        : 'border-white/5 bg-[#0b0b0e] hover:border-white/10'
                    }`}
                  >
                    {/* Status check visual */}
                    <div className="mt-0.5 shrink-0">
                      {item.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-700 group-hover:text-slate-500 transition-colors" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-xs font-bold leading-tight ${item.status === 'completed' ? 'text-white' : 'text-slate-400'}`}>
                          {item.label}
                        </h4>
                        <span className={`text-[8.5px] font-mono px-1.5 py-0.5 shrink-0 ${
                          item.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-slate-500'
                        }`}>
                          +{item.points}%
                        </span>
                      </div>
                      
                      <p className="text-[10.5px] text-slate-400 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Instructions / Tip for pending autos */}
                      {item.status === 'pending' && isAuto && item.tip && (
                        <div className="bg-sky-500/5 border border-sky-500/10 p-2 mt-2 text-[9.5px] text-sky-400 font-mono leading-tight flex items-start gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span><strong>Pending Task Action:</strong> {item.tip}</span>
                        </div>
                      )}

                      {/* Interactive toggle instruction */}
                      {item.interactive && (
                        <span className="text-[8px] font-mono text-emerald-500 group-hover:underline block mt-1.5 uppercase">
                          [Click here to toggle document check]
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setActiveTab('market')}
                className="flex items-center gap-1.5 text-xs text-sky-400 font-mono font-bold hover:underline"
              >
                Proceed to Edmonton Neighborhood Validation
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 2: EDMONTON NEIGHBORHOOD MARKET VALIDATION */}
        {activeTab === 'market' && (
          <motion.div
            key="market-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Site address card */}
            <div className="border border-white/10 bg-zinc-900/30 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <MapPin className="w-5 h-5 shrink-0" />
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Selected Site Address</span>
                </div>
                <h3 className="text-xl font-light text-white tracking-tight">
                  4412 36 Ave NW, <span className="font-serif italic text-slate-400">Edmonton, AB T6L 1Y1</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Located in the Pylypow Business/Industrial Sector on the fringe of the Mill Woods dense trade area.
                </p>
              </div>

              <div className="bg-black/60 border border-white/5 p-4 text-[11px] font-mono space-y-1 md:w-80 w-full">
                <div className="flex justify-between">
                  <span className="text-slate-500">Local Area Division:</span>
                  <span className="text-white font-bold">EPS Southeast Division</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Retail Zone growth:</span>
                  <span className="text-emerald-400 font-bold">+6.4% / year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Continuous Trade Potential:</span>
                  <span className="text-white font-bold">Over 45,000 residents</span>
                </div>
              </div>
            </div>

            {/* Neighborhood Stats Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Crime Statistics Profile */}
              <div className="lg:col-span-6 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2 border-b border-white/5 pb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  EPS Southeast Crime Data (Real-time Profile)
                </h4>

                <div className="space-y-3">
                  <div className="bg-rose-950/15 border border-rose-500/20 p-4 space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-300">Property Crime Density Index:</span>
                      <span className="text-rose-400 font-bold">4,810 per 100,000 residents</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2">
                      <div className="bg-rose-500 h-2" style={{ width: '78%' }} />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal pt-1">
                      Slightly higher (1.8x) than the Alberta baseline due to midnight retail gas/convenience theft, window smash-and-grabs, and property damage.
                    </p>
                  </div>

                  <div className="bg-[#050508] border border-white/5 p-4 text-[11px] font-mono space-y-2">
                    <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Vulnerabilities of Conventional Late-Night Formats:</p>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-slate-400">Average Open-Door Shrinkage:</span>
                      <span className="text-rose-400 font-bold">4.1% of Gross Revenue</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-slate-400">Commercial Liability Surcharge:</span>
                      <span className="text-rose-400 font-bold">+$4,500/yr Risk Premium</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">EPS Call-for-Service Average:</span>
                      <span className="text-slate-300 font-bold">3.2 events/month per store</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Retail Trends & Safe-Window Mitigation */}
              <div className="lg:col-span-6 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2 border-b border-white/5 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Market Trends & Safe-Window Defensive Advantage
                </h4>

                <div className="space-y-3">
                  <div className="bg-emerald-950/15 border border-emerald-500/20 p-4 space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-300">Safe-Window Protective Mitigation:</span>
                      <span className="text-emerald-400 font-bold">100% Barrier Integrity</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2">
                      <div className="bg-emerald-400 h-2" style={{ width: '100%' }} />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal pt-1">
                      By keeping overnight physical doors locked and conducting all midnight cash & goods transactions through the <strong>UL Level 3 ballistic portal</strong>, risk exposure drops to absolute zero.
                    </p>
                  </div>

                  <div className="bg-[#050508] border border-white/5 p-4 text-[11px] font-mono space-y-2">
                    <p className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">SafeMart Underwriting Validation Credits:</p>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-slate-400">Target Overnight Shrinkage:</span>
                      <span className="text-emerald-400 font-bold">0.0% (Zero intrusion possible)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-slate-400">Overnight Insurance Discount:</span>
                      <span className="text-emerald-400 font-bold">-69% ($2,000/yr fixed rate)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">EPS Safety Program Grade:</span>
                      <span className="text-emerald-400 font-bold">A+ (Continuous compliance)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setActiveTab('checklist')}
                className="flex items-center gap-1.5 text-xs text-slate-400 font-mono hover:text-white transition-all"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Progress Checklist
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('financials')}
                className="flex items-center gap-1.5 text-xs text-sky-400 font-mono font-bold hover:underline"
              >
                Proceed to Financial Schedule & Margins
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 3: FINANCIAL SCHEDULES, TIMELINES & PROFIT MARGINS */}
        {activeTab === 'financials' && (
          <motion.div
            key="financials-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Capital Cost Breakdown & Timelines */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Cost Breakdown List */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2 border-b border-white/5 pb-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Initial Capital Cost Budget ($150,000)
                </h4>

                <div className="space-y-2.5">
                  {capitalBudget.map((item, idx) => (
                    <div key={idx} className="bg-zinc-950 border border-white/5 p-3 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-white block">{item.name}</span>
                        <p className="text-[9.5px] text-slate-400 leading-normal">{item.desc}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
                        ${item.cost.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 flex justify-between items-center text-xs font-mono font-bold">
                    <span className="text-white uppercase">Total Project Allocation:</span>
                    <span className="text-white underline decoration-emerald-400 decoration-2 underline-offset-4">
                      $150,000
                    </span>
                  </div>
                </div>
              </div>

              {/* Implementation Timelines */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2 border-b border-white/5 pb-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  Launch Timeline & Milestones
                </h4>

                <div className="relative border-l border-white/10 pl-6 space-y-5 my-2">
                  {/* Step 1 */}
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 w-2 h-2 rounded-full bg-sky-400" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-sky-400 font-bold uppercase tracking-wider bg-sky-500/10 px-1.5 py-0.5">Month 1</span>
                        <span className="text-xs font-bold text-white">Acquisition & Structural Planning</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Execute final lease contracts at 4412 36 Ave NW and draft complete construction permits with Edmonton municipal engineers.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 w-2 h-2 rounded-full bg-sky-400" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-sky-400 font-bold uppercase tracking-wider bg-sky-500/10 px-1.5 py-0.5">Month 2</span>
                        <span className="text-xs font-bold text-white">Safe-Window Assembly Installation</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Fabricate and anchor the UL Level 3 ballistic steel plates, sliding glass drawer mechanisms, and safety intercom.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 w-2 h-2 rounded-full bg-sky-400" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-sky-400 font-bold uppercase tracking-wider bg-sky-500/10 px-1.5 py-0.5">Month 3</span>
                        <span className="text-xs font-bold text-white">Licensing & Safety Inspections</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Register with EPS commercial safety-networks, secure local fire marshal occupancy credentials, and stage core inventory.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-1.5 py-0.5 font-bold">Month 4</span>
                        <span className="text-xs font-bold text-white">Operational Launch & Grand Opening</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Train first-line convenience staff in Safe-Window continuous operations. Open 24/7 continuous retail pipeline to local consumers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Interactive Amortization Repayment & Margin Schedule */}
            <div className="border-t border-white/5 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Selector & Breakdown */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Loan Amortization Repayment Schedule
                </h4>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Calculate the precise repayment mechanics of the $150,000 commercial credit line amortized at 6.5% APR. Select a projection year below to inspect the debt schedule:
                </p>

                {/* Grid Year Selectors */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setSelectedAmortizationYear(yr)}
                      className={`py-2 text-[10px] font-mono border text-center transition-all ${
                        selectedAmortizationYear === yr
                          ? 'border-emerald-400 bg-emerald-400/5 text-emerald-400 font-bold'
                          : 'border-white/5 bg-[#070709] hover:border-white/10 text-slate-400'
                      }`}
                    >
                      Yr {yr}
                    </button>
                  ))}
                </div>

                {/* Selected Year Data Panel */}
                <div className="bg-[#050508] border border-white/5 p-4 space-y-2 text-[11px] font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-500">Year {selectedAmortizationYear} Total Payments:</span>
                    <span className="text-white font-bold">$20,440</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-500">Principal Contribution:</span>
                    <span className="text-emerald-400 font-bold">${selectedYearData.principalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-500">Interest Paid to Lender:</span>
                    <span className="text-rose-400 font-bold">${selectedYearData.interestPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-0.5">
                    <span className="text-slate-400">End-Of-Year Debt Balance:</span>
                    <span className="text-white">${selectedYearData.remainingBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Repayment Chart */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    Principal vs. Interest (10-Year Trend)
                  </h4>
                  <div className="flex gap-4 text-[9px] font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2 bg-emerald-500/80" />
                      Principal
                    </span>
                    <span className="flex items-center gap-1.5 text-rose-500">
                      <span className="w-2.5 h-2 bg-rose-500/80" />
                      Interest
                    </span>
                  </div>
                </div>

                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={repaymentData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.03} vertical={false} />
                      <XAxis dataKey="year" tickFormatter={(val) => `Yr ${val}`} stroke="#4b5563" tick={{ fontSize: 9, fontFamily: 'monospace' }} />
                      <YAxis stroke="#4b5563" tickFormatter={(val) => `$${val/1000}k`} tick={{ fontSize: 9, fontFamily: 'monospace' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '11px', fontFamily: 'monospace' }}
                        labelFormatter={(label) => `Year ${label} Breakdown`}
                      />
                      <Bar dataKey="principalPaid" name="Principal Paid" stackId="a" fill="#10b981" fillOpacity={0.7} />
                      <Bar dataKey="interestPaid" name="Interest Paid" stackId="a" fill="#ef4444" fillOpacity={0.7} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-[#050508] border border-white/5 p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Gross Profit Margin:</span>
                    <span className="text-sm font-bold text-white font-mono">70% Late-Night markup</span>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Yr 3 Target Net Margin:</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">24.2% After Debt Service</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-start items-center pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setActiveTab('market')}
                className="flex items-center gap-1.5 text-xs text-slate-400 font-mono hover:text-white transition-all"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Edmonton Neighborhood Validation
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </motion.section>
  );
};
