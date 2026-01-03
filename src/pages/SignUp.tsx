import { ApiClientError } from "@/api/client";
import logo from "@/assets/dualguard-logo.png";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSignUp } from "@/hooks/api/auth";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Check, Eye, EyeOff, Lock, Mail, User, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { mutate: signUp, isPending: isSigningUp } = useSignUp();
  const { isSignedIn, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthLoading && isSignedIn) {
      navigate("/", { replace: true });
    }
  }, [isSignedIn, isAuthLoading, navigate]);

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

  // Validate username: 3-30 characters, alphanumeric with underscores and hyphens only
  const validateUsername = (value: string): string | undefined => {
    if (!value) {
      return "Username is required";
    }
    if (value.length < 3 || value.length > 30) {
      return "Username must be between 3 and 30 characters";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return "Username can only contain letters, numbers, underscores, and hyphens";
    }
    return undefined;
  };

  // Validate email
  const validateEmail = (value: string): string | undefined => {
    if (!value) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  // Password requirement checks
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasCapital: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  // Check if all password requirements are met
  const allPasswordRequirementsMet =
    passwordRequirements.minLength &&
    passwordRequirements.hasCapital &&
    passwordRequirements.hasNumber &&
    passwordRequirements.hasSpecial;

  // Check if passwords match
  const passwordsMatch = password === confirmPassword && password.length > 0;

  // Check if form is valid for submission
  const isFormValid =
    allPasswordRequirementsMet &&
    passwordsMatch &&
    acceptTerms;

  // Validate password: 8+ chars, capital, number, special char
  const validatePassword = (value: string): string | undefined => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (value.length > 128) {
      return "Password must be at most 128 characters";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one capital letter";
    }
    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      return "Password must contain at least one special character";
    }
    return undefined;
  };

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate all fields
    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    let confirmPasswordError: string | undefined;

    if (!confirmPassword) {
      confirmPasswordError = "Please confirm your password";
    } else if (password !== confirmPassword) {
      confirmPasswordError = "Passwords don't match";
    }

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Terms required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    // Submit signup
    signUp(
      {
        username,
        email: email.toLowerCase().trim(),
        password,
      },
      {
        onSuccess: (response) => {
          // Redirect to check-email page with email info
          navigate("/check-email", {
            state: {
              email: email.toLowerCase().trim(),
              message: response.message || "Please check your email to verify your account.",
            },
          });
        },
        onError: (error: unknown) => {
          // Extract error message from ApiClientError or generic Error
          let errorMessage = "Failed to create account. Please try again.";
          let status: number | undefined;

          if (error instanceof ApiClientError) {
            status = error.status;
            errorMessage = error.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          // Handle specific error cases based on status code
          if (status === 409) {
            toast({
              title: "Account already exists",
              description: "This email or username is already registered. Please sign in instead.",
              variant: "destructive",
            });
          } else if (status === 429) {
            toast({
              title: "Too many requests",
              description: "Please wait a moment before trying again.",
              variant: "destructive",
            });
          } else if (status === 400) {
            toast({
              title: "Validation error",
              description: errorMessage || "Please check your input and try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: errorMessage,
              variant: "destructive",
            });
          }
        },
      }
    );
  };

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    try {
      const ethereum = (window as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;
      if (ethereum) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
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
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="auditor1"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) {
                        setErrors((prev) => ({ ...prev, username: undefined }));
                      }
                    }}
                    className={`pl-10 bg-background/50 border-border/50 focus:border-primary ${errors.username ? "border-destructive" : ""
                      }`}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  3-30 characters, letters, numbers, underscores, and hyphens only
                </p>
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    className={`pl-10 bg-background/50 border-border/50 focus:border-primary ${errors.email ? "border-destructive" : ""
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: undefined }));
                      }
                      // Clear confirm password error if passwords now match
                      if (e.target.value === confirmPassword && errors.confirmPassword) {
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }
                    }}
                    className={`pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary ${errors.password ? "border-destructive" : ""
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
                <div className="space-y-1.5 mt-2">
                  <div className={`flex items-center gap-2 text-xs transition-colors ${passwordRequirements.minLength ? "text-green-500" : "text-muted-foreground"}`}>
                    {passwordRequirements.minLength ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/50" />
                    )}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs transition-colors ${passwordRequirements.hasCapital ? "text-green-500" : "text-muted-foreground"}`}>
                    {passwordRequirements.hasCapital ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/50" />
                    )}
                    <span>One capital letter</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs transition-colors ${passwordRequirements.hasNumber ? "text-green-500" : "text-muted-foreground"}`}>
                    {passwordRequirements.hasNumber ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/50" />
                    )}
                    <span>One number</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs transition-colors ${passwordRequirements.hasSpecial ? "text-green-500" : "text-muted-foreground"}`}>
                    {passwordRequirements.hasSpecial ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/50" />
                    )}
                    <span>One special character</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }
                    }}
                    className={`pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary ${errors.confirmPassword ? "border-destructive" : ""
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
                {confirmPassword && password && !passwordsMatch && !errors.confirmPassword && (
                  <p className="text-sm text-destructive">Passwords do not match</p>
                )}
                {confirmPassword && password && passwordsMatch && (
                  <p className="text-sm text-green-500 flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    Passwords match
                  </p>
                )}
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

              <Button
                type="submit"
                variant="gradient"
                className="w-full h-12"
                disabled={isSigningUp || !isFormValid}
              >
                {isSigningUp ? "Creating Account..." : "Create Account"}
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
