import { Download, GraduationCap, Award, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResumeWindow = () => {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Resume</h2>
          <p className="text-muted-foreground">Full Stack Developer • 4+ Years Experience</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">
          <FileText size={16} />
          Download Technical Resume (PDF)
        </Button>
      </div>

      {/* Quick Summary */}
      <div className="glass p-6 rounded-lg">
        <h3 className="font-semibold mb-3 text-primary">Professional Summary</h3>
        <p className="text-foreground/80 leading-relaxed">
          Full Stack Developer with 4+ years of experience building scalable web applications. 
          Specialized in React ecosystem, Node.js backends, and cloud infrastructure. 
          Passionate about creating intuitive user experiences and writing maintainable code. 
          Track record of delivering production applications serving 1M+ users.
        </p>
      </div>

      {/* Education */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="text-primary" size={20} />
          <h3 className="text-lg font-semibold">Education</h3>
        </div>
        <div className="space-y-4">
          <div className="glass p-4 rounded-lg">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <h4 className="font-medium">Bachelor of Computer Science</h4>
                <p className="text-sm text-muted-foreground">University of Technology</p>
              </div>
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">2018 - 2022</span>
            </div>
            <p className="text-sm mt-2 text-foreground/80">
              Specialized in Software Engineering with focus on web technologies and distributed systems.
              <span className="text-primary font-medium"> GPA: 3.8/4.0</span>
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
            { name: 'AWS Solutions Architect Associate', issuer: 'Amazon Web Services', year: '2023', badge: '🏆' },
            { name: 'Meta Frontend Developer Professional', issuer: 'Meta', year: '2023', badge: '⚡' },
            { name: 'Google Cloud Professional Developer', issuer: 'Google', year: '2022', badge: '☁️' },
            { name: 'MongoDB Certified Developer', issuer: 'MongoDB University', year: '2022', badge: '🍃' },
          ].map((cert, i) => (
            <div key={i} className="glass p-4 rounded-lg hover:border-primary/50 transition-colors group">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{cert.badge}</span>
                <div>
                  <h4 className="font-medium text-sm group-hover:text-primary transition-colors">{cert.name}</h4>
                  <p className="text-xs text-muted-foreground">{cert.issuer} • {cert.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Achievements */}
      <section className="glass p-6 rounded-lg">
        <h3 className="font-semibold mb-4 text-primary">Key Achievements</h3>
        <ul className="space-y-3">
          {[
            'Led development of microservices architecture serving 1M+ monthly active users',
            'Reduced application load time by 60% through performance optimization',
            'Mentored 5 junior developers, with 3 receiving promotions within a year',
            'Contributed to 10+ open source projects with 500+ GitHub stars',
          ].map((achievement, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
              <span className="text-primary mt-0.5">✓</span>
              {achievement}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ResumeWindow;
