import { ReactNode } from 'react';
import { X, Minus, Square } from 'lucide-react';

interface WindowProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  isOpen: boolean;
}

const Window = ({ title, children, onClose, isOpen }: WindowProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-4 md:inset-8 lg:inset-16 window-glass animate-window-open z-10">
      {/* Title bar */}
      <div className="window-titlebar">
        <span className="text-sm font-medium text-foreground/90">{title}</span>
        <div className="flex items-center gap-2">
          <button className="window-control window-control-minimize hover:opacity-80">
            <Minus size={8} className="text-black/60 mx-auto" />
          </button>
          <button className="window-control window-control-maximize hover:opacity-80">
            <Square size={6} className="text-black/60 mx-auto" />
          </button>
          <button
            onClick={onClose}
            className="window-control window-control-close hover:opacity-80"
          >
            <X size={8} className="text-black/60 mx-auto" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="window-content p-6 overflow-y-auto h-[calc(100%-40px)]">
        {children}
      </div>
    </div>
  );
};

export default Window;
