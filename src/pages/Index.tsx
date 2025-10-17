import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Layers, ArrowRight, Check, Workflow, PlugZap, Share2, ListChecks } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import siteProfile from "@/assets/site-profile.png";
import { Mail, Phone } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const features = [
    {
      icon: Workflow,
      title: "Guided Creative Workflow",
      description: "Step-by-step briefs that keep every campaign consistent and on-message",
    },
    {
      icon: Layers,
      title: "Reusable Layout Presets",
      description: "Save high-performing compositions and repurpose them across formats",
    },
    {
      icon: PlugZap,
      title: "Channel-Ready Exports",
      description: "One-click sizing and exporting for social, banners, and stories",
    },
    {
      icon: Share2,
      title: "Collaboration & Reviews",
      description: "Centralized feedback loops so teams can comment, approve, and ship faster",
    },
  ];

  const benefits = [
    "Save hours of creative work with structured briefs",
    "No design experience needed—built-in layout guidance",
    "Unlimited projects & exports for every channel",
    "Professional results with consistent review checkpoints",
    "Integrated presentation mode for stakeholder approvals",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/85 to-background/95" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="max-w-5xl mx-auto text-center space-y-10 fade-up">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel glow-ring">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium tracking-wide text-primary/90">Campaign craftsmanship, simplified</span>
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <img src={siteProfile} alt="Myk adMaker badge" className="w-20 h-20 rounded-3xl object-cover shadow-[0_12px_45px_rgba(80,70,240,0.35)]" />
              <h1 className="text-5xl md:text-7xl font-semibold leading-tight drop-shadow-[0_12px_45px_rgba(32,26,80,0.45)]">
                Create polished ads with
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-3">
                  Myk adMaker
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground/90 max-w-3xl mx-auto">
              Build high-performing campaigns using guided creative briefs, reusable presets, and collaborative reviews—all in one streamlined workspace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate(isSignedIn ? "/dashboard" : "/auth")}
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-glow gap-2"
              >
                {isSignedIn ? "Go to Dashboard" : "Start Designing"}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 glass-panel hover:bg-white/10"
              >
                Explore Templates
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 flex flex-col gap-4 items-center">
            <span className="text-sm uppercase tracking-[0.4em] text-muted-foreground/60">Why teams choose Myk adMaker</span>
            <h2 className="text-4xl font-semibold">Workflow-first features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Streamline every step—from creative brief to delivery—with tools built to keep your campaigns fast, on-brand, and collaborative.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-8 text-center glass-panel transition-all duration-300 group hover:translate-y-[-6px] hover:shadow-glow border-transparent"
              >
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 group-hover:from-primary/30 group-hover:to-accent/30 mb-6 transition-all duration-300 shadow-[0_12px_35px_rgba(82,70,255,0.2)]">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground/90 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Why teams rely on
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ml-2">
                    Myk adMaker
                  </span>
                </h2>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="p-1 rounded-full bg-primary/10">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  size="lg"
                  onClick={() => navigate(isSignedIn ? "/dashboard" : "/auth")}
                  className="mt-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity gap-2 shadow-glow"
                >
                  Start Your Next Campaign
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="relative">
                <div className="aspect-square rounded-2xl glass-panel p-8 flex items-center justify-center shadow-glow">
                  <div className="text-center space-y-4">
                    <Sparkles className="w-24 h-24 text-primary mx-auto animate-pulse" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Launch complete campaigns in minutes with confidence
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="glass-panel border-transparent rounded-3xl px-8 py-12 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <h3 className="text-3xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Let's build your next campaign together
                </h3>
                <p className="text-muted-foreground/90">
                  Reach out for tailored onboarding, team training, or partnership opportunities.
                </p>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-muted-foreground/90">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>wrootmike@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground/90">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>0792618156</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <Card className="glass-panel border-transparent px-8 py-16 max-w-4xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-semibold text-primary-foreground">
              Ready to craft standout campaigns?
            </h2>
            <p className="text-xl text-muted-foreground/90 max-w-2xl mx-auto">
              Join brands and agencies turning briefs into polished multi-channel ads with toolkits built for focus, collaboration, and speed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate(isSignedIn ? "/dashboard" : "/auth")}
                className="bg-gradient-to-r from-primary to-accent text-lg px-8 py-6 gap-2 shadow-glow"
              >
                {isSignedIn ? "Open Campaign Hub" : "Start Free Trial"}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 glass-panel hover:bg-white/10"
              >
                Book a Walkthrough
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
