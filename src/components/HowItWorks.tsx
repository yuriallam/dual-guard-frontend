import { FileCode, Search, Bug, Trophy } from "lucide-react";

const steps = [
  {
    icon: FileCode,
    title: "Submit Protocol",
    description: "Protocols submit their smart contracts along with prize pool and audit scope.",
    gradient: "from-cyan to-cyan/50",
  },
  {
    icon: Search,
    title: "Audit Period",
    description: "Security researchers analyze code during the contest period, searching for vulnerabilities.",
    gradient: "from-cyan/80 to-purple/60",
  },
  {
    icon: Bug,
    title: "Submit Findings",
    description: "Auditors submit detailed vulnerability reports with severity ratings and proof of concepts.",
    gradient: "from-purple/60 to-purple/80",
  },
  {
    icon: Trophy,
    title: "Earn Rewards",
    description: "Valid findings are rewarded based on severity. Top performers earn bonuses and reputation.",
    gradient: "from-purple to-purple/50",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24">
      {/* Background */}
      <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-cyan/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Our competitive audit model incentivizes thorough security reviews through transparent, 
            community-driven contests.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Connection Line (Desktop) */}
          <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-gradient-primary lg:block" />

          {steps.map((step, index) => (
            <div 
              key={index}
              className="animate-fade-in-up relative"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Step Number & Icon */}
              <div className="relative mb-6 flex items-center justify-center">
                <div className={`flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} p-[2px]`}>
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
                    <step.icon className="h-10 w-10 text-cyan" />
                  </div>
                </div>
                <span className="absolute -bottom-4 mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary font-display text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
