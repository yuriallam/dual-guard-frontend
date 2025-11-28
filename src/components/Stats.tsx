import { Shield, Users, DollarSign, Bug, Target, Award } from "lucide-react";

const stats = [
  {
    icon: DollarSign,
    value: "$12M+",
    label: "Total Payouts",
    description: "Rewards distributed to auditors",
  },
  {
    icon: Users,
    value: "500+",
    label: "Active Auditors",
    description: "Elite security researchers",
  },
  {
    icon: Shield,
    value: "150+",
    label: "Completed Audits",
    description: "Protocols secured",
  },
  {
    icon: Bug,
    value: "2,500+",
    label: "Bugs Found",
    description: "Vulnerabilities discovered",
  },
  {
    icon: Target,
    value: "$2B+",
    label: "TVL Protected",
    description: "Value secured by our audits",
  },
  {
    icon: Award,
    value: "99.8%",
    label: "Success Rate",
    description: "Post-audit security record",
  },
];

const Stats = () => {
  return (
    <section className="relative border-y border-border/50 bg-muted/30 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />

      <div className="container relative mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="animate-fade-in-up group text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card transition-all duration-300 group-hover:border-cyan/50 group-hover:shadow-glow-cyan">
                <stat.icon className="h-6 w-6 text-cyan transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="font-display text-3xl font-bold text-gradient">
                {stat.value}
              </div>
              <div className="mt-1 font-medium text-foreground">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
