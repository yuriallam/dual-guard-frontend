import { ApiClientError } from "@/api/client";
import logo from "@/assets/dualguard-logo.png";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useVerifyEmail } from "@/hooks/api/auth";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const { toast } = useToast();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const { mutate: verifyEmail } = useVerifyEmail();

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setErrorMessage("Invalid verification link. No token provided.");
            return;
        }

        // Verify email with token
        verifyEmail(
            { token },
            {
                onSuccess: async () => {
                    setStatus("success");
                    toast({
                        title: "Email verified successfully",
                        description: "Your account has been verified. You are now signed in.",
                    });

                    // Refresh user data to get authenticated state
                    try {
                        await refreshUser();
                        // Redirect to home after a short delay
                        setTimeout(() => {
                            navigate("/", { replace: true });
                        }, 2000);
                    } catch (error) {
                        // Even if refresh fails, redirect to sign in
                        console.error("Failed to refresh user after verification:", error);
                        setTimeout(() => {
                            navigate("/signin", { replace: true });
                        }, 2000);
                    }
                },
                onError: (error: unknown) => {
                    setStatus("error");
                    let errorMessage = "Failed to verify email. Please try again.";

                    if (error instanceof ApiClientError) {
                        if (error.status === 400) {
                            errorMessage = "Invalid or expired verification token. Please request a new verification email.";
                        } else {
                            errorMessage = error.message;
                        }
                    } else if (error instanceof Error) {
                        errorMessage = error.message;
                    }

                    setErrorMessage(errorMessage);
                    toast({
                        title: "Verification failed",
                        description: errorMessage,
                        variant: "destructive",
                    });
                },
            }
        );
    }, [token, verifyEmail, refreshUser, navigate, toast]);

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

                        {status === "loading" && (
                            <>
                                <div className="flex justify-center mb-6">
                                    <Loader2 className="h-16 w-16 text-primary animate-spin" />
                                </div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Verifying your email</h1>
                                <p className="text-muted-foreground">Please wait while we verify your email address...</p>
                            </>
                        )}

                        {status === "success" && (
                            <>
                                <div className="flex justify-center mb-6">
                                    <div className="rounded-full bg-emerald-500/10 p-4">
                                        <CheckCircle className="h-16 w-16 text-emerald-500" />
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Email Verified!</h1>
                                <p className="text-muted-foreground">
                                    Your email has been successfully verified. Redirecting you to the home page...
                                </p>
                            </>
                        )}

                        {status === "error" && (
                            <>
                                <div className="flex justify-center mb-6">
                                    <div className="rounded-full bg-destructive/10 p-4">
                                        <XCircle className="h-16 w-16 text-destructive" />
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Verification Failed</h1>
                                <p className="text-muted-foreground mb-4">{errorMessage}</p>
                            </>
                        )}
                    </div>

                    {/* Card */}
                    {status === "error" && (
                        <div className="rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    The verification link may have expired or is invalid. You can request a new verification email.
                                </p>
                                <div className="flex flex-col gap-2">
                                    <Button asChild variant="default" className="w-full">
                                        <Link to="/signin">Go to Sign In</Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link to="/signup">Create New Account</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    {status !== "loading" && (
                        <p className="text-center text-sm text-muted-foreground">
                            <Link to="/" className="text-primary hover:underline">
                                Return to home
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;

