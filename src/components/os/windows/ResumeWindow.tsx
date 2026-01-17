import { Download, GraduationCap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResumeWindow = () => {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Resume</h2>
          <p className="text-muted-foreground">Full Stack Developer</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Download size={16} />
          Download CV
        </Button>
      </div>

      {/* Education */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="text-primary" size={20} />
          <h3 className="text-lg font-semibold">Education</h3>
        </div>
        <div className="space-y-4">
          <div className="glass p-4 rounded-lg">
            <h4 className="font-medium">Bachelor of Computer Science</h4>
            <p className="text-sm text-muted-foreground">University of Technology • 2018 - 2022</p>
            <p className="text-sm mt-2 text-foreground/80">
              Specialized in Software Engineering with focus on web technologies and distributed systems.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Award className="text-primary" size={20} />
          <h3 className="text-lg font-semibold">Certifications</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
            { name: 'Meta Frontend Developer', issuer: 'Meta', year: '2023' },
            { name: 'Google Cloud Professional', issuer: 'Google', year: '2022' },
            { name: 'MongoDB Developer', issuer: 'MongoDB University', year: '2022' },
          ].map((cert, i) => (
            <div key={i} className="glass p-4 rounded-lg hover:border-primary/50 transition-colors">
              <h4 className="font-medium text-sm">{cert.name}</h4>
              <p className="text-xs text-muted-foreground">{cert.issuer} • {cert.year}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResumeWindow;
