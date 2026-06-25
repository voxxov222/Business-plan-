import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Percent, 
  DollarSign, 
  Sliders, 
  Briefcase, 
  BarChart3, 
  PieChart, 
  RefreshCw, 
  HelpCircle, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Info,
  Shield,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';

// Helper function to compute Net Present Value
function calculateNPV(cashFlows: number[], discountRate: number): number {
  let npv = 0;
  for (let t = 0; t < cashFlows.length; t++) {
    npv += cashFlows[t] / Math.pow(1 + discountRate, t);
  }
  return npv;
}

// Helper function to compute Internal Rate of Return (IRR) numerically
function calculateIRR(cashFlows: number[]): number {
  let r = 0.15; // initial guess
  for (let i = 0; i < 150; i++) {
    let npv = 0;
    let dNPV = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + r, t);
      if (t > 0) {
        dNPV -= t * cashFlows[t] / Math.pow(1 + r, t + 1);
      }
    }
    if (Math.abs(npv) < 1e-6) {
      return r * 100; // as percentage
    }
    if (Math.abs(dNPV) < 1e-12) break; // avoid division by zero
    const nextR = r - npv / dNPV;
    if (Math.abs(nextR - r) < 1e-6) {
      return nextR * 100;
    }
    r = nextR;
  }
  
  // High-reliability brute-force scanner fallback if Newton-Raphson diverges
  if (isNaN(r) || r < -0.99 || r > 5.0) {
    let bestR = -0.5;
    let minNPV = Infinity;
    for (let candidate = -0.99; candidate <= 4.0; candidate += 0.005) {
      let currentNPV = 0;
      for (let t = 0; t < cashFlows.length; t++) {
        currentNPV += cashFlows[t] / Math.pow(1 + candidate, t);
      }
      if (Math.abs(currentNPV) < Math.abs(minNPV)) {
        minNPV = currentNPV;
        bestR = candidate;
      }
    }
    return bestR * 100;
  }
  return r * 100;
}

type FundingStructure = 'equity' | 'debt' | 'rev_share';

export const InvestorROIVisualizer = () => {
  // Primary slider controls
  const [fundingType, setFundingType] = useState<FundingStructure>('equity');
  const [principal, setPrincipal] = useState<number>(150000); // Requested start-up principal
  const [y1Revenue, setY1Revenue] = useState<number>(450000); // Year 1 projected revenue
  const [revenueGrowth, setRevenueGrowth] = useState<number>(20); // Annual rev growth (percentage)
  const [netMargin, setNetMargin] = useState<number>(18); // Net profit margin (percentage)
  
  // Equity parameters
  const [equityOffered, setEquityOffered] = useState<number>(15); // % of equity offered
  const [divPayoutRatio, setDivPayoutRatio] = useState<number>(50); // % of net profits distributed annually
  const [exitMultiple, setExitMultiple] = useState<number>(10); // Year 5 valuation multiple on Net Income

  // Debt parameters
  const [interestRate, setInterestRate] = useState<number>(8.5); // Annual interest rate (percentage)
  const [loanTerm, setLoanTerm] = useState<number>(5); // Term in years

  // Revenue share parameters
  const [revSharePct, setRevSharePct] = useState<number>(5); // Royalty share of top-line revenue
  const [repaymentCapMultiplier, setRepaymentCapMultiplier] = useState<number>(2.0); // 1.5x - 3.0x payback cap

  // Active chart tab
  const [activeChartTab, setActiveChartTab] = useState<'payouts' | 'cumFlow' | 'sensitivity'>('payouts');

  // Perform financial calculations over a 5-year model
  const financials = useMemo(() => {
    const years = [1, 2, 3, 4, 5];
    const dataPoints: any[] = [];
    
    // Track core company projections
    let currentRevenue = y1Revenue;
    const marginRatio = netMargin / 100;
    
    // Arrays to feed into IRR/NPV solvers
    // Year 0 Cash flow is the negative initial investment
    const investorCashFlows = [-principal];
    const companyCashFlows = [principal]; // capital injection

    let cumulativeInvestorReturn = 0;
    let companyValue = 0;

    years.forEach((yr) => {
      if (yr > 1) {
        currentRevenue = currentRevenue * (1 + revenueGrowth / 100);
      }
      
      const netProfit = currentRevenue * marginRatio;
      let investorPayout = 0;
      let remainingProfit = netProfit;

      // Calculate investor payouts based on the chosen funding structure
      if (fundingType === 'equity') {
        const totalDividends = netProfit * (divPayoutRatio / 100);
        investorPayout = totalDividends * (equityOffered / 100);
        remainingProfit = netProfit - totalDividends;
      } else if (fundingType === 'debt') {
        // Simple amortized loan repayment formula (annual equivalent)
        const rate = interestRate / 100;
        const annualPayment = (principal * rate * Math.pow(1 + rate, loanTerm)) / (Math.pow(1 + rate, loanTerm) - 1);
        if (yr <= loanTerm) {
          investorPayout = annualPayment;
        } else {
          investorPayout = 0;
        }
        remainingProfit = netProfit - investorPayout;
      } else if (fundingType === 'rev_share') {
        // Royalty based on top line revenue
        const targetRoyalty = currentRevenue * (revSharePct / 100);
        const capAmount = principal * repaymentCapMultiplier;
        
        // Ensure we don't exceed the repayment cap
        if (cumulativeInvestorReturn < capAmount) {
          const remainingCap = capAmount - cumulativeInvestorReturn;
          investorPayout = Math.min(targetRoyalty, remainingCap);
        } else {
          investorPayout = 0;
        }
        remainingProfit = netProfit - investorPayout;
      }

      cumulativeInvestorReturn += investorPayout;
      investorCashFlows.push(investorPayout);
      companyCashFlows.push(remainingProfit);

      // Estimate company valuation based on Year 5 exit multiples
      // Standard EBITDA multiple projection or PE multiple for retail
      companyValue = netProfit * exitMultiple;

      dataPoints.push({
        year: `Year ${yr}`,
        revenue: Math.round(currentRevenue),
        netProfit: Math.round(netProfit),
        investorPayout: Math.round(investorPayout),
        cumulativeReturn: Math.round(cumulativeInvestorReturn),
        companyValue: Math.round(companyValue),
        netCashFlow: Math.round(netProfit - investorPayout)
      });
    });

    // For equity funding, the exit scenario includes selling the equity stake in Year 5
    if (fundingType === 'equity') {
      const year5Valuation = dataPoints[4].netProfit * exitMultiple;
      const equityExitValue = year5Valuation * (equityOffered / 100);
      
      // Add the liquidation of equity to Year 5 cash flow
      investorCashFlows[5] += equityExitValue;
      dataPoints[4].cumulativeReturn += equityExitValue;
      dataPoints[4].exitPayoff = Math.round(equityExitValue);
    }

    // Calculate metrics
    const totalReturn = fundingType === 'equity' 
      ? cumulativeInvestorReturn + (dataPoints[4].exitPayoff || 0)
      : cumulativeInvestorReturn;
      
    const roiMultiplier = totalReturn / principal;
    const netReturnPercent = ((totalReturn - principal) / principal) * 100;
    
    const irr = calculateIRR(investorCashFlows);
    const npv = calculateNPV(investorCashFlows, 0.10); // Standard 10% discount hurdle rate

    // Calculate sensitivity data (Annual growth rate vs net margin)
    const growthScenarios = [10, 20, 30, 40];
    const marginScenarios = [12, 18, 25, 30];
    const sensitivityData = growthScenarios.map((growth) => {
      const row: any = { growth: `${growth}% Growth` };
      marginScenarios.forEach((margin) => {
        // Calculate cumulative Year 5 payout for each coordinate
        let testRev = y1Revenue;
        let testCumReturn = 0;
        let testCumPayoutArray = [-principal];

        for (let t = 1; t <= 5; t++) {
          if (t > 1) testRev = testRev * (1 + growth / 100);
          const testProfit = testRev * (margin / 100);
          
          let testPayout = 0;
          if (fundingType === 'equity') {
            testPayout = (testProfit * (divPayoutRatio / 100)) * (equityOffered / 100);
          } else if (fundingType === 'debt') {
            const rate = interestRate / 100;
            const annualPayment = (principal * rate * Math.pow(1 + rate, loanTerm)) / (Math.pow(1 + rate, loanTerm) - 1);
            testPayout = t <= loanTerm ? annualPayment : 0;
          } else if (fundingType === 'rev_share') {
            const targetRoyalty = testRev * (revSharePct / 100);
            const capAmount = principal * repaymentCapMultiplier;
            if (testCumReturn < capAmount) {
              testPayout = Math.min(targetRoyalty, capAmount - testCumReturn);
            }
          }
          testCumReturn += testPayout;
          testCumPayoutArray.push(testPayout);
        }

        if (fundingType === 'equity') {
          const testY5Profit = testRev * (margin / 100);
          const testExitVal = testY5Profit * exitMultiple;
          const exitPayoff = testExitVal * (equityOffered / 100);
          testCumReturn += exitPayoff;
          testCumPayoutArray[5] += exitPayoff;
        }

        const testIrr = calculateIRR(testCumPayoutArray);
        row[`m_${margin}`] = parseFloat(testIrr.toFixed(1));
      });
      return row;
    });

    return {
      dataPoints,
      totalReturn,
      roiMultiplier,
      netReturnPercent,
      irr,
      npv,
      sensitivityData,
      investorCashFlows
    };
  }, [
    fundingType, 
    principal, 
    y1Revenue, 
    revenueGrowth, 
    netMargin, 
    equityOffered, 
    divPayoutRatio, 
    exitMultiple, 
    interestRate, 
    loanTerm, 
    revSharePct, 
    repaymentCapMultiplier
  ]);

  // Quick formatted values helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24 border border-sky-900/30 bg-[#06080e]/95 p-6 sm:p-10 relative overflow-hidden"
      id="investor-roi-visualizer-section"
    >
      {/* Visual Blueprint Grid Layout accents */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/[0.02] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Title block */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10 border-b border-sky-950/40 pb-6">
        <div className="space-y-1.5">
          <span className="text-[9px] tracking-[0.35em] uppercase text-sky-400 font-bold block">Funding Risk-Mitigation Model</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tighter">
            Startup Funding & <span className="font-serif italic text-sky-400">Interactive ROI Engine</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Configure various capital deployment channels including <strong>Equity Growth</strong>, <strong>Amortized Debt</strong>, or <strong>Top-Line Royalty structures</strong>. Adjust target margins and growth trajectories to simulate underwritten return scenarios.
          </p>
        </div>

        {/* Structure Selector Pill */}
        <div className="flex bg-zinc-950 p-1 border border-white/5 rounded-none shrink-0 self-start xl:self-center">
          <button
            type="button"
            onClick={() => setFundingType('equity')}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
              fundingType === 'equity'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            Equity Yield
          </button>
          <button
            type="button"
            onClick={() => setFundingType('debt')}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
              fundingType === 'debt'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Amortized Debt
          </button>
          <button
            type="button"
            onClick={() => setFundingType('rev_share')}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
              fundingType === 'rev_share'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Revenue Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: SLIDER CONTROLS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#05060a] border border-sky-950/40 p-6 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2 border-b border-sky-950 pb-3">
              <Sliders className="w-4 h-4 text-sky-400" />
              Interactive Parameters
            </h3>

            {/* Slider 1: Funding Requested */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Total Capital Injection</span>
                <span className="text-white font-bold">{formatCurrency(principal)}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="300000"
                step="10000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-sky-400 bg-sky-950/30 h-1 rounded-lg cursor-pointer"
              />
              <span className="text-[9px] text-slate-500 block">Required for store acquisition, security build-out, refrigeration.</span>
            </div>

            {/* Slider 2: Year 1 Revenue Target */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Year 1 Target Revenue</span>
                <span className="text-white font-bold">{formatCurrency(y1Revenue)}</span>
              </div>
              <input
                type="range"
                min="200000"
                max="800000"
                step="25000"
                value={y1Revenue}
                onChange={(e) => setY1Revenue(Number(e.target.value))}
                className="w-full accent-sky-400 bg-sky-950/30 h-1 rounded-lg cursor-pointer"
              />
              <span className="text-[9px] text-slate-500 block">Based on historic local convenience store averages ($1,250 daily).</span>
            </div>

            {/* Slider 3: Revenue Annual Growth */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Yearly Revenue Growth</span>
                <span className="text-white font-bold">{revenueGrowth}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="5"
                value={revenueGrowth}
                onChange={(e) => setRevenueGrowth(Number(e.target.value))}
                className="w-full accent-sky-400 bg-sky-950/30 h-1 rounded-lg cursor-pointer"
              />
              <span className="text-[9px] text-slate-500 block">Targeting steady late-night customer density expansion.</span>
            </div>

            {/* Slider 4: Net Margin Profile */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Projected Net Profit Margin</span>
                <span className="text-white font-bold">{netMargin}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                step="1"
                value={netMargin}
                onChange={(e) => setNetMargin(Number(e.target.value))}
                className="w-full accent-sky-400 bg-sky-950/30 h-1 rounded-lg cursor-pointer"
              />
              <span className="text-[9px] text-slate-500 block">Baseline model utilizes 18% net margin due to low late-night overhead.</span>
            </div>

            {/* SEGMENT DYNAMIC CONTROLS BASED ON FUNDING TYPE */}
            <div className="border-t border-sky-950/40 pt-5 space-y-4">
              <span className="text-[9.5px] font-mono text-sky-400 uppercase tracking-widest font-bold block">
                {fundingType === 'equity' && 'Equity Specific Options'}
                {fundingType === 'debt' && 'Debt Amortization Options'}
                {fundingType === 'rev_share' && 'Royalty Structure Options'}
              </span>

              {fundingType === 'equity' && (
                <>
                  {/* Slider: Equity Percent */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Equity Stake Offered</span>
                      <span className="text-white font-bold">{equityOffered}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="35"
                      step="1"
                      value={equityOffered}
                      onChange={(e) => setEquityOffered(Number(e.target.value))}
                      className="w-full accent-sky-400 bg-sky-950/30 h-1 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Slider: Dividends payout */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Annual Dividend Payout Ratio</span>
                      <span className="text-white font-bold">{divPayoutRatio}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="10"
                      value={divPayoutRatio}
                      onChange={(e) => setDivPayoutRatio(Number(e.target.value))}
                      className="w-full accent-sky-400 bg-sky-950/30 h-1 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Slider: Exit multiple */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Year 5 Valuation Multiple</span>
                      <span className="text-white font-bold">{exitMultiple}x EBITDA</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="15"
                      step="1"
                      value={exitMultiple}
                      onChange={(e) => setExitMultiple(Number(e.target.value))}
                      className="w-full accent-sky-400 bg-sky-950/30 h-1 rounded-lg cursor-pointer"
                    />
                  </div>
                </>
              )}

              {fundingType === 'debt' && (
                <>
                  {/* Slider: Interest rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Annual Interest Rate</span>
                      <span className="text-white font-bold">{interestRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="5.0"
                      max="15.0"
                      step="0.5"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full accent-sky-400 bg-sky-950/30 h-1 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Slider: Loan Term */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Repayment Term</span>
                      <span className="text-white font-bold">{loanTerm} Years</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="7"
                      step="1"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full accent-sky-400 bg-sky-950/30 h-1 rounded-lg cursor-pointer"
                    />
                  </div>
                </>
              )}

              {fundingType === 'rev_share' && (
                <>
                  {/* Slider: Royalty rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Top-Line Royalty Share</span>
                      <span className="text-white font-bold">{revSharePct}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      step="0.5"
                      value={revSharePct}
                      onChange={(e) => setRevSharePct(Number(e.target.value))}
                      className="w-full accent-sky-400 bg-sky-950/30 h-1 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Slider: Cap multiplier */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Total Repayment Cap</span>
                      <span className="text-white font-bold">{repaymentCapMultiplier}x Capital ({formatCurrency(principal * repaymentCapMultiplier)})</span>
                    </div>
                    <input
                      type="range"
                      min="1.5"
                      max="3.0"
                      step="0.1"
                      value={repaymentCapMultiplier}
                      onChange={(e) => setRepaymentCapMultiplier(Number(e.target.value))}
                      className="w-full accent-sky-400 bg-sky-950/30 h-1 rounded-lg cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: METRICS & INTERACTIVE CHARTS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* ROI Metric Cards Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-[#05060a] border border-sky-950/40 p-4 font-mono text-center relative overflow-hidden">
              <span className="text-[8.5px] text-slate-500 uppercase block mb-1">Estimated IRR</span>
              <span className={`text-2xl font-light tracking-tight ${financials.irr > 15 ? 'text-emerald-400' : 'text-sky-300'}`}>
                {financials.irr > 0 ? `${financials.irr.toFixed(1)}%` : 'N/A'}
              </span>
              <span className="text-[7.5px] text-slate-500 block mt-1">Hurdle Target: 10%</span>
            </div>

            <div className="bg-[#05060a] border border-sky-950/40 p-4 font-mono text-center relative overflow-hidden">
              <span className="text-[8.5px] text-slate-500 uppercase block mb-1">Net Present Value</span>
              <span className={`text-xl sm:text-2xl font-light tracking-tight ${financials.npv > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                {formatCurrency(financials.npv)}
              </span>
              <span className="text-[7.5px] text-slate-500 block mt-1">Discount Rate: 10%</span>
            </div>

            <div className="bg-[#05060a] border border-sky-950/40 p-4 font-mono text-center relative overflow-hidden">
              <span className="text-[8.5px] text-slate-500 uppercase block mb-1">Total Return</span>
              <span className="text-2xl font-light text-white tracking-tight">
                {formatCurrency(financials.totalReturn)}
              </span>
              <span className="text-[7.5px] text-slate-500 block mt-1">Cumulative payouts</span>
            </div>

            <div className="bg-[#05060a] border border-sky-950/40 p-4 font-mono text-center relative overflow-hidden">
              <span className="text-[8.5px] text-slate-500 uppercase block mb-1">Payback Multiple</span>
              <span className="text-2xl font-light text-sky-400 tracking-tight">
                {financials.roiMultiplier.toFixed(2)}x
              </span>
              <span className="text-[7.5px] text-slate-500 block mt-1">ROI: {financials.netReturnPercent.toFixed(0)}%</span>
            </div>

          </div>

          {/* Interactive Chart Container */}
          <div className="bg-zinc-950 border border-sky-950/50 p-6">
            
            {/* Chart Sub Tabs */}
            <div className="flex justify-between items-center border-b border-sky-950 pb-4 mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                Financial Visualization
              </h4>

              <div className="flex gap-1.5 bg-[#040609] p-0.5 border border-sky-950/40">
                <button
                  type="button"
                  onClick={() => setActiveChartTab('payouts')}
                  className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    activeChartTab === 'payouts'
                      ? 'bg-sky-500/10 text-sky-400 font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Annual Payouts
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartTab('cumFlow')}
                  className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    activeChartTab === 'cumFlow'
                      ? 'bg-sky-500/10 text-sky-400 font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Cumulative Return
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartTab('sensitivity')}
                  className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    activeChartTab === 'sensitivity'
                      ? 'bg-sky-500/10 text-sky-400 font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Sensitivity Matrix
                </button>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeChartTab === 'payouts' ? (
                  <BarChart data={financials.dataPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                    <XAxis dataKey="year" stroke="#475569" fontSize={10} fontStyle="italic" />
                    <YAxis stroke="#475569" fontSize={10} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#05070a', border: '1px solid #0f172a', borderRadius: 0 }}
                      itemStyle={{ color: '#94a3b8', fontSize: 11 }}
                      labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: 11 }}
                      formatter={(value: any) => [formatCurrency(Number(value)), 'Investor Dividend/Payment']}
                    />
                    <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                    <Bar dataKey="investorPayout" name="Yearly Cash Outflow to Investor" fill="#38bdf8" radius={[0, 0, 0, 0]} />
                  </BarChart>
                ) : activeChartTab === 'cumFlow' ? (
                  <AreaChart data={financials.dataPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReturnGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                    <XAxis dataKey="year" stroke="#475569" fontSize={10} />
                    <YAxis stroke="#475569" fontSize={10} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#05070a', border: '1px solid #0f172a', borderRadius: 0 }}
                      itemStyle={{ color: '#94a3b8', fontSize: 11 }}
                      labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: 11 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                    <Area type="monotone" dataKey="cumulativeReturn" name="Cumulative Payout Portfolio" stroke="#10b981" fillOpacity={1} fill="url(#colorReturnGrad)" />
                    {fundingType === 'equity' && (
                      <Line type="monotone" dataKey="companyValue" name="Total Company Valuation" stroke="#a78bfa" strokeDasharray="4 4" />
                    )}
                  </AreaChart>
                ) : (
                  /* Sensitivity Matrix - represented as layered lines */
                  <LineChart data={financials.sensitivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                    <XAxis dataKey="growth" stroke="#475569" fontSize={10} />
                    <YAxis stroke="#475569" fontSize={10} unit="%" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#05070a', border: '1px solid #0f172a', borderRadius: 0 }}
                      itemStyle={{ fontSize: 11 }}
                      labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: 11 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                    <Line type="monotone" dataKey="m_12" name="12% Net Margin (IRR%)" stroke="#94a3b8" />
                    <Line type="monotone" dataKey="m_18" name="18% Baseline (IRR%)" stroke="#38bdf8" strokeWidth={2} />
                    <Line type="monotone" dataKey="m_25" name="25% Mid-Target (IRR%)" stroke="#818cf8" />
                    <Line type="monotone" dataKey="m_30" name="30% High-Target (IRR%)" stroke="#10b981" />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Footnote dynamic logic */}
            <div className="mt-4 pt-4 border-t border-sky-950/40 flex items-start gap-2 text-[10.5px] text-slate-400 font-sans">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <p>
                {fundingType === 'equity' && `Equity Exit valuation assumes selling your ${equityOffered}% shares in Year 5 at ${exitMultiple}x earnings. All intermediate years assume a ${divPayoutRatio}% annual distributed dividend.`}
                {fundingType === 'debt' && `Debt payback model uses a rigid annual coupon payoff. Standard risk exposure applies. Total debt service equates to ${formatCurrency(financials.totalReturn)} paid in full by Year ${loanTerm}.`}
                {fundingType === 'rev_share' && `Royalty shares pay out directly from top-line revenues without deducting cost factors. Payments automatically terminate on reaching ${repaymentCapMultiplier}x cap payoff.`}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* COMPARATIVE ROADMAP MATRIX */}
      <div className="mt-10 border-t border-sky-950/40 pt-10">
        <h4 className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-6 font-bold flex items-center gap-2">
          <Layers className="w-4.5 h-4.5" />
          Pre-Underwritten Funding Scenarios
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Conservative Case */}
          <div className="bg-[#05060a] border border-sky-950/30 p-5 space-y-4">
            <span className="text-[8.5px] font-mono text-slate-500 uppercase block">Scenario 01 // Underperforming</span>
            <div className="space-y-1">
              <span className="text-sm font-bold text-slate-300 block">Conservative Case</span>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Assumes slow late-night customer volume build-up with a limited 12% profit margin and 5% annual growth.
              </p>
            </div>
            <div className="flex justify-between items-center text-xs font-mono pt-3 border-t border-sky-950/50">
              <span className="text-slate-500">Proj. IRR:</span>
              <span className="text-slate-300 font-bold">11.4%</span>
            </div>
          </div>

          {/* Target Case */}
          <div className="bg-[#05060a] border border-sky-400/20 p-5 space-y-4 relative">
            <div className="absolute top-3 right-3 text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[8.5px] font-mono text-sky-400 uppercase block font-bold">Scenario 02 // Underwritten Standard</span>
            <div className="space-y-1">
              <span className="text-sm font-bold text-white block">Target Underwritten Model</span>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Assumes 18% profit margins resulting from reduced late-night staffing costs combined with a steady 20% growth.
              </p>
            </div>
            <div className="flex justify-between items-center text-xs font-mono pt-3 border-t border-sky-950/50">
              <span className="text-sky-400">Proj. IRR:</span>
              <span className="text-sky-400 font-bold">{financials.irr.toFixed(1)}%</span>
            </div>
          </div>

          {/* Aggressive Case */}
          <div className="bg-[#05060a] border border-sky-950/30 p-5 space-y-4">
            <span className="text-[8.5px] font-mono text-slate-500 uppercase block">Scenario 03 // Super-Normal Returns</span>
            <div className="space-y-1">
              <span className="text-sm font-bold text-slate-300 block">Aggressive Outperformance</span>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Assumes rapid local night market domination, capturing food delivery margins with a 25% net margin and 35% growth.
              </p>
            </div>
            <div className="flex justify-between items-center text-xs font-mono pt-3 border-t border-sky-950/50">
              <span className="text-slate-500">Proj. IRR:</span>
              <span className="text-slate-300 font-bold">48.2%</span>
            </div>
          </div>

        </div>
      </div>

    </motion.section>
  );
};
