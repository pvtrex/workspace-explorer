import { Html } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import Desktop from '../os/Desktop';

interface MonitorScreenProps {
  isActive: boolean;
  onExit: () => void;
}

const MonitorScreen = ({ isActive, onExit }: MonitorScreenProps) => {
  const htmlRef = useRef<THREE.Group>(null);
  const [isBooting, setIsBooting] = useState(false);
  const [showOS, setShowOS] = useState(false);

  // Boot sequence when monitor becomes active
  useEffect(() => {
    if (isActive && !showOS) {
      setIsBooting(true);
      // Show boot screen for 800ms then reveal OS
      const bootTimer = setTimeout(() => {
        setIsBooting(false);
        setShowOS(true);
      }, 800);
      return () => clearTimeout(bootTimer);
    } else if (!isActive) {
      setShowOS(false);
      setIsBooting(false);
    }
  }, [isActive]);

  if (!isActive) {
    return null;
  }

  return (
    <group ref={htmlRef} position={[0, 1.15, -0.275]}>
      <Html
        transform
        distanceFactor={0.75}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={0.065}
        occlude="blending"
        style={{
          width: '1024px',
          height: '576px',
          background: 'transparent',
          borderRadius: '4px',
          overflow: 'hidden',
          pointerEvents: 'auto',
        }}
      >
        <div 
          className="w-full h-full" 
          style={{ 
            width: '1024px', 
            height: '576px',
            transform: 'scale(1)',
            transformOrigin: 'center center',
          }}
        >
          {isBooting ? (
            // Boot sequence screen
            <div className="w-full h-full bg-background flex flex-col items-center justify-center">
              <div className="text-primary font-mono text-xl mb-4 animate-pulse">
                Portfolio OS
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <div className="text-muted-foreground font-mono text-xs mt-4">
                Loading workspace...
              </div>
            </div>
          ) : showOS ? (
            <Desktop onExit={onExit} isEmbedded />
          ) : null}
        </div>
      </Html>
    </group>
  );
};

export default MonitorScreen;
