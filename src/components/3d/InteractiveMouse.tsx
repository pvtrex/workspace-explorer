import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractiveMouseProps {
  mousePosition: { x: number; y: number };
  isInteractive: boolean;
}

const InteractiveMouse = ({ mousePosition, isInteractive }: InteractiveMouseProps) => {
  const mouseRef = useRef<THREE.Group>(null);
  const targetPosition = useRef({ x: 0, z: 0 });

  useFrame(() => {
    if (mouseRef.current && isInteractive) {
      // Map mouse position to small desk movement range
      targetPosition.current.x = mousePosition.x * 0.03;
      targetPosition.current.z = mousePosition.y * 0.02;

      // Smooth lerp to target
      mouseRef.current.position.x = THREE.MathUtils.lerp(
        mouseRef.current.position.x,
        0.4 + targetPosition.current.x,
        0.1
      );
      mouseRef.current.position.z = THREE.MathUtils.lerp(
        mouseRef.current.position.z,
        0.25 + targetPosition.current.z,
        0.1
      );
    }
  });

  return (
    <group ref={mouseRef} position={[0.4, 0.78, 0.25]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.025, 0.05, 8, 16]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Mouse button detail */}
      <mesh position={[0, 0.015, -0.01]} castShadow>
        <boxGeometry args={[0.015, 0.005, 0.02]} />
        <meshStandardMaterial color="#252538" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Scroll wheel */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.01, 8]} />
        <meshStandardMaterial color="#0a0a0f" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
};

export default InteractiveMouse;
