import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface InteractiveMouseProps {
  mousePosition: { x: number; y: number };
  isInteractive: boolean;
}

const InteractiveMouse = ({ mousePosition, isInteractive }: InteractiveMouseProps) => {
  const mouseRef = useRef<THREE.Group>(null);
  const leftButtonRef = useRef<THREE.Mesh>(null);
  const rightButtonRef = useRef<THREE.Mesh>(null);
  const scrollWheelRef = useRef<THREE.Mesh>(null);
  
  const targetPosition = useRef({ x: 0, z: 0 });
  const currentPosition = useRef({ x: 0.32, z: 0.18 });
  const [isLeftPressed, setIsLeftPressed] = useState(false);
  const [isRightPressed, setIsRightPressed] = useState(false);

  // Handle mouse button clicks
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!isInteractive) return;
    
    if (e.button === 0) {
      setIsLeftPressed(true);
      if (leftButtonRef.current) {
        gsap.to(leftButtonRef.current.position, {
          y: 0.008,
          duration: 0.05,
          ease: 'power2.out',
        });
      }
    } else if (e.button === 2) {
      setIsRightPressed(true);
      if (rightButtonRef.current) {
        gsap.to(rightButtonRef.current.position, {
          y: 0.008,
          duration: 0.05,
          ease: 'power2.out',
        });
      }
    }
  }, [isInteractive]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isInteractive) return;
    
    if (e.button === 0) {
      setIsLeftPressed(false);
      if (leftButtonRef.current) {
        gsap.to(leftButtonRef.current.position, {
          y: 0.012,
          duration: 0.1,
          ease: 'elastic.out(1, 0.5)',
        });
      }
    } else if (e.button === 2) {
      setIsRightPressed(false);
      if (rightButtonRef.current) {
        gsap.to(rightButtonRef.current.position, {
          y: 0.012,
          duration: 0.1,
          ease: 'elastic.out(1, 0.5)',
        });
      }
    }
  }, [isInteractive]);

  // Handle scroll wheel
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isInteractive || !scrollWheelRef.current) return;
    
    const direction = e.deltaY > 0 ? 1 : -1;
    scrollWheelRef.current.rotation.x += direction * 0.5;
  }, [isInteractive]);

  useEffect(() => {
    if (isInteractive) {
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('wheel', handleWheel, { passive: true });
    }
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isInteractive, handleMouseDown, handleMouseUp, handleWheel]);

  useFrame((state, delta) => {
    if (mouseRef.current && isInteractive) {
      // Map mouse position to desk movement range
      // Larger range for more noticeable movement
      targetPosition.current.x = mousePosition.x * 0.04;
      targetPosition.current.z = mousePosition.y * 0.025;

      // Smooth lerp to target with easing
      const lerpFactor = 1 - Math.pow(0.001, delta);
      currentPosition.current.x = THREE.MathUtils.lerp(
        currentPosition.current.x,
        0.32 + targetPosition.current.x,
        lerpFactor * 0.15
      );
      currentPosition.current.z = THREE.MathUtils.lerp(
        currentPosition.current.z,
        0.18 + targetPosition.current.z,
        lerpFactor * 0.15
      );

      mouseRef.current.position.x = currentPosition.current.x;
      mouseRef.current.position.z = currentPosition.current.z;
      
      // Subtle tilt based on movement direction
      const tiltX = (targetPosition.current.z - (mouseRef.current.position.z - 0.18)) * 0.3;
      const tiltZ = -(targetPosition.current.x - (mouseRef.current.position.x - 0.32)) * 0.3;
      
      mouseRef.current.rotation.x = THREE.MathUtils.lerp(mouseRef.current.rotation.x, tiltX, 0.1);
      mouseRef.current.rotation.z = THREE.MathUtils.lerp(mouseRef.current.rotation.z, tiltZ, 0.1);
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
      <mesh 
        ref={leftButtonRef} 
        position={[-0.008, 0.012, -0.008]} 
        castShadow
      >
        <boxGeometry args={[0.012, 0.004, 0.018]} />
        <meshStandardMaterial 
          color={isLeftPressed ? '#00d4ff' : '#222230'} 
          metalness={0.2} 
          roughness={0.75}
          emissive={isLeftPressed ? '#00d4ff' : '#000000'}
          emissiveIntensity={isLeftPressed ? 0.3 : 0}
        />
      </mesh>
      {/* Mouse button detail - right */}
      <mesh 
        ref={rightButtonRef} 
        position={[0.008, 0.012, -0.008]} 
        castShadow
      >
        <boxGeometry args={[0.012, 0.004, 0.018]} />
        <meshStandardMaterial 
          color={isRightPressed ? '#00d4ff' : '#222230'} 
          metalness={0.2} 
          roughness={0.75}
          emissive={isRightPressed ? '#00d4ff' : '#000000'}
          emissiveIntensity={isRightPressed ? 0.3 : 0}
        />
      </mesh>
      {/* Scroll wheel */}
      <mesh ref={scrollWheelRef} position={[0, 0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.008, 8]} />
        <meshStandardMaterial color="#0f0f15" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* RGB strip accent */}
      <mesh position={[0, -0.01, 0.015]}>
        <boxGeometry args={[0.018, 0.003, 0.003]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#00d4ff" 
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Side grip textures */}
      <mesh position={[-0.024, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.015, 0.002, 0.025]} />
        <meshStandardMaterial color="#151520" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0.024, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.015, 0.002, 0.025]} />
        <meshStandardMaterial color="#151520" metalness={0.1} roughness={0.9} />
      </mesh>
    </group>
  );
};

export default InteractiveMouse;
