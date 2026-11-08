import React, { useState, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Upload, 
  Copy, 
  Check, 
  FileAudio, 
  Sparkles, 
  BookmarkPlus, 
  Volume2, 
  RefreshCw 
} from 'lucide-react';

interface TranscribeModuleProps {
  onSaveToVault?: (title: string, prompt: string, model: string, transcript: string) => void;
}

export const TranscribeModule: React.FC<TranscribeModuleProps> = ({ onSaveToVault }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const blobUrl = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(blobUrl);
        stream.getTracks().forEach(track => track.stop());
        await processAudioBlob(audioBlob, 'audio/webm');
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      setErrorMessage('Could not access microphone: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioBlobUrl(URL.createObjectURL(file));
    await processAudioBlob(file, file.type || 'audio/webm');
  };

  const processAudioBlob = async (blob: Blob, mimeType: string) => {
    setLoading(true);
    setTranscription('');
    setSavedSuccess(false);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        const response = await fetch('/api/audio/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            mimeType: mimeType || 'audio/webm',
            prompt: 'Transcribe this voice transmission verbatim with pristine accuracy, standard capitalization, and appropriate structural formatting.'
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Transcription failed');

        setTranscription(data.transcription || 'No audible speech identified in transmission.');
      };
    } catch (err: any) {
      console.error('Transcription error:', err);
      setTranscription(`Transcription failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!transcription) return;
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!transcription || !onSaveToVault) return;
    onSaveToVault(
      'Voice Transcription ' + new Date().toLocaleDateString(),
      'Microphone Audio Intake',
      'gemini-3.5-transcribe',
      transcription
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Banner */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span>Speech-to-Text Transcription</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20 font-semibold">
                gemini-3.5-transcribe
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Direct microphone recording and audio file ingest transcribed using Google Gemini 3.5 Transcribe.
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-200 text-xs px-2 py-0.5">✕</button>
        </div>
      )}

      {/* Recording & Ingest Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Live Mic Card */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center">
          <div className="relative">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse shadow-red-500/30 ring-4 ring-red-500/20'
                  : 'bg-teal-500 hover:bg-teal-400 text-zinc-950 shadow-teal-500/20 hover:scale-105'
              }`}
            >
              {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
            {isRecording && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="text-sm font-bold text-zinc-200">
              {isRecording ? 'Capturing Voice Transmission...' : 'Microphone Ready'}
            </div>
            <div className="text-xs text-zinc-400 font-mono mt-1">
              {isRecording ? `Recording Duration: ${formatSeconds(recordingSeconds)}` : 'Click to start recording'}
            </div>
          </div>
        </div>

        {/* Upload Audio File Card */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center">
          <input
            type="file"
            ref={fileInputRef}
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-full bg-zinc-800 hover:bg-zinc-700 text-teal-400 border border-zinc-700 flex items-center justify-center transition-all hover:scale-105"
          >
            <Upload className="w-8 h-8" />
          </button>
          <div>
            <div className="text-sm font-bold text-zinc-200">Upload Audio File</div>
            <div className="text-xs text-zinc-400 font-mono mt-1">
              Supports MP3, WAV, WebM, M4A, OGG
            </div>
          </div>
        </div>
      </div>

      {/* Audio Playback If Available */}
      {audioBlobUrl && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="text-xs font-mono text-zinc-400 shrink-0">Captured Audio:</span>
          <audio src={audioBlobUrl} controls className="w-full h-8" />
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-zinc-900 border border-teal-500/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center">
          <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
          <div className="text-sm font-semibold text-zinc-200">
            gemini-3.5-transcribe analyzing acoustic signal...
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            Decoding phonetic layers and constructing textual transcript
          </div>
        </div>
      )}

      {/* Transcription Output */}
      {transcription && (
        <div className="bg-zinc-900 border border-teal-500/30 rounded-2xl p-5 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span className="text-xs font-mono font-bold text-zinc-200 uppercase">
                Verbatim Transcript
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                (gemini-3.5-transcribe)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onSaveToVault && (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 text-xs bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300 hover:text-amber-300 transition-colors"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Save to Vault</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 px-3 py-1.5 rounded-lg text-teal-300 transition-colors font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Transcript'}</span>
              </button>
            </div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-sm text-zinc-100 font-sans leading-relaxed whitespace-pre-wrap">
            {transcription}
          </div>
        </div>
      )}
    </div>
  );
};
