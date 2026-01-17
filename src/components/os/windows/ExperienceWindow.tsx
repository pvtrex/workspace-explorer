const ExperienceWindow = () => {
  const experiences = [
    {
      role: 'Senior Full Stack Developer',
      company: 'Tech Innovations Inc.',
      duration: '2023 - Present',
      responsibilities: [
        'Lead development of microservices architecture serving 1M+ users',
        'Mentored team of 5 junior developers',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Architected real-time collaboration features using WebSockets',
      ],
    },
    {
      role: 'Full Stack Developer',
      company: 'Digital Solutions Co.',
      duration: '2021 - 2023',
      responsibilities: [
        'Built responsive web applications using React and Node.js',
        'Designed and implemented RESTful APIs',
        'Optimized database queries improving performance by 40%',
        'Collaborated with UX team to implement pixel-perfect designs',
      ],
    },
    {
      role: 'Junior Developer',
      company: 'StartUp Labs',
      duration: '2020 - 2021',
      responsibilities: [
        'Developed features for e-commerce platform',
        'Wrote unit and integration tests',
        'Participated in code reviews and agile ceremonies',
        'Fixed bugs and improved code quality',
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-gradient">Experience</h2>
        <p className="text-muted-foreground">Professional journey & career highlights</p>
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        <div className="timeline-line" />
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="relative glass p-6 rounded-lg ml-4"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="timeline-dot" style={{ top: '24px' }} />
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-primary">{exp.role}</h3>
                <p className="text-sm text-foreground/90">{exp.company}</p>
                <p className="text-xs text-muted-foreground font-mono">{exp.duration}</p>
              </div>
              
              <ul className="space-y-2">
                {exp.responsibilities.map((resp, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceWindow;
