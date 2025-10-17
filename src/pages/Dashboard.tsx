import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Image, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type AdProject = Tables<"ad_projects">;

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [projects, setProjects] = useState<AdProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("ad_projects")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setProjects(data ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load projects";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

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
        .single<AdProject>();

      if (error) throw error;
      if (!data) return;

      toast.success("Project created!");
      navigate(`/editor/${data.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create project";
      toast.error(message);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 space-y-12">
        <div className="glass-panel border-transparent rounded-3xl p-8 md:p-12 shadow-glow">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground/60 mb-3">Campaign workspace</p>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Your Projects Hub
              </h1>
              <p className="text-muted-foreground/80 max-w-xl">
                Build out concepts, track revisions, and move effortlessly from idea to launch-ready deliverables.
              </p>
            </div>
            <Button onClick={() => createProject("social")} className="bg-gradient-to-r from-primary to-accent gap-2 shadow-glow">
              <Plus className="w-4 h-4" /> New project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="p-8 cursor-pointer transition-all glass-panel group border-transparent hover:shadow-glow"
            onClick={() => createProject("social")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 group-hover:from-primary/25 group-hover:to-accent/25 transition-all shadow-[0_12px_35px_rgba(82,70,255,0.15)]">
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
            className="p-8 cursor-pointer transition-all glass-panel group border-transparent hover:shadow-glow"
            onClick={() => createProject("banner")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 group-hover:from-primary/25 group-hover:to-accent/25 transition-all shadow-[0_12px_35px_rgba(82,70,255,0.15)]">
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
            className="p-8 cursor-pointer transition-all glass-panel group border-transparent hover:shadow-glow"
            onClick={() => createProject("story")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 group-hover:from-primary/25 group-hover:to-accent/25 transition-all shadow-[0_12px_35px_rgba(82,70,255,0.15)]">
                <Sparkles className="w-12 h-12 text-primary" />
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
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="group cursor-pointer glass-panel border-transparent hover:shadow-glow transition-all"
                  onClick={() => navigate(`/editor/${project.id}`)}
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/12 to-accent/12 rounded-t-2xl flex items-center justify-center overflow-hidden">
                    {project.thumbnail_url ? (
                      <img 
                        src={project.thumbnail_url} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="w-12 h-12 text-primary/40" />
                    )}
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-semibold truncate">{project.title}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{project.template_type}</p>
                    <p className="text-xs text-muted-foreground/70">Updated {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : "recently"}</p>
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
