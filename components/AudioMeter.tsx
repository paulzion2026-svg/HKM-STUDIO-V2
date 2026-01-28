
import React, { useEffect, useRef } from 'react';

/**
 * Singleton Audio Manager to handle the restriction that createMediaElementSource 
 * can only be called once per HTMLMediaElement and to provide a summed master node.
 */
class GlobalAudioManager {
  private static instance: GlobalAudioManager;
  private context: AudioContext | null = null;
  private elementSourceMap = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>();
  private streamSourceMap = new WeakMap<MediaStream, MediaStreamAudioSourceNode>();

  private constructor() {}

  static getInstance() {
    if (!this.instance) this.instance = new GlobalAudioManager();
    return this.instance;
  }

  getContext() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.context;
  }

  getSource(source: MediaStream | HTMLMediaElement): AudioNode {
    const ctx = this.getContext();
    if (source instanceof MediaStream) {
      let node = this.streamSourceMap.get(source);
      if (!node) {
        node = ctx.createMediaStreamSource(source);
        this.streamSourceMap.set(source, node);
      }
      return node;
    } else {
      let node = this.elementSourceMap.get(source);
      if (!node) {
        node = ctx.createMediaElementSource(source);
        node.connect(ctx.destination);
        this.elementSourceMap.set(source, node);
      }
      return node;
    }
  }

  resume() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume().catch(console.warn);
    }
  }
}

interface AudioMeterProps {
  source?: MediaStream | HTMLMediaElement | (MediaStream | HTMLMediaElement)[] | null;
  vertical?: boolean;
  className?: string;
  barCount?: number;
}

const AudioMeter: React.FC<AudioMeterProps> = ({ source, vertical = true, className = "", barCount = 20 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);

  useEffect(() => {
    if (!source) return;

    const manager = GlobalAudioManager.getInstance();
    const ctx = manager.getContext();
    const sourceArray = Array.isArray(source) ? source : [source];
    
    if (sourceArray.length === 0) return;

    const masterSumNode = ctx.createGain();
    const analyserL = ctx.createAnalyser();
    const analyserR = ctx.createAnalyser();
    analyserL.fftSize = 128;
    analyserR.fftSize = 128;
    analyserL.smoothingTimeConstant = 0.4;
    analyserR.smoothingTimeConstant = 0.4;

    const splitter = ctx.createChannelSplitter(2);
    masterSumNode.connect(splitter);
    splitter.connect(analyserL, 0);
    try {
      splitter.connect(analyserR, 1);
    } catch {
      splitter.connect(analyserR, 0);
    }

    const connectedNodes: AudioNode[] = [];

    sourceArray.forEach(s => {
      try {
        const node = manager.getSource(s);
        node.connect(masterSumNode);
        connectedNodes.push(node);
      } catch (e) {
        console.warn("Source connection skipped:", e);
      }
    });

    const bufferLength = analyserL.frequencyBinCount;
    const dataArrayL = new Uint8Array(bufferLength);
    const dataArrayR = new Uint8Array(bufferLength);

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const drawCtx = canvas.getContext('2d');
      if (!drawCtx) return;

      manager.resume();

      analyserL.getByteFrequencyData(dataArrayL);
      analyserR.getByteFrequencyData(dataArrayR);

      const calculateLevel = (data: Uint8Array) => {
        let max = 0;
        for (let i = 0; i < bufferLength; i++) if (data[i] > max) max = data[i];
        const level = max / 255;
        return level < 0.02 ? 0 : level;
      };

      const levelL = calculateLevel(dataArrayL);
      const levelR = calculateLevel(dataArrayR);

      const { width, height } = canvas;
      drawCtx.clearRect(0, 0, width, height);

      const spacing = 1.5;
      const totalSpacing = spacing * (barCount - 1);
      const barHeight = vertical ? (height - totalSpacing) / barCount : (height / 2) - 1.5;
      const barWidth = vertical ? (width / 2) - 1.5 : (width - totalSpacing) / barCount;

      const drawChannel = (level: number, xOff: number, yOff: number) => {
        for (let i = 0; i < barCount; i++) {
          const threshold = i / barCount;
          const isActive = level > threshold;
          let color = "#10b981"; 
          if (i > barCount * 0.85) color = "#ef4444"; 
          else if (i > barCount * 0.65) color = "#fbbf24";
          drawCtx.fillStyle = isActive ? color : "#1a1e23";
          if (vertical) {
            const y = height - (i + 1) * (barHeight + spacing);
            drawCtx.fillRect(xOff, y, barWidth, barHeight);
          } else {
            const x = i * (barWidth + spacing);
            drawCtx.fillRect(x, yOff, barWidth, barHeight);
          }
        }
      };

      if (vertical) {
        drawChannel(levelL, 0, 0);
        drawChannel(levelR, width / 2 + 1, 0);
      } else {
        drawChannel(levelL, 0, 0);
        drawChannel(levelR, 0, height / 2 + 1);
      }
      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      connectedNodes.forEach(node => {
        try { node.disconnect(masterSumNode); } catch (e) {}
      });
      masterSumNode.disconnect();
      splitter.disconnect();
    };
  }, [source, barCount, vertical]);

  return (
    <canvas 
      ref={canvasRef} 
      width={vertical ? 14 : 120} 
      height={vertical ? 120 : 14} 
      onClick={() => GlobalAudioManager.getInstance().resume()}
      className={`rounded-sm bg-black/90 shadow-inner ring-1 ring-white/5 cursor-pointer ${className}`}
    />
  );
};

export default AudioMeter;
