import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  UserCheck, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle, 
  MessageSquare, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  RotateCcw, 
  ArrowRight, 
  Briefcase, 
  Cpu, 
  MapPin, 
  FileCheck,
  ChevronDown,
  Info,
  Layers,
  HeartHandshake
} from 'lucide-react';

// Expert Roles definitions
interface ExpertRole {
  id: string;
  name: string;
  title: string;
  avatarColor: string;
  borderColor: string;
  glowColor: string;
  description: string;
  initialQuestion: string;
}

const EXPERT_ROLES: ExpertRole[] = [
  {
    id: 'consultant',
    name: 'Sarah Jenkins',
    title: 'Lead Business Consultant (30y exp)',
    avatarColor: 'bg-indigo-500/10 text-indigo-400',
    borderColor: 'border-indigo-500/30',
    glowColor: 'from-indigo-500/10',
    description: 'Specializes in convenience store business models, franchise mechanics, and strategic growth scaling.',
    initialQuestion: 'To target $350,000 in Year 3 profits at 4412 36 Ave NW, what local product categories (e.g., local farm fresh items, grab-and-go boxes, parcel pick-up) will you use to separate SafeMart from the 7-Eleven down the road?'
  },
  {
    id: 'underwriter',
    name: 'Robert Vance',
    title: 'Commercial Loan Officer (ATB & BDC advisor)',
    avatarColor: 'bg-sky-500/10 text-sky-400',
    borderColor: 'border-sky-500/30',
    glowColor: 'from-sky-500/10',
    description: 'Reviews creditworthiness, Debt Service Coverage Ratios (DSCR), leasehold safety offsets, and collateral values.',
    initialQuestion: 'I am reviewing your $150,000 credit application. To ensure a loan approval score above 85%, how much cash equity (minimum 20% standard) are you contributing, and are you prepared to sign a personal guarantee backed by the equipment assets?'
  },
  {
    id: 'analyst',
    name: 'Kenji Sato',
    title: 'Retail & Alberta Market Analyst',
    avatarColor: 'bg-amber-500/10 text-amber-400',
    borderColor: 'border-amber-500/30',
    glowColor: 'from-amber-500/10',
    description: 'Understands local Mill Woods demographics, competitor voids, commuter volumes, and late-night health corridor traffic.',
    initialQuestion: 'The Grey Nuns Community Hospital is nearby. Emergency responders and night shifts represent a major market. Do you plan to run special late-night promos or target partnerships with the hospital union to capture this traffic?'
  },
  {
    id: 'risk_advisor',
    name: 'Lt. Marcus Brody',
    title: 'Risk Management Advisor (Former EPS Officer)',
    avatarColor: 'bg-rose-500/10 text-rose-400',
    borderColor: 'border-rose-500/30',
    glowColor: 'from-rose-500/10',
    description: 'Analyzes late-night security risks, cash handling, robbery prevention, and FLIR thermal sensor lockouts.',
    initialQuestion: 'The previous occupant (Circle K) suffered a 4.1% shrink and closed early. To defend your staff during late-night hours (10 PM to 6 AM), how does the ballistic Safe-Window Night Portal completely block the threat vectors?'
  }
];

// Pre-defined interview questions & answers for simulator
interface InterviewQA {
  id: string;
  roleId: string;
  question: string;
  presetAnswers: {
    label: string;
    text: string;
    loanImpact: number;
    improvement: string;
  }[];
}

const INTERVIEW_QUESTIONS: InterviewQA[] = [
  {
    id: 'q-product-mix',
    roleId: 'consultant',
    question: 'How do you plan to configure the high-margin product mix to offset high standard lease costs?',
    presetAnswers: [
      {
        label: 'Focus on Standard C-Store Goods',
        text: 'We will stock standard snacks, candy, and convenience sodas, which have a typical 35% margin, and rely on sheer volume.',
        loanImpact: 2,
        improvement: 'C-stores with purely standard items struggle to compete with supermarkets on price. Banks view this as highly vulnerable.'
      },
      {
        label: 'Hybrid Premium Coffee & Fresh Food Hub',
        text: 'SafeMart will dedicate 20% of store space to self-serve premium local coffee (70% margins) and pre-packaged fresh gourmet sandwiches from an Edmonton bakery (48% margins).',
        loanImpact: 12,
        improvement: 'This transforms the store into a high-yield destination, lifting the average customer ticket by an estimated 22%.'
      }
    ]
  },
  {
    id: 'q-equity',
    roleId: 'underwriter',
    question: 'What is your proposed personal equity contribution, and how will it be allocated?',
    presetAnswers: [
      {
        label: 'Minimal Equity (10% contribution)',
        text: 'We are seeking 90% debt funding ($135,000 loan) with $15,000 owner capital. This keeps our cash reserve high.',
        loanImpact: -5,
        improvement: 'Lenders rarely approve start-up retail with <20% equity. It signals low borrower alignment and high leverage risk.'
      },
      {
        label: '25% Cash Injection ($50,000)',
        text: 'The founder is injecting $50,000 in cold cash equity (25% of total $200,000 project cost). This will directly fund initial inventory and leasehold improvements.',
        loanImpact: 15,
        improvement: 'This easily meets BDC/ATB risk standards, reducing the Loan-To-Value (LTV) ratio to 75% and demonstrating high skin-in-the-game.'
      }
    ]
  },
  {
    id: 'q-safe-window',
    roleId: 'risk_advisor',
    question: 'How will you keep cash on-hand low during late night shifts when only the Safe-Window is active?',
    presetAnswers: [
      {
        label: 'Standard Safe Drop System',
        text: 'Cashiers will make standard drops into a lockbox every few hours. We will accept cash all night.',
        loanImpact: 5,
        improvement: 'Accepting cash overnight maintains a target profile for armed robberies, even with a window barrier.'
      },
      {
        label: 'Digital-Only Overnight & Under-Counter Smart Safe',
        text: 'Between 10:00 PM and 6:00 AM, we will mandate digital payments or exact-change only through the Safe-Window tray. Any physical cash received is automatically fed into a dual-custody smart safe with 0% staff access.',
        loanImpact: 18,
        improvement: 'This removes 100% of the late-night incentive for theft, satisfying commercial underwriters concerned with overnight staff liability.'
      }
    ]
  }
];

export const AIPlanningStudio = () => {
  // Main state
  const [selectedRole, setSelectedRole] = useState<string>('consultant');
  const [activeQAIndex, setActiveQAIndex] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');
  
  // Dynamic Financial Assumptions State
  const [storeSize, setStoreSize] = useState<number>(1800); // sq ft
  const [leasePerSqFt, setLeasePerSqFt] = useState<number>(32); // CAD per sq ft annual
  const [startupCapital, setStartupCapital] = useState<number>(50000); // Cash equity injected
  const [inventoryBudget, setInventoryBudget] = useState<number>(35000); // initial stock
  const [staffHourlyRate, setStaffHourlyRate] = useState<number>(17.50); // AB Minimum wage is $15, premium is standard
  const [operatingHours, setOperatingHours] = useState<number>(24); // 24 hours vs 16 hours
  
  // Simulation log history
  const [chatHistory, setChatHistory] = useState<Array<{
    role: string;
    speaker: string;
    message: string;
    type: 'user' | 'assistant';
    timestamp: string;
  }>>([
    {
      role: 'consultant',
      speaker: 'Sarah Jenkins',
      message: 'Hello! I’m your AI Business Consultant. Welcome to the Google AI Studio Collaborative Planner. Let’s start by shaping your product categories or risk metrics to ensure a highly fundable layout.',
      type: 'assistant',
      timestamp: '07:28 AM'
    }
  ]);

  // Selected Answers tracked to show loan rating progress
  const [completedAnswers, setCompletedAnswers] = useState<Record<string, number>>({});
  const [customUnderwritingWeaknesses, setCustomUnderwritingWeaknesses] = useState<Array<{
    id: string;
    title: string;
    concern: string;
    wordingBefore: string;
    wordingAfter: string;
    resolved: boolean;
  }>>([
    {
      id: 'weakness-security',
      title: 'Late-Night Staff Vulnerability',
      concern: 'Standard retail operations in South Edmonton show a high crime risk factor between 2:00 AM and 5:00 AM, leading to high staff turnover and risk of robbery.',
      wordingBefore: '"We will operate 24 hours with standard staffing of one person overnight, relying on basic alarm services and security cameras to deter intruders."',
      wordingAfter: '"SafeMart implements a certified walk-up Safe-Window Night Portal between 10 PM and 6 AM. The front retail lobby locks completely, isolating the night shift cashier behind a UL Level 3 ballistic barrier. High-definition FLIR thermal weapons scans and ocular biometric tracking identify potential threats in under 400ms, triggering rapid electromagnet locks."',
      resolved: true
    },
    {
      id: 'weakness-shrink',
      title: 'Excessive Inventory Shrinkage',
      concern: 'Underwriters review typical 4-5% convenience store shrinkage which can wipe out early net profit margins entirely.',
      wordingBefore: '"We will write off average inventory losses as a cost of business and perform monthly manual inventory counts to audit losses."',
      wordingAfter: '"Through the overnight walk-up transaction model, open-shelf shoplifting vectors are reduced to absolute zero. All inventory remains strictly inside the locked cashier capsule. Combined with smart shelf barcode reconciliation, we project annual shrinkage under 0.25%, recovering an estimated $18,000 in annual net profits."',
      resolved: false
    }
  ]);

  // Financial engine dynamic formulas & calculations
  const financialMetrics = useMemo(() => {
    // 1. Monthly Lease Cost = (Size * LeaseRate) / 12
    const monthlyLease = (storeSize * leasePerSqFt) / 12;
    
    // 2. Monthly Staffing Costs = Rate * Hours * 30 days
    const monthlyStaffing = staffHourlyRate * operatingHours * 30.5;

    // 3. Operating overhead approximation (utilities, insurance, POS, marketing, etc.)
    // Safe-window reduces insurance by 30%!
    const baseInsurance = 1200;
    const nightPortalDiscount = 360; // 30% off
    const monthlyInsurance = (baseInsurance - nightPortalDiscount) / 12;
    
    const monthlyUtilities = 800;
    const monthlyMisc = 1000;
    const totalFixedMonthlyOverhead = monthlyLease + monthlyStaffing + monthlyInsurance + monthlyUtilities + monthlyMisc;

    // 4. Break-even Sales per day
    // Assuming typical gross profit margin of 42% on product mix
    const averageGrossMargin = 0.42;
    const monthlySalesRequiredForBreakEven = totalFixedMonthlyOverhead / averageGrossMargin;
    const dailySalesBreakEven = monthlySalesRequiredForBreakEven / 30.5;

    // 5. Total Startup cost estimation
    // Construction of safety window system: $45,000
    // POS/IT setup: $12,000
    // Shell Rent deposit + utility bond: $10,000
    // Initial Stock: inventoryBudget
    // Remaining requested is working capital
    const securityHardeningCost = 45000;
    const posItSetup = 12000;
    const leaseDeposits = 10000;
    const totalEstStartupNeeds = securityHardeningCost + posItSetup + leaseDeposits + inventoryBudget;

    // Debt Service capacity (DSCR)
    // Assume conservative annual revenue of $650,000
    // Gross Profit (42%): $273,000
    // Fixed Annual Overhead: totalFixedMonthlyOverhead * 12
    const projectedAnnualRevenue = 650000;
    const projectedAnnualGrossProfit = projectedAnnualRevenue * averageGrossMargin;
    const projectedAnnualExpenses = totalFixedMonthlyOverhead * 12;
    const dynamicNOI = Math.max(10000, projectedAnnualGrossProfit - projectedAnnualExpenses);

    // Annual debt service on $150,000 loan (6.5% interest, 10 years amortization = $1,703/mo or $20,436/yr)
    const annualDebtService = 20436;
    const dynamicDSCR = dynamicNOI / annualDebtService;

    return {
      monthlyLease,
      monthlyStaffing,
      totalFixedMonthlyOverhead,
      dailySalesBreakEven,
      totalEstStartupNeeds,
      dynamicNOI,
      dynamicDSCR
    };
  }, [storeSize, leasePerSqFt, staffHourlyRate, operatingHours, inventoryBudget]);

  // Calculate dynamic Loan Approval Score
  const loanApprovalScore = useMemo(() => {
    let score = 55; // Base starting score for standard retail startup

    // 1. Add score based on completed questions
    const answeredImpact = Object.values(completedAnswers).reduce((sum, val) => sum + val, 0);
    score += answeredImpact;

    // 2. Score adjustments from Financial assumptions engine
    // If DSCR > 1.25x (Excellent score booster)
    if (financialMetrics.dynamicDSCR >= 1.5) score += 10;
    else if (financialMetrics.dynamicDSCR >= 1.25) score += 5;
    else score -= 15; // penalty if expenses eat up cashflow

    // Cash equity contribution vs requested startup needs (minimum 25% target)
    const equityRatio = startupCapital / financialMetrics.totalEstStartupNeeds;
    if (equityRatio >= 0.3) score += 10;
    else if (equityRatio >= 0.2) score += 5;
    else score -= 10; // High risk ratio penalty

    // Security resolved checks
    customUnderwritingWeaknesses.forEach(w => {
      if (w.resolved) score += 5;
    });

    return Math.max(10, Math.min(99, score));
  }, [completedAnswers, financialMetrics, startupCapital, customUnderwritingWeaknesses]);

  // Handle preset answer submission
  const handleSelectPreset = (qaId: string, label: string, text: string, impact: number) => {
    // Save completion
    setCompletedAnswers(prev => ({
      ...prev,
      [qaId]: impact
    }));

    // Find QA to get question details
    const qa = INTERVIEW_QUESTIONS.find(item => item.id === qaId);
    if (!qa) return;

    // Append to conversation log
    const userMsg = {
      role: selectedRole,
      speaker: 'You (Owner)',
      message: `${label}: "${text}"`,
      type: 'user' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Find the expert role
    const expert = EXPERT_ROLES.find(r => r.id === selectedRole);
    const expertName = expert ? expert.name : 'AI Consultant';

    // Construct positive review response
    let responseText = `Thank you. I have integrated this choice into our central business prospectus. `;
    if (impact > 0) {
      responseText += `This is an outstanding response. By selecting this option, you successfully address standard banking underwriting concerns, increasing our cumulative **Loan Approval Score by +${impact} points**. `;
    } else {
      responseText += `Note: While this keeps short-term cash reserves high, commercial loan officers at ATB and BDC look unfavorably on high leverage for retail startups. I have flagged this as an optimization challenge. `;
    }

    const assistantMsg = {
      role: selectedRole,
      speaker: expertName,
      message: responseText,
      type: 'assistant' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg, assistantMsg]);
  };

  // Handle custom user text input
  const handleSendCustomInput = () => {
    if (!customInput.trim()) return;

    const userMsg = {
      role: selectedRole,
      speaker: 'You (Owner)',
      message: customInput,
      type: 'user' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const expert = EXPERT_ROLES.find(r => r.id === selectedRole);
    const expertName = expert ? expert.name : 'AI Consultant';

    // Adaptive simulation review of custom text
    let adaptiveReply = '';
    let ratingBoost = 0;

    const lowercaseInput = customInput.toLowerCase();
    if (lowercaseInput.includes('guarantee') || lowercaseInput.includes('repay') || lowercaseInput.includes('collateral')) {
      adaptiveReply = `Excellent point. Pledging the custom UL Level 3 Safe-Window assets as tangible equipment collateral provides strong asset backing. I have noted your willingness to sign a personal guarantee. This decreases structural default severity under ATB guidelines. **Approval Score updated (+8 points)**.`;
      ratingBoost = 8;
    } else if (lowercaseInput.includes('hospital') || lowercaseInput.includes('nuns') || lowercaseInput.includes('nurse')) {
      adaptiveReply = `This aligns perfectly with the Mill Woods demographic survey. Targeting shift handoffs at Grey Nuns Hospital with specialized midnight snack boxes and cardless account payouts taps a highly locked-in recurring market. **Approval Score updated (+6 points)**.`;
      ratingBoost = 6;
    } else if (lowercaseInput.includes('shrink') || lowercaseInput.includes('theft') || lowercaseInput.includes('crime')) {
      adaptiveReply = `Strong technical focus. Utilizing the walk-up portal isolates cashier personnel entirely, dropping nighttime convenience shrink liabilities to virtually 0%. Commercial underwriters appreciate having this stated explicitly. **Approval Score updated (+7 points)**.`;
      ratingBoost = 7;
    } else {
      adaptiveReply = `I have logged your response regarding "${customInput.substring(0, 45)}...". I will cross-reference this with the PESTLE and SWOT matrices inside our South Edmonton retail database. This refines our operational blueprint. **Approval Score updated (+3 points)**.`;
      ratingBoost = 3;
    }

    // Apply incremental score boost
    setCompletedAnswers(prev => ({
      ...prev,
      [`custom-${Date.now()}`]: ratingBoost
    }));

    const assistantMsg = {
      role: selectedRole,
      speaker: expertName,
      message: adaptiveReply,
      type: 'assistant' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg, assistantMsg]);
    setCustomInput('');
  };

  // Toggle resolved on a loan weakness check
  const toggleResolveWeakness = (id: string) => {
    setCustomUnderwritingWeaknesses(prev => prev.map(w => w.id === id ? { ...w, resolved: !w.resolved } : w));
  };

  // Helper to switch active expert and reset/push greeting
  const handleSelectExpertRole = (roleId: string) => {
    setSelectedRole(roleId);
    const expert = EXPERT_ROLES.find(r => r.id === roleId)!;
    
    // Add warm introduction message
    const introMsg = {
      role: roleId,
      speaker: expert.name,
      message: `Hello! I have activated my expertise module in the planning matrix. ${expert.description} ${expert.initialQuestion}`,
      type: 'assistant' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, introMsg]);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24"
      id="ai-planning-studio"
    >
      <div className="border border-white/10 bg-zinc-900/30 p-8 sm:p-12 mb-8 relative overflow-hidden">
        {/* Subtle mesh background element */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/[0.03] rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/[0.03] rounded-full filter blur-[120px] pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-sky-400 animate-pulse animate-duration-1000" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-sky-400 font-bold font-mono">
                Interactive AI Business architect
              </span>
            </div>
            <h2 className="text-4xl font-light text-white tracking-tighter">
              Collaborative <span className="font-serif italic text-sky-400 font-bold">Planning Studio</span>
            </h2>
          </div>

          {/* Dynamic Bank Loan Score Gauge */}
          <div className="bg-[#050508] border border-sky-500/20 px-6 py-4 flex items-center gap-6 relative shadow-[0_0_25px_rgba(56,189,248,0.03)]">
            <div className="space-y-1">
              <span className="text-[8px] font-mono uppercase text-slate-500 block">CUMULATIVE UNDERWRITER RATING</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-light font-mono text-white tracking-tighter">{loanApprovalScore}%</span>
                <span className={`text-[9px] px-2 py-0.5 font-mono uppercase font-bold border ${
                  loanApprovalScore >= 85 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : loanApprovalScore >= 70 
                    ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' 
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  {loanApprovalScore >= 85 ? 'Highly Fundable' : loanApprovalScore >= 70 ? 'Bank Ready' : 'Optimization Needed'}
                </span>
              </div>
            </div>
            <div className="w-16 h-1 bg-zinc-800 rounded-none relative">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-sky-400" 
                style={{ width: `${loanApprovalScore}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* Narrative introduction */}
        <p className="text-sm leading-relaxed opacity-70 mb-10 max-w-4xl">
          Do not settle for a static, passive business document. This **Interactive Planning Workspace** transforms Google AI Studio into a team of elite retail underwriters, risk consultants, and local financial modelers. Review underwriting objections, stress-test your overhead parameters, and optimize your leasehold safety matrix in real-time.
        </p>

        {/* ================= BENTO GRID MATRIX ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN A: Dynamic Expert Interview Rig (Col Span: 8) */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* Expert selection rails */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#030306] p-1.5 border border-white/5">
              {EXPERT_ROLES.map((role) => {
                const isActive = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleSelectExpertRole(role.id)}
                    className={`p-3 text-left border transition-all cursor-pointer relative overflow-hidden ${
                      isActive 
                        ? 'border-sky-400 bg-sky-400/5 shadow-[0_0_15px_rgba(56,189,248,0.03)]' 
                        : 'border-transparent bg-zinc-950/40 hover:bg-zinc-950/80 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`p-1.5 rounded-none shrink-0 ${role.avatarColor}`}>
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-[10px] font-mono uppercase font-bold ${isActive ? 'text-sky-400' : 'text-slate-400'}`}>
                        {role.id.split('_').join(' ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-white font-bold block truncate">{role.name}</span>
                    <span className="text-[9px] text-slate-500 block truncate leading-none mt-0.5">{role.title.split('(')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Conversation view & Interactive prompts */}
            <div className="border border-white/5 bg-black/40 flex flex-col justify-between">
              
              {/* Active Conversation log */}
              <div className="p-6 h-[260px] overflow-y-auto space-y-4 border-b border-white/5 scrollbar-thin">
                {chatHistory.filter(item => item.role === selectedRole).map((item, idx) => (
                  <div key={idx} className={`flex flex-col ${item.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 text-[9px] font-mono text-slate-500">
                      <span>{item.speaker}</span>
                      <span>•</span>
                      <span>{item.timestamp}</span>
                    </div>
                    <div className={`p-3.5 max-w-[85%] text-xs leading-relaxed ${
                      item.type === 'user'
                        ? 'bg-zinc-900 border border-sky-400/20 text-slate-200'
                        : 'bg-[#050508] border border-white/5 text-slate-300'
                    }`}>
                      {item.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Interview questions trigger or custom response input */}
              <div className="p-6 bg-zinc-950/40 space-y-4">
                
                {/* Check if preset interview question exists for this role */}
                {INTERVIEW_QUESTIONS.filter(q => q.roleId === selectedRole).map((q) => {
                  const isAnswered = completedAnswers[q.id] !== undefined;
                  return (
                    <div key={q.id} className="space-y-3 p-4 bg-black/60 border border-white/5">
                      <div className="flex items-start gap-2.5">
                        <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[9px] font-mono uppercase text-amber-400 block mb-0.5 font-bold">Interactive Case Challenge</span>
                          <p className="text-xs text-white font-bold leading-normal">{q.question}</p>
                        </div>
                      </div>

                      {!isAnswered ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {q.presetAnswers.map((p, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSelectPreset(q.id, p.label, p.text, p.loanImpact)}
                              className="p-3 text-left border border-white/10 hover:border-sky-400/40 bg-zinc-950 hover:bg-sky-400/[0.02] transition-all cursor-pointer group rounded-none"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-mono font-bold text-slate-300 group-hover:text-sky-400">{p.label}</span>
                                <span className={`text-[8.5px] font-mono font-bold ${p.loanImpact > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {p.loanImpact > 0 ? `+${p.loanImpact}` : p.loanImpact} Approval Index
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-normal group-hover:text-slate-200">{p.text}</p>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] bg-emerald-500/5 p-2 border border-emerald-500/10">
                          <CheckCircle className="w-4 h-4" />
                          <span>Objection optimized and integrated into current loan pro-forma.</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Custom interview text entry */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCustomInput()}
                    placeholder={`Propose custom mitigation or answer ${EXPERT_ROLES.find(r => r.id === selectedRole)?.name}...`}
                    className="flex-1 bg-[#050508] border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-sky-400 rounded-none font-sans placeholder:text-slate-600"
                  />
                  <button
                    onClick={handleSendCustomInput}
                    disabled={!customInput.trim()}
                    className="px-5 py-3 bg-sky-400 hover:bg-sky-300 disabled:opacity-50 text-black font-mono font-bold text-[10.5px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <span>Submit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Financial Assumptions Sandbox Engine */}
            <div className="border border-white/5 bg-[#050508] p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-[8.5px] font-mono uppercase text-emerald-400 font-bold">Dynamic Financial Assumptions Core</span>
                  </div>
                  <h3 className="text-lg font-light text-white tracking-tight">Financial Pro-Forma Stress Testing</h3>
                </div>
                <div className="text-[9px] font-mono text-slate-500">Formulas updated dynamically</div>
              </div>

              {/* Slider variables matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Store Size */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Store Lease Area:</span>
                    <span className="text-white font-bold">{storeSize} sq ft</span>
                  </div>
                  <input 
                    type="range" 
                    min="1200" 
                    max="3500" 
                    step="100" 
                    value={storeSize} 
                    onChange={(e) => setStoreSize(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer bg-zinc-800"
                  />
                  <p className="text-[9px] text-slate-500 font-mono">Increases rental overhead directly.</p>
                </div>

                {/* Lease Rate per Sq Ft */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Lease Rate (Net):</span>
                    <span className="text-white font-bold">${leasePerSqFt}/sq ft</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="55" 
                    step="1" 
                    value={leasePerSqFt} 
                    onChange={(e) => setLeasePerSqFt(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer bg-zinc-800"
                  />
                  <p className="text-[9px] text-slate-500 font-mono">Typical South Edmonton range: $25-$45.</p>
                </div>

                {/* Cash Equity Injection */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Owner Cash Equity:</span>
                    <span className="text-emerald-400 font-bold">${startupCapital.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="15000" 
                    max="100000" 
                    step="5000" 
                    value={startupCapital} 
                    onChange={(e) => setStartupCapital(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer bg-zinc-800"
                  />
                  <p className="text-[9px] text-slate-500 font-mono">Personal skin-in-the-game ratio.</p>
                </div>

                {/* Staff Hourly Premium */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Avg. Staff Hourly:</span>
                    <span className="text-white font-bold">${staffHourlyRate.toFixed(2)}/hr</span>
                  </div>
                  <input 
                    type="range" 
                    min="15.00" 
                    max="25.00" 
                    step="0.50" 
                    value={staffHourlyRate} 
                    onChange={(e) => setStaffHourlyRate(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer bg-zinc-800"
                  />
                  <p className="text-[9px] text-slate-500 font-mono">Alberta legal minimum is $15.00.</p>
                </div>

                {/* Initial Stock Budget */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Inventory Budget:</span>
                    <span className="text-white font-bold">${inventoryBudget.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="15000" 
                    max="60000" 
                    step="2500" 
                    value={inventoryBudget} 
                    onChange={(e) => setInventoryBudget(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer bg-zinc-800"
                  />
                  <p className="text-[9px] text-slate-500 font-mono">Initial high-margin stock acquisition.</p>
                </div>

                {/* Shift Hours */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Uptime Schedule:</span>
                    <span className="text-white font-bold">{operatingHours} Hours</span>
                  </div>
                  <input 
                    type="range" 
                    min="16" 
                    max="24" 
                    step="8" 
                    value={operatingHours} 
                    onChange={(e) => setOperatingHours(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer bg-zinc-800"
                  />
                  <p className="text-[9px] text-slate-500 font-mono">24h unlocks premium night-portal sales.</p>
                </div>
              </div>

              {/* Dynamic Engine Outputs and Formulas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/5 font-mono text-[10.5px]">
                {/* Total Monthly Fixed Expenses */}
                <div className="bg-zinc-950 p-4 border border-white/5 space-y-1.5">
                  <span className="text-slate-500 text-[9px] uppercase font-bold block">MONTHLY FIXED EXPENSES</span>
                  <div className="text-white text-base font-bold">${Math.round(financialMetrics.totalFixedMonthlyOverhead).toLocaleString()}</div>
                  <p className="text-[9px] text-slate-400 leading-normal font-sans">
                    Formula: <code className="text-sky-400">Lease + Staffing + utilities + net_insurance</code>. Net insurance reflects our 30% discount.
                  </p>
                </div>

                {/* Daily Break-Even Sales Needed */}
                <div className="bg-zinc-950 p-4 border border-white/5 space-y-1.5">
                  <span className="text-slate-500 text-[9px] uppercase font-bold block">DAILY BREAK-EVEN TARGET</span>
                  <div className="text-emerald-400 text-base font-bold">${Math.round(financialMetrics.dailySalesBreakEven).toLocaleString()}/day</div>
                  <p className="text-[9px] text-slate-400 leading-normal font-sans">
                    Formula: <code className="text-sky-400">expenses / 42%_gross_margin / 30.5_days</code>. Any sale past this threshold adds directly to Net income.
                  </p>
                </div>

                {/* Dynamic Debt Service Ratio */}
                <div className="bg-zinc-950 p-4 border border-white/5 space-y-1.5">
                  <span className="text-slate-500 text-[9px] uppercase font-bold block">EXPECTED LOAN CAPACITY</span>
                  <div className="text-white text-base font-bold">
                    {financialMetrics.dynamicDSCR.toFixed(2)}x <span className="text-[9px] font-normal text-slate-500">DSCR</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-normal font-sans">
                    Formula: <code className="text-sky-400">pro_forma_NOI / annual_debt_payment_($20k)</code>. BDC standard target is above 1.25x.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMN B: Underwriting Optimization Tracker (Col Span: 4) */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Continuous Improvement Dashboard Status */}
            <div className="border border-white/5 bg-zinc-950/60 p-5 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                <FileCheck className="w-4 h-4 text-sky-400" />
                Continuously Improving
              </h4>
              
              <ul className="space-y-3">
                <li className="flex gap-2.5 items-start text-[11px] leading-relaxed">
                  <div className="p-1 bg-sky-500/10 text-sky-400 rounded-none shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Continuous Interview Gaps</span>
                    <p className="text-slate-400">Select active expert on left to interview the owner, filling gaps dynamically.</p>
                  </div>
                </li>

                <li className="flex gap-2.5 items-start text-[11px] leading-relaxed">
                  <div className="p-1 bg-amber-500/10 text-amber-400 rounded-none shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">High Leasehold Costs</span>
                    <p className="text-slate-400">Leases in South Edmonton require high gross profit offsets. Optimize Coffee Hub mix on left.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Underwriting weaknesses optimization tracker */}
            <div className="border border-white/5 bg-[#030306] p-5 space-y-4">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[9px] font-mono uppercase text-slate-400 block">BANK UNDERWRITER REVIEW ENGINE</span>
                <h4 className="text-xs font-bold uppercase text-white tracking-widest font-mono">OBJECTION WEAKNESS DECK</h4>
              </div>

              <div className="space-y-4">
                {customUnderwritingWeaknesses.map((w) => (
                  <div key={w.id} className="p-4 bg-zinc-950 border border-white/5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-500 uppercase">WEAKNESS PINPOINTED</span>
                        <h5 className="text-xs font-bold text-white leading-normal">{w.title}</h5>
                      </div>
                      <button
                        onClick={() => toggleResolveWeakness(w.id)}
                        className={`px-2.5 py-1 text-[8.5px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                          w.resolved
                            ? 'bg-emerald-400 text-black'
                            : 'border border-sky-400/30 text-sky-400 hover:bg-sky-400/5'
                        }`}
                      >
                        {w.resolved ? '✓ Resolved' : 'Optimize Wording'}
                      </button>
                    </div>

                    <p className="text-[10.5px] leading-relaxed text-slate-400 italic">
                      "{w.concern}"
                    </p>

                    <div className="space-y-2 border-t border-white/5 pt-2.5 text-[10px] font-mono">
                      <div>
                        <span className="text-rose-400 uppercase text-[8.5px] block font-bold">Unacceptable (Vague Wording):</span>
                        <p className="text-slate-500 leading-normal pl-2 border-l border-rose-500/20 italic">{w.wordingBefore}</p>
                      </div>
                      <div>
                        <span className="text-emerald-400 uppercase text-[8.5px] block font-bold">Lender-Ready (Approved Wording):</span>
                        <p className="text-slate-300 leading-normal pl-2 border-l border-emerald-500/20">{w.wordingAfter}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alberta Small Business Grants / Resources */}
            <div className="border border-white/5 bg-zinc-900/10 p-5 space-y-3">
              <span className="text-[9px] font-mono uppercase text-sky-400 font-bold block">ALBERTA FUNDING OPPORTUNITIES</span>
              <h5 className="text-xs font-bold text-white">Canada Digital Adoption Program (CDAP)</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                SafeMart’s advanced POS, ocular biometric scan database, and edge FLIR thermal hardware qualifies for the CDAP Boost Your Business Technology grant, offsetting equipment startup overhead by up to **$15,000**.
              </p>
              <div className="text-[9.5px] font-mono text-slate-500 italic">
                Source Reference: Government of Alberta Commerce Portal
              </div>
            </div>

          </div>

        </div>

      </div>
    </motion.section>
  );
};
