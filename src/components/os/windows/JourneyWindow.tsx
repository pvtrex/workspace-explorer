const JourneyWindow = () => {
  const milestones = [
    {
      phase: 'The Spark',
      year: '2018',
      emoji: '✨',
      content: "It started with breaking things. I was trying to customize my blog and accidentally deleted the entire CSS file. Instead of panicking, I was fascinated. How did those random-looking characters create something visual? That night, I wrote my first line of code: a simple color change. I refreshed the page probably 50 times just to watch it happen.",
    },
    {
      phase: 'The Struggle',
      year: '2019',
      emoji: '🧗',
      content: "JavaScript broke me. Callbacks, closures, this keyword—nothing made sense. I'd spend hours debugging, only to find a missing semicolon. I almost quit twice. What kept me going? Building a small calculator that actually worked. Seeing users (okay, just my friends) use something I created was addictive.",
    },
    {
      phase: 'The Click',
      year: '2020',
      emoji: '💡',
      content: "React changed everything. Suddenly, the chaos had structure. Components, state, props—it was like someone gave me LEGO blocks instead of clay. Got my first internship. Real code reviews humbled me fast, but I learned more in 3 months than the previous year. Discovered that clean code matters as much as working code.",
    },
    {
      phase: 'The Deep End',
      year: '2021',
      emoji: '🏊',
      content: "Backend wasn't optional anymore. Node.js became my second language. Databases stopped being scary black boxes. I built my first full-stack app—a task manager that 200 people actually used. The bugs at 2 AM taught me more than any tutorial. Started contributing to open source. Imposter syndrome hit hard, but shipping code was the cure.",
    },
    {
      phase: 'The Growth',
      year: '2022-2023',
      emoji: '🌱',
      content: "Joined an incredible team building products at scale. Learned that architecture decisions at 10 users matter at 100,000 users. Mentored newcomers and realized teaching solidifies learning. Cloud technologies, system design, performance optimization—the toolkit expanded. Every production incident was a masterclass.",
    },
    {
      phase: 'Now',
      year: '2024',
      emoji: '🚀',
      content: "I don't just write code anymore—I craft experiences. This portfolio itself pushed my boundaries: 3D graphics, GSAP animations, creative UI patterns. I'm exploring AI integration, WebGL, and the edges of what's possible in a browser. The curious kid who broke his blog CSS is now building things that make people say 'how did they do that?'",
    },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-gradient">My Journey</h2>
        <p className="text-muted-foreground">Not a resume—a real story</p>
      </div>

      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className="glass p-6 rounded-lg relative overflow-hidden group hover:border-primary/30 transition-colors"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Year badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="text-xl">{milestone.emoji}</span>
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-mono rounded-full">
                {milestone.year}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-primary mb-3 pr-24">{milestone.phase}</h3>
            <p className="text-foreground/80 leading-relaxed">{milestone.content}</p>
            
            {/* Decorative gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* Personal touch */}
      <div className="glass p-8 rounded-lg text-center space-y-4">
        <p className="text-lg text-foreground/90">
          What I've learned: <span className="text-primary">The best developers aren't the ones who know everything—they're the ones who never stop being curious.</span>
        </p>
        <p className="text-sm text-muted-foreground italic">
          Still breaking things. Still learning. Still loving it.
        </p>
      </div>
    </div>
  );
};

export default JourneyWindow;
