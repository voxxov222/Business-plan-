import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Percent, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Calculator, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Award, 
  BadgeDollarSign, 
  LineChart, 
  Sparkles,
  Layers,
  HeartHandshake
} from 'lucide-react';

interface UnderwritingRule {
  id: string;
  category: string;
  label: string;
  description: string;
  completed: boolean;
  impactScore: number; // contribution to loan approval probability
}

export const LoanReadinessDashboard = () => {
  // Input parameters
  const [loanAmount, setLoanAmount] = useState<number>(150000); // requested loan amount
  const [interestRate, setInterestRate] = useState<number>(6.5); // interest rate in %
  const [amortizationYears, setAmortizationYears] = useState<number>(10); // amortization period
  const [projectedAnnualNOI, setProjectedAnnualNOI] = useState<number>(62000); // annual Net Operating Income
  const [collateralValue, setCollateralValue] = useState<number>(180000); // estimated collateral value

  // Underwriting risk mitigation factors (interactive toggles)
  const [rules, setRules] = useState<UnderwritingRule[]>([
    {
      id: 'personal-guarantee',
      category: 'Credit & Guarantee',
      label: 'Signed Personal Guarantee',
      description: 'Owner commits personal assets as secondary recourse, securing secondary repayment priority.',
      completed: true,
      impactScore: 12
    },
    {
      id: 'safe-window-insurance',
      category: 'Risk Mitigation',
      label: 'Safe-Window Risk Premium Discount',
      description: 'Verified insurance discount due to 24/7 locked-door physical transaction barrier (reduces liability/shrinkage).',
      completed: true,
      impactScore: 15
    },
    {
      id: 'signed-lease',
      category: 'Real Estate',
      label: 'Executed 5-Year Lease Agreement',
      description: 'Binding commercial lease secured at 4405 36 Ave NW with renewal options.',
      completed: true,
      impactScore: 10
    },
    {
      id: 'pro-forma-external',
      category: 'Documentation',
      label: 'Third-Party CPA Pro-Forma Audit',
      description: 'Financial projections validated by a registered accounting firm in Alberta.',
      completed: false,
      impactScore: 8
    },
    {
      id: 'secured-equity',
      category: 'Equity Injection',
      label: '25% Founder Cash Equity Contribution',
      description: 'Founder has injected $50,000 of personal cash unencumbered by secondary debt.',
      completed: true,
      impactScore: 15
    },
    {
      id: 'security-matrix',
      category: 'Asset Security',
      label: 'UL Level 3 Security Shield Valuation',
      description: 'Ballistic barrier hardware valued as persistent physical equipment collateral.',
      completed: true,
      impactScore: 10
    }
  ]);

  // Toggle a rule
  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  // Calculations
  const calculatedOutputs = useMemo(() => {
    // Annualized Debt Service calculation using standard loan formula
    // PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const r = (interestRate / 100) / 12;
    const n = amortizationYears * 12;
    
    let monthlyPayment = 0;
    if (r > 0) {
      monthlyPayment = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      monthlyPayment = loanAmount / n;
    }
    
    const annualDebtService = monthlyPayment * 12;

    // Debt Service Coverage Ratio (DSCR) = NOI / Annual Debt Service
    const dscr = annualDebtService > 0 ? projectedAnnualNOI / annualDebtService : 0;

    // Loan-to-Value (LTV) Ratio = Loan Amount / Collateral Value
    const ltv = collateralValue > 0 ? (loanAmount / collateralValue) * 100 : 0;

    // Base probability from core financials
    let score = 0;
    
    // DSCR scoring: typical bank target is >= 1.25. If < 1.0, severe penalty.
    if (dscr >= 1.5) score += 30;
    else if (dscr >= 1.25) score += 25;
    else if (dscr >= 1.1) score += 15;
    else if (dscr >= 1.0) score += 5;
    else score -= 20; // severe penalty

    // LTV scoring: typical target is < 80%
    if (ltv <= 65) score += 20;
    else if (ltv <= 80) score += 15;
    else if (ltv <= 90) score += 8;
    else score -= 10;

    // Add completed checklist impact points
    const checklistScore = rules.reduce((sum, r) => r.completed ? sum + r.impactScore : sum, 0);
    score += checklistScore;

    // Cap score between 5% and 99% for realism
    const finalProbability = Math.max(5, Math.min(99, score));

    return {
      monthlyPayment,
      annualDebtService,
      dscr,
      ltv,
      finalProbability
    };
  }, [loanAmount, interestRate, amortizationYears, projectedAnnualNOI, collateralValue, rules]);

  // Risk Rating Label
  const ratingDetails = useMemo(() => {
    const prob = calculatedOutputs.finalProbability;
    if (prob >= 85) return { label: 'Excellent - High Approval Tier', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (prob >= 70) return { label: 'Strong - Standard Underwriting Approval', color: 'text-sky-400 bg-sky-400/10 border-sky-400/30' };
    if (prob >= 50) return { label: 'Moderate Risk - Requires Mitigating Factors', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'High Risk - Below Commercial Threshold', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  }, [calculatedOutputs.finalProbability]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24"
      id="loan-readiness-section"
    >
      <div className="border border-white/10 bg-zinc-900/30 p-8 sm:p-12">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.3em] uppercase text-sky-400 font-bold">Bank Underwriting Portal</p>
            <h2 className="text-4xl font-light text-white tracking-tighter">
              Commercial Loan <span className="font-serif italic text-sky-400">Readiness Dashboard</span>
            </h2>
          </div>
          <div className="bg-black/60 border border-white/5 px-4 py-2 text-xs font-mono text-slate-400 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-sky-400" />
            <span>Target: $150,000 Alberta Commercial Credit Line</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed opacity-70 mb-10 max-w-4xl">
          Bank underwriters assess commercial debt applications using specialized financial stress-testing models. Adjust the parameters below to verify that SafeMart's high-efficiency, lower-risk operations deliver credit compliance ratios that far exceed local standard convenience retail.
        </p>

        {/* main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Left Controls Column: Sliders */}
          <div className="xl:col-span-4 space-y-6 bg-zinc-950/40 p-6 border border-white/5">
            <h3 className="text-xs uppercase font-mono tracking-widest text-slate-300 font-bold flex items-center gap-2 border-b border-white/5 pb-3">
              <Calculator className="w-4 h-4 text-sky-400" />
              Stress Test Parameters
            </h3>

            {/* Parameter 1: Loan Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Requested Loan Principal:</span>
                <span className="text-white font-bold">${loanAmount.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="50000" 
                max="300000" 
                step="5000"
                value={loanAmount} 
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer bg-zinc-800"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>$50k</span>
                <span>$150k (Base target)</span>
                <span>$300k</span>
              </div>
            </div>

            {/* Parameter 2: Annual NOI */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Projected Annual NOI:</span>
                <span className="text-emerald-400 font-bold">${projectedAnnualNOI.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="30000" 
                max="120000" 
                step="2000"
                value={projectedAnnualNOI} 
                onChange={(e) => setProjectedAnnualNOI(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer bg-zinc-800"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>$30k</span>
                <span>$62k (Yr 1 Estimate)</span>
                <span>$120k</span>
              </div>
            </div>

            {/* Parameter 3: Collateral Value */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Tangible Collateral Value:</span>
                <span className="text-white font-bold">${collateralValue.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="50000" 
                max="250000" 
                step="5000"
                value={collateralValue} 
                onChange={(e) => setCollateralValue(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer bg-zinc-800"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>$50k</span>
                <span>$180k (Assets & Equ.)</span>
                <span>$250k</span>
              </div>
            </div>

            {/* Parameter 4: Interest Rate */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Interest Rate (APR):</span>
                <span className="text-amber-400 font-bold">{interestRate}%</span>
              </div>
              <input 
                type="range" 
                min="4.5" 
                max="12.0" 
                step="0.1"
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer bg-zinc-800"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>4.5%</span>
                <span>6.5% (SBA / Bank Standard)</span>
                <span>12.0%</span>
              </div>
            </div>

            {/* Parameter 5: Amortization */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Amortization Term:</span>
                <span className="text-white font-bold">{amortizationYears} Years</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="20" 
                step="1"
                value={amortizationYears} 
                onChange={(e) => setAmortizationYears(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer bg-zinc-800"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>5 Years</span>
                <span>10 Years (Recommended)</span>
                <span>20 Years</span>
              </div>
            </div>
          </div>

          {/* Middle Score Gauge & Calculated Metrics */}
          <div className="xl:col-span-4 flex flex-col justify-between space-y-6">
            
            {/* Probability Gauge Box */}
            <div className="bg-[#050508] border border-white/10 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[220px]">
              
              <div className="absolute top-4 left-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span className="text-[9px] font-mono uppercase text-slate-400">Risk Matrix Probability</span>
              </div>

              {/* Dynamic Percentage Ring Visual Effect */}
              <div className="relative flex items-center justify-center my-6">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#18181b"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke={calculatedOutputs.finalProbability >= 70 ? '#10b981' : calculatedOutputs.finalProbability >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 54}
                    initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - calculatedOutputs.finalProbability / 100) }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-light font-mono text-white tracking-tighter">
                    {calculatedOutputs.finalProbability}%
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Approval Index</span>
                </div>
              </div>

              {/* Tier status badge */}
              <div className={`px-3 py-1.5 border text-[10px] font-mono uppercase tracking-wider text-center ${ratingDetails.color} w-full`}>
                {ratingDetails.label}
              </div>
            </div>

            {/* Calculated Key Ratios Box */}
            <div className="bg-zinc-950/40 border border-white/5 p-6 space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-widest text-slate-300 font-bold border-b border-white/5 pb-2">
                Underwriting Compliance Metrics
              </h3>

              {/* DSCR Ratio */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Debt Service Coverage Ratio (DSCR):</span>
                  <span className={`font-mono font-bold text-sm ${
                    calculatedOutputs.dscr >= 1.25 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {calculatedOutputs.dscr.toFixed(2)}x
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-2">
                  <motion.div 
                    animate={{ width: `${Math.min(100, (calculatedOutputs.dscr / 2.0) * 100)}%` }}
                    className={`h-2 ${calculatedOutputs.dscr >= 1.25 ? 'bg-emerald-400' : 'bg-rose-400'}`} 
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>Target: &gt;1.25x</span>
                  <span>SafeMart Level</span>
                </div>
              </div>

              {/* Loan to Value (LTV) Ratio */}
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Loan-To-Value (LTV) Ratio:</span>
                  <span className={`font-mono font-bold text-sm ${
                    calculatedOutputs.ltv <= 80 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {calculatedOutputs.ltv.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-2">
                  <motion.div 
                    animate={{ width: `${Math.min(100, calculatedOutputs.ltv)}%` }}
                    className={`h-2 ${calculatedOutputs.ltv <= 80 ? 'bg-emerald-400' : 'bg-rose-400'}`} 
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>Target: &lt;80%</span>
                  <span>Lower = Better Security</span>
                </div>
              </div>

              {/* Monthly Debt Payment */}
              <div className="flex justify-between items-center pt-2 border-t border-white/5 text-xs font-mono">
                <span className="text-slate-400">Est. Monthly Debt Payment:</span>
                <span className="text-white font-bold text-sm">${Math.round(calculatedOutputs.monthlyPayment).toLocaleString()}/mo</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Risk Mitigation Checklist */}
          <div className="xl:col-span-4 space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xs uppercase font-mono tracking-widest text-slate-300 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                Asset-Security checklist (Click to toggle)
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Loan officers reward active risk-reduction technologies with premium credits. Click each checkbox to see how SafeMart’s defensive structure increases loan probability.
              </p>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {rules.map((rule) => (
                <button
                  key={rule.id}
                  onClick={() => handleToggleRule(rule.id)}
                  className={`w-full text-left p-3.5 border transition-all flex gap-3 items-start ${
                    rule.completed 
                      ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10' 
                      : 'border-white/5 bg-[#0b0b0e] hover:border-white/10 hover:bg-zinc-950/40'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 border flex items-center justify-center shrink-0 ${
                    rule.completed ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-slate-600'
                  }`}>
                    {rule.completed && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white leading-none">{rule.label}</span>
                      <span className="text-[8px] font-mono bg-white/5 px-1.5 py-0.5 text-slate-400">+{rule.impactScore}% impact</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">{rule.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-none flex items-start gap-3">
              <Award className="w-8 h-8 text-sky-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">Alberta Small Business Credit Line</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">This loan dashboard helps package a compelling commercial credit request, demonstrating high risk management rigor directly to ATB or BDC credit committees.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </motion.section>
  );
};
