import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Home, Clock, Monitor, Heart, Scissors, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const jobs = [
  { title: "Data Entry Operator", company: "FlexiWork Corp", type: "Work-from-home", skill: "Beginner", salary: "₹12,000/mo", icon: Home },
  { title: "Frontend Developer", company: "TechPink Solutions", type: "IT / Corporate", skill: "Intermediate", salary: "₹35,000/mo", icon: Monitor },
  { title: "Part-time Tutor", company: "EduShe Academy", type: "Part-time", skill: "Beginner", salary: "₹8,000/mo", icon: Clock },
  { title: "Home Cook", company: "HomeChef Network", type: "Cooking", skill: "Beginner", salary: "₹10,000/mo", icon: Heart },
  { title: "Boutique Tailor", company: "StitchCraft India", type: "Tailoring", skill: "Intermediate", salary: "₹15,000/mo", icon: Scissors },
  { title: "Customer Support", company: "HelpDesk Pro", type: "Work-from-home", skill: "Beginner", salary: "₹14,000/mo", icon: Home },
  { title: "Caretaker", company: "ElderCare Plus", type: "Domestic help", skill: "Beginner", salary: "₹11,000/mo", icon: Heart },
  { title: "UI/UX Designer", company: "DesignHer Studio", type: "IT / Corporate", skill: "Advanced", salary: "₹45,000/mo", icon: Monitor },
];

const typeFilters = ["All", "Work-from-home", "Part-time", "IT / Corporate", "Domestic help", "Tailoring", "Cooking"];
const skillFilters = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const JobsSection = () => {
  const [typeFilter, setTypeFilter] = useState("All");
  const [skillFilter, setSkillFilter] = useState("All Levels");

  const filtered = jobs.filter((j) => {
    const typeMatch = typeFilter === "All" || j.type === typeFilter;
    const skillMatch = skillFilter === "All Levels" || j.skill === skillFilter;
    return typeMatch && skillMatch;
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-display mb-2">Jobs & Opportunities</h2>
        <p className="text-muted-foreground">Find the perfect role that fits your life.</p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap justify-center gap-2">
          {typeFilters.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={typeFilter === f ? "default" : "outline"}
              className={typeFilter === f ? "gradient-primary text-primary-foreground" : "border-primary/30 text-foreground hover:bg-primary/10"}
              onClick={() => setTypeFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {skillFilters.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={skillFilter === f ? "default" : "outline"}
              className={skillFilter === f ? "bg-accent text-accent-foreground" : "border-accent/30 text-foreground hover:bg-accent/10"}
              onClick={() => setSkillFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((job, i) => (
          <motion.div
            key={job.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="section-card"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <job.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">{job.title}</h3>
                <p className="text-xs text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-xs border-primary/30">{job.type}</Badge>
              <Badge variant="outline" className="text-xs border-accent/30">{job.skill}</Badge>
            </div>
            <p className="text-primary font-bold mb-3">{job.salary}</p>
            <Button size="sm" variant="outline" className="w-full border-primary/30 text-foreground hover:bg-primary/10 gap-1">
              Apply Now <ExternalLink className="w-3 h-3" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobsSection;
