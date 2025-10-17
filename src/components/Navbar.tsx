import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-[0_8px_30px_rgba(109,88,255,0.45)] transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="w-6 h-6 text-primary-foreground drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-wide">
              Myk adMaker
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <div className="flex items-center gap-3 rounded-full border border-border bg-card/60 px-3 py-1 shadow-sm">
                <span className="hidden text-sm font-medium md:block">
                  {user?.fullName ?? user?.primaryEmailAddress?.emailAddress}
                </span>
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};
