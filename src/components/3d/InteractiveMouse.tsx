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
      targetPosition.current.x = mousePosition.x * 0.025;
      targetPosition.current.z = mousePosition.y * 0.015;

      // Smooth lerp to target
      mouseRef.current.position.x = THREE.MathUtils.lerp(
        mouseRef.current.position.x,
        0.32 + targetPosition.current.x,
        0.1
      );
      mouseRef.current.position.z = THREE.MathUtils.lerp(
        mouseRef.current.position.z,
        0.18 + targetPosition.current.z,
        0.1
      );
    }
  });

  return (
    <group ref={mouseRef} position={[0.32, 0.63, 0.18]}>
      {/* Mouse body - ergonomic shape */}
      <mesh castShadow>
        <capsuleGeometry args={[0.022, 0.042, 8, 16]} />
        <meshStandardMaterial 
          color="#1a1a22" 
          metalness={0.25} 
          roughness={0.7}
        />
      </mesh>
      {/* Mouse button detail - left */}
      <mesh position={[-0.008, 0.012, -0.008]} castShadow>
        <boxGeometry args={[0.012, 0.004, 0.018]} />
        <meshStandardMaterial color="#222230" metalness={0.2} roughness={0.75} />
      </mesh>
      {/* Mouse button detail - right */}
      <mesh position={[0.008, 0.012, -0.008]} castShadow>
        <boxGeometry args={[0.012, 0.004, 0.018]} />
        <meshStandardMaterial color="#222230" metalness={0.2} roughness={0.75} />
      </mesh>
      {/* Scroll wheel */}
      <mesh position={[0, 0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.008, 8]} />
        <meshStandardMaterial color="#0f0f15" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* RGB strip accent */}
      <mesh position={[0, -0.01, 0.015]}>
        <boxGeometry args={[0.018, 0.003, 0.003]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#00d4ff" 
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
};

export default InteractiveMouse;
