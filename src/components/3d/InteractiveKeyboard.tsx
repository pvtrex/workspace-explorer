import { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface KeyState {
  [key: string]: boolean;
}

interface InteractiveKeyboardProps {
  isInteractive: boolean;
}

const InteractiveKeyboard = ({ isInteractive }: InteractiveKeyboardProps) => {
  const [pressedKeys, setPressedKeys] = useState<KeyState>({});
  const keysRef = useRef<Map<string, THREE.Mesh>>(new Map());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isInteractive) return;
    const key = `${Math.floor(Math.random() * 4)}-${Math.floor(Math.random() * 10)}`;
    setPressedKeys(prev => ({ ...prev, [key]: true }));
  }, [isInteractive]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (!isInteractive) return;
    // Release all keys after a short delay
    setTimeout(() => {
      setPressedKeys({});
    }, 100);
  }, [isInteractive]);

  useEffect(() => {
    if (isInteractive) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isInteractive, handleKeyDown, handleKeyUp]);

  useFrame(() => {
    keysRef.current.forEach((mesh, key) => {
      const isPressed = pressedKeys[key];
      const targetY = isPressed ? 0.01 : 0.015;
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY, 0.3);
    });
  });

  return (
    <group position={[0, 0.78, 0.2]}>
      {/* Keyboard base */}
      <mesh castShadow>
        <boxGeometry args={[0.45, 0.02, 0.15]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Keys */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => {
          const key = `${row}-${col}`;
          return (
            <mesh
              key={key}
              ref={(el) => {
                if (el) keysRef.current.set(key, el);
              }}
              position={[-0.18 + col * 0.04, 0.015, -0.05 + row * 0.035]}
              castShadow
            >
              <boxGeometry args={[0.03, 0.008, 0.025]} />
              <meshStandardMaterial 
                color={pressedKeys[key] ? '#00d4ff' : '#2a2a3e'} 
                metalness={0.3} 
                roughness={0.7}
                emissive={pressedKeys[key] ? '#00d4ff' : '#000000'}
                emissiveIntensity={pressedKeys[key] ? 0.3 : 0}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
};

export default InteractiveKeyboard;
