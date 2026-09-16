'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Download, Disc3 } from 'lucide-react';
import { formatDuration, cn } from '@/lib/utils';
import { Button } from '../ui/button';

export interface AudioPlayerWaveformProps {
  recordingUrl?: string | null;
  durationSeconds?: number;
  callerName?: string;
  isDemo?: boolean;
}

export function AudioPlayerWaveform({
  recordingUrl,
  durationSeconds = 184,
  callerName = 'Call Audio',
  isDemo = false,
}: AudioPlayerWaveformProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [simulatedBars] = useState(() =>
    Array.from({ length: 48 }, () => Math.floor(Math.random() * 65) + 15)
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setDuration(durationSeconds);
  }, [durationSeconds]);

  // Handle simulation if no real URL or for demo playback
  useEffect(() => {
    let interval: any;
    if (isPlaying && (!recordingUrl || !audioRef.current)) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed, recordingUrl]);

  const togglePlay = () => {
    if (recordingUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Fallback to simulated playback on error/unsupported url
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current && recordingUrl) {
      audioRef.current.currentTime = newTime;
    }
  };

  const changeSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const restart = () => {
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // If in strict production mode and no recording is present
  if (!recordingUrl && !isDemo) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-center">
        <Disc3 className="w-8 h-8 text-slate-400 mb-2" />
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Recording Unavailable</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
          Audio recording is not available for this call session or access is restricted by policy.
        </p>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/60 shadow-sm space-y-4">
      {recordingUrl && (
        <audio
          ref={audioRef}
          src={recordingUrl}
          onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
          onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {isPlaying && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={cn(
                'relative inline-flex rounded-full h-2.5 w-2.5',
                isPlaying ? 'bg-emerald-500' : 'bg-slate-400'
              )}
            />
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{callerName}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={changeSpeed}
            className="h-7 px-2 text-[11px] font-bold rounded-lg"
          >
            {playbackSpeed}x
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-7 w-7 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </Button>
          {recordingUrl && (
            <a
              href={recordingUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Download Recording"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Dynamic Waveform Visualizer */}
      <div className="relative h-14 flex items-center justify-between gap-1 px-2 py-1 bg-slate-100/70 dark:bg-slate-950/70 rounded-xl overflow-hidden">
        {simulatedBars.map((height, idx) => {
          const barPercent = (idx / simulatedBars.length) * 100;
          const isPlayed = barPercent <= progressPercent;

          return (
            <div
              key={idx}
              className={cn(
                'flex-1 rounded-full transition-all duration-150',
                isPlayed
                  ? 'bg-indigo-600 dark:bg-indigo-400'
                  : 'bg-slate-300 dark:bg-slate-800',
                isPlaying && isPlayed && 'opacity-90'
              )}
              style={{
                height: `${height}%`,
                transform: isPlaying && isPlayed ? 'scaleY(1.08)' : 'scaleY(1)',
              }}
            />
          );
        })}

        {/* Seek slider overlaid */}
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          aria-label="Seek audio position"
        />
      </div>

      {/* Controls & Timers */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="primary"
            size="icon"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full shadow-md shadow-indigo-600/20"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={restart}
            className="w-8 h-8 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white"
            aria-label="Restart audio"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
          <span className="text-slate-900 dark:text-white font-semibold">{formatDuration(currentTime)}</span> /{' '}
          {formatDuration(duration)}
        </div>
      </div>
    </div>
  );
}
