import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/dualguard-logo.png";

const EmailVerified = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <img src={logo} alt="Dualguard" className="h-12 w-12" />
          <span className="font-display text-2xl font-bold text-gradient">Dualguard</span>
        </Link>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-20 w-20 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Email Verified
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Your email has been successfully verified. You can now access all features.
          </p>
        </div>
        
        <Button asChild size="lg" className="mt-6">
          <Link to="/">Continue to Dualguard</Link>
        </Button>
      </div>
    </div>
  );
};

export default EmailVerified;
