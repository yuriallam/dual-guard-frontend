import { useState } from "react";
import { Shield, Clock, Users, CheckCircle, ArrowRight, Zap, Lock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const ForProtocols = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    protocolName: "",
    contactName: "",
    email: "",
    website: "",
    description: "",
    timeline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Request Submitted",
      description: "We'll review your submission and get back to you within 24-48 hours.",
    });
    
    setFormData({
      protocolName: "",
      contactName: "",
      email: "",
      website: "",
      description: "",
      timeline: "",
    });
    setIsSubmitting(false);
  };

  const benefits = [
    {
      icon: Users,
      title: "Elite Auditor Network",
      description: "Access to 100+ vetted security researchers competing to find vulnerabilities in your code.",
    },
    {
      icon: Zap,
      title: "Faster Coverage",
      description: "Multiple auditors working in parallel means more eyes on your code in less time.",
    },
    {
      icon: Award,
      title: "Pay for Results",
      description: "Contest model ensures you only pay for valid findings. No bugs found? Lower costs.",
    },
    {
      icon: Lock,
      title: "Comprehensive Security",
      description: "From smart contracts to full protocol reviews, we cover all aspects of blockchain security.",
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Submit Your Protocol",
      description: "Fill out the form with your protocol details, codebase information, and desired timeline.",
    },
    {
      step: "02",
      title: "Scope & Pricing",
      description: "Our team reviews your submission and works with you to define the audit scope and prize pool.",
    },
    {
      step: "03",
      title: "Contest Launch",
      description: "Your contest goes live. Auditors compete to find vulnerabilities over the contest period.",
    },
    {
      step: "04",
      title: "Review & Report",
      description: "We compile findings, validate submissions, and deliver a comprehensive security report.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted by Leading Protocols</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Secure Your Protocol</span>
              <br />
              <span className="text-foreground">With Elite Auditors</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Launch a competitive audit contest and let our network of security experts 
              battle-test your smart contracts before attackers do.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="gradient" 
                size="xl"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Audit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "$12M+", label: "Paid to Auditors" },
              { value: "150+", label: "Contests Completed" },
              { value: "2,500+", label: "Bugs Found" },
              { value: "100+", label: "Elite Auditors" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-gradient">Dualguard</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our competitive audit model delivers superior results compared to traditional audits.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <Card 
                key={benefit.title} 
                className="glass-card p-6 group hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From submission to final report, we guide you through every step.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary/50 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="text-5xl font-display font-bold text-primary/20 mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to <span className="text-gradient">Get Started</span>?
              </h2>
              <p className="text-muted-foreground">
                Submit your protocol details and we'll get back to you within 24-48 hours.
              </p>
            </div>
            
            <Card className="glass-card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Protocol Name *</label>
                    <Input
                      required
                      placeholder="e.g., DeFi Protocol X"
                      value={formData.protocolName}
                      onChange={(e) => setFormData({ ...formData, protocolName: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Name *</label>
                    <Input
                      required
                      placeholder="Your name"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      required
                      type="email"
                      placeholder="you@protocol.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website</label>
                    <Input
                      placeholder="https://yourprotocol.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Desired Timeline</label>
                  <Input
                    placeholder="e.g., Within 2 weeks, Q1 2025, Flexible"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Description *</label>
                  <Textarea
                    required
                    placeholder="Tell us about your protocol, the codebase, and what you're looking to audit..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-background/50 resize-none"
                  />
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Your information is kept confidential and secure.</span>
                </div>
                
                <Button 
                  type="submit" 
                  variant="gradient" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Request
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForProtocols;
