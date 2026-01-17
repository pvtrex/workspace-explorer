const JourneyWindow = () => {
  const milestones = [
    {
      phase: 'The Beginning',
      year: '2018',
      content: 'My coding journey started with curiosity—a simple "Hello World" in Python. I was fascinated by how lines of text could create something functional. That spark ignited an obsession with technology.',
    },
    {
      phase: 'The Learning Curve',
      year: '2019',
      content: 'Dove deep into web development. HTML, CSS, JavaScript became my daily companions. Built my first website—a terrible portfolio that I was incredibly proud of. Failed often, learned more.',
    },
    {
      phase: 'Breaking Through',
      year: '2020',
      content: 'React changed everything. Suddenly, I could build complex UIs with elegance. Got my first internship, experienced real-world development, understood that code quality matters as much as functionality.',
    },
    {
      phase: 'Going Full Stack',
      year: '2021',
      content: 'Backend became my new frontier. Node.js, databases, APIs—the full picture emerged. Started contributing to open source. Built projects that actual users loved and used.',
    },
    {
      phase: 'Professional Growth',
      year: '2022-2023',
      content: 'Joined an amazing team, learned architecture at scale, mentored newcomers. Cloud technologies, DevOps, system design became part of my toolkit. Every challenge made me stronger.',
    },
    {
      phase: 'Current Chapter',
      year: '2024',
      content: 'Now exploring the edges—AI integration, 3D web, performance optimization. Building this portfolio itself pushed my boundaries. The journey continues, always learning, always growing.',
    },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-gradient">My Journey</h2>
        <p className="text-muted-foreground">The story behind the code</p>
      </div>

      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className="glass p-6 rounded-lg relative overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Year badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-primary/20 text-primary text-xs font-mono rounded-full">
              {milestone.year}
            </div>
            
            <h3 className="text-lg font-semibold text-primary mb-3">{milestone.phase}</h3>
            <p className="text-foreground/80 leading-relaxed">{milestone.content}</p>
            
            {/* Decorative gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-accent/30 to-transparent" />
          </div>
        ))}
      </div>

      {/* Quote */}
      <div className="glass p-8 rounded-lg text-center">
        <p className="text-lg italic text-foreground/90">
          "The only way to do great work is to love what you do."
        </p>
        <p className="text-sm text-muted-foreground mt-2">— Steve Jobs</p>
      </div>
    </div>
  );
};

export default JourneyWindow;
