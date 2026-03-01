import { useRef } from 'react';
import { KALIBER_SHAPES, drawKaliberShape, hexToRgba } from '../constants';

type Options = {
  bgCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  fgCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  eventCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  activeLayer: 'fg' | 'bg';
  activeTool: string;
  color: string;
  brushSize: number;
  opacity: number;
  baseBgColor: React.MutableRefObject<string>;
};

export const useVerfdoosDrawing = ({
  bgCanvasRef,
  fgCanvasRef,
  eventCanvasRef,
  activeLayer,
  activeTool,
  color,
  brushSize,
  opacity,
  baseBgColor
}: Options) => {
  const drawState = useRef({
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    smudgeColor: [0,0,0,0]
  });

  const getCoordinates = (e: any) => {
    const canvas = eventCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const draw = (lastX: number, lastY: number, currentX: number, currentY: number) => {
    const activeCanvas = activeLayer === 'fg' ? fgCanvasRef.current : bgCanvasRef.current;
    if (!activeCanvas) return;

    const ctx = activeCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-atop';

    if (activeTool === 'gum') {
      ctx.globalAlpha = opacity / 100;
      ctx.strokeStyle = activeLayer === 'fg' ? '#FFFFFF' : baseBgColor.current;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
      return;
    }

    if (activeTool === 'mengen') {
      const currentPixel = ctx.getImageData(currentX, currentY, 1, 1).data;
      let prevColor = drawState.current.smudgeColor;

      if (prevColor[3] > 0 || currentPixel[3] > 0) {
        let r = prevColor[0], g = prevColor[1], b = prevColor[2];
        if (currentPixel[3] > 0 && prevColor[3] > 0) {
          r = Math.round(prevColor[0] * 0.7 + currentPixel[0] * 0.3);
          g = Math.round(prevColor[1] * 0.7 + currentPixel[1] * 0.3);
          b = Math.round(prevColor[2] * 0.7 + currentPixel[2] * 0.3);
        } else if (currentPixel[3] > 0) {
          r = currentPixel[0]; g = currentPixel[1]; b = currentPixel[2];
        }
        drawState.current.smudgeColor = [r, g, b, 255];
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.25)`;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
      }
      return;
    }

    if (activeTool === 'waterverf') {
      ctx.globalAlpha = (opacity / 100) * 0.25;
      const dist = Math.hypot(currentX - lastX, currentY - lastY);
      const steps = Math.max(1, Math.floor(dist / (brushSize / 4)));
      for (let i = 0; i <= steps; i++) {
        const cx = lastX + (currentX - lastX) * (i / steps);
        const cy = lastY + (currentY - lastY) * (i / steps);
        const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, brushSize / 2);
        rg.addColorStop(0, hexToRgba(color, 1));
        rg.addColorStop(1, hexToRgba(color, 0));
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(cx, cy, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    if (activeTool === 'kwast') {
      ctx.globalAlpha = opacity / 100;
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    }
    else if (activeTool === 'stift') {
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    }
    else if (activeTool === 'spray') {
      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = color;
      const density = brushSize * 2.5;
      for (let i = 0; i < density; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * (brushSize / 2);
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius;
        ctx.fillRect(currentX + offsetX, currentY + offsetY, 2, 2);
      }
    }
  };

  const handleStart = (e: any) => {
    if (e.cancelable) e.preventDefault();
    const { x, y } = getCoordinates(e);

    const activeCanvas = activeLayer === 'fg' ? fgCanvasRef.current : bgCanvasRef.current;
    if (!activeCanvas) return;
    const ctx = activeCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (activeTool === 'emmer') {
      ctx.globalCompositeOperation = 'source-atop';
      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);
      return;
    }

    if (activeTool === 'stempel') {
      ctx.globalCompositeOperation = 'source-atop';
      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = color;
      const randomShape = KALIBER_SHAPES[Math.floor(Math.random() * KALIBER_SHAPES.length)];
      drawKaliberShape(ctx, randomShape, x, y, brushSize * 3);
      drawState.current = { isDrawing: true, lastX: x, lastY: y, smudgeColor: [0,0,0,0] };
      return;
    }

    const pixel = ctx.getImageData(x, y, 1, 1).data;

    drawState.current = {
      isDrawing: true,
      lastX: x,
      lastY: y,
      smudgeColor: [pixel[0], pixel[1], pixel[2], pixel[3]]
    };

    draw(x, y, x, y);
  };

  const handleMove = (e: any) => {
    if (e.cancelable) e.preventDefault();
    if (!drawState.current.isDrawing) return;
    const { x, y } = getCoordinates(e);

    if (activeTool === 'stempel') {
      const dist = Math.hypot(x - drawState.current.lastX, y - drawState.current.lastY);
      if (dist > brushSize * 2) {
        const activeCanvas = activeLayer === 'fg' ? fgCanvasRef.current : bgCanvasRef.current;
        if (!activeCanvas) return;
        const ctx = activeCanvas.getContext('2d');
        if (!ctx) return;
        ctx.globalCompositeOperation = 'source-atop';
        ctx.globalAlpha = opacity / 100;
        ctx.fillStyle = color;
        const randomShape = KALIBER_SHAPES[Math.floor(Math.random() * KALIBER_SHAPES.length)];
        drawKaliberShape(ctx, randomShape, x, y, brushSize * 3);
        drawState.current.lastX = x;
        drawState.current.lastY = y;
      }
      return;
    }

    draw(drawState.current.lastX, drawState.current.lastY, x, y);
    drawState.current.lastX = x;
    drawState.current.lastY = y;
  };

  const handleEnd = () => {
    drawState.current.isDrawing = false;
  };

  return { handleStart, handleMove, handleEnd };
};
