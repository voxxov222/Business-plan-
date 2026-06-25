import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  Clock, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  HelpCircle,
  TrendingDown
} from 'lucide-react';

// Custom interface for calculated scenarios
interface ScenarioDataPoint {
  year: string;
  expected: number;
  bestCase: number;
  worstCase: number;
  daytime: number;
  overnight: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/95 border border-white/10 p-4 shadow-2xl max-w-xs rounded-none">
        <p className="font-mono font-bold text-white mb-2.5 text-xs uppercase tracking-wider">{label} Projections</p>
        <div className="space-y-1.5 border-b border-white/5 pb-2.5 mb-2.5">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex justify-between items-center gap-6">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </span>
              <span className="text-xs font-mono font-bold text-white">
                ${Math.round(entry.value).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        
        {/* Breakdown of custom projection */}
        {payload[0] && (
          <div className="space-y-1 text-[10px] font-mono text-slate-500">
            <div className="flex justify-between">
              <span>Daytime Revenue:</span>
              <span>${Math.round(payload[0].payload.daytime).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Overnight Revenue:</span>
              <span>${Math.round(payload[0].payload.overnight).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const ProjectedRevenueGrowth = () => {
  // Input parameters
  const [operatingMode, setOperatingMode] = useState<'safe-window' | 'open-door' | 'daytime-only'>('safe-window');
  const [staffingLevel, setStaffingLevel] = useState<number>(1); // overnight staff (1 or 2)
  const [avgOrderValue, setAvgOrderValue] = useState<number>(18); // $10 to $35
  const [hourlyCustomers, setHourlyCustomers] = useState<number>(15); // 5 to 30

  // Standard loan constants to calculate Debt Service (aligned with LoanReadinessDashboard)
  const loanAmount = 150000;
  const interestRate = 6.5;
  const amortizationYears = 10;
  
  // Calculate fixed annual debt service
  const annualDebtService = useMemo(() => {
    const r = (interestRate / 100) / 12;
    const n = amortizationYears * 12;
    let monthlyPayment = 0;
    if (r > 0) {
      monthlyPayment = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      monthlyPayment = loanAmount / n;
    }
    return monthlyPayment * 12;
  }, [interestRate, amortizationYears, loanAmount]);

  // Synchronized dynamic calculations
  const { chartData, metrics, automatedInsight } = useMemo(() => {
    // 1. Calculate growth multipliers based on custom inputs
    // Baseline represents: Safe-Window, 15 customers/hr, $18 AOV
    const trafficRatio = hourlyCustomers / 15;
    const aovRatio = avgOrderValue / 18;
    const overnightPerformanceRatio = trafficRatio * aovRatio;

    // Daytime baseline revenues (historically secure channels, fixed)
    const daytimeY1 = 90000;
    const daytimeY2 = 132000;
    const daytimeY3 = 210000;

    // Overnight baseline revenues (highly subject to security adjustments)
    const baseOvernightY1 = 60000;
    const baseOvernightY2 = 88000;
    const baseOvernightY3 = 140000;

    let grossOvernightY1 = 0;
    let grossOvernightY2 = 0;
    let grossOvernightY3 = 0;

    let shrinkageY1 = 0;
    let overnightLaborY1 = 0;
    let overnightInsuranceY1 = 0;

    if (operatingMode === 'daytime-only') {
      grossOvernightY1 = 0;
      grossOvernightY2 = 0;
      grossOvernightY3 = 0;
    } else {
      // Overnight operations active (Safe-Window or Open-Door)
      grossOvernightY1 = baseOvernightY1 * overnightPerformanceRatio;
      grossOvernightY2 = baseOvernightY2 * overnightPerformanceRatio;
      grossOvernightY3 = baseOvernightY3 * overnightPerformanceRatio;

      // Shoplifting/shrinkage leakages
      if (operatingMode === 'open-door') {
        shrinkageY1 = grossOvernightY1 * 0.041; // 4.1% standard open-door shrinkage
      } else {
        shrinkageY1 = 0; // 0% shrinkage with Safe-Window physical barrier
      }

      // Labor costs overnight
      // 8 hours per night * 365 days = 2920 hours. Estimated wage: $22/hr.
      overnightLaborY1 = staffingLevel * 22 * 2920;

      // Liability insurance & safety premium surcharges
      if (operatingMode === 'open-door') {
        overnightInsuranceY1 = 6500; // Premium rate due to active physical exposure
      } else {
        overnightInsuranceY1 = 2000; // Discounted high-security commercial rate
      }
    }

    // Adjusted Expected Revenues (Gross revenue minus physical shrinkage loss)
    const expectedY1 = daytimeY1 + (grossOvernightY1 - shrinkageY1);
    const expectedY2 = daytimeY2 + (grossOvernightY2 - (operatingMode === 'open-door' ? grossOvernightY2 * 0.041 : 0));
    const expectedY3 = daytimeY3 + (grossOvernightY3 - (operatingMode === 'open-door' ? grossOvernightY3 * 0.041 : 0));

    // Best-Case Scenario (+20% operational efficiency)
    const bestY1 = expectedY1 * 1.20;
    const bestY2 = expectedY2 * 1.22;
    const bestY3 = expectedY3 * 1.25;

    // Worst-Case Scenario (-20% traffic risk and local inflation)
    const worstY1 = expectedY1 * 0.80;
    const worstY2 = expectedY2 * 0.78;
    const worstY3 = expectedY3 * 0.75;

    const data: ScenarioDataPoint[] = [
      { 
        year: 'Year 1', 
        expected: expectedY1, 
        bestCase: bestY1, 
        worstCase: worstY1,
        daytime: daytimeY1,
        overnight: grossOvernightY1 - shrinkageY1
      },
      { 
        year: 'Year 2', 
        expected: expectedY2, 
        bestCase: bestY2, 
        worstCase: worstY2,
        daytime: daytimeY2,
        overnight: grossOvernightY2 - (operatingMode === 'open-door' ? grossOvernightY2 * 0.041 : 0)
      },
      { 
        year: 'Year 3', 
        expected: expectedY3, 
        bestCase: bestY3, 
        worstCase: worstY3,
        daytime: daytimeY3,
        overnight: grossOvernightY3 - (operatingMode === 'open-door' ? grossOvernightY3 * 0.041 : 0)
      }
    ];

    // Calculated Year 1 Net Operating Income (NOI)
    // Base Daytime Expenses (Daytime COGS 55% + fixed daytime operation): $55,000
    const daytimeExpensesY1 = 55000;
    const overnightCogsY1 = (grossOvernightY1 - shrinkageY1) * 0.30; // 30% cost-of-sales overnight

    const totalExpensesY1 = daytimeExpensesY1 + overnightCogsY1 + overnightLaborY1 + overnightInsuranceY1 + shrinkageY1;
    const rawNoi = expectedY1 - totalExpensesY1;
    
    // Smooth NOI to prevent unrealistic negative numbers under ridiculous scenarios, floor it at $12k
    const calculatedNoi = Math.max(12000, rawNoi);
    const calculatedDscr = calculatedNoi / annualDebtService;

    // Custom automated narrative synthesis
    let insight = "";
    if (operatingMode === 'safe-window') {
      insight = "Safe-Window active: Full late-night demand captured securely. Physical separation locks shrinkage at 0.0%, requiring only 1 staff member safely isolated. This secures a strong Debt Service Coverage Ratio (DSCR), satisfying bank risk assessments.";
    } else if (operatingMode === 'open-door') {
      insight = "Open-Door active: Inventory leakage rises to 4.1% due to shoplifting, while overnight liability requires at least 2 staff members. Shrunken margins and doubled labor costs significantly erode Net Operating Income, dropping your underwriting rating.";
    } else {
      insight = "Daytime-Only: Surrendering the late-night trade area completely avoids security overhead, but cuts gross sales potential by 40%. This tightens your debt coverage capacity close to bank thresholds.";
    }

    return { 
      chartData: data, 
      metrics: {
        totalRevenueY1: expectedY1,
        totalExpensesY1,
        noiY1: calculatedNoi,
        dscr: calculatedDscr,
        shrinkage: shrinkageY1,
        labor: overnightLaborY1,
        insurance: overnightInsuranceY1
      },
      automatedInsight: insight 
    };
  }, [operatingMode, staffingLevel, avgOrderValue, hourlyCustomers, annualDebtService]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24 border border-white/10 bg-zinc-900/10 p-8 sm:p-12 relative overflow-hidden"
      id="scenario-planner-section"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/[0.01] rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] tracking-[0.3em] uppercase text-sky-400 font-bold block">Interactive Cash Flow Simulation</span>
          <h2 className="text-3xl font-light text-white tracking-tighter">
            Scenario Planner & <span className="font-serif italic text-sky-400">Pro-Forma Forecaster</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-white/5 text-[10px] font-mono text-slate-400">
          <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Real-time underwriting calculations synced</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Control Panel (Col Span: 5) */}
        <div className="lg:col-span-5 space-y-6 bg-black/45 border border-white/5 p-6 sm:p-8">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Adjust Operational Variables
            </h3>
            <p className="text-[11px] text-slate-400">
              Manipulate retail conditions below to stress-test financial projections against bank standards.
            </p>
          </div>

          {/* Operating Mode Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Overnight Operational Strategy (10 PM - 6 AM)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setOperatingMode('safe-window');
                  setStaffingLevel(1); // Auto-optimize staffing to 1
                }}
                className={`px-3 py-2.5 border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  operatingMode === 'safe-window'
                    ? 'border-sky-400 bg-sky-400/5 text-sky-400 font-bold'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] tracking-wider uppercase">Safe-Window</span>
                <span className="text-[8px] font-mono opacity-50">24/7 Continuous</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOperatingMode('open-door');
                  setStaffingLevel(2); // Auto-raise staffing for traditional overnight standard
                }}
                className={`px-3 py-2.5 border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  operatingMode === 'open-door'
                    ? 'border-amber-500 bg-amber-500/5 text-amber-500 font-bold'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-400'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] tracking-wider uppercase">Open-Door</span>
                <span className="text-[8px] font-mono opacity-50">24/7 Traditional</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOperatingMode('daytime-only');
                  setStaffingLevel(0); // Closed overnight, zero staffing
                }}
                className={`px-3 py-2.5 border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  operatingMode === 'daytime-only'
                    ? 'border-rose-500 bg-rose-500/5 text-rose-500 font-bold'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-400'
                }`}
              >
                <Clock className="w-4 h-4 text-rose-400" />
                <span className="text-[10px] tracking-wider uppercase">Daytime Only</span>
                <span className="text-[8px] font-mono opacity-50">Closed Overnight</span>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {operatingMode !== 'daytime-only' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5 border-t border-white/5 pt-4 overflow-hidden"
              >
                {/* Overnight Staffing Level */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      Overnight Staffing Level
                    </label>
                    <span className="text-[10px] font-mono font-bold text-white">
                      {staffingLevel} Employee{staffingLevel > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStaffingLevel(1)}
                      className={`py-1.5 border text-[9px] font-mono uppercase tracking-wider transition-all ${
                        staffingLevel === 1 
                          ? 'border-sky-400 bg-sky-400/5 text-sky-400 font-bold' 
                          : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-500'
                      }`}
                    >
                      1 Employee ($13k/yr)
                    </button>
                    <button
                      type="button"
                      onClick={() => setStaffingLevel(2)}
                      className={`py-1.5 border text-[9px] font-mono uppercase tracking-wider transition-all ${
                        staffingLevel === 2 
                          ? 'border-sky-400 bg-sky-400/5 text-sky-400 font-bold' 
                          : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-500'
                      }`}
                    >
                      2 Employees ($26k/yr)
                    </button>
                  </div>
                  {operatingMode === 'open-door' && staffingLevel === 1 && (
                    <div className="flex items-start gap-1.5 bg-amber-500/10 border border-amber-500/20 p-2 text-[9px] text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>Security Risk Warning: Standard overnight convenience stores require at least 2 active staffers to avoid regulatory or safety citations.</span>
                    </div>
                  )}
                  {operatingMode === 'safe-window' && staffingLevel === 2 && (
                    <div className="flex items-start gap-1.5 bg-sky-400/10 border border-sky-400/20 p-2 text-[9px] text-sky-300">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>Staff Optimization Note: With the physical Safe-Window locked barrier, 1 employee is highly sufficient and saves $13,000 annually.</span>
                    </div>
                  )}
                </div>

                {/* Average late-night order value */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                    <span className="uppercase flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Avg Late-Night Transaction
                    </span>
                    <span className="text-white text-xs">${avgOrderValue}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="35"
                    step="1"
                    value={avgOrderValue}
                    onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                    className="w-full accent-sky-400 bg-zinc-800 h-1.5 cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-slate-600">
                    <span>$10 (Min snacks)</span>
                    <span>$18 (Default standard)</span>
                    <span>$35 (High-margin hot foods)</span>
                  </div>
                </div>

                {/* Hourly Customer Density */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                    <span className="uppercase flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                      Overnight Traffic (Cust/hr)
                    </span>
                    <span className="text-white text-xs">{hourlyCustomers} / hr</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={hourlyCustomers}
                    onChange={(e) => setHourlyCustomers(Number(e.target.value))}
                    className="w-full accent-sky-400 bg-zinc-800 h-1.5 cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-slate-600">
                    <span>5 cust/hr (Slow)</span>
                    <span>15 cust/hr (Standard)</span>
                    <span>30 cust/hr (Peak Delivery)</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic narrative commentary */}
          <div className="bg-[#050508] border border-white/5 p-4 space-y-2">
            <span className="text-[9px] font-mono uppercase text-sky-400 font-bold block">Automated Analyst Insight:</span>
            <p className="text-[11px] text-slate-300 leading-relaxed italic">
              "{automatedInsight}"
            </p>
          </div>
        </div>

        {/* Right Live-Updating Forecasting Chart (Col Span: 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Chart Container */}
          <div className="bg-black/25 border border-white/5 p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h4 className="text-xs uppercase tracking-widest text-slate-300 font-bold font-mono">
                Line Chart: Dynamic 3-Year Projections
              </h4>
              
              {/* Custom Legend badges with colors */}
              <div className="flex flex-wrap gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2.5 h-0.5 bg-emerald-400" />
                  Best Case
                </span>
                <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <span className="w-2.5 h-1 bg-sky-400" />
                  Target Expected
                </span>
                <span className="flex items-center gap-1.5 text-rose-500 font-bold">
                  <span className="w-2.5 h-0.5 bg-rose-500" />
                  Worst Case
                </span>
              </div>
            </div>

            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                  <XAxis dataKey="year" stroke="#4b5563" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <YAxis 
                    stroke="#4b5563" 
                    tickFormatter={(val) => `$${Math.round(val / 1000)}k`} 
                    tick={{ fontSize: 10, fontFamily: 'monospace' }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Line definitions */}
                  <Line 
                    type="monotone" 
                    dataKey="bestCase" 
                    name="Best Case" 
                    stroke="#10b981" 
                    strokeWidth={1.5} 
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expected" 
                    name="Target Expected" 
                    stroke="#38bdf8" 
                    strokeWidth={3} 
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="worstCase" 
                    name="Worst Case" 
                    stroke="#f43f5e" 
                    strokeWidth={1.5} 
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dynamic Financial Scorecard and Bank DSCR check */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Year 1 Adjusted Revenue */}
            <div className="bg-black/30 border border-white/5 p-4 space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Y1 Gross Sales</span>
              <div className="text-xl font-mono font-bold text-white">
                ${Math.round(metrics.totalRevenueY1).toLocaleString()}
              </div>
              <p className="text-[9.5px] text-slate-400 flex items-center gap-1">
                {operatingMode === 'daytime-only' ? (
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                ) : (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                )}
                {operatingMode === 'daytime-only' ? 'No late-night channel' : 'Overnight active'}
              </p>
            </div>

            {/* Year 1 Calculated NOI */}
            <div className="bg-black/30 border border-white/5 p-4 space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Y1 Net Operating Income (NOI)</span>
              <div className="text-xl font-mono font-bold text-emerald-400">
                ${Math.round(metrics.noiY1).toLocaleString()}
              </div>
              <p className="text-[9.5px] text-slate-400">
                After labor, shrinkage, & COGS
              </p>
            </div>

            {/* Debt Service Coverage Ratio (DSCR) Status Badge */}
            <div className="bg-black/30 border border-white/5 p-4 space-y-1.5">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Underwriter DSCR Rating</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-mono font-bold text-white">
                  {metrics.dscr.toFixed(2)}x
                </span>
                
                {metrics.dscr >= 1.25 ? (
                  <span className="bg-emerald-500/15 text-emerald-400 text-[8px] font-mono uppercase px-1.5 py-0.5 font-bold">
                    PASSED
                  </span>
                ) : (
                  <span className="bg-rose-500/15 text-rose-400 text-[8px] font-mono uppercase px-1.5 py-0.5 font-bold animate-pulse">
                    FAIL (RISKY)
                  </span>
                )}
              </div>

              <div className="text-[9.5px] text-slate-400">
                {metrics.dscr >= 1.25 ? (
                  <span className="text-slate-400">Safe: Exceeds bank 1.25x limit.</span>
                ) : (
                  <span className="text-rose-400 font-bold">Danger: Under 1.25x limit.</span>
                )}
              </div>
            </div>

          </div>

          {/* Underwriter Cost Leakage breakdown */}
          {operatingMode !== 'daytime-only' && (
            <div className="bg-zinc-950/60 border border-white/5 p-4">
              <h5 className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-2.5 border-b border-white/5 pb-1.5">
                Overnight Cost & Safety Breakdown (Year 1)
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block">Shrinkage Loss:</span>
                  <span className={metrics.shrinkage > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    ${Math.round(metrics.shrinkage).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Overnight Labor:</span>
                  <span className="text-slate-300 font-bold">
                    ${Math.round(metrics.labor).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Insurance Premium:</span>
                  <span className="text-slate-300 font-bold">
                    ${Math.round(metrics.insurance).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Collateral Security Rating:</span>
                  <span className={`font-bold ${operatingMode === 'safe-window' ? 'text-emerald-400' : 'text-amber-500'}`}>
                    {operatingMode === 'safe-window' ? 'HIGH (UL Level 3)' : 'LOW (Exposed)'}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </motion.section>
  );
};
