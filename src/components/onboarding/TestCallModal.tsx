'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Bot,
  Phone,
  PhoneOff,
  Volume2,
  CheckCircle2,
  Mic,
  Radio,
} from 'lucide-react';

interface TestCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentName: string;
  welcomeMessage: string;
  didNumber: string;
  onTestComplete: () => void;
}

export function TestCallModal({
  open,
  onOpenChange,
  agentName,
  welcomeMessage,
  didNumber,
  onTestComplete,
}: TestCallModalProps) {
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'active' | 'ended'>('idle');
  const [activeTurn, setActiveTurn] = useState<number>(0);

  useEffect(() => {
    if (!open) {
      setCallState('idle');
      setActiveTurn(0);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [open]);

  const handleStartCall = () => {
    setCallState('connecting');

    setTimeout(() => {
      setCallState('active');
      setActiveTurn(1);

      // Speak welcome message using SpeechSynthesis
      if (
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        typeof SpeechSynthesisUtterance !== 'undefined'
      ) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(welcomeMessage);
          utterance.rate = 1.0;
          utterance.onend = () => {
            // After Maya speaks, ready for student turn
            setActiveTurn(2);
          };
          window.speechSynthesis.speak(utterance);
        } catch {
          setTimeout(() => setActiveTurn(2), 3000);
        }
      } else {
        setTimeout(() => setActiveTurn(2), 3000);
      }
    }, 1200);
  };

  const handleEndCall = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCallState('ended');
    onTestComplete();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val && typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        onOpenChange(val);
      }}
      title="Interactive Voice Diagnostic Test"
      description={`Simulate an admissions voice inquiry session with ${agentName}.`}
      maxWidth="md"
    >
      <div className="space-y-6 my-2">
        {/* Call Status Header Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white text-center space-y-4 shadow-xl">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-500/30">
              <Bot className="w-8 h-8" />
            </div>
            {callState === 'active' && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full animate-ping" />
            )}
          </div>

          <div>
            <h3 className="text-base font-bold">{agentName}</h3>
            <p className="text-xs text-indigo-300 font-mono">DID Line: {didNumber}</p>
          </div>

          {/* Call Connection Status */}
          <div className="flex items-center justify-center gap-2">
            {callState === 'idle' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200">
                Ready for Test Call
              </span>
            )}
            {callState === 'connecting' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Connecting Trunk...</span>
              </span>
            )}
            {callState === 'active' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Call Active • Speech Live</span>
              </span>
            )}
            {callState === 'ended' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Test Call Completed & Verified</span>
              </span>
            )}
          </div>

          {/* Live Audio Waveform Animation (When active) */}
          {callState === 'active' && (
            <div className="flex items-center justify-center gap-1.5 h-8 pt-2">
              {[30, 80, 50, 95, 60, 40, 75, 45, 90, 65, 35].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-indigo-400 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 100}ms`,
                    animationDuration: '1.2s',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Conversation Transcript Preview */}
        {callState === 'active' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Live Dialogue Stream
            </p>

            {/* Maya Welcome Turn */}
            <div className="p-3.5 rounded-2xl rounded-tl-sm bg-indigo-50 border border-indigo-100 text-indigo-950 space-y-1">
              <span className="font-bold text-indigo-700 text-[11px] block">{agentName}:</span>
              <p className="leading-relaxed">&quot;{welcomeMessage}&quot;</p>
            </div>

            {/* Student Inquiry Turn */}
            {activeTurn >= 2 && (
              <div className="p-3.5 rounded-2xl rounded-tr-sm bg-white border border-slate-200 text-slate-800 ml-auto max-w-[90%] space-y-1 animate-in fade-in duration-300">
                <span className="font-bold text-slate-600 text-[11px] block">Prospective Student:</span>
                <p className="leading-relaxed">
                  &quot;What is the scholarship cutoff for 12th PCM scores above 90%?&quot;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-xs text-slate-600"
          >
            Close
          </Button>

          {callState === 'idle' && (
            <Button
              type="button"
              variant="primary"
              onClick={handleStartCall}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-500/20"
            >
              <Phone className="w-4 h-4" />
              <span>Start Test Call</span>
            </Button>
          )}

          {callState === 'active' && (
            <Button
              type="button"
              variant="danger"
              onClick={handleEndCall}
              className="gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Test & Complete</span>
            </Button>
          )}

          {callState === 'ended' && (
            <Button
              type="button"
              variant="primary"
              onClick={() => onOpenChange(false)}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Done (Verified)</span>
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
