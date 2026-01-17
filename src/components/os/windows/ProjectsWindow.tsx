import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProjectsWindow = () => {
  const projects = [
    {
      title: 'CloudSync Pro',
      description: 'Real-time collaboration platform with live document editing, video conferencing, and team management.',
      tech: ['React', 'Node.js', 'WebSocket', 'PostgreSQL', 'Redis'],
      image: '🚀',
      github: '#',
      live: '#',
    },
    {
      title: 'AI Analytics Dashboard',
      description: 'Machine learning powered analytics platform for business intelligence and data visualization.',
      tech: ['Next.js', 'Python', 'TensorFlow', 'D3.js', 'AWS'],
      image: '📊',
      github: '#',
      live: '#',
    },
    {
      title: 'E-Commerce Platform',
      description: 'Full-featured online marketplace with payment processing, inventory management, and admin dashboard.',
      tech: ['React', 'Stripe', 'MongoDB', 'Express', 'Docker'],
      image: '🛒',
      github: '#',
      live: '#',
    },
    {
      title: 'DevOps Toolkit',
      description: 'Automated deployment and monitoring solution for containerized applications.',
      tech: ['Go', 'Kubernetes', 'Terraform', 'Prometheus', 'Grafana'],
      image: '⚙️',
      github: '#',
      live: '#',
    },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-gradient">Projects</h2>
        <p className="text-muted-foreground">Featured work & side projects</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="glass rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 group"
          >
            {/* Project Image/Icon */}
            <div className="h-32 bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-5xl">
              {project.image}
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-foreground/80">{project.description}</p>
              
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 text-xs font-mono bg-primary/10 text-primary rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
              
              {/* Links */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Github size={14} />
                  Code
                </Button>
                <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <ExternalLink size={14} />
                  Live Demo
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsWindow;
