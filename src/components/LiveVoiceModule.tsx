import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

export const LiveVoiceModule: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startLiveSession = async () => {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${location.host}/live`);
    wsRef.current = ws;

    ws.onopen = async () => {
      setIsConnected(true);
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(err => {
        setErrorMessage('Could not access microphone: ' + err.message);
        throw err;
      });
      streamRef.current = stream;
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32Array to 16-bit PCM (Int16Array)
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
        }
        // Base64 encode the Int16Array buffer
        const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
        ws.send(JSON.stringify({ audio: base64 }));
      };
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.audio) {
        playAudioChunk(outputAudioCtxRef.current!, msg.audio);
      }
    };
  };

  const stopLiveSession = () => {
    wsRef.current?.close();
    streamRef.current?.getTracks().forEach(track => track.stop());
    inputAudioCtxRef.current?.close();
    outputAudioCtxRef.current?.close();
    setIsConnected(false);
  };

  const playAudioChunk = async (ctx: AudioContext, base64: string) => {
    // Decode base64 to Float32Array
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;

    const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();
  };

  return (
    <div className="flex flex-col gap-2">
      {errorMessage && (
        <div className="p-2 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-[10px] font-mono flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-200 text-xs px-2 py-0.5">✕</button>
        </div>
      )}
      <button onClick={isConnected ? stopLiveSession : startLiveSession} className="p-2 rounded-full">
        {isConnected ? <MicOff /> : <Mic />}
      </button>
    </div>
  );
};
