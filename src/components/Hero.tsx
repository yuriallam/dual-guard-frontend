import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-subtle" />
      <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan/5 blur-3xl" />
      <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-purple/5 blur-3xl" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--cyan) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--cyan) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container relative mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
        {/* Badge */}
        <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/5 px-4 py-2 text-sm">
          <Shield className="h-4 w-4 text-cyan" />
          <span className="text-muted-foreground">Trusted by 100+ protocols</span>
        </div>

        {/* Main Heading */}
        <h1 
          className="animate-fade-in-up max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: '0.1s' }}
        >
          Secure Your Smart Contracts with{' '}
          <span className="text-gradient">Elite Auditors</span>
        </h1>

        {/* Subtitle */}
        <p 
          className="animate-fade-in-up mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          style={{ animationDelay: '0.2s' }}
        >
          Join competitive security audits. Discover vulnerabilities before hackers do. 
          Protect millions in TVL with community-driven security contests.
        </p>

        {/* CTA Buttons */}
        <div 
          className="animate-fade-in-up mt-10 flex flex-col gap-4 sm:flex-row"
          style={{ animationDelay: '0.3s' }}
        >
          <Button variant="hero" size="xl">
            Submit Your Protocol
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="hero-outline" size="xl">
            Become an Auditor
          </Button>
        </div>

        {/* Stats Preview */}
        <div 
          className="animate-fade-in-up mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4"
          style={{ animationDelay: '0.4s' }}
        >
          {[
            { value: '$12M+', label: 'Total Payouts' },
            { value: '500+', label: 'Auditors' },
            { value: '150+', label: 'Contests' },
            { value: '2,500+', label: 'Bugs Found' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-display text-2xl font-bold text-gradient sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
