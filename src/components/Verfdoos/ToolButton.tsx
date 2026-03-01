import { motion } from 'framer-motion';
import { iconAnimations } from './constants';
import styles from './ToolButton.module.css';

type Props = {
  id: keyof typeof iconAnimations;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
};

export function ToolButton({ id, icon: Icon, label, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`${styles.toolButton} ${isActive ? styles.active : ''}`}
    >
      <motion.div
        whileHover={iconAnimations[id]}
        whileTap={iconAnimations[id]}
        className={styles.iconWrapper}
      >
        <Icon size={26} strokeWidth={2.5} />
      </motion.div>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
