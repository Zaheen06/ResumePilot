import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Layout, 
  Shield, 
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Content',
    description: 'Generate professional summaries and bullet points with our advanced AI assistant.',
  },
  {
    icon: Layout,
    title: '5+ ATS Templates',
    description: 'Choose from professionally designed templates optimized for applicant tracking systems.',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Download your resume as a polished PDF ready for applications.',
  },
  {
    icon: Shield,
    title: 'Secure Storage',
    description: 'Your resumes are safely stored and accessible from any device.',
  },
  {
    icon: Zap,
    title: 'Real-time Preview',
    description: 'See changes instantly as you build your perfect resume.',
  },
  {
    icon: FileText,
    title: 'Multiple Resumes',
    description: 'Create different versions tailored for various job applications.',
  },
];

const templates = [
  { name: 'Minimal Professional', color: 'bg-card' },
  { name: 'Modern Clean', color: 'bg-secondary' },
  { name: 'Tech Developer', color: 'bg-muted' },
  { name: 'Student / Fresher', color: 'bg-accent' },
  { name: 'Executive', color: 'bg-card' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Resume Builder
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Build Your Perfect Resume in Minutes
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create ATS-friendly resumes with AI assistance. Stand out from the crowd and land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="text-base px-8">
                <Link to="/auth?mode=signup">
                  Start Building Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8">
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you create professional resumes that get noticed.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Professional Templates
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from 5+ ATS-optimized templates designed for different industries and experience levels.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {templates.map((template, index) => (
              <div
                key={index}
                className={`w-48 h-64 rounded-lg border border-border ${template.color} flex items-end p-4 hover:shadow-lg transition-shadow cursor-pointer`}
              >
                <div className="w-full">
                  <div className="h-2 w-3/4 bg-muted-foreground/20 rounded mb-2"></div>
                  <div className="h-2 w-1/2 bg-muted-foreground/20 rounded mb-4"></div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-muted-foreground/10 rounded"></div>
                    <div className="h-1.5 w-5/6 bg-muted-foreground/10 rounded"></div>
                    <div className="h-1.5 w-4/6 bg-muted-foreground/10 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {templates.map(t => t.name).join(' • ')}
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create your professional resume in three simple steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Choose Template', desc: 'Pick from our ATS-friendly designs' },
              { step: '2', title: 'Add Content', desc: 'Fill in your details with AI assistance' },
              { step: '3', title: 'Download PDF', desc: 'Export and start applying' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Build Your Resume?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of job seekers who've landed their dream jobs with our AI-powered resume builder.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="text-base px-8">
                <Link to="/auth?mode=signup">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Free to start
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                No credit card required
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
