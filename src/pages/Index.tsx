import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LoadingScreen from '@/components/LoadingScreen';
import LandingSection from '@/components/LandingSection';

// Lazy load the 3D scene for better initial load
const Scene = lazy(() => import('@/components/3d/Scene'));

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showDesktop, setShowDesktop] = useState(false);
  const [showLandingText, setShowLandingText] = useState(true);
  const [cameraState, setCameraState] = useState<{
    position: [number, number, number];
    lookAt: [number, number, number];
  }>({
    position: [3, 2.5, 4],
    lookAt: [0, 1, 0],
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [screenOn, setScreenOn] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const progress = Math.min(scrollY / windowHeight, 1);
        scrollProgress.current = progress;

        // Phase 1: Hide text (0-30%)
        if (progress < 0.3) {
          setShowLandingText(true);
          setScreenOn(false);
          setShowDesktop(false);
        } else {
          setShowLandingText(false);
        }

        // Phase 2: Zoom to monitor (30-70%)
        if (progress >= 0.3 && progress < 0.7) {
          const zoomProgress = (progress - 0.3) / 0.4;
          // Camera moves closer but stops at a minimum distance to keep scene visible
          const newPos: [number, number, number] = [
            3 - zoomProgress * 2.5,
            2.5 - zoomProgress * 1.2,
            4 - zoomProgress * 2.5, // Will be clamped by minZ in Scene
          ];
          const newLookAt: [number, number, number] = [
            0,
            1 + zoomProgress * 0.1,
            0 - zoomProgress * 0.2,
          ];
          setCameraState({ position: newPos, lookAt: newLookAt });
          setIsAnimating(true);
        }

        // Phase 3: Turn screen on (70%+)
        if (progress >= 0.7) {
          setScreenOn(true);
        }

        // Phase 4: Show desktop UI inside monitor (85%+)
        if (progress >= 0.85) {
          setShowDesktop(true);
        } else {
          setShowDesktop(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isLoading]);

  const handleExitDesktop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setCameraState({
        position: [3, 2.5, 4],
        lookAt: [0, 1, 0],
      });
      setScreenOn(false);
      setShowDesktop(false);
      setShowLandingText(true);
    }, 500);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Scroll container - creates scroll space */}
      <div className="h-[300vh]" />

      {/* Fixed viewport for 3D scene */}
      <div className="fixed inset-0">
        {/* 3D Scene with embedded Desktop */}
        <Suspense
          fallback={
            <div className="w-full h-full bg-background flex items-center justify-center">
              <div className="text-primary animate-pulse font-mono">
                Loading 3D Scene...
              </div>
            </div>
          }
        >
          <Scene
            cameraPosition={cameraState.position}
            cameraLookAt={cameraState.lookAt}
            isAnimating={isAnimating}
            screenOn={screenOn}
            enableMouseParallax={!showDesktop}
            showDesktop={showDesktop}
            onExitDesktop={handleExitDesktop}
          />
        </Suspense>

        {/* Landing text overlay */}
        <LandingSection isVisible={showLandingText} />

        {/* Scroll indicator */}
        {showLandingText && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
            </div>
            <span className="text-xs text-muted-foreground font-mono">Scroll</span>
          </div>
        )}

        {/* Progress indicator */}
        <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground">
          {screenOn && !showDesktop && (
            <span className="text-primary">Keep scrolling to enter workspace...</span>
          )}
        </div>

        {/* Exit hint when desktop is active */}
        {showDesktop && (
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={handleExitDesktop}
              className="px-3 py-1.5 text-xs font-mono bg-background/80 backdrop-blur-sm border border-primary/30 rounded text-primary hover:bg-primary/10 transition-colors"
            >
              ← Scroll up to exit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
