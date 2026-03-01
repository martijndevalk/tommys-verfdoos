import { motion } from 'framer-motion';
import { Palette, ChevronDown, ChevronUp, Sparkles, Trash2, Download, Sun, Moon, User, Image as ImageIcon } from 'lucide-react';
import { Brush, PenTool, SprayCan, Blend, PaintBucket, Stamp, Droplet, Eraser } from 'lucide-react';
import { COLORS } from './constants';
import { ToolButton } from './ToolButton';
import styles from './Toolbar.module.css';

type Props = {
  isToolsOpen: boolean;
  setIsToolsOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  activeLayer: 'fg' | 'bg';
  setActiveLayer: (layer: 'fg' | 'bg') => void;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  color: string;
  setColor: (c: string) => void;
  brushSize: number;
  setBrushSize: (s: number) => void;
  opacity: number;
  setOpacity: (o: number) => void;
  onRandomize: () => void;
  onClear: () => void;
  onExport: () => void;
};

export function Toolbar({
  isToolsOpen, setIsToolsOpen,
  isDarkMode, setIsDarkMode,
  activeLayer, setActiveLayer,
  activeTool, setActiveTool,
  color, setColor,
  brushSize, setBrushSize,
  opacity, setOpacity,
  onRandomize, onClear, onExport
}: Props) {

  const handleColorChange = (c: string) => {
    setColor(c);
    if (activeTool === 'gum' || activeTool === 'mengen') setActiveTool('kwast');
  };

  return (
    <div className={`${styles.sidebar} ${isToolsOpen ? styles.open : styles.closed}`}>
      <div
        className={styles.mobileHandle}
        onClick={() => setIsToolsOpen(!isToolsOpen)}
      >
        <div className={styles.handleTitle}>
          <Palette size={20} className={styles.handleIcon} />
          <span>Verfdoos Openen</span>
        </div>
        <div className={styles.handleChevron}>
          {isToolsOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </div>
      </div>

      <div className={styles.sidebarContent}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Tommy's Verfdoos <Sparkles size={20} className={styles.sparkles} />
            </h1>
            <p className={styles.subtitle}>Klieder, meng en maak er een meesterwerk van!</p>
          </div>
          <button
            className={styles.themeToggle}
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Wissel Thema"
          >
            {isDarkMode ? <Sun size={22} strokeWidth={2.5} /> : <Moon size={22} strokeWidth={2.5} />}
          </button>
        </div>

        <div className={styles.layerTabs}>
          <button
            onClick={() => setActiveLayer('fg')}
            className={`${styles.layerTab} ${activeLayer === 'fg' ? styles.layerTabActive : ''}`}
          >
            <User size={18} strokeWidth={2.5} className={styles.tabIcon} /> Binnenin Tommy
          </button>
          <button
            onClick={() => setActiveLayer('bg')}
            className={`${styles.layerTab} ${activeLayer === 'bg' ? styles.layerTabActive : ''}`}
          >
            <ImageIcon size={18} strokeWidth={2.5} className={styles.tabIcon} /> Achtergrond
          </button>
        </div>

        <div className={styles.toolsSection}>
          <div className={styles.toolsGrid}>
            <ToolButton id="kwast" icon={Brush} label="Kwast" isActive={activeTool === 'kwast'} onClick={() => setActiveTool('kwast')} />
            <ToolButton id="stempel" icon={Stamp} label="Stempel" isActive={activeTool === 'stempel'} onClick={() => setActiveTool('stempel')} />
            <ToolButton id="waterverf" icon={Droplet} label="Aquarel" isActive={activeTool === 'waterverf'} onClick={() => setActiveTool('waterverf')} />
            <ToolButton id="stift" icon={PenTool} label="Stift" isActive={activeTool === 'stift'} onClick={() => setActiveTool('stift')} />
            <ToolButton id="spray" icon={SprayCan} label="Spray" isActive={activeTool === 'spray'} onClick={() => setActiveTool('spray')} />
            <ToolButton id="mengen" icon={Blend} label="Mengen" isActive={activeTool === 'mengen'} onClick={() => setActiveTool('mengen')} />
            <ToolButton id="emmer" icon={PaintBucket} label="Emmer" isActive={activeTool === 'emmer'} onClick={() => setActiveTool('emmer')} />
            <ToolButton id="gum" icon={Eraser} label="Gum" isActive={activeTool === 'gum'} onClick={() => setActiveTool('gum')} />
          </div>

          <div className={styles.sliders}>
            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Grootte / Dikte</span>
                <span className={styles.sliderValue}>{brushSize}px</span>
              </div>
              <input type="range" className={styles.rangeInput} min="5" max="80" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} />
            </div>
            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Verfdekking</span>
                <span className={styles.sliderValue}>{opacity}%</span>
              </div>
              <input type="range" className={styles.rangeInput} min="1" max="100" value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} />
            </div>
          </div>
        </div>

        <div className={styles.paletteSection}>
          <h3 className={styles.paletteTitle}>
            <Palette size={16} className={styles.paletteTitleIcon} /> Jouw Verfpalet
          </h3>
          <div className={styles.paletteGrid}>
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => handleColorChange(c)}
                className={`${styles.colorChip} ${(color === c && activeTool !== 'gum' && activeTool !== 'mengen') ? styles.colorChipActive : ''}`}
                style={{
                  backgroundColor: c,
                  borderColor: c === color ? c : 'transparent'
                }}
                title={c}
              >
                 <div className={styles.colorGlare}></div>
              </button>
            ))}

            <div className={`${styles.colorChip} ${styles.colorWheelPicker}`}>
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className={styles.colorInputHidden}
                title="Meng je eigen kleur"
              />
              <div className={styles.colorWheelInner} style={{backgroundColor: color}}></div>
            </div>
          </div>
        </div>

        <div className={styles.actionsBox}>
          <button onClick={onRandomize} className={styles.magicButton}>
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
              <Sparkles size={20} strokeWidth={2.5} className={styles.magicIcon} />
            </motion.div>
            Verras Me met Magie!
          </button>

          <div className={styles.actionsGrid}>
            <button onClick={onClear} className={styles.clearButton}>
              <Trash2 size={18} className={styles.actionIcon} /> Schoonvegen
            </button>
            <button onClick={onExport} className={styles.saveButton}>
              <Download size={18} className={styles.actionIcon} /> Opslaan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
