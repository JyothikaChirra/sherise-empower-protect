import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ExternalLink, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const scholarships = [
  { name: "CBSE Merit Scholarship", type: "School", org: "Government", amount: "₹500/month", deadline: "Dec 2025", link: "https://scholarships.gov.in/" },
  { name: "Pragati Scholarship for Girls", type: "College", org: "AICTE", amount: "₹50,000/year", deadline: "Oct 2025", link: "https://www.aicte-india.org/schemes/students-development-schemes/Pragati" },
  { name: "Indira Gandhi Scholarship", type: "Postgraduate", org: "UGC", amount: "₹36,200/year", deadline: "Jan 2026", link: "https://www.ugc.gov.in/" },
  { name: "L'Oréal India Scholarship", type: "College", org: "Private", amount: "₹2,50,000", deadline: "Sep 2025", link: "https://www.loreal.com/en/india/" },
  { name: "Tata Women of Science", type: "Postgraduate", org: "Private", amount: "₹5,00,000", deadline: "Nov 2025", link: "https://www.tatatrusts.org/" },
  { name: "Post Matric Scholarship for Girls", type: "School", org: "Government", amount: "₹12,000/year", deadline: "Mar 2026", link: "https://scholarships.gov.in/" },
];

const filters = ["All", "School", "College", "Postgraduate"];

const ScholarshipsSection = () => {
  const [filter, setFilter] = useState("All");
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data } = await supabase
      .from("scholarship_applications")
      .select("scholarship_name");
    if (data) {
      setAppliedIds(new Set(data.map((d) => d.scholarship_name)));
    }
  };

  const handleApply = async (scholarship: typeof scholarships[0]) => {
    setLoadingId(scholarship.name);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const { error } = await supabase.from("scholarship_applications").insert({
        user_id: user.id,
        scholarship_name: scholarship.name,
        scholarship_type: scholarship.type,
        organization: scholarship.org,
        amount: scholarship.amount,
        deadline: scholarship.deadline,
      });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already Applied", description: `You have already applied for ${scholarship.name}.` });
        } else {
          throw error;
        }
      } else {
        setAppliedIds((prev) => new Set([...prev, scholarship.name]));
        toast({
          title: "✅ Application Submitted!",
          description: `Your application for "${scholarship.name}" has been successfully submitted. You can track it in My Applications.`,
        });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoadingId(null);
    }
  };

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
        {filtered.map((s, i) => {
          const isApplied = appliedIds.has(s.name);
          const isLoading = loadingId === s.name;

          return (
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

              <div className="mt-auto flex gap-2">
                {isApplied ? (
                  <Button size="sm" disabled className="flex-1 gap-1 bg-green-100 text-green-700 border-green-200 cursor-default">
                    <CheckCircle className="w-3 h-3" /> Applied
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="flex-1 gradient-primary text-primary-foreground hover:opacity-90 gap-1"
                    onClick={() => handleApply(s)}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    {isLoading ? "Applying..." : "Apply Now"}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/30 text-foreground hover:bg-primary/10 gap-1"
                  onClick={() => window.open(s.link, "_blank")}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ScholarshipsSection;
