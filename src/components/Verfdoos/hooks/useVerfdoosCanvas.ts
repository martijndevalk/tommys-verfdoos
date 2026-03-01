import { useRef, useState, useEffect } from 'react';
import { TOMMY_SVG_PATH, KALIBER_SHAPES, COLORS, drawKaliberShape } from '../constants';

export const useVerfdoosCanvas = (isDarkMode: boolean) => {
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const eventCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const baseBgColor = useRef<string>('#FFFFFF');

  const isDarkModeRef = useRef(isDarkMode);
  useEffect(() => {
    isDarkModeRef.current = isDarkMode;
  }, [isDarkMode]);

  const [isLoaded, setIsLoaded] = useState(false);

  const applyInitState = () => {
    const width = 580;
    const height = 580;
    const currentIsDarkMode = isDarkModeRef.current;

    // bgCanvas is the Circle (Achtergrond)
    // fgCanvas is Tommy (Binnenin Tommy)
    // Light mode: Circle is Black, Tommy is White
    // Dark mode: Circle is White, Tommy is Black
    baseBgColor.current = currentIsDarkMode ? '#FFFFFF' : '#000000';
    const fgColor = currentIsDarkMode ? '#000000' : '#FFFFFF';
    const path2d = new Path2D(TOMMY_SVG_PATH);

    if (bgCanvasRef.current) {
      const bgCtx = bgCanvasRef.current.getContext('2d', { willReadFrequently: true });
      if (bgCtx) {
        bgCtx.clearRect(0, 0, width, height);
        bgCtx.beginPath();
        bgCtx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
        bgCtx.fillStyle = baseBgColor.current;
        bgCtx.fill();
      }
    }

    if (fgCanvasRef.current) {
      const fgCtx = fgCanvasRef.current.getContext('2d', { willReadFrequently: true });
      if (fgCtx) {
        fgCtx.clearRect(0, 0, width, height);
        fgCtx.beginPath();
        fgCtx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
        fgCtx.fillStyle = fgColor;
        fgCtx.fill();

        fgCtx.globalCompositeOperation = 'destination-out';
        fgCtx.fill(path2d, 'evenodd');
        fgCtx.globalCompositeOperation = 'source-over';
      }
    }
  };

  useEffect(() => {
    const initCanvases = () => {
      const width = 580;
      const height = 580;

      [bgCanvasRef, fgCanvasRef, eventCanvasRef].forEach(ref => {
        if (ref.current) {
          ref.current.width = width;
          ref.current.height = height;
        }
      });

      applyInitState();
      setIsLoaded(true);
    };

    setTimeout(initCanvases, 100);
  }, []);

  const clearCanvas = () => {
    applyInitState();
  };

  const randomizeCanvas = () => {
    if (!bgCanvasRef.current || !fgCanvasRef.current) return;
    const width = 580;
    const height = 580;
    const bgCtx = bgCanvasRef.current.getContext('2d');
    const fgCtx = fgCanvasRef.current.getContext('2d');

    const applyRandomPattern = (ctx: CanvasRenderingContext2D) => {
      ctx.globalCompositeOperation = 'source-atop';
      ctx.globalAlpha = 1.0;

      const patternType = Math.floor(Math.random() * 6);
      const shuffledColors = [...COLORS].sort(() => 0.5 - Math.random());
      const c1 = shuffledColors[0];
      const c2 = shuffledColors[1];
      const c3 = shuffledColors[2];

      ctx.fillStyle = c1;
      ctx.fillRect(0, 0, width, height);

      if (patternType === 0) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, c1);
        gradient.addColorStop(0.5, c2);
        gradient.addColorStop(1, c3);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
      else if (patternType === 1) {
        ctx.fillStyle = c2;
        const dotSize = Math.random() * 20 + 15;
        for (let x = 0; x <= width; x += dotSize * 2.5) {
          for (let y = 0; y <= height; y += dotSize * 2.5) {
            ctx.beginPath();
            ctx.arc(x + (Math.random()*15 - 7.5), y + (Math.random()*15 - 7.5), dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      else if (patternType === 2) {
        ctx.lineWidth = Math.random() * 40 + 20;
        ctx.strokeStyle = c2;
        ctx.lineCap = 'round';
        for (let i = -width; i < width * 2; i += ctx.lineWidth * 2) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + height, height);
          ctx.stroke();
        }
      }
      else if (patternType === 3) {
        for (let i = 0; i < 40; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? c2 : c3;
          ctx.beginPath();
          ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 30 + 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      else if (patternType === 4) {
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.8);
        gradient.addColorStop(0, c2);
        gradient.addColorStop(1, c1);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
      else if (patternType === 5) {
        for (let i = 0; i < 35; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? c2 : c3;
          const randomShape = KALIBER_SHAPES[Math.floor(Math.random() * KALIBER_SHAPES.length)];
          const rx = Math.random() * width;
          const ry = Math.random() * height;
          const rsize = Math.random() * 120 + 30;
          const rrot = Math.random() * Math.PI * 2;
          drawKaliberShape(ctx, randomShape, rx, ry, rsize, rrot);
        }
      }
    };

    if (bgCtx) applyRandomPattern(bgCtx);
    if (fgCtx) applyRandomPattern(fgCtx);
  };

  return { bgCanvasRef, fgCanvasRef, eventCanvasRef, isLoaded, clearCanvas, randomizeCanvas, baseBgColor };
};
