import logo from "@/assets/dualguard-logo.png";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isSignedIn, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page the user was trying to access before being redirected
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthLoading && isSignedIn) {
      navigate(from, { replace: true });
    }
  }, [isSignedIn, isAuthLoading, navigate, from]);

  // Show loading while checking auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if already authenticated (will redirect)
  if (isSignedIn) {
    return null;
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      toast({
        title: "Success",
        description: "You have been signed in successfully.",
      });
      // Redirect to the page they were trying to access, or home
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to sign in. Please check your credentials.";
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    try {
      const ethereum = (window as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;
      if (ethereum) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Connected wallet:", accounts[0]);
      } else {
        alert("Please install MetaMask or another Web3 wallet");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <img src={logo} alt="Dualguard" className="h-12 w-12" />
              <span className="font-display text-2xl font-bold text-gradient">Dualguard</span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to your account</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
            {/* Wallet Connect */}
            <Button
              onClick={handleWalletConnect}
              disabled={isConnecting}
              variant="outline"
              className="w-full h-12 gap-2 border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <Wallet className="h-5 w-5" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>

            <div className="relative my-6">
              <Separator className="bg-border/50" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-sm text-muted-foreground">
                or continue with email
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full h-12"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
