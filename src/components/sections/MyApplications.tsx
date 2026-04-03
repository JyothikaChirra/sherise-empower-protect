import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Trash2, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScholarshipApp {
  id: string;
  scholarship_name: string;
  scholarship_type: string;
  organization: string;
  amount: string;
  status: string;
  applied_at: string;
}

interface JobApp {
  id: string;
  job_title: string;
  company: string;
  job_type: string;
  skill_level: string;
  salary: string;
  status: string;
  applied_at: string;
}

const MyApplications = () => {
  const [scholarshipApps, setScholarshipApps] = useState<ScholarshipApp[]>([]);
  const [jobApps, setJobApps] = useState<JobApp[]>([]);
  const [tab, setTab] = useState<"scholarships" | "jobs">("scholarships");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: sData }, { data: jData }] = await Promise.all([
      supabase.from("scholarship_applications").select("*").order("applied_at", { ascending: false }),
      supabase.from("job_applications").select("*").order("applied_at", { ascending: false }),
    ]);
    setScholarshipApps(sData || []);
    setJobApps(jData || []);
    setLoading(false);
  };

  const withdrawScholarship = async (id: string, name: string) => {
    await supabase.from("scholarship_applications").delete().eq("id", id);
    setScholarshipApps((prev) => prev.filter((a) => a.id !== id));
    toast({ title: "Withdrawn", description: `Application for "${name}" has been withdrawn.` });
  };

  const withdrawJob = async (id: string, title: string) => {
    await supabase.from("job_applications").delete().eq("id", id);
    setJobApps((prev) => prev.filter((a) => a.id !== id));
    toast({ title: "Withdrawn", description: `Application for "${title}" has been withdrawn.` });
  };

  const statusIcon = (status: string) => {
    if (status === "applied") return <Clock className="w-4 h-4 text-amber-500" />;
    if (status === "accepted" || status === "offered") return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <Clock className="w-4 h-4 text-muted-foreground" />;
  };

  const statusBadgeClass = (status: string) => {
    if (status === "applied") return "bg-amber-50 text-amber-700 border-amber-200";
    if (status === "accepted" || status === "offered") return "bg-green-50 text-green-700 border-green-200";
    if (status === "rejected") return "bg-red-50 text-red-700 border-red-200";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-display mb-2">My Applications</h2>
        <p className="text-muted-foreground">Track all your scholarship and job applications.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="flex rounded-xl bg-muted p-1">
          <button
            onClick={() => setTab("scholarships")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              tab === "scholarships" ? "gradient-primary text-primary-foreground shadow-md" : "text-muted-foreground"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Scholarships ({scholarshipApps.length})
          </button>
          <button
            onClick={() => setTab("jobs")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              tab === "jobs" ? "gradient-primary text-primary-foreground shadow-md" : "text-muted-foreground"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Jobs ({jobApps.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 rounded-full gradient-primary mx-auto mb-3 animate-pulse" />
          <p className="text-muted-foreground text-sm">Loading applications...</p>
        </div>
      ) : tab === "scholarships" ? (
        scholarshipApps.length === 0 ? (
          <div className="text-center py-12 section-card">
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No scholarship applications yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Browse the Scholarships section to apply!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {scholarshipApps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="section-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-sm">{app.scholarship_name}</h3>
                      <p className="text-xs text-muted-foreground">{app.organization}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs ${statusBadgeClass(app.status)}`}>
                    {statusIcon(app.status)} {app.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary font-bold">{app.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10 gap-1"
                    onClick={() => withdrawScholarship(app.id, app.scholarship_name)}
                  >
                    <Trash2 className="w-3 h-3" /> Withdraw
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        jobApps.length === 0 ? (
          <div className="text-center py-12 section-card">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No job applications yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Browse the Jobs section to apply!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {jobApps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="section-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-sm">{app.job_title}</h3>
                      <p className="text-xs text-muted-foreground">{app.company}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs ${statusBadgeClass(app.status)}`}>
                    {statusIcon(app.status)} {app.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="text-xs border-primary/30">{app.job_type}</Badge>
                  <Badge variant="outline" className="text-xs border-accent/30">{app.skill_level}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary font-bold">{app.salary}</p>
                    <p className="text-xs text-muted-foreground">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10 gap-1"
                    onClick={() => withdrawJob(app.id, app.job_title)}
                  >
                    <Trash2 className="w-3 h-3" /> Withdraw
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MyApplications;
