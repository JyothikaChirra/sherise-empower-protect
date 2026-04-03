import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const scholarships = [
  { name: "CBSE Merit Scholarship", type: "School", org: "Government", amount: "₹500/month", deadline: "Dec 2025" },
  { name: "Pragati Scholarship for Girls", type: "College", org: "AICTE", amount: "₹50,000/year", deadline: "Oct 2025" },
  { name: "Indira Gandhi Scholarship", type: "Postgraduate", org: "UGC", amount: "₹36,200/year", deadline: "Jan 2026" },
  { name: "L'Oréal India Scholarship", type: "College", org: "Private", amount: "₹2,50,000", deadline: "Sep 2025" },
  { name: "Tata Women of Science", type: "Postgraduate", org: "Private", amount: "₹5,00,000", deadline: "Nov 2025" },
  { name: "Post Matric Scholarship for Girls", type: "School", org: "Government", amount: "₹12,000/year", deadline: "Mar 2026" },
];

const filters = ["All", "School", "College", "Postgraduate"];

const ScholarshipsSection = () => {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? scholarships : scholarships.filter((s) => s.type === filter);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-display mb-2">Scholarships</h2>
        <p className="text-muted-foreground">Financial aid to fuel your education and dreams.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            className={filter === f ? "gradient-primary text-primary-foreground" : "border-primary/30 text-foreground hover:bg-primary/10"}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="section-card flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <GraduationCap className="w-8 h-8 text-primary shrink-0" />
              <Badge variant="outline" className="text-xs border-primary/30">{s.type}</Badge>
            </div>
            <h3 className="font-semibold text-sm mb-1">{s.name}</h3>
            <p className="text-xs text-muted-foreground mb-1">{s.org}</p>
            <p className="text-primary font-bold text-lg mb-1">{s.amount}</p>
            <p className="text-xs text-muted-foreground mb-4">Deadline: {s.deadline}</p>
            <Button size="sm" variant="outline" className="mt-auto border-primary/30 text-foreground hover:bg-primary/10 gap-1">
              Apply <ExternalLink className="w-3 h-3" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipsSection;
