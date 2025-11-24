"use client";

import { useState, useEffect, useRef, useCallback } from "react";
// Import Loader untuk status loading
import { Play, Pause, Volume2, VolumeX, Loader } from "lucide-react";

interface MusicPlayerProps {
  // Menggunakan URL default yang sama
  audioUrl?: string; 
}

export default function MusicPlayer({ 
  audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(10).fill(0));
  
  // Audio Initialization and Event Listeners
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.load();
    }
    
    const audio = audioRef.current;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
    };
    
    audio.volume = volume;
    audio.muted = isMuted;

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl, volume, isMuted]);
  
  // Visualizer animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isMuted) {
      interval = setInterval(() => {
        setVisualizerData(Array(10).fill(0).map(() => Math.random() * 80 + 20));
      }, 150);
    } else {
      setVisualizerData(Array(10).fill(0));
    }
    return () => clearInterval(interval);
  }, [isPlaying, isMuted]);

  // Handle Play/Pause logic
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || isLoading) return;
    
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error("Autoplay failed: ", error);
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, isLoading]);

  // Handle Mute Toggle
  const handleMuteToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);
  
  // Handle Volume Change
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
        audioRef.current.volume = newVolume;
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
            audioRef.current.muted = false;
        } else if (newVolume === 0 && !isMuted) {
            setIsMuted(true);
            audioRef.current.muted = true;
        }
    }
  }, [isMuted]);

  // Handle Seek/Progress Change
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
        audioRef.current.currentTime = newTime;
    }
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // FIX 1: Rename to PascalCase (VolumeIconComponent) for proper JSX usage
  const VolumeIconComponent = isMuted || volume === 0 ? VolumeX : Volume2;
  
  // FIX 2: Rename to PascalCase (ButtonIconComponent) for proper JSX usage
  const ButtonIconComponent = isLoading ? Loader : (isPlaying ? Pause : Play);


  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {/* Container untuk Player Button dan Control Panel (Muncul saat hover) */}
      <div className="flex items-end space-x-3 group">
        
        {/* Floating Control Panel (Slide out on hover) */}
        <div className="opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out">
          <div className="w-72 p-4 bg-gray-900 border border-gray-700/50 rounded-2xl shadow-xl space-y-3">
            
            {/* Visualizer (Ambient Element) */}
            <div className="flex justify-between items-center h-4 px-2">
                {visualizerData.map((height, i) => (
                    <div 
                        key={i}
                        className="w-0.5 rounded-full transition-all duration-150 ease-out"
                        style={{ 
                            height: `${height / 5 + 4}px`, 
                            backgroundColor: '#6366f1', 
                            opacity: isPlaying && !isMuted ? 1 : 0.5,
                        }}
                    />
                ))}
            </div>

            {/* Progress Bar & Time */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="w-10 text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 appearance-none cursor-pointer rounded-full bg-gray-700 focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #6366f1 0%, #a855f7 ${progressPercent}%, #374151 ${progressPercent}%, #374151 100%)`,
                }}
                disabled={isLoading}
              />
              <span className="w-10 text-left">{formatTime(duration)}</span>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 pt-1">
                <button onClick={handleMuteToggle} className="text-gray-400 hover:text-white transition p-1 rounded-full">
                    {/* FIX 3: Use VolumeIconComponent as a JSX tag */}
                    <VolumeIconComponent size={20} />
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 appearance-none cursor-pointer rounded-full bg-gray-700 focus:outline-none"
                    style={{
                        background: `linear-gradient(to right, #6366f1 0%, #a855f7 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`,
                    }}
                />
            </div>
          </div>
        </div>

        {/* Main Player Button */}
        <div className="relative">
          {/* Glow effect */}
          {isPlaying && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-xl opacity-60 transition-opacity duration-500 animate-pulse-slow" 
              />
          )}

          {/* Player button */}
          <button
            onClick={handlePlayPause}
            className={`relative w-16 h-16 bg-gray-900 border-2 border-gray-700 rounded-full shadow-2xl shadow-gray-900/50 cursor-pointer 
                        transform transition-all duration-300 hover:scale-105 flex items-center justify-center text-white
                        ${isLoading ? 'animate-spin-slow' : ''}`}
            disabled={isLoading}
            aria-label={isPlaying ? "Pause Music" : "Play Music"}
          >
            {/* Inner Ring Accent */}
            <div className="absolute inset-1 rounded-full border border-indigo-500/50 opacity-20" />

            {/* FIX 4: Use ButtonIconComponent as a JSX tag */}
            <ButtonIconComponent 
                size={24} 
                className={`${isLoading ? 'text-indigo-400' : 'text-white'} ${ButtonIconComponent === Play ? 'ml-1' : ''}`}
            />
          </button>
        </div>
      </div>
      
      {/* Custom Tailwind and Keyframe Styles */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
}