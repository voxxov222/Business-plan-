import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Play, 
  Pause, 
  Volume2, 
  Maximize2, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  User, 
  Clock, 
  Search, 
  CornerDownRight, 
  Folder, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface SourceDoc {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx';
  size: string;
  pages: number;
  description: string;
  content: string;
  keyTakeaways: string[];
}

interface TranscriptLine {
  time: string;
  seconds: number;
  speaker: 'Sarah' | 'Devon';
  text: string;
}

const SOURCES: SourceDoc[] = [
  {
    id: 'biz-plan',
    name: 'SafeMart_Pitch_Deck_v3.pdf',
    type: 'pdf',
    size: '4.2 MB',
    pages: 18,
    description: 'Core commercial loan request document compiled for ATB Bank and BDC. Outlines financial model, real estate acquisition, and unit economics.',
    content: 'EXECUTIVE DISCLOSURE: SafeMart Edmonton represents a modern high-security convenience brand designed to capture 24/7 retail flow without overnight asset exposure. The model transitions to a Walk-up Safe-Window system between 10:00 PM and 6:00 AM daily, effectively minimizing late-night shrinkage and liability. REQUESTED DEBT: $150,000 for site-work, custom architectural hardware, and initial high-margin inventory.',
    keyTakeaways: [
      'Proposes $150,000 commercial credit line.',
      'Projected Year 1 Net Operating Income (NOI) of $62,000.',
      'Target Debt Service Coverage Ratio (DSCR) of 1.45x, exceeding 1.25x bank standards.'
    ]
  },
  {
    id: 'hardware-specs',
    name: 'Safe-Window_Engineering_Specs.docx',
    type: 'docx',
    size: '1.8 MB',
    pages: 6,
    description: 'Technical drafting and physical resistance certifications for the ballistic window assembly and automated deadbolt systems.',
    content: 'HARDWARE BILL OF MATERIALS: 1.25-inch structural grade-3 acrylic bullet-resistant ballistic shield with custom aluminum load-bearing framing. Integrated steel cash/card deal tray with automated sliding interlocking mechanism. Motorized double-actuator exterior deadbolts linked to emergency silent alarm system. Edge-computing loitering camera system with optical AI tracking.',
    keyTakeaways: [
      'Ballistic acrylic shield rated for UL Level 3 impact protection.',
      'Double interlocking transaction tray prevents physical access to cashier.',
      'Auto-lockout activates in 1.4 seconds upon alarm trigger.'
    ]
  },
  {
    id: 'market-demographics',
    name: 'Edmonton_Late_Night_Traffic_Report.xlsx',
    type: 'xlsx',
    size: '720 KB',
    pages: 1,
    description: 'Traffic counts and competitor density statistics for the immediate 5km radius surrounding 4412 36 Ave NW.',
    content: 'SITE METRICS: 4412 36 Ave NW displays a highly favorable demographic baseline. Population (5km) is 24,500 with average household income of $68,000. Late-night vehicle traffic counts average 840 vehicles/hour between 10 PM and 2 AM. Local competitor landscape reveals 4 service stations within 3km, none of which offer secure transaction portals after 11 PM.',
    keyTakeaways: [
      'Exposed late-night consumer pool of 24,000+ residents.',
      'No safe-window late-night competitors within immediate trade area.',
      'Uncontested capture of third-shift commercial/delivery drivers.'
    ]
  },
  {
    id: 'risk-assessment',
    name: 'Circle_K_Historical_Failure_Analysis.pdf',
    type: 'pdf',
    size: '2.1 MB',
    pages: 8,
    description: 'Detailed post-mortem of the previous tenant at the location, identifying failure root causes and how SafeMart mitigates them.',
    content: 'POST-MORTEM SUMMARY: The previous occupant (Circle K) suffered from terminal overnight shrinkage (4.1% of inventory sales) and recurring late-night safety incidents. This forced the franchise operator to restrict operational hours to 6 AM - 11 PM, surrendering approximately $650 per day in premium late-night high-margin sales. Rent costs remained fixed, leading to margin collapse.',
    keyTakeaways: [
      'Identified 4.1% inventory shrinkage due to open-door overnight shoplifting.',
      'Forced early closures cut 25% of potential premium sales.',
      'SafeMart’s Safe-Window recovers this $650/day pool with 0% shrinkage.'
    ]
  }
];

const TRANSCRIPT: TranscriptLine[] = [
  { time: '0:00', seconds: 0, speaker: 'Sarah', text: "Hey Devon! Have you had a chance to dive into this SafeMart notebook yet? It's honestly fascinating." },
  { time: '0:08', seconds: 8, speaker: 'Devon', text: "I did! And look, at first glance, you think: 'Okay, another convenience store in Edmonton.' But when you look at the technical specs, it's a total paradigm shift." },
  { time: '0:18', seconds: 18, speaker: 'Sarah', text: "Exactly! Most standard convenience stores are basically sitting ducks overnight. High shrinkage, skyrocketing insurance premiums, and solo staff members in high-vulnerability situations." },
  { time: '0:31', seconds: 31, speaker: 'Devon', text: "Right, and what SafeMart does is brilliant. At 10:00 PM, they transition to the 'Safe-Window' model. The retail doors lock completely. But instead of closing, they run walk-up and drive-by orders through a UL Level 3 ballistic acrylic shield." },
  { time: '0:48', seconds: 48, speaker: 'Sarah', text: "And that drops physical security risk to basically zero, while unlocking the remaining 8 hours of premium, high-margin late-night sales. That's an estimated $650 a day they're recovering!" },
  { time: '1:01', seconds: 61, speaker: 'Devon', text: "And look at the numbers. The previous tenant, Circle K, went under because their 4% shrinkage rate and security threats forced them to close early. SafeMart is turning that exact vulnerability into their core competitive advantage." },
  { time: '1:16', seconds: 76, speaker: 'Sarah', text: "For a commercial lender like ATB Bank, that's music to their ears. It dramatically lowers the risk profile of the business while keeping the cash flow highly predictable." },
  { time: '1:28', seconds: 88, speaker: 'Devon', text: "Absolutely. Their Debt Service Coverage Ratio—the DSCR—sits comfortably at 1.45x for this $150,000 loan. Standard bank requirements are 1.25x. It's a remarkably strong credit application." }
];

const SIMULATED_QAS = [
  {
    q: "How does SafeMart resolve the high insurance premium costs typical of 24/7 retail?",
    a: "By utilizing the Safe-Window physical barrier, SafeMart completely eliminates interior access between 10 PM and 6 AM. Underwriting documents show a pre-negotiated **30% reduction in commercial general liability insurance premiums** due to the certified UL Level 3 ballistic glass assembly [2][4]. This is a key operational cost-saving that standard convenience stores cannot access.",
    sources: ['Safe-Window_Engineering_Specs.docx', 'Circle_K_Historical_Failure_Analysis.pdf']
  },
  {
    q: "Is the requested $150,000 loan backed by tangible equipment collateral?",
    a: "Yes. Of the $150,000 requested principal, **45% ($67,500) is directly allocated to specialized safety build-out and hardware installation** [1]. This includes the UL Level 3 acrylic shields, automated double-actuator deadbolts, and structural framing. These assets are physical, high-durability improvements valued as direct collateral under bank underwriting guidelines [1][2].",
    sources: ['SafeMart_Pitch_Deck_v3.pdf', 'Safe-Window_Engineering_Specs.docx']
  },
  {
    q: "Why is the 4412 36 Ave NW location ideal for the Safe-Window business model?",
    a: "The location possesses high late-night traffic counts (840 vehicles/hour average) driven by commercial transport, third-shift workers, and emergency responders [3]. Because the previous operator failed due to security vulnerabilities [4], SafeMart enters an already-validated demand pool with **zero safe-window competitors in the immediate 5km radius** [3], guaranteeing immediate capture of high-margin nocturnal commerce.",
    sources: ['Edmonton_Late_Night_Traffic_Report.xlsx', 'Circle_K_Historical_Failure_Analysis.pdf']
  }
];

export const NotebookLMBriefing = () => {
  // Source Explorer states
  const [selectedSourceId, setSelectedSourceId] = useState<string>('biz-plan');
  
  // Podcast Player states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTranscriptIndex, setActiveTranscriptIndex] = useState<number>(0);
  
  // Q&A Chatbot states
  const [chatHistory, setChatHistory] = useState<Array<{ q: string; a: string; sources: string[]; isTyping?: boolean }>>([]);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);

  const selectedSource = SOURCES.find(s => s.id === selectedSourceId)!;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulation play loop for Podcast
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + (1 * playbackSpeed);
          if (next >= 88) { // end of briefing
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 88;
          }
          // Update active transcript line based on seconds
          const lineIndex = TRANSCRIPT.findIndex((t, i) => {
            const nextT = TRANSCRIPT[i + 1];
            return nextT ? (next >= t.seconds && next < nextT.seconds) : next >= t.seconds;
          });
          if (lineIndex !== -1) {
            setActiveTranscriptIndex(lineIndex);
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    const lineIndex = TRANSCRIPT.findIndex((t, i) => {
      const nextT = TRANSCRIPT[i + 1];
      return nextT ? (seconds >= t.seconds && seconds < nextT.seconds) : seconds >= t.seconds;
    });
    if (lineIndex !== -1) {
      setActiveTranscriptIndex(lineIndex);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendQuestion = (questionText: string) => {
    if (!questionText.trim()) return;

    // Add user question to history
    const userQ = questionText;
    setChatHistory(prev => [...prev, { q: userQ, a: '', sources: [], isTyping: true }]);
    setCustomQuestion('');
    setIsBotTyping(true);

    // Simulate custom answer searching the docs
    setTimeout(() => {
      // Find matching standard question if possible, or generate adaptive response
      const matched = SIMULATED_QAS.find(qa => 
        userQ.toLowerCase().includes(qa.q.toLowerCase().substring(0, 15)) || 
        qa.q.toLowerCase().includes(userQ.toLowerCase().substring(0, 15))
      );

      let answerText = "";
      let matchedSources: string[] = [];

      if (matched) {
        answerText = matched.a;
        matchedSources = matched.sources;
      } else {
        // Fallback adaptive answer based on keywords
        if (userQ.toLowerCase().includes('loan') || userQ.toLowerCase().includes('atb') || userQ.toLowerCase().includes('money')) {
          answerText = "The SafeMart commercial application seeks a **$150,000 credit line** to fund site acquisition, high-security ballistic hardware, and operating capital [1]. Risk modeling indicates a conservative Year 1 payback threshold supported by a robust 1.45x DSCR [1][3].";
          matchedSources = ['SafeMart_Pitch_Deck_v3.pdf', 'Edmonton_Late_Night_Traffic_Report.xlsx'];
        } else if (userQ.toLowerCase().includes('window') || userQ.toLowerCase().includes('safety') || userQ.toLowerCase().includes('specs')) {
          answerText = "The transaction window is engineered from **1.25\" ballistic polycarbonate acrylic** encased in high-load aluminum extrusion channels [2]. This ensures full protection under UL Level 3 safety guidelines and prevents any direct interior cashier reachability overnight [2][4].";
          matchedSources = ['Safe-Window_Engineering_Specs.docx', 'Circle_K_Historical_Failure_Analysis.pdf'];
        } else {
          answerText = "Based on the compiled sources, SafeMart mitigates Edmonton commercial risks by utilizing a walk-up window transition after 10 PM. This maintains full inventory availability to late-night customers while reducing physical risk and inventory shrinkage to virtually 0% [1][2][4].";
          matchedSources = ['SafeMart_Pitch_Deck_v3.pdf', 'Circle_K_Historical_Failure_Analysis.pdf'];
        }
      }

      setChatHistory(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last) {
          last.a = answerText;
          last.sources = matchedSources;
          last.isTyping = false;
        }
        return updated;
      });
      setIsBotTyping(false);
    }, 1500);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24"
      id="notebooklm-section"
    >
      <div className="border border-white/10 bg-zinc-900/20 p-8 sm:p-12 relative overflow-hidden">
        
        {/* Glowing Ambient Mesh Backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-sky-400 font-bold">Interactive Resource Hub</span>
              <span className="bg-sky-400/15 text-sky-400 text-[8px] font-mono uppercase px-2 py-0.5 tracking-wider font-bold">NotebookLM Powered</span>
            </div>
            <h2 className="text-4xl font-light text-white tracking-tighter">
              AI Audio Overview & <span className="font-serif italic text-sky-400">Notebook Sources</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="https://notebooklm.google.com/notebook/6bc60018-074a-411c-a4e2-6bcd4351e062?utm_source=nlmm_share" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-400 text-black text-xs font-bold uppercase tracking-widest hover:bg-sky-300 transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
            >
              <ExternalLink className="w-4 h-4" />
              Open Live NotebookLM
            </a>
          </div>
        </div>

        <p className="text-sm leading-relaxed opacity-70 mb-10 max-w-4xl">
          We have generated an interactive AI summary system mirroring Google’s NotebookLM. Dive into the official source documents, play the simulated <strong>AI Dual-Host Deep Dive Briefing</strong> (complete with synchronized interactive transcript), and query the virtual underwriter analyst regarding loan probabilities.
        </p>

        {/* Main 3-Column Bento Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Column 1: Source Document Explorer (Col Span: 4) */}
          <div className="xl:col-span-4 flex flex-col justify-between border border-white/5 bg-black/40 p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-widest text-slate-300 font-bold flex items-center gap-2 border-b border-white/5 pb-3">
                <Folder className="w-4 h-4 text-sky-400" />
                Source Documents ({SOURCES.length})
              </h3>

              <div className="space-y-2">
                {SOURCES.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => setSelectedSourceId(source.id)}
                    className={`w-full text-left p-3 border transition-all flex items-start gap-3 ${
                      selectedSourceId === source.id 
                        ? 'border-sky-400 bg-sky-400/5 shadow-[0_0_15px_rgba(56,189,248,0.05)]' 
                        : 'border-white/5 bg-zinc-950/40 hover:border-white/15'
                    }`}
                  >
                    <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${
                      source.type === 'xlsx' ? 'text-emerald-400' : source.type === 'docx' ? 'text-sky-400' : 'text-rose-400'
                    }`} />
                    <div className="space-y-1">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-bold text-white truncate max-w-[160px]">{source.name}</span>
                        <span className="text-[9px] font-mono text-slate-500">{source.size}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{source.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Source Insights */}
            <div className="bg-[#050508] border border-white/5 p-4 space-y-3">
              <span className="text-[9px] font-mono uppercase text-sky-400 font-bold block">Document Insight Extract</span>
              <p className="text-[11px] text-slate-300 italic leading-relaxed">
                "{selectedSource.content}"
              </p>
              
              <div className="border-t border-white/5 pt-3 space-y-1.5">
                <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Key Underwriter Takeaways:</span>
                {selectedSource.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Dual-Host Audio Briefing & Live Transcript (Col Span: 4) */}
          <div className="xl:col-span-4 flex flex-col justify-between border border-white/5 bg-black/40 p-6 space-y-6">
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs uppercase font-mono tracking-widest text-slate-300 font-bold flex items-center gap-2 border-b border-white/5 pb-3">
                  <Volume2 className="w-4 h-4 text-sky-400" />
                  AI Deep Dive Podcast Overview
                </h3>

                {/* Simulated Audio Player Control */}
                <div className="bg-[#050508] border border-white/5 p-4 mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isPlaying ? 'bg-sky-400 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <div>
                      <span className="text-xs font-bold text-white block">AI Audio Briefing</span>
                      <span className="text-[9px] font-mono text-slate-500">Sarah & Devon (AI Hosts)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPlaybackSpeed(s => s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1)}
                      className="px-2 py-1 border border-white/10 rounded-none text-[9px] font-mono text-slate-400 hover:text-white"
                    >
                      {playbackSpeed}x
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">
                      {formatTime(currentTime)} / 1:28
                    </span>
                  </div>
                </div>

                {/* Timeline Seek Bar */}
                <div className="px-1 pt-2">
                  <input
                    type="range"
                    min="0"
                    max="88"
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full accent-sky-400 bg-zinc-800 cursor-pointer h-1"
                  />
                </div>
              </div>

              {/* Pulsing visualizer when playing */}
              <div className="h-10 flex items-center justify-center gap-1 my-3 bg-black/40 border border-white/5 py-2">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={isPlaying ? {
                      height: [8, Math.random() * 24 + 10, 8]
                    } : { height: 8 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5 + (i * 0.05),
                      ease: "easeInOut"
                    }}
                    className={`w-1 rounded-full ${isPlaying ? 'bg-sky-400/80' : 'bg-zinc-700'}`}
                  />
                ))}
              </div>

              {/* Live Scrolling Transcript Panel */}
              <div className="flex-1 max-h-[190px] overflow-y-auto border border-white/5 bg-zinc-950/60 p-4 space-y-4 scrollbar-thin">
                {TRANSCRIPT.map((line, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSeek(line.seconds)}
                    className={`w-full text-left p-2.5 transition-all flex flex-col gap-1 border ${
                      activeTranscriptIndex === idx 
                        ? 'bg-sky-400/5 border-sky-400/20 shadow-sm' 
                        : 'border-transparent hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold ${line.speaker === 'Sarah' ? 'text-sky-400' : 'text-purple-400'}`}>
                        {line.speaker}
                      </span>
                      <span className="text-[8px] font-mono text-slate-500">{line.time}</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${activeTranscriptIndex === idx ? 'text-white' : 'text-slate-400'}`}>
                      {line.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: NotebookLM AI Underwriter Chatbot (Col Span: 4) */}
          <div className="xl:col-span-4 flex flex-col justify-between border border-white/5 bg-black/40 p-6 space-y-6">
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <h3 className="text-xs uppercase font-mono tracking-widest text-slate-300 font-bold flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles className="w-4 h-4 text-sky-400" />
                NotebookLM Underwriting Query
              </h3>

              {/* Suggested Questions */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">Suggested Queries:</span>
                {SIMULATED_QAS.map((qa, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuestion(qa.q)}
                    className="w-full text-left p-2 border border-white/5 bg-zinc-950/40 hover:border-sky-400/20 text-[10.5px] text-slate-300 hover:text-white transition-all flex items-center justify-between"
                  >
                    <span className="truncate pr-4">{qa.q}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  </button>
                ))}
              </div>

              {/* Chat View Panel */}
              <div className="flex-1 max-h-[190px] overflow-y-auto border border-white/5 bg-[#050508] p-4 space-y-3.5 mt-2">
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <HelpCircle className="w-8 h-8 text-slate-600 mb-2" />
                    <p className="text-[11px] text-slate-400">
                      Ask a query or select a preset above to stress-test SafeMart's commercial credit model.
                    </p>
                  </div>
                ) : (
                  chatHistory.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-sky-400 font-bold shrink-0">Q:</span>
                        <p className="text-white font-medium">{item.q}</p>
                      </div>

                      <div className="pl-3 border-l border-white/10 py-0.5 space-y-1.5">
                        {item.isTyping ? (
                          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono">
                            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            <span>Querying Source Index...</span>
                          </div>
                        ) : (
                          <>
                            <p className="text-[10.5px] text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.a }} />
                            {item.sources.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {item.sources.map((src, sIdx) => (
                                  <span key={sIdx} className="text-[8.5px] font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 text-slate-400">
                                    {src}
                                  </span>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Question Input */}
              <div className="flex gap-2 border-t border-white/5 pt-3">
                <input
                  type="text"
                  placeholder="Ask a custom underwriting question..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion(customQuestion)}
                  className="flex-1 bg-zinc-950 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400 rounded-none placeholder:text-slate-600"
                />
                <button
                  onClick={() => handleSendQuestion(customQuestion)}
                  disabled={isBotTyping || !customQuestion.trim()}
                  className="px-3 bg-sky-400 text-black hover:bg-sky-300 disabled:opacity-50 transition-all flex items-center justify-center shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Notebook Summary / Professional Callout */}
        <div className="mt-8 bg-zinc-950/60 border border-white/5 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-sky-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">NotebookLM Analytical Synthesis</h4>
              <p className="text-[10.5px] text-slate-400 leading-relaxed">
                By compiling engineering specifications, traffic data, and business matrices into a cohesive notebook, we demonstrate institutional-grade preparedness to funding partners.
              </p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Source Code: ATB_SAFE_6BC6
          </div>
        </div>

      </div>
    </motion.section>
  );
};
