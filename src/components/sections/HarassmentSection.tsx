import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Upload, MessageSquare, CheckCircle, XCircle, AlertTriangle, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Result = "safe" | "offensive" | "highly_offensive" | null;

const HarassmentSection = () => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [complaintText, setComplaintText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const offensiveWords = ["hate", "ugly", "stupid", "dumb", "kill", "die", "slut", "whore", "bitch", "trash", "idiot", "abuse", "threat", "harass"];

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const { data } = await supabase
      .from("harassment_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setReports(data);
  };

  const analyzeText = () => {
    const lower = text.toLowerCase();
    const matchCount = offensiveWords.filter((w) => lower.includes(w)).length;
    if (matchCount >= 2) setResult("highly_offensive");
    else if (matchCount === 1) setResult("offensive");
    else setResult("safe");
  };

  const handleSubmitReport = async () => {
    if (!complaintText.trim()) return;
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let screenshotUrl: string | null = null;

      // Upload screenshot if provided
      if (file) {
        setUploading(true);
        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("evidence")
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("evidence").getPublicUrl(filePath);
        screenshotUrl = urlData.publicUrl;
        setUploading(false);
      }

      const { error } = await supabase.from("harassment_reports").insert({
        user_id: user.id,
        description: complaintText,
        screenshot_url: screenshotUrl,
      });

      if (error) throw error;

      toast({
        title: "✅ Report Submitted",
        description: "Your anonymous complaint has been recorded securely.",
      });

      setComplaintText("");
      setFile(null);
      loadReports();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit report",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const resultConfig = {
    safe: { icon: CheckCircle, label: "Safe", color: "text-green-600", bg: "bg-green-50" },
    offensive: { icon: AlertTriangle, label: "Offensive", color: "text-amber-600", bg: "bg-amber-50" },
    highly_offensive: { icon: XCircle, label: "Highly Offensive", color: "text-red-600", bg: "bg-red-50" },
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-display mb-2">Harassment Detection</h2>
        <p className="text-muted-foreground">Detect toxic content and report harassment anonymously.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Text Analysis */}
        <div className="section-card space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <h3 className="font-semibold font-display">Comment Analysis</h3>
          </div>
          <Textarea
            placeholder="Paste a comment or message to analyze..."
            value={text}
            onChange={(e) => { setText(e.target.value); setResult(null); }}
            className="min-h-[120px] bg-muted/30"
          />
          <Button
            className="gradient-primary text-primary-foreground hover:opacity-90"
            onClick={analyzeText}
            disabled={!text.trim()}
          >
            Analyze Text
          </Button>

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-3 p-4 rounded-xl ${resultConfig[result].bg}`}
            >
              {(() => {
                const Icon = resultConfig[result].icon;
                return <Icon className={`w-6 h-6 ${resultConfig[result].color}`} />;
              })()}
              <div>
                <p className={`font-semibold ${resultConfig[result].color}`}>{resultConfig[result].label}</p>
                <p className="text-xs text-muted-foreground">
                  {result === "safe" ? "No harmful content detected." : "This content may be harmful. Consider reporting it."}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Screenshot + Complaint */}
        <div className="space-y-4">
          <div className="section-card">
            <div className="flex items-center gap-2 mb-3">
              <Upload className="w-5 h-5 text-primary" />
              <h3 className="font-semibold font-display">Upload Evidence</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Upload screenshots of harassment as evidence.</p>
            <Input
              type="file"
              accept="image/*"
              className="bg-muted/30"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && <p className="text-xs text-muted-foreground mt-1">📎 {file.name}</p>}
          </div>

          <div className="section-card">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-semibold font-display">Anonymous Complaint</h3>
            </div>
            <div className="space-y-3">
              <Textarea
                placeholder="Describe the incident..."
                className="bg-muted/30 min-h-[80px]"
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
              />
              <Button
                variant="outline"
                className="border-primary/30 text-foreground hover:bg-primary/10"
                onClick={handleSubmitReport}
                disabled={submitting || !complaintText.trim()}
              >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...</> : "Submit Anonymously"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Reports */}
      {reports.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold font-display mb-4">Your Reports</h3>
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="section-card flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm line-clamp-2">{report.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      report.status === "submitted" ? "bg-amber-100 text-amber-700" :
                      report.status === "reviewed" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    }`}>{report.status}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HarassmentSection;
