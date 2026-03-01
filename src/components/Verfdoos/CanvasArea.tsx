import { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import styles from './CanvasArea.module.css';

type Props = {
  bgCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  fgCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  eventCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  isLoaded: boolean;
  onStart: (e: any) => void;
  onMove: (e: any) => void;
  onEnd: () => void;
  brushSize: number;
  color: string;
  activeTool: string;
};

export function CanvasArea({
  bgCanvasRef,
  fgCanvasRef,
  eventCanvasRef,
  isLoaded,
  onStart,
  onMove,
  onEnd,
  brushSize,
  color,
  activeTool
}: Props) {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const canvas = eventCanvasRef.current;
    if (!canvas) return;

    const preventTouchScroll = (e: TouchEvent) => {
      e.preventDefault();
    };

    // Use passive: false to allow preventDefault() inside the event body
    canvas.addEventListener('touchstart', preventTouchScroll, { passive: false });
    canvas.addEventListener('touchmove', preventTouchScroll, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', preventTouchScroll);
      canvas.removeEventListener('touchmove', preventTouchScroll);
    };
  }, [eventCanvasRef]);

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    onMove(e);

    const canvas = eventCanvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

      const xPercent = ((clientX - rect.left) / rect.width) * 100;
      const yPercent = ((clientY - rect.top) / rect.height) * 100;
      setCursorPos({ x: xPercent, y: yPercent });
      setIsHovering(true);
    }
  };

  const currentDiameter = activeTool === 'stempel' ? brushSize * 3 : brushSize;
  const cursorSizePercent = (currentDiameter / 580) * 100;
  const showCursor = isHovering && activeTool !== 'emmer';
  return (
    <div className={styles.canvasContainer}>
      {!isLoaded && (
        <div className={styles.loadingOverlay}>
          <Palette size={48} className={styles.loadingIcon} />
          <p className={styles.loadingText}>Verf mengen...</p>
        </div>
      )}

      <div className={`${styles.canvasWrapper} ${isLoaded ? styles.loaded : ''}`}>
        <canvas ref={bgCanvasRef} className={styles.layerBg} />
        <canvas ref={fgCanvasRef} className={styles.layerFg} />
        <canvas
          ref={eventCanvasRef}
          className={`${styles.layerEvent} ${showCursor ? styles.hideNativeCursor : ''}`}
          onMouseDown={onStart}
          onMouseMove={handlePointerMove}
          onMouseUp={onEnd}
          onMouseLeave={() => { setIsHovering(false); onEnd(); }}
          onTouchStart={onStart}
          onTouchMove={handlePointerMove}
          onTouchEnd={onEnd}
          onMouseEnter={() => setIsHovering(true)}
        />

        {showCursor && (
          <div
            className={styles.customCursor}
            style={{
              left: `${cursorPos.x}%`,
              top: `${cursorPos.y}%`,
              width: `${cursorSizePercent}%`,
              height: `${cursorSizePercent}%`,
              borderColor: activeTool === 'gum' ? '#9CA3AF' : color,
              backgroundColor: activeTool === 'gum' ? 'rgba(255,255,255,0.8)' : 'transparent'
            }}
          />
        )}
      </div>
    </div>
  );
}
