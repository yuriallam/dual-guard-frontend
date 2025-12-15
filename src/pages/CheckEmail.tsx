import logo from "@/assets/dualguard-logo.png";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const CheckEmail = () => {
    const location = useLocation();
    const state = location.state as { email?: string; message?: string } | null;
    const email = state?.email || "your email";
    const message = state?.message || "Please check your email to verify your account.";

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="flex min-h-screen items-center justify-center px-4 pt-16 pb-8">
                <div className="w-full max-w-md space-y-8 text-center">
                    {/* Header */}
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            <img src={logo} alt="Dualguard" className="h-12 w-12" />
                            <span className="font-display text-2xl font-bold text-gradient">Dualguard</span>
                        </Link>
                        <div className="flex justify-center mb-6">
                            <div className="rounded-full bg-primary/10 p-4">
                                <Mail className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Check your email</h1>
                        <p className="text-muted-foreground">{message}</p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                We've sent a verification link to <strong className="text-foreground">{email}</strong>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Click the link in the email to verify your account and get started.
                            </p>
                            <div className="pt-4">
                                <p className="text-xs text-muted-foreground mb-4">
                                    Didn't receive the email? Check your spam folder or{" "}
                                    <Link to="/signin" className="text-primary hover:underline">
                                        try signing in
                                    </Link>
                                    {" "}if you've already verified.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="space-y-2">
                        <Button asChild variant="outline" className="w-full">
                            <Link to="/signin">Back to Sign In</Link>
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            <Link to="/" className="text-primary hover:underline">
                                Return to home
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckEmail;

