import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const VoiceAssistant = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  const startVoice = async () => {
    setIsConnecting(true);
    try {
      const ws = new WebSocket(`wss://${location.host}/live`);
      wsRef.current = ws;

      ws.onopen = async () => {
        const inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        inputCtxRef.current = inputAudioCtx;
        outputCtxRef.current = outputAudioCtx;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        const source = inputAudioCtx.createMediaStreamSource(stream);
        const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;
        
        source.connect(processor);
        processor.connect(inputAudioCtx.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              let s = Math.max(-1, Math.min(1, inputData[i]));
              pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            
            // Convert to base64
            let binary = '';
            const bytes = new Uint8Array(pcm16.buffer);
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64 = btoa(binary);
            ws.send(JSON.stringify({ audio: base64 }));
          }
        };

        setIsActive(true);
        setIsConnecting(false);
      };

      ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        if (msg.interrupted) {
          nextStartTimeRef.current = 0;
          return;
        }
        if (msg.audio) {
          const outputCtx = outputCtxRef.current;
          if (!outputCtx) return;

          const binaryString = atob(msg.audio);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const pcm16 = new Int16Array(bytes.buffer);
          const float32 = new Float32Array(pcm16.length);
          for (let i = 0; i < pcm16.length; i++) {
            float32[i] = pcm16[i] / 32768.0;
          }

          const buffer = outputCtx.createBuffer(1, float32.length, 24000);
          buffer.getChannelData(0).set(float32);

          const source = outputCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(outputCtx.destination);

          if (nextStartTimeRef.current < outputCtx.currentTime) {
            nextStartTimeRef.current = outputCtx.currentTime;
          }
          source.start(nextStartTimeRef.current);
          nextStartTimeRef.current += buffer.duration;
        }
      };

      ws.onclose = () => {
        stopVoice();
      };
    } catch (e) {
      console.error("Failed to start voice", e);
      setIsConnecting(false);
    }
  };

  const stopVoice = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (inputCtxRef.current) {
      inputCtxRef.current.close();
      inputCtxRef.current = null;
    }
    if (outputCtxRef.current) {
      outputCtxRef.current.close();
      outputCtxRef.current = null;
    }
    nextStartTimeRef.current = 0;
    setIsActive(false);
    setIsConnecting(false);
  };

  const toggleVoice = () => {
    if (isActive || isConnecting) {
      stopVoice();
    } else {
      startVoice();
    }
  };

  // Check speaking status
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (outputCtxRef.current) {
          const speaking = outputCtxRef.current.currentTime < nextStartTimeRef.current;
          setIsSpeaking(speaking);
        } else {
          setIsSpeaking(false);
        }
      }, 100);
    } else {
      setIsSpeaking(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoice();
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Speech capsule / Status card */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            className="bg-zinc-950/95 border border-sky-400/30 p-4 shadow-[0_0_30px_rgba(56,189,248,0.15)] flex items-center gap-4 max-w-xs backdrop-blur-md pointer-events-auto"
          >
            {/* Dynamic visual sound wave */}
            <div className="flex items-center gap-1 h-6 shrink-0">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scaleY: isSpeaking ? [1, 2.5, 1] : [1, 1.2, 1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: isSpeaking ? 0.35 + (i * 0.08) : 1.5,
                    ease: "easeInOut"
                  }}
                  className={`w-1 h-3.5 rounded-full origin-center ${
                    isSpeaking ? 'bg-sky-400' : 'bg-slate-500/50'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex-1 min-w-[140px] space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-sky-400 animate-pulse' : 'bg-emerald-400'}`} />
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  {isSpeaking ? 'AI Speaking' : 'AI Listening'}
                </span>
              </div>
              <p className="text-[10.5px] text-white font-medium leading-tight">
                {isSpeaking ? 'Narrating custom security specs...' : 'Awaiting user voice input...'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic button and concentric wave rings */}
      <div className="relative pointer-events-auto">
        {/* Concentric visual pulse rings */}
        <AnimatePresence>
          {isActive && (
            <>
              {/* Ring 1 */}
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ 
                  scale: isSpeaking ? [1, 1.9, 1] : [1, 1.3, 1],
                  opacity: isSpeaking ? [0.45, 0, 0.45] : [0.25, 0.08, 0.25]
                }}
                transition={{
                  repeat: Infinity,
                  duration: isSpeaking ? 1.4 : 2.8,
                  ease: "easeOut"
                }}
                className={`absolute inset-0 rounded-full pointer-events-none ${
                  isSpeaking ? 'bg-sky-400/45 shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 'bg-emerald-400/15'
                }`}
              />
              {/* Ring 2 */}
              <motion.div
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ 
                  scale: isSpeaking ? [1, 2.5, 1] : [1, 1.6, 1],
                  opacity: isSpeaking ? [0.35, 0, 0.35] : [0.15, 0.03, 0.15]
                }}
                transition={{
                  repeat: Infinity,
                  duration: isSpeaking ? 1.8 : 3.6,
                  ease: "easeOut",
                  delay: 0.25
                }}
                className={`absolute inset-0 rounded-full pointer-events-none ${
                  isSpeaking ? 'bg-sky-400/35 shadow-[0_0_30px_rgba(56,189,248,0.3)]' : 'bg-emerald-400/10'
                }`}
              />
            </>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button */}
        <button
          onClick={toggleVoice}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all z-10 ${
            isActive
              ? 'bg-zinc-950 text-red-500 border border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.3)] hover:bg-zinc-900'
              : 'bg-sky-500 hover:bg-sky-400 text-white shadow-[0_0_20px_rgba(14,165,233,0.3)]'
          }`}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : isActive ? (
            <div className="relative flex items-center justify-center">
              {isSpeaking && (
                <span className="absolute w-12 h-12 rounded-full border border-sky-400/35 animate-ping pointer-events-none" />
              )}
              <MicOff className="w-7 h-7 text-red-500" />
            </div>
          ) : (
            <Mic className="w-7 h-7 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};
