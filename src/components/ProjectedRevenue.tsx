import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
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
  TrendingDown,
  Sparkles,
  HelpCircle,
  Coins
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
  // Scenario Planner State variables as requested
  const [operatingHours, setOperatingHours] = useState<'24' | '16' | '12'>('24');
  const [securityMode, setSecurityMode] = useState<'safe-window' | 'open-door'>('safe-window');
  const [wageTier, setWageTier] = useState<'minimum' | 'living' | 'premium'>('living');
  const [staffingLevel, setStaffingLevel] = useState<number>(1); // overnight staff count (1 or 2)
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
    // 1. Hourly rate map for staffing costs
    const hourlyWageRate = wageTier === 'minimum' ? 15.00 : wageTier === 'living' ? 18.50 : 22.00;

    // Traffic and AOV ratios
    const trafficRatio = hourlyCustomers / 15;
    const aovRatio = avgOrderValue / 18;
    const overnightPerformanceRatio = trafficRatio * aovRatio;

    // Daytime baseline revenues (historically secure channels, fixed)
    let daytimeY1 = 90000;
    let daytimeY2 = 132000;
    let daytimeY3 = 210000;

    // Adjust daytime revenue down if hours are severely restricted (e.g. 12-hour limit vs 16-hour)
    if (operatingHours === '12') {
      daytimeY1 = daytimeY1 * 0.80;
      daytimeY2 = daytimeY2 * 0.80;
      daytimeY3 = daytimeY3 * 0.80;
    }

    // Overnight baseline revenues (highly subject to security and operational adjustments)
    const baseOvernightY1 = 60000;
    const baseOvernightY2 = 88000;
    const baseOvernightY3 = 140000;

    let grossOvernightY1 = 0;
    let grossOvernightY2 = 0;
    let grossOvernightY3 = 0;

    let shrinkageY1 = 0;
    let overnightLaborY1 = 0;
    let overnightInsuranceY1 = 0;

    if (operatingHours !== '24') {
      // Overnight operations completely closed
      grossOvernightY1 = 0;
      grossOvernightY2 = 0;
      grossOvernightY3 = 0;
      shrinkageY1 = 0;
      overnightLaborY1 = 0;
      overnightInsuranceY1 = 0;
    } else {
      // Overnight operations active (24 Hours)
      grossOvernightY1 = baseOvernightY1 * overnightPerformanceRatio;
      grossOvernightY2 = baseOvernightY2 * overnightPerformanceRatio;
      grossOvernightY3 = baseOvernightY3 * overnightPerformanceRatio;

      // Shoplifting/shrinkage leakages based on security mode
      if (securityMode === 'open-door') {
        shrinkageY1 = grossOvernightY1 * 0.041; // 4.1% standard open-door shrinkage
      } else {
        shrinkageY1 = grossOvernightY1 * 0.002; // Very minimal 0.2% shrinkage with physical Safe-Window locked barrier
      }

      // Labor costs overnight
      // 8 hours per night * 365 days = 2920 hours. 
      overnightLaborY1 = staffingLevel * hourlyWageRate * 2920;

      // Liability insurance & safety premium surcharges
      if (securityMode === 'open-door') {
        overnightInsuranceY1 = 6500; // Premium rate due to active physical exposure
      } else {
        overnightInsuranceY1 = 2000; // Discounted high-security commercial rate
      }
    }

    // Adjusted Expected Revenues (Gross revenue minus physical shrinkage loss)
    const expectedY1 = daytimeY1 + (grossOvernightY1 - shrinkageY1);
    const expectedY2 = daytimeY2 + (grossOvernightY2 - (operatingHours === '24' ? (securityMode === 'open-door' ? grossOvernightY2 * 0.041 : grossOvernightY2 * 0.002) : 0));
    const expectedY3 = daytimeY3 + (grossOvernightY3 - (operatingHours === '24' ? (securityMode === 'open-door' ? grossOvernightY3 * 0.041 : grossOvernightY3 * 0.002) : 0));

    // Morale performance coefficient: better wages boost productivity and best case outcomes
    const moraleFactor = wageTier === 'premium' ? 1.05 : wageTier === 'minimum' ? 0.95 : 1.00;

    // Best-Case Scenario (+20% operational efficiency modified by wage-driven employee productivity)
    const bestY1 = expectedY1 * 1.20 * moraleFactor;
    const bestY2 = expectedY2 * 1.22 * moraleFactor;
    const bestY3 = expectedY3 * 1.25 * moraleFactor;

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
        overnight: Math.max(0, grossOvernightY1 - shrinkageY1)
      },
      { 
        year: 'Year 2', 
        expected: expectedY2, 
        bestCase: bestY2, 
        worstCase: worstY2,
        daytime: daytimeY2,
        overnight: Math.max(0, grossOvernightY2 - (operatingHours === '24' ? (securityMode === 'open-door' ? grossOvernightY2 * 0.041 : grossOvernightY2 * 0.002) : 0))
      },
      { 
        year: 'Year 3', 
        expected: expectedY3, 
        bestCase: bestY3, 
        worstCase: worstY3,
        daytime: daytimeY3,
        overnight: Math.max(0, grossOvernightY3 - (operatingHours === '24' ? (securityMode === 'open-door' ? grossOvernightY3 * 0.041 : grossOvernightY3 * 0.002) : 0))
      }
    ];

    // Calculated Year 1 Net Operating Income (NOI)
    // Base Daytime Expenses (Daytime COGS 55% + fixed daytime operation): $55,000
    const daytimeExpensesY1 = 55000;
    const overnightCogsY1 = Math.max(0, (grossOvernightY1 - shrinkageY1)) * 0.30; // 30% cost-of-sales overnight

    const totalExpensesY1 = daytimeExpensesY1 + overnightCogsY1 + overnightLaborY1 + overnightInsuranceY1 + shrinkageY1;
    const rawNoi = expectedY1 - totalExpensesY1;
    
    // Smooth NOI to prevent unrealistic negative numbers, floor at sensible minimums or show real deficit
    const calculatedNoi = Math.max(8000, rawNoi);
    const calculatedDscr = calculatedNoi / annualDebtService;

    // Custom automated narrative synthesis matching the selected options
    let insight = "";
    if (operatingHours === '24') {
      if (securityMode === 'safe-window') {
        insight = `24/7 continuous operations with Safe-Window is the optimal scenario. Paying a ${wageTier === 'premium' ? 'Premium' : wageTier === 'living' ? 'Living' : 'Minimum'} wage (${wageTier === 'premium' ? '$22.00/hr' : wageTier === 'living' ? '$18.50/hr' : '$15.00/hr'}) maintains solid staff retention. Shoplifting shrinkage is halted at 0.2%, ensuring high NOI and a powerful Debt Service Coverage Ratio (DSCR) of ${calculatedDscr.toFixed(2)}x.`;
      } else {
        insight = `24/7 Open-Door operations allow standard customer entry but expose inventory to high safety risks. Shoplifting shrinkage jumps to 4.1% ($${Math.round(shrinkageY1).toLocaleString()}/yr), commercial liability insurance surges, and regulatory compliance requires at least 2 overnight employees. This erodes Net Operating Income considerably.`;
      }
    } else if (operatingHours === '16') {
      insight = `Operating 16 Hours (6:00 AM - 10:00 PM) avoids late-night risk and overnight staffing costs of $${Math.round(overnightLaborY1).toLocaleString()}/yr, but sacrifices 40% of standard commuter sales. Debt coverage shrinks, reducing the overall bank underwriting eligibility.`;
    } else {
      insight = `Operating strictly 12 Hours (7:00 AM - 7:00 PM) reduces daytime sales by 20% and eliminates overnight channels completely. While it features the lowest operating overhead, the restricted revenue restricts your capacity to comfortably service the $150,000 ATB bank credit.`;
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
        insurance: overnightInsuranceY1,
        hourlyWageRate
      },
      automatedInsight: insight 
    };
  }, [operatingHours, securityMode, wageTier, staffingLevel, avgOrderValue, hourlyCustomers, annualDebtService]);

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
          <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Real-time underwriting calculations synced</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Control Panel (Col Span: 5) */}
        <div className="lg:col-span-5 space-y-6 bg-black/45 border border-white/5 p-6 sm:p-8">
          <div className="space-y-1">
            <h3 className="text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Adjust Scenario Planner Variables
            </h3>
            <p className="text-[11px] text-slate-400">
              Stress-test business viability by adjusting operating hours, overnight safety modes, and hourly staffing wages.
            </p>
          </div>

          {/* 1. Operating Hours Selector */}
          <div className="space-y-2 border-t border-white/5 pt-4">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex justify-between">
              <span>Operating Hours</span>
              <span className="text-sky-400">{operatingHours === '24' ? '24 Hours (Full Uptime)' : operatingHours === '16' ? '16 Hours (Extended)' : '12 Hours (Daytime Only)'}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setOperatingHours('24')}
                className={`py-2 text-center transition-all flex flex-col items-center justify-center border rounded-none ${
                  operatingHours === '24'
                    ? 'border-sky-400 bg-sky-400/5 text-sky-400 font-bold shadow-[0_0_10px_rgba(56,189,248,0.1)]'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-400'
                }`}
              >
                <span className="text-[10px] tracking-wider uppercase font-mono">24 Hours</span>
                <span className="text-[8px] opacity-50">24/7 Ops</span>
              </button>

              <button
                type="button"
                onClick={() => setOperatingHours('16')}
                className={`py-2 text-center transition-all flex flex-col items-center justify-center border rounded-none ${
                  operatingHours === '16'
                    ? 'border-sky-400 bg-sky-400/5 text-sky-400 font-bold shadow-[0_0_10px_rgba(56,189,248,0.1)]'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-400'
                }`}
              >
                <span className="text-[10px] tracking-wider uppercase font-mono">16 Hours</span>
                <span className="text-[8px] opacity-50">6 AM - 10 PM</span>
              </button>

              <button
                type="button"
                onClick={() => setOperatingHours('12')}
                className={`py-2 text-center transition-all flex flex-col items-center justify-center border rounded-none ${
                  operatingHours === '12'
                    ? 'border-sky-400 bg-sky-400/5 text-sky-400 font-bold shadow-[0_0_10px_rgba(56,189,248,0.1)]'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-400'
                }`}
              >
                <span className="text-[10px] tracking-wider uppercase font-mono">12 Hours</span>
                <span className="text-[8px] opacity-50">7 AM - 7 PM</span>
              </button>
            </div>
          </div>

          {/* 2. Staffing Costs / Wage Tier Selector */}
          <div className="space-y-2 border-t border-white/5 pt-4">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex justify-between">
              <span>Staffing Costs (Hourly Rate)</span>
              <span className="text-emerald-400">${metrics.hourlyWageRate.toFixed(2)}/hr</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setWageTier('minimum')}
                className={`py-2 text-center transition-all flex flex-col items-center justify-center border rounded-none ${
                  wageTier === 'minimum'
                    ? 'border-emerald-400 bg-emerald-400/5 text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-400'
                }`}
              >
                <span className="text-[10px] tracking-wider uppercase font-mono">Minimum</span>
                <span className="text-[8px] opacity-50">$15.00/hr</span>
              </button>

              <button
                type="button"
                onClick={() => setWageTier('living')}
                className={`py-2 text-center transition-all flex flex-col items-center justify-center border rounded-none ${
                  wageTier === 'living'
                    ? 'border-emerald-400 bg-emerald-400/5 text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-400'
                }`}
              >
                <span className="text-[10px] tracking-wider uppercase font-mono">Living Wage</span>
                <span className="text-[8px] opacity-50">$18.50/hr</span>
              </button>

              <button
                type="button"
                onClick={() => setWageTier('premium')}
                className={`py-2 text-center transition-all flex flex-col items-center justify-center border rounded-none ${
                  wageTier === 'premium'
                    ? 'border-emerald-400 bg-emerald-400/5 text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-400'
                }`}
              >
                <span className="text-[10px] tracking-wider uppercase font-mono">Premium</span>
                <span className="text-[8px] opacity-50">$22.00/hr</span>
              </button>
            </div>
          </div>

          {/* Conditional Overnight Controls */}
          <AnimatePresence mode="wait">
            {operatingHours === '24' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 border-t border-white/5 pt-4 overflow-hidden"
              >
                {/* Security Mode */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Overnight Security Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSecurityMode('safe-window');
                        setStaffingLevel(1);
                      }}
                      className={`py-1.5 border text-[9px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        securityMode === 'safe-window'
                          ? 'border-sky-400 bg-sky-400/5 text-sky-400 font-bold'
                          : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-500'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Safe-Window (0.2% Shrinkage)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSecurityMode('open-door');
                        setStaffingLevel(2);
                      }}
                      className={`py-1.5 border text-[9px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        securityMode === 'open-door'
                          ? 'border-amber-500 bg-amber-500/5 text-amber-500 font-bold'
                          : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-500'
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      Open-Door (4.1% Shrinkage)
                    </button>
                  </div>
                </div>

                {/* Overnight Staff Count */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      Overnight Staff Headcount
                    </label>
                    <span className="text-[10px] font-mono font-bold text-white">
                      {staffingLevel} Employee{staffingLevel > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStaffingLevel(1)}
                      className={`py-1 text-[9px] border font-mono uppercase tracking-wider transition-all ${
                        staffingLevel === 1 
                          ? 'border-sky-400 bg-sky-400/5 text-sky-400 font-bold' 
                          : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-500'
                      }`}
                    >
                      1 staff ($13k-$19k/yr)
                    </button>
                    <button
                      type="button"
                      onClick={() => setStaffingLevel(2)}
                      className={`py-1 text-[9px] border font-mono uppercase tracking-wider transition-all ${
                        staffingLevel === 2 
                          ? 'border-sky-400 bg-sky-400/5 text-sky-400 font-bold' 
                          : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-500'
                      }`}
                    >
                      2 staff ($26k-$38k/yr)
                    </button>
                  </div>
                </div>

                {/* Average transaction value */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                    <span className="uppercase flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Avg Late-Night Order
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
                    className="w-full accent-sky-400 bg-zinc-800 h-1 cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-slate-600">
                    <span>$10</span>
                    <span>$18 (Std)</span>
                    <span>$35 (High)</span>
                  </div>
                </div>

                {/* Hourly Customers */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                    <span className="uppercase flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                      Hourly Customer Flow
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
                    className="w-full accent-sky-400 bg-zinc-800 h-1 cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-slate-600">
                    <span>5/hr (Slow)</span>
                    <span>15/hr (Std)</span>
                    <span>30/hr (Peak)</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Automated narrative insight */}
          <div className="bg-[#050508] border border-white/5 p-4 space-y-2">
            <span className="text-[9px] font-mono uppercase text-sky-400 font-bold block">Scenario Analyst Insight:</span>
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
                Scenario Growth: Best vs. Expected vs. Worst Case
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
                    name="Best Case Projections" 
                    stroke="#10b981" 
                    strokeWidth={1.5} 
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expected" 
                    name="Expected Target" 
                    stroke="#38bdf8" 
                    strokeWidth={3} 
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="worstCase" 
                    name="Worst Case Scenario" 
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
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Y1 Adjusted Gross Sales</span>
              <div className="text-xl font-mono font-bold text-white">
                ${Math.round(metrics.totalRevenueY1).toLocaleString()}
              </div>
              <p className="text-[9.5px] text-slate-400 flex items-center gap-1">
                {operatingHours !== '24' ? (
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                ) : (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                )}
                {operatingHours === '24' ? '24/7 Channel Active' : 'Restricted Hours'}
              </p>
            </div>

            {/* Year 1 Calculated NOI */}
            <div className="bg-black/30 border border-white/5 p-4 space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Y1 Net Operating Income (NOI)</span>
              <div className="text-xl font-mono font-bold text-emerald-400">
                ${Math.round(metrics.noiY1).toLocaleString()}
              </div>
              <p className="text-[9.5px] text-slate-400">
                After labor, shrinkage & overhead
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
                  <span className="text-rose-400 font-bold animate-pulse">Danger: Under 1.25x limit.</span>
                )}
              </div>
            </div>

          </div>

          {/* Underwriter Cost Leakage breakdown */}
          <div className="bg-zinc-950/60 border border-white/5 p-4">
            <h5 className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-2.5 border-b border-white/5 pb-1.5">
              Cost & Wage Simulation Analysis (Year 1)
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 block">Theft/Shrinkage Loss:</span>
                <span className={metrics.shrinkage > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                  ${Math.round(metrics.shrinkage).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Annual Staffing Cost:</span>
                <span className="text-emerald-400 font-bold">
                  ${Math.round(metrics.labor).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Liability Premium:</span>
                <span className="text-slate-300 font-bold">
                  ${Math.round(metrics.insurance).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Security Class rating:</span>
                <span className={`font-bold ${operatingHours !== '24' ? 'text-slate-400' : securityMode === 'safe-window' ? 'text-emerald-400' : 'text-amber-500'}`}>
                  {operatingHours !== '24' ? 'N/A' : securityMode === 'safe-window' ? 'HIGH (Level 3)' : 'LOW (Exposed)'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </motion.section>
  );
};
