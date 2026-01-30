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
    <group ref={htmlRef} position={[0, 1.18, -0.18]}>
      {/* Screen plane for visual reference - slightly behind the UI */}
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[0.52, 0.30]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      <Html
        transform
        distanceFactor={0.28}
        position={[0, 0, 0.001]}
        rotation={[0, 0, 0]}
        zIndexRange={[100, 0]}
        style={{
          width: '1024px',
          height: '576px',
          borderRadius: '4px',
          overflow: 'hidden',
          pointerEvents: 'auto',
          userSelect: 'none',
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
                background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 100%)',
              }}
            >
              <div 
                style={{ 
                  color: '#00d4ff', 
                  fontFamily: 'monospace', 
                  fontSize: '32px', 
                  marginBottom: '24px',
                  letterSpacing: '3px',
                  textShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
                }}
              >
                Portfolio OS
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{ 
                      width: '14px', 
                      height: '14px', 
                      borderRadius: '50%',
                      background: '#00d4ff',
                      opacity: 0.8,
                      animation: `pulse 1s infinite ${i * 150}ms`,
                    }}
                  />
                ))}
              </div>
              <div style={{ color: '#8b8b9e', fontFamily: 'monospace', fontSize: '16px' }}>
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
