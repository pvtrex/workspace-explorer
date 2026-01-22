import { Html } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import Desktop from '../os/Desktop';

interface MonitorScreenProps {
  isActive: boolean;
  onExit: () => void;
}

const MonitorScreen = ({ isActive, onExit }: MonitorScreenProps) => {
  const htmlRef = useRef<THREE.Group>(null);

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
          <Desktop onExit={onExit} isEmbedded />
        </div>
      </Html>
    </group>
  );
};

export default MonitorScreen;
