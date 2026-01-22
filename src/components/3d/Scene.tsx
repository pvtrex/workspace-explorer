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
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-2, 3, 2]} intensity={0.3} color="#00d4ff" />
      <pointLight position={[2, 2, -1]} intensity={0.2} color="#a855f7" />
      <spotLight
        position={[0, 4, 0]}
        angle={0.5}
        penumbra={1}
        intensity={0.4}
        castShadow
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
        <fog attach="fog" args={['#0a0a12', 5, 20]} />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
