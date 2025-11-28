import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ActiveContests from "@/components/ActiveContests";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <ActiveContests />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
