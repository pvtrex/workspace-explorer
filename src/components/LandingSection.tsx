import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LandingSectionProps {
  isVisible: boolean;
}

const LandingSection = ({ isVisible }: LandingSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      if (isVisible) {
        gsap.to(containerRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
      } else {
        gsap.to(containerRef.current, {
          opacity: 0,
          x: -50,
          duration: 0.6,
          ease: 'power2.in',
        });
      }
    }
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className="absolute left-0 top-0 h-full w-full md:w-1/2 flex items-center justify-center p-8 z-10"
    >
      <div className="max-w-lg space-y-6">
        {/* Greeting */}
        <div className="space-y-2">
          <p className="text-primary font-mono text-sm tracking-wider animate-fade-in">
            {'>'} Hello World_
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            I'm a{' '}
            <span className="text-gradient">Full Stack</span>
            <br />
            Developer
          </h1>
        </div>

        {/* Description */}
        <p className="text-lg text-foreground/80 leading-relaxed">
          Passionate about crafting modern web applications that deliver 
          exceptional user experiences. I transform complex problems into 
          elegant, scalable solutions.
        </p>

        {/* Tech Stack Preview */}
        <div className="flex flex-wrap gap-2">
          {['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm font-mono bg-primary/10 text-primary rounded-full border border-primary/20"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4 pt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-[2px] bg-primary animate-pulse" />
            <span className="text-sm font-mono">Scroll to explore</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingSection;
