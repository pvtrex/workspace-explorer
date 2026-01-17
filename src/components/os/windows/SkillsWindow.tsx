import { useState, useEffect } from 'react';

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

const SkillBar = ({ name, level, delay }: { name: string; level: number; delay: number }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(level), delay);
    return () => clearTimeout(timer);
  }, [level, delay]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground">{level}%</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-bar-fill transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

const SkillsWindow = () => {
  const categories: SkillCategory[] = [
    {
      title: 'Frontend',
      skills: [
        { name: 'React / Next.js', level: 95 },
        { name: 'TypeScript', level: 90 },
        { name: 'Tailwind CSS', level: 92 },
        { name: 'Three.js / WebGL', level: 75 },
      ],
    },
    {
      title: 'Backend',
      skills: [
        { name: 'Node.js / Express', level: 88 },
        { name: 'Python / FastAPI', level: 82 },
        { name: 'GraphQL', level: 78 },
        { name: 'REST APIs', level: 92 },
      ],
    },
    {
      title: 'Database',
      skills: [
        { name: 'PostgreSQL', level: 85 },
        { name: 'MongoDB', level: 88 },
        { name: 'Redis', level: 75 },
        { name: 'Prisma / Drizzle', level: 80 },
      ],
    },
    {
      title: 'DevOps & Tools',
      skills: [
        { name: 'Docker / Kubernetes', level: 78 },
        { name: 'AWS / Vercel', level: 85 },
        { name: 'Git / GitHub Actions', level: 90 },
        { name: 'Linux / Bash', level: 82 },
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-gradient">Skills</h2>
        <p className="text-muted-foreground">Technical expertise & proficiencies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {categories.map((category, catIndex) => (
          <div key={category.title} className="glass p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-primary">{category.title}</h3>
            <div className="space-y-4">
              {category.skills.map((skill, skillIndex) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
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
