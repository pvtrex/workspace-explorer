import { useState, useEffect } from 'react';

interface Skill {
  name: string;
  level: number;
  experience: string;
  usedIn: string;
  status: 'current' | 'recent' | 'familiar';
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

const SkillBar = ({ skill, delay }: { skill: Skill; delay: number }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(skill.level), delay);
    return () => clearTimeout(timer);
  }, [skill.level, delay]);

  const statusColors = {
    current: 'bg-green-500',
    recent: 'bg-yellow-500',
    familiar: 'bg-blue-500',
  };

  const statusLabels = {
    current: 'Currently using',
    recent: 'Used recently',
    familiar: 'Familiar with',
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <span className="font-medium">{skill.name}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${statusColors[skill.status]}`} />
            <span className="text-xs text-muted-foreground">{statusLabels[skill.status]}</span>
          </div>
        </div>
        <span className="text-muted-foreground text-sm">{skill.level}%</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-bar-fill transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-0.5 bg-secondary/50 rounded text-muted-foreground">
          {skill.experience}
        </span>
        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
          {skill.usedIn}
        </span>
      </div>
    </div>
  );
};

const SkillsWindow = () => {
  const categories: SkillCategory[] = [
    {
      title: 'Frontend',
      skills: [
        { name: 'React / Next.js', level: 95, experience: '4+ years', usedIn: 'Used in 8 production apps', status: 'current' },
        { name: 'TypeScript', level: 90, experience: '3+ years', usedIn: 'Used in 6 production apps', status: 'current' },
        { name: 'Tailwind CSS', level: 92, experience: '3+ years', usedIn: 'Used in 10+ projects', status: 'current' },
        { name: 'Three.js / WebGL', level: 75, experience: '1+ year', usedIn: 'Used in 2 projects', status: 'recent' },
      ],
    },
    {
      title: 'Backend',
      skills: [
        { name: 'Node.js / Express', level: 88, experience: '4+ years', usedIn: 'Used in 6 production apps', status: 'current' },
        { name: 'Python / FastAPI', level: 82, experience: '2+ years', usedIn: 'Used in 3 projects', status: 'recent' },
        { name: 'GraphQL', level: 78, experience: '2+ years', usedIn: 'Used in 4 projects', status: 'familiar' },
        { name: 'REST APIs', level: 92, experience: '4+ years', usedIn: 'Used in all projects', status: 'current' },
      ],
    },
    {
      title: 'Database',
      skills: [
        { name: 'PostgreSQL', level: 85, experience: '3+ years', usedIn: 'Used in 5 production apps', status: 'current' },
        { name: 'MongoDB', level: 88, experience: '3+ years', usedIn: 'Used in 4 projects', status: 'recent' },
        { name: 'Redis', level: 75, experience: '2+ years', usedIn: 'Used in 3 projects', status: 'recent' },
        { name: 'Prisma / Drizzle', level: 80, experience: '2+ years', usedIn: 'Currently using', status: 'current' },
      ],
    },
    {
      title: 'DevOps & Tools',
      skills: [
        { name: 'Docker / Kubernetes', level: 78, experience: '2+ years', usedIn: 'Used in 4 projects', status: 'recent' },
        { name: 'AWS / Vercel', level: 85, experience: '3+ years', usedIn: 'Used in 8 deployments', status: 'current' },
        { name: 'Git / GitHub Actions', level: 90, experience: '4+ years', usedIn: 'Used in all projects', status: 'current' },
        { name: 'Linux / Bash', level: 82, experience: '4+ years', usedIn: 'Daily driver', status: 'current' },
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-gradient">Technical Skills</h2>
        <p className="text-muted-foreground">Real experience, not just checkboxes</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Currently using</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-muted-foreground">Used recently</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">Familiar with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {categories.map((category, catIndex) => (
          <div key={category.title} className="glass p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-primary">{category.title}</h3>
            <div className="space-y-6">
              {category.skills.map((skill, skillIndex) => (
                <SkillBar
                  key={skill.name}
                  skill={skill}
                  delay={(catIndex * 4 + skillIndex) * 100}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsWindow;
