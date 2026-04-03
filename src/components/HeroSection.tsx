import { motion } from "framer-motion";
import { Shield, Briefcase, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onNavigate: (section: string) => void;
}

const HeroSection = ({ onNavigate }: HeroProps) => {
  return (
    <section className="relative overflow-hidden gradient-bg py-20 px-4">
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-20 blur-3xl gradient-primary" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl bg-accent" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold font-display mb-4">
            <span className="gradient-text">Empower.</span>{" "}
            <span className="gradient-text">Protect.</span>{" "}
            <span className="gradient-text">Rise.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Your all-in-one safety and empowerment companion. Stay safe, find opportunities, and build your future.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button
            size="lg"
            className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity gap-2 rounded-xl px-8"
            onClick={() => onNavigate("Safety")}
          >
            <Shield className="w-5 h-5" /> Stay Safe
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/30 text-foreground hover:bg-primary/10 gap-2 rounded-xl px-8"
            onClick={() => onNavigate("Jobs")}
          >
            <Briefcase className="w-5 h-5" /> Find Jobs
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-accent/30 text-foreground hover:bg-accent/10 gap-2 rounded-xl px-8"
            onClick={() => onNavigate("Skills")}
          >
            <BookOpen className="w-5 h-5" /> Learn Today
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
