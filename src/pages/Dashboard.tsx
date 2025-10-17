import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Image, FileText } from "lucide-react";
import { toast } from "sonner";
import type { User, Session } from "@supabase/supabase-js";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          setTimeout(() => {
            navigate("/auth");
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("ad_projects")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (templateType: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("ad_projects")
        .insert({
          user_id: user.id,
          template_type: templateType,
          title: `New ${templateType} Ad`,
        })
        .select()
        .single();

      if (error) throw error;
      toast.success("Project created!");
      navigate(`/editor/${data.id}`);
    } catch (error: any) {
      toast.error("Failed to create project");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Ad Projects
          </h1>
          <p className="text-muted-foreground">Create and manage your advertising campaigns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card 
            className="p-8 cursor-pointer hover:shadow-elegant transition-all border-2 border-dashed hover:border-primary group"
            onClick={() => createProject("social")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                <Image className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Social Media Ad</h3>
                <p className="text-sm text-muted-foreground">Perfect for Instagram, Facebook & Twitter</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Create
              </Button>
            </div>
          </Card>

          <Card 
            className="p-8 cursor-pointer hover:shadow-elegant transition-all border-2 border-dashed hover:border-primary group"
            onClick={() => createProject("banner")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                <FileText className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Display Banner</h3>
                <p className="text-sm text-muted-foreground">Web banners for Google Ads & more</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Create
              </Button>
            </div>
          </Card>

          <Card 
            className="p-8 cursor-pointer hover:shadow-elegant transition-all border-2 border-dashed hover:border-primary group"
            onClick={() => createProject("story")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                <Image className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Story Ad</h3>
                <p className="text-sm text-muted-foreground">Instagram & Snapchat stories</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Create
              </Button>
            </div>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your projects...</p>
          </div>
        ) : projects.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="group cursor-pointer hover:shadow-elegant transition-all"
                  onClick={() => navigate(`/editor/${project.id}`)}
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-lg flex items-center justify-center">
                    {project.thumbnail_url ? (
                      <img 
                        src={project.thumbnail_url} 
                        alt={project.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <Image className="w-12 h-12 text-primary/40" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 truncate">{project.title}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{project.template_type}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
