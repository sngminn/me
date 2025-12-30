'use client';

import { useEffect, useRef } from 'react';

const ASCII = ['@', '%', '#', '*', '+', '=', '-', ':', '.', ' '];

export default function AsciiVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    let animationId: number;
    const render = () => {
      const video = videoRef.current;
      const inputCanvas = inputCanvasRef.current;
      const output = outputRef.current;

      if (!inputCanvas || !output || !video) return;

      const ctx = inputCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx || video.videoWidth === 0) {
        animationId = requestAnimationFrame(render);
        return;
      }

      const [w, h] = [Math.floor(video.videoWidth / 5), Math.floor(video.videoHeight / 8)];

      if (inputCanvas.width !== w || inputCanvas.height !== h) {
        [inputCanvas.width, inputCanvas.height] = [w, h];
      }

      ctx.drawImage(video, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const converted: string[] = [];

      for (let i = 0; i < imageData.data.length; i += 4) {
        const red = imageData.data[i];
        const green = imageData.data[i + 1];
        const blue = imageData.data[i + 2];
        const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue; //get luminance

        converted.push(
          ASCII[Math.min(Math.floor((luminance / 255) * ASCII.length), ASCII.length - 1)]
        );
        if ((i / 4 + 1) % w === 0) converted.push('\n');
      }

      output.innerText = converted.join('');

      animationId = requestAnimationFrame(render);
    };
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.error('재생 실패:', e));
    }
    animationId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className={className}>
      <video
        src={'/hero.mp4'}
        ref={videoRef}
        className="absolute -z-50 opacity-0 pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
      />
      <pre
        ref={outputRef}
        className="font-mono text-shadow-2xs text-[calc(0.7vh+0.5vw)] leading-[100%] w-fit whitespace-pre text-text-inverse pointer-events-none"
      />
      <canvas ref={inputCanvasRef} className="hidden" />
    </div>
  );
}
