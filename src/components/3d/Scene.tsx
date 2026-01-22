import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { WorkspaceScene } from './WorkspaceScene';
import MonitorScreen from './MonitorScreen';
import * as THREE from 'three';
import gsap from 'gsap';

interface CameraControllerProps {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
  isAnimating: boolean;
  mousePosition: { x: number; y: number };
  enableMouseParallax: boolean;
  minZ: number;
}

const CameraController = ({ 
  targetPosition, 
  targetLookAt, 
  isAnimating, 
  mousePosition,
  enableMouseParallax,
  minZ
}: CameraControllerProps) => {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 1, 0));
  const basePosition = useRef(new THREE.Vector3(...targetPosition));

  useEffect(() => {
    // Clamp the Z position to never go closer than minZ
    const clampedZ = Math.max(targetPosition[2], minZ);
    const clampedPosition: [number, number, number] = [
      targetPosition[0],
      targetPosition[1],
      clampedZ
    ];
    
    basePosition.current.set(...clampedPosition);
    if (isAnimating) {
      gsap.to(camera.position, {
        x: clampedPosition[0],
        y: clampedPosition[1],
        z: clampedPosition[2],
        duration: 2,
        ease: 'power2.inOut',
      });
      gsap.to(lookAtTarget.current, {
        x: targetLookAt[0],
        y: targetLookAt[1],
        z: targetLookAt[2],
        duration: 2,
        ease: 'power2.inOut',
      });
    }
  }, [targetPosition, targetLookAt, isAnimating, camera, minZ]);

  useFrame(() => {
    // Add subtle mouse parallax when enabled
    if (enableMouseParallax) {
      const parallaxX = mousePosition.x * 0.15;
      const parallaxY = mousePosition.y * 0.08;
      
      camera.position.x = basePosition.current.x + parallaxX;
      camera.position.y = basePosition.current.y + parallaxY;
    }
    camera.lookAt(lookAtTarget.current);
  });

  return null;
};

const Lights = () => {
  return (
    <>
      {/* Ambient - very low, just to avoid pitch black */}
      <ambientLight intensity={0.08} color="#1a1a2e" />
      
      {/* Key Light - Main directional, soft shadows */}
      <directionalLight
        position={[3, 6, 4]}
        intensity={0.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0001}
        color="#fff8f0"
      />
      
      {/* Fill Light - Softer, from the side */}
      <directionalLight
        position={[-3, 4, 2]}
        intensity={0.15}
        color="#e0e8ff"
      />
      
      {/* Rim Light - Back light for depth separation */}
      <directionalLight
        position={[0, 3, -4]}
        intensity={0.25}
        color="#8090ff"
      />
      
      {/* Accent lights - Subtle colored atmosphere */}
      <pointLight position={[-1.5, 2, 1]} intensity={0.15} color="#00d4ff" distance={4} decay={2} />
      <pointLight position={[1.5, 1.5, -0.5]} intensity={0.08} color="#a855f7" distance={3} decay={2} />
      
      {/* Monitor glow light - activated when screen is on */}
      <pointLight position={[0, 1.2, 0]} intensity={0.1} color="#00d4ff" distance={2} decay={2} />
      
      {/* Spot on desk area for focus */}
      <spotLight
        position={[0, 3.5, 1]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.35}
        castShadow
        shadow-bias={-0.0001}
        color="#fff5e6"
        target-position={[0, 0.8, 0]}
      />
    </>
  );
};

interface SceneProps {
  cameraPosition?: [number, number, number];
  cameraLookAt?: [number, number, number];
  isAnimating?: boolean;
  screenOn?: boolean;
  enableMouseParallax?: boolean;
  showDesktop?: boolean;
  onExitDesktop?: () => void;
}

const Scene = ({
  cameraPosition = [3, 2.5, 4],
  cameraLookAt = [0, 1, 0],
  isAnimating = false,
  screenOn = false,
  enableMouseParallax = true,
  showDesktop = false,
  onExitDesktop = () => {},
}: SceneProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Minimum Z distance - camera will never go closer than this
  const MIN_CAMERA_Z = 1.2;

  return (
    <Canvas
      shadows
      camera={{ position: cameraPosition, fov: 50 }}
      className="w-full h-full"
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <CameraController
          targetPosition={cameraPosition}
          targetLookAt={cameraLookAt}
          isAnimating={isAnimating}
          mousePosition={mousePosition}
          enableMouseParallax={enableMouseParallax && !isAnimating}
          minZ={MIN_CAMERA_Z}
        />
        <Lights />
        <WorkspaceScene 
          screenOn={screenOn} 
          mousePosition={mousePosition}
          isInteractive={showDesktop}
        />
        {/* Monitor screen with embedded Desktop UI */}
        <MonitorScreen 
          isActive={showDesktop} 
          onExit={onExitDesktop} 
        />
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
        />
        <Environment preset="night" />
        <fog attach="fog" args={['#05050a', 4, 15]} />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
