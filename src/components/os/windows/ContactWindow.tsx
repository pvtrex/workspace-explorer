import { useState } from 'react';
import { Mail, Github, Linkedin, Send, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactWindow = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });
    alert('Message sent! Thank you for reaching out.');
  };

  const socialLinks = [
    { icon: Mail, label: 'Email', href: 'mailto:hello@developer.com', text: 'hello@developer.com' },
    { icon: Github, label: 'GitHub', href: 'https://github.com', text: 'github.com/developer' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com', text: 'linkedin.com/in/developer' },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-gradient">Get In Touch</h2>
        <p className="text-muted-foreground">Let's build something amazing together</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-secondary/50 border-border/50 focus:border-primary"
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-secondary/50 border-border/50 focus:border-primary"
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-secondary/50 border-border/50 focus:border-primary min-h-[120px]"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Connect With Me</h3>
            <div className="space-y-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <link.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{link.label}</p>
                    <p className="text-xs text-muted-foreground">{link.text}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <MapPin size={18} className="text-primary" />
              <h3 className="font-semibold">Location</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              San Francisco, California<br />
              Open to remote opportunities worldwide
            </p>
          </div>

          <div className="glass p-6 rounded-lg text-center">
            <p className="text-sm text-foreground/80">
              Currently <span className="text-green-400">●</span> available for freelance work
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactWindow;
