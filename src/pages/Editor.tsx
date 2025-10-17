import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Wand2, Download, Save, Palette, Type, Image as ImageIcon } from "lucide-react";
import type { User, Session } from "@supabase/supabase-js";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any>(null);
  
  const [title, setTitle] = useState("");
  const [headline, setHeadline] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [cta, setCta] = useState("");
  const [bgColor, setBgColor] = useState("#8B5CF6");
  const [imageUrl, setImageUrl] = useState("");

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
    if (id && user) {
      fetchProject();
    }
  }, [id, user]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from("ad_projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      setProject(data);
      setTitle(data.title || "");
      
      const content = (data.content as any) || {};
      setHeadline(content.headline || "");
      setBodyText(content.bodyText || "");
      setCta(content.cta || "Learn More");
      setBgColor(content.bgColor || "#8B5CF6");
      setImageUrl(content.imageUrl || "");
    } catch (error: any) {
      toast.error("Failed to load project");
      navigate("/dashboard");
    }
  };

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
    } catch (error: any) {
      toast.error("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  const generateCopy = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-ad-copy", {
        body: {
          prompt: `Create ad copy for: ${title}`,
          adType: project?.template_type || "social",
          tone: "professional",
        },
      });

      if (error) throw error;
      
      const content = data.content;
      const headlineMatch = content.match(/Headline:\s*(.+)/i);
      const bodyMatch = content.match(/Body:\s*(.+)/i);
      const ctaMatch = content.match(/CTA:\s*(.+)/i);

      if (headlineMatch) setHeadline(headlineMatch[1].trim());
      if (bodyMatch) setBodyText(bodyMatch[1].trim());
      if (ctaMatch) setCta(ctaMatch[1].trim());
      
      toast.success("AI copy generated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate copy");
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-ad-image", {
        body: {
          prompt: `Professional advertising image for: ${headline || title}. Modern, clean, eye-catching.`,
          size: "1024x1024",
        },
      });

      if (error) throw error;
      
      setImageUrl(data.imageUrl);
      toast.success("Image generated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !project) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Ad Editor</h1>
              <div className="flex gap-2">
                <Button onClick={saveProject} disabled={loading} className="gap-2">
                  <Save className="w-4 h-4" /> Save
                </Button>
              </div>
            </div>

            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content" className="gap-2">
                  <Type className="w-4 h-4" /> Content
                </TabsTrigger>
                <TabsTrigger value="design" className="gap-2">
                  <Palette className="w-4 h-4" /> Design
                </TabsTrigger>
                <TabsTrigger value="ai" className="gap-2">
                  <Wand2 className="w-4 h-4" /> AI Tools
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <Card className="p-6 space-y-4">
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
                <Card className="p-6 space-y-4">
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

              <TabsContent value="ai" className="space-y-4">
                <Card className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">AI Copy Generator</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate professional ad copy with AI based on your project title
                    </p>
                    <Button 
                      onClick={generateCopy} 
                      disabled={loading}
                      className="w-full gap-2 bg-gradient-to-r from-primary to-accent"
                    >
                      <Wand2 className="w-4 h-4" /> Generate Copy
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">AI Image Generator</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a custom image using AI based on your headline
                    </p>
                    <Button 
                      onClick={generateImage} 
                      disabled={loading}
                      className="w-full gap-2 bg-gradient-to-r from-primary to-accent"
                    >
                      <ImageIcon className="w-4 h-4" /> Generate Image
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Preview</h2>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" /> Export
              </Button>
            </div>

            <Card className="overflow-hidden shadow-elegant">
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
                  <h3 className="text-4xl font-bold text-white drop-shadow-lg">
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
                    className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8"
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
