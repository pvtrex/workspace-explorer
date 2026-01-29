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
  const [isReady, setIsReady] = useState(false);
  const hasBooted = useRef(false);

  useEffect(() => {
    if (isActive && !hasBooted.current) {
      console.log('[MonitorScreen] Activating - starting boot timer');
      hasBooted.current = true;
      
      // Short delay to show boot screen
      const timer = setTimeout(() => {
        console.log('[MonitorScreen] Boot complete - showing Desktop');
        setIsReady(true);
      }, 400);
      
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  // Reset on deactivation
  useEffect(() => {
    if (!isActive) {
      hasBooted.current = false;
      setIsReady(false);
    }
  }, [isActive]);

  console.log('[MonitorScreen] Render:', { isActive, isReady });

  if (!isActive) {
    return null;
  }

  return (
    <group ref={htmlRef} position={[0, 1.15, -0.22]}>
      <Html
        transform
        distanceFactor={0.65}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={0.06}
        prepend
        center
        style={{
          width: '1024px',
          height: '576px',
          borderRadius: '6px',
          overflow: 'hidden',
          pointerEvents: 'auto',
          userSelect: 'none',
          background: '#0a0a12',
        }}
      >
        <div 
          style={{ 
            width: '1024px', 
            height: '576px',
            background: '#0a0a12',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {!isReady ? (
            // Boot screen
            <div 
              style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: '#0a0a12',
              }}
            >
              <div 
                style={{ 
                  color: '#00d4ff', 
                  fontFamily: 'monospace', 
                  fontSize: '28px', 
                  marginBottom: '24px',
                  letterSpacing: '2px',
                }}
                className="animate-pulse"
              >
                Portfolio OS
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%',
                      background: '#00d4ff',
                      animation: `bounce 0.6s infinite ${i * 100}ms`,
                    }}
                  />
                ))}
              </div>
              <div style={{ color: '#6b7280', fontFamily: 'monospace', fontSize: '14px' }}>
                Initializing workspace...
              </div>
            </div>
          ) : (
            <Desktop onExit={onExit} isEmbedded />
          )}
        </div>
      </Html>
    </group>
  );
};

export default MonitorScreen;
