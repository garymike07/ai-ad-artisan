import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Download, Save, Palette, Type, Image as ImageIcon, ClipboardList, Layers } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type AdProject = Tables<"ad_projects">;
type ProjectContent = {
  headline?: string;
  bodyText?: string;
  cta?: string;
  bgColor?: string;
  imageUrl?: string;
};

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<AdProject | null>(null);
  
  const [title, setTitle] = useState("");
  const [headline, setHeadline] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [cta, setCta] = useState("");
  const [bgColor, setBgColor] = useState("#8B5CF6");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/auth");
    }
  }, [isSignedIn, navigate]);

  const fetchProject = useCallback(async () => {
    if (!id || !user) return;

    try {
      const { data, error } = await supabase
        .from("ad_projects")
        .select("*")
        .eq("id", id)
        .single<AdProject>();

      if (error) throw error;
      if (!data) return;

      setProject(data);
      setTitle(data.title ?? "");

      const content = (data.content as ProjectContent) || {};
      setHeadline(content.headline ?? "");
      setBodyText(content.bodyText ?? "");
      setCta(content.cta ?? "Learn More");
      setBgColor(content.bgColor ?? "#8B5CF6");
      setImageUrl(content.imageUrl ?? "");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load project";
      toast.error(message);
      navigate("/dashboard");
    }
  }, [id, navigate, user]);

  useEffect(() => {
    void fetchProject();
  }, [fetchProject]);

  const saveProject = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("ad_projects")
        .update({
          title,
          content: { headline, bodyText, cta, bgColor, imageUrl },
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      toast.success("Project saved!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save project";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const openGuidedBrief = () => {
    toast("Use the creative checklist to align messaging, tone, and audience before drafting.");
  };

  const applyPreset = (preset: { headline: string; bodyText: string; cta: string; bgColor: string }) => {
    setHeadline(preset.headline);
    setBodyText(preset.bodyText);
    setCta(preset.cta);
    setBgColor(preset.bgColor);
    toast.success("Preset applied");
  };

  if (!user || !project) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/60 mb-2">Campaign builder</p>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Creative Workspace</h1>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={openGuidedBrief} className="gap-2">
                  <ClipboardList className="w-4 h-4" /> Brief checklist
                </Button>
                <Button onClick={saveProject} disabled={loading} className="gap-2 bg-gradient-to-r from-primary to-accent">
                  <Save className="w-4 h-4" /> Save progress
                </Button>
              </div>
            </div>

            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass-panel border-transparent">
                <TabsTrigger value="content" className="gap-2">
                  <Type className="w-4 h-4" /> Content
                </TabsTrigger>
                <TabsTrigger value="design" className="gap-2">
                  <Palette className="w-4 h-4" /> Design
                </TabsTrigger>
                <TabsTrigger value="workflow" className="gap-2">
                  <Layers className="w-4 h-4" /> Presets
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <Card className="p-6 space-y-4 glass-panel border-transparent">
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="My Amazing Ad"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                      id="headline"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="Your Catchy Headline"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bodyText">Body Text</Label>
                    <Textarea
                      id="bodyText"
                      value={bodyText}
                      onChange={(e) => setBodyText(e.target.value)}
                      placeholder="Your compelling message..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cta">Call to Action</Label>
                    <Input
                      id="cta"
                      value={cta}
                      onChange={(e) => setCta(e.target.value)}
                      placeholder="Learn More"
                    />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <Card className="p-6 space-y-4 glass-panel border-transparent">
                  <div>
                    <Label htmlFor="bgColor">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bgColor"
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-20 h-12"
                      />
                      <Input
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        placeholder="#8B5CF6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="workflow" className="space-y-4">
                <Card className="p-6 space-y-6 glass-panel border-transparent">
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" /> Favorite presets
                    </h3>
                    <div className="grid gap-3">
                      {[
                        {
                          name: "Product launch spotlight",
                          headline: "Launch your next big release",
                          bodyText: "Highlight key benefits, pricing, and urgency to drive rapid adoption.",
                          cta: "See launch plan",
                          bgColor: "#5B2EFF",
                        },
                        {
                          name: "Seasonal promo",
                          headline: "Seasonal offer just dropped",
                          bodyText: "Bundle your best sellers and give early access to loyal customers.",
                          cta: "Preview collection",
                          bgColor: "#0F6B81",
                        },
                        {
                          name: "Event registration",
                          headline: "Join our live workshop",
                          bodyText: "Walk through strategy, creative, and measurement with our experts.",
                          cta: "Reserve a seat",
                          bgColor: "#E2543D",
                        },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className="text-left rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 px-4 py-3 transition-all"
                        >
                          <p className="text-sm font-semibold">{preset.name}</p>
                          <p className="text-xs text-muted-foreground">{preset.headline}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-primary" /> Creative checklist
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground/90">
                      <li>• Define audience pain points and desired outcome.</li>
                      <li>• Confirm tone, voice, and mandatory brand language.</li>
                      <li>• List the essential visuals or product highlights.</li>
                      <li>• Decide supporting channels for repurposed assets.</li>
                    </ul>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/60 mb-2">Live preview</p>
                <h2 className="text-2xl font-semibold">Campaign mockup</h2>
              </div>
              <Button variant="outline" size="sm" className="gap-2 glass-panel border-transparent">
                <Download className="w-4 h-4" /> Export
              </Button>
            </div>

            <Card className="overflow-hidden shadow-glow glass-panel border-transparent">
              <div 
                className="aspect-square p-12 flex flex-col items-center justify-center text-center space-y-6"
                style={{ backgroundColor: bgColor }}
              >
                {imageUrl && (
                  <div className="w-full max-w-xs">
                    <img 
                      src={imageUrl} 
                      alt="Ad image"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                )}
                
                {headline && (
                  <h3 className="text-4xl font-bold text-white drop-shadow-[0_12px_25px_rgba(0,0,0,0.45)]">
                    {headline}
                  </h3>
                )}
                
                {bodyText && (
                  <p className="text-lg text-white/90 max-w-md">
                    {bodyText}
                  </p>
                )}
                
                {cta && (
                  <Button 
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 shadow-lg"
                  >
                    {cta}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
