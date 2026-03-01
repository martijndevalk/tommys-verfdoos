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
};

export function CanvasArea({ bgCanvasRef, fgCanvasRef, eventCanvasRef, isLoaded, onStart, onMove, onEnd }: Props) {
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
          className={styles.layerEvent}
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
        />
      </div>
    </div>
  );
}
