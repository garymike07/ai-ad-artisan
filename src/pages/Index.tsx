import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Wand2, Image, Zap, ArrowRight, Check } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import type { User, Session } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const features = [
    {
      icon: Wand2,
      title: "AI-Powered Copywriting",
      description: "Generate compelling ad copy in seconds with advanced AI technology",
    },
    {
      icon: Image,
      title: "Smart Image Generation",
      description: "Create stunning visuals tailored to your brand and message",
    },
    {
      icon: Zap,
      title: "Instant Templates",
      description: "Professional templates for social media, banners, and stories",
    },
  ];

  const benefits = [
    "Save hours of creative work",
    "No design experience needed",
    "Unlimited projects & exports",
    "Professional results guaranteed",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Ad Creation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Create Stunning Ads with{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                AI Magic
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Transform your ideas into professional advertisements in minutes. 
              No design skills required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-glow gap-2"
              >
                {user ? "Go to Dashboard" : "Start Creating Free"}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to create amazing ads</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-8 text-center hover:shadow-elegant transition-all border-2 group hover:border-primary"
              >
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 mb-6 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
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
                  Why Choose{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    AdGenius?
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
                  onClick={() => navigate(user ? "/dashboard" : "/auth")}
                  className="mt-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity gap-2"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center shadow-elegant">
                  <div className="text-center space-y-4">
                    <Sparkles className="w-24 h-24 text-primary mx-auto" />
                    <p className="text-lg font-medium">Create Your First Ad in Minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Create Amazing Ads?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of marketers and businesses creating professional ads with AI
          </p>
          <Button 
            size="lg"
            onClick={() => navigate(user ? "/dashboard" : "/auth")}
            className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6 gap-2"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
