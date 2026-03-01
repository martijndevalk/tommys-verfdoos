import { useState, useEffect } from 'react';
import { useVerfdoosCanvas } from './hooks/useVerfdoosCanvas';
import { useVerfdoosDrawing } from './hooks/useVerfdoosDrawing';
import { exportVerfdoosImage } from './utils';
import { CanvasArea } from './CanvasArea';
import { Toolbar } from './Toolbar';
import { COLORS } from './constants';
import styles from './Verfdoos.module.css';

export function Verfdoos() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(true);
  const [activeLayer, setActiveLayer] = useState<'fg' | 'bg'>('fg');
  const [activeTool, setActiveTool] = useState('kwast');
  const [color, setColor] = useState(COLORS[2]);
  const [brushSize, setBrushSize] = useState(25);
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsToolsOpen(false);
    }
  }, []);

  const {
    bgCanvasRef,
    fgCanvasRef,
    eventCanvasRef,
    isLoaded,
    clearCanvas,
    randomizeCanvas,
    baseBgColor
  } = useVerfdoosCanvas();

  const {
    handleStart,
    handleMove,
    handleEnd
  } = useVerfdoosDrawing({
    bgCanvasRef,
    fgCanvasRef,
    eventCanvasRef,
    activeLayer,
    activeTool,
    color,
    brushSize,
    opacity,
    baseBgColor
  });

  const handleExport = () => {
    exportVerfdoosImage(bgCanvasRef, fgCanvasRef, isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className={styles.appContainer}>
        <div className={styles.contentWrapper}>
          <CanvasArea
            bgCanvasRef={bgCanvasRef}
            fgCanvasRef={fgCanvasRef}
            eventCanvasRef={eventCanvasRef}
            isLoaded={isLoaded}
            onStart={handleStart}
            onMove={handleMove}
            onEnd={handleEnd}
          />
          <Toolbar
            isToolsOpen={isToolsOpen}
            setIsToolsOpen={setIsToolsOpen}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            color={color}
            setColor={setColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            opacity={opacity}
            setOpacity={setOpacity}
            onRandomize={randomizeCanvas}
            onClear={clearCanvas}
            onExport={handleExport}
          />
        </div>
      </div>
    </div>
  );
}
