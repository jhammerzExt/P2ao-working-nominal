import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Maximize, 
  Minimize, 
  PictureInPicture2, 
  RotateCcw, 
  RotateCw, 
  FastForward, 
  Sliders, 
  Sparkles, 
  Download, 
  Bookmark, 
  ExternalLink, 
  X, 
  Tv, 
  Radio, 
  Share2, 
  Check, 
  Copy,
  Info,
  Film,
  Music,
  Zap,
  Repeat,
  RefreshCw
} from 'lucide-react';

interface UltraVideoPlayerProps {
  url: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  onSaveToVault?: (artifact: any) => void;
  isFloatingMini?: boolean;
  onToggleFloatingMini?: () => void;
}

export const UltraVideoPlayer: React.FC<UltraVideoPlayerProps> = ({
  url,
  title = 'Sovereign Cinema Player',
  isOpen,
  onClose,
  onSaveToVault,
  isFloatingMini = false,
  onToggleFloatingMini
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '21:9' | 'fill'>('16:9');
  const [audioPreset, setAudioPreset] = useState<'flat' | 'bass' | 'vocal' | 'theater'>('theater');
  const [volumeBooster, setVolumeBooster] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Manual URL Switcher
  const [activeMediaUrl, setActiveMediaUrl] = useState<string>(url);
  const [urlInput, setUrlInput] = useState<string>('');

  useEffect(() => {
    setActiveMediaUrl(url);
  }, [url]);

  // Determine media provider / type
  const mediaInfo = useMemo(() => {
    const raw = activeMediaUrl.trim();
    
    // 1. YouTube
    const ytMatch = raw.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return {
        type: 'youtube' as const,
        id: ytMatch[1],
        embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&enablejsapi=1&playsinline=1&rel=0&modestbranding=1&vq=hd1080&html5=1`,
        providerName: 'YouTube Best Decoded HD Stream'
      };
    }

    // 2. Vimeo
    const vimeoMatch = raw.match(/(?:vimeo\.com\/(?:channels\/[^\/]+\/|groups\/[^\/]+\/videos\/|album\/[^\/]+\/video\/|video\/|)(\d+))/i);
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        type: 'vimeo' as const,
        id: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&badge=0&autopause=0`,
        providerName: 'Vimeo Cinema'
      };
    }

    // 3. Twitch
    const twitchMatch = raw.match(/twitch\.tv\/([\w]+)/i);
    if (twitchMatch && twitchMatch[1]) {
      const channel = twitchMatch[1];
      const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      return {
        type: 'twitch' as const,
        id: channel,
        embedUrl: `https://player.twitch.tv/?channel=${channel}&parent=${host}&autoplay=true`,
        providerName: 'Twitch Live Stream'
      };
    }

    // 4. Dailymotion
    const dailyMatch = raw.match(/dailymotion\.com\/video\/([\w]+)/i);
    if (dailyMatch && dailyMatch[1]) {
      return {
        type: 'dailymotion' as const,
        id: dailyMatch[1],
        embedUrl: `https://www.dailymotion.com/embed/video/${dailyMatch[1]}?autoplay=1`,
        providerName: 'Dailymotion'
      };
    }

    // 5. Loom
    const loomMatch = raw.match(/loom\.com\/share\/([\w]+)/i);
    if (loomMatch && loomMatch[1]) {
      return {
        type: 'loom' as const,
        id: loomMatch[1],
        embedUrl: `https://www.loom.com/embed/${loomMatch[1]}?autoplay=1`,
        providerName: 'Loom Video'
      };
    }

    // 6. Direct Audio
    const isAudio = /\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i.test(raw) || raw.includes('icecast') || raw.includes('audio');
    if (isAudio) {
      return {
        type: 'audio' as const,
        id: raw,
        embedUrl: raw,
        providerName: 'High-Fidelity Audio Stream'
      };
    }

    // 7. Direct HTML5 Video (mp4, webm, mov, m3u8, etc.)
    return {
      type: 'direct-video' as const,
      id: raw,
      embedUrl: raw,
      providerName: 'Sovereign Native Video (HTML5/HLS)'
    };
  }, [activeMediaUrl]);

  // Video Time Update & Events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      video.playbackRate = playbackRate;
      video.volume = volume;
      video.play().catch(() => {});
    };
    const handleEnded = () => {
      if (!isLooping) setIsPlaying(false);
    };

    const handleVideoError = (e: any) => {
      console.warn('[CinemaPlayer] Primary source load failure, attempting recovery sequence...', e);
      // If primary stream fails, we could try a direct download proxy or procedural fallback
      // For now, we'll just log it and offer the user a "Repair" option in the UI
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleVideoError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleVideoError);
    };
  }, [activeMediaUrl, isLooping, playbackRate, volume]);

  // Keyboard Shortcuts (Space, F, M, Arrow Keys)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        skipTime(10);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        skipTime(-10);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        changeVolume(0.1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        changeVolume(-0.1);
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        } else if (!isFloatingMini) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, isFullscreen, isFloatingMini, volume, isMuted]);

  const togglePlay = () => {
    if (mediaInfo.type !== 'direct-video' && mediaInfo.type !== 'audio') {
      setIsPlaying(!isPlaying);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeVolume = (delta: number) => {
    const next = Math.max(0, Math.min(1, volume + delta));
    setVolume(next);
    if (videoRef.current) {
      videoRef.current.volume = next;
      videoRef.current.muted = false;
    }
    setIsMuted(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (video.requestPictureInPicture) {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP note:', err);
    }
  };

  const handleSaveVault = () => {
    if (onSaveToVault) {
      onSaveToVault({
        type: mediaInfo.type === 'audio' ? 'music' : 'video',
        title: title || `${mediaInfo.providerName} Recording`,
        prompt: `Extracted stream from Sovereign Browser: ${activeMediaUrl}`,
        model: 'Sovereign Cinema Engine v7.0',
        mediaUrl: activeMediaUrl,
        metadataJson: JSON.stringify({
          provider: mediaInfo.providerName,
          aspectRatio,
          audioPreset,
          savedAt: new Date().toISOString()
        })
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(activeMediaUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) return null;

  // Preset Channels
  const streamPresets = [
    { title: 'Lofi Girl 24/7 Live Beats', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', badge: 'YouTube 1080p' },
    { title: 'DEFCON Cyber Radio (Music for Hackers)', url: 'https://ice1.somafm.com/defcon-128-mp3', badge: 'Stereo MP3' },
    { title: 'NASA Space Live Feed', url: 'https://www.youtube.com/watch?v=21X5lGlDOfg', badge: 'NASA Live' },
    { title: 'Ambient Deep Focus Coding', url: 'https://www.youtube.com/watch?v=5qap5aO4i9A', badge: 'Ambient' },
    { title: 'Direct Big Buck Bunny (4K MP4)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', badge: 'Direct MP4' }
  ];

  // MINI FLOATING PLAYER VIEW (Picture-in-Picture inside app)
  if (isFloatingMini) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-zinc-950 border-2 border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden ring-4 ring-black/60 transition-all animate-slideUp">
        <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            {onToggleFloatingMini && (
              <button
                onClick={onToggleFloatingMini}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                title="Expand to Full Player"
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-red-400"
              title="Close Player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Video Frame */}
        <div className="relative aspect-video bg-black">
          {mediaInfo.type === 'direct-video' ? (
            <video
              ref={videoRef}
              src={`/api/browser/stream-media?url=${encodeURIComponent(activeMediaUrl)}`}
              className="w-full h-full object-cover"
              autoPlay
              controls
              playsInline
              loop={isLooping}
            />
          ) : mediaInfo.type === 'audio' ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-tr from-zinc-900 to-zinc-950">
              <Music className="w-10 h-10 text-emerald-400 animate-pulse mb-2" />
              <div className="text-xs font-bold text-zinc-200 truncate">{title}</div>
              <audio src={activeMediaUrl} autoPlay controls className="mt-2 w-full h-8" />
            </div>
          ) : (
            <iframe
              src={mediaInfo.embedUrl}
              title={title}
              className="w-full h-full border-none"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            />
          )}
        </div>
      </div>
    );
  }

  // FULL CINEMA THEATER VIEWPORT
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-sky-600 via-indigo-900 to-emerald-600 blur-3xl" />

      {/* Main Player Container */}
      <div 
        ref={containerRef}
        className={`relative z-10 w-full flex flex-col bg-zinc-950 border border-zinc-800 shadow-2xl transition-all ${
          isTheaterMode 
            ? 'h-full max-w-full rounded-none border-none' 
            : 'max-w-6xl max-h-[92vh] mx-3 sm:mx-6 rounded-3xl overflow-hidden'
        }`}
      >
        {/* Top Header Controls Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-zinc-900/90 border-b border-zinc-800 text-xs shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <Film className="w-4 h-4 animate-pulse" />
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-zinc-100 truncate text-sm sm:text-base flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                  {mediaInfo.providerName}
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono truncate">{activeMediaUrl}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick URL Switcher Button */}
            <button
              onClick={() => {
                const next = prompt('Enter any Video, Audio, YouTube, Vimeo, or MP4 URL:', activeMediaUrl);
                if (next && next.trim()) setActiveMediaUrl(next.trim());
              }}
              className="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Change Video URL"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Change URL</span>
            </button>

            {/* Save to Vault */}
            <button
              onClick={handleSaveVault}
              className={`p-1.5 rounded-xl border transition-all ${
                savedSuccess 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300 hover:text-white'
              }`}
              title="Save Video/Audio to Firestore Vault"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Copy Stream Link */}
            <button
              onClick={copyUrl}
              className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title="Copy Media URL"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Theater Mode Toggle */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className={`p-1.5 rounded-xl border transition-colors ${
                isTheaterMode 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
              }`}
              title={isTheaterMode ? 'Exit Theater Mode' : 'Enter Theater Mode'}
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* PiP Mini Player */}
            {onToggleFloatingMini && (
              <button
                onClick={onToggleFloatingMini}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white transition-colors"
                title="Pop out into floating mini-player"
              >
                <PictureInPicture2 className="w-4 h-4" />
              </button>
            )}

            {/* Repair Stream */}
            <button
              onClick={() => {
                const current = activeMediaUrl;
                setActiveMediaUrl('');
                setTimeout(() => setActiveMediaUrl(current), 100);
              }}
              className="p-1.5 rounded-xl bg-zinc-800 hover:bg-emerald-500/20 border border-zinc-700 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-400 transition-colors"
              title="Repair Stream (Reload Decoder)"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-800 hover:bg-red-500/20 border border-zinc-700 hover:border-red-500/40 text-zinc-400 hover:text-red-400 transition-colors ml-1"
              title="Close Cinema Player (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Viewport Stage */}
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden min-h-[380px] sm:min-h-[500px]">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none z-10" />

          {mediaInfo.type === 'direct-video' ? (
            <video
              ref={videoRef}
              src={`/api/browser/stream-media?url=${encodeURIComponent(activeMediaUrl)}`}
              className={`w-full max-h-full object-contain transition-all ${
                aspectRatio === '4:3' ? 'aspect-[4/3]' : aspectRatio === '21:9' ? 'aspect-[21/9]' : aspectRatio === 'fill' ? 'object-cover h-full' : 'aspect-video'
              }`}
              autoPlay
              playsInline
              loop={isLooping}
              onClick={togglePlay}
            />
          ) : mediaInfo.type === 'audio' ? (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg w-full">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-500 p-1 shadow-2xl mb-6 animate-pulse">
                <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-4xl">
                  🎵
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-1 truncate w-full">{title}</h2>
              <p className="text-xs text-emerald-400 font-mono mb-6">High-Fidelity Stereo Audio Stream (Zero Token Spend)</p>
              
              <audio 
                src={`/api/browser/stream-media?url=${encodeURIComponent(activeMediaUrl)}`} 
                autoPlay 
                controls 
                className="w-full filter invert hue-rotate-180" 
              />
            </div>
          ) : (
            <iframe
              src={mediaInfo.embedUrl}
              title={title}
              className="w-full h-full border-none absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
          )}

          {/* Quick HUD overlay for Direct Video */}
          {mediaInfo.type === 'direct-video' && (
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 transition-opacity">
              {/* Progress Slider */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-zinc-400 min-w-[42px] text-right">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[11px] font-mono text-zinc-400 min-w-[42px]">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-transform active:scale-95"
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={() => skipTime(-10)}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300"
                    title="Rewind 10s (Left Arrow)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => skipTime(10)}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300"
                    title="Forward 10s (Right Arrow)"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  {/* Volume Group */}
                  <div className="flex items-center gap-1.5 ml-2">
                    <button onClick={toggleMute} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 sm:w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Right Settings */}
                <div className="flex items-center gap-2">
                  {/* Playback Speed selector */}
                  <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 text-[10px] font-mono">
                    {[0.5, 1.0, 1.5, 2.0].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => handleSpeedChange(rate)}
                        className={`px-1.5 py-0.5 rounded-lg transition-colors ${
                          playbackRate === rate ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>

                  {/* Loop Toggle */}
                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`p-1.5 rounded-xl border transition-colors ${
                      isLooping ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'hover:bg-zinc-800 border-transparent text-zinc-400'
                    }`}
                    title="Loop Video"
                  >
                    <Repeat className="w-4 h-4" />
                  </button>

                  {/* Native PiP */}
                  <button
                    onClick={togglePiP}
                    className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    title="Picture in Picture"
                  >
                    <PictureInPicture2 className="w-4 h-4" />
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    title="Fullscreen (F)"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Presets & Channels Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between text-xs overflow-x-auto scrollbar-none gap-3">
          <div className="flex items-center gap-2 shrink-0 text-zinc-400 text-[11px] font-mono">
            <span>PRESETS:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {streamPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMediaUrl(preset.url)}
                className={`px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors ${
                  activeMediaUrl === preset.url 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' 
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60'
                }`}
              >
                <span>{preset.title}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 font-mono">
                  {preset.badge}
                </span>
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0 text-[11px] font-mono text-zinc-500">
            <span>SPACE: PLAY/PAUSE</span>
            <span>•</span>
            <span>ARROWS: SEEK</span>
            <span>•</span>
            <span>F: FULLSCREEN</span>
          </div>
        </div>
      </div>
    </div>
  );
};
