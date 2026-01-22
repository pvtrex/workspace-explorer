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
    <group position={[0.05, 0.63, 0.12]}>
      {/* Keyboard base - matte plastic with slight texture */}
      <mesh castShadow>
        <boxGeometry args={[0.38, 0.018, 0.13]} />
        <meshStandardMaterial 
          color="#18181f" 
          metalness={0.15} 
          roughness={0.75}
        />
      </mesh>
      {/* Palm rest area */}
      <mesh position={[0, 0.001, 0.055]} castShadow>
        <boxGeometry args={[0.36, 0.016, 0.025]} />
        <meshStandardMaterial 
          color="#1f1f28" 
          metalness={0.1} 
          roughness={0.85}
        />
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
              position={[-0.15 + col * 0.034, 0.015, -0.04 + row * 0.028]}
              castShadow
            >
              <boxGeometry args={[0.026, 0.007, 0.022]} />
              <meshStandardMaterial 
                color={pressedKeys[key] ? '#00d4ff' : '#252530'} 
                metalness={0.2} 
                roughness={0.65}
                emissive={pressedKeys[key] ? '#00d4ff' : '#000000'}
                emissiveIntensity={pressedKeys[key] ? 0.4 : 0}
              />
            </mesh>
          );
        })
      )}
      {/* LED indicator lights */}
      <mesh position={[0.16, 0.015, -0.05]}>
        <boxGeometry args={[0.004, 0.003, 0.004]} />
        <meshStandardMaterial 
          color="#00ff88" 
          emissive="#00ff88" 
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};

export default InteractiveKeyboard;
