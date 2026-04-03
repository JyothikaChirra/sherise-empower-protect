import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Upload, MessageSquare, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const offensiveWords = ["hate", "ugly", "stupid", "dumb", "kill", "die", "slut", "whore", "bitch", "trash", "idiot"];

type Result = "safe" | "offensive" | "highly_offensive" | null;

const HarassmentSection = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [complaintSent, setComplaintSent] = useState(false);

  const analyzeText = () => {
    const lower = text.toLowerCase();
    const matchCount = offensiveWords.filter((w) => lower.includes(w)).length;
    if (matchCount >= 2) setResult("highly_offensive");
    else if (matchCount === 1) setResult("offensive");
    else setResult("safe");
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
                  {result === "safe" ? "No harmful content detected." : "This content may be harmful."}
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
              <h3 className="font-semibold font-display">Upload Screenshot</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Upload screenshots of harassment for evidence.</p>
            <Input type="file" accept="image/*" className="bg-muted/30" />
          </div>

          <div className="section-card">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-semibold font-display">Anonymous Complaint</h3>
            </div>
            {complaintSent ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-700">Complaint submitted anonymously!</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <Textarea placeholder="Describe the incident..." className="bg-muted/30 min-h-[80px]" />
                <Button
                  variant="outline"
                  className="border-primary/30 text-foreground hover:bg-primary/10"
                  onClick={() => setComplaintSent(true)}
                >
                  Submit Anonymously
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarassmentSection;
