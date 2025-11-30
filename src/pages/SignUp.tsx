import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, User, Wallet } from "lucide-react";
import Navbar from "@/components/Navbar";
import logo from "@/assets/dualguard-logo.png";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (!acceptTerms) {
      alert("Please accept the terms and conditions");
      return;
    }
    console.log("Sign up with:", { name, email, password });
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
      <div className="flex min-h-screen items-center justify-center px-4 pt-16 pb-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <img src={logo} alt="Dualguard" className="h-12 w-12" />
              <span className="font-display text-2xl font-bold text-gradient">Dualguard</span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Create an account</h1>
            <p className="mt-2 text-muted-foreground">Join the security community</p>
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
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

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
                <Label htmlFor="password">Password</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" variant="gradient" className="w-full h-12">
                Create Account
              </Button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
