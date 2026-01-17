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
          <p className="text-primary font-mono text-sm tracking-wider animate-fade-in flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Available for opportunities
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            I build{' '}
            <span className="text-gradient">immersive</span>
            <br />
            web experiences
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-xl text-primary/90 font-medium">
          Full Stack Developer crafting interactive, production-ready experiences using code, not templates.
        </p>

        {/* Description */}
        <p className="text-lg text-foreground/70 leading-relaxed">
          I transform complex problems into elegant, scalable solutions that users love and businesses rely on.
        </p>

        {/* Tech Stack Preview */}
        <div className="flex flex-wrap gap-2">
          {['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'].map((tech, i) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm font-mono bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition-colors cursor-default"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-8 pt-2">
          <div>
            <p className="text-2xl font-bold text-gradient">4+</p>
            <p className="text-xs text-muted-foreground">Years Experience</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gradient">20+</p>
            <p className="text-xs text-muted-foreground">Projects Delivered</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gradient">1M+</p>
            <p className="text-xs text-muted-foreground">Users Served</p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4 pt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-[2px] bg-primary animate-pulse" />
            <span className="text-sm font-mono">Scroll to explore my workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingSection;
