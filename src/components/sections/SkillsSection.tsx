import { motion } from "framer-motion";
import { Scissors, ChefHat, Sparkles, Music, Languages, Monitor, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const skills = [
  { title: "Stitching & Tailoring", desc: "Learn basic to advanced stitching techniques", icon: Scissors, videos: 12, color: "from-pink-500 to-rose-400" },
  { title: "Cooking Classes", desc: "Master regional and international cuisines", icon: ChefHat, videos: 18, color: "from-orange-400 to-amber-400" },
  { title: "Beautician Training", desc: "Skincare, makeup & salon skills", icon: Sparkles, videos: 15, color: "from-purple-500 to-violet-400" },
  { title: "Dancing & Singing", desc: "Express yourself through art and music", icon: Music, videos: 20, color: "from-cyan-500 to-blue-400" },
  { title: "Spoken English", desc: "Build confidence in English communication", icon: Languages, videos: 10, color: "from-emerald-500 to-green-400" },
  { title: "Digital Skills", desc: "Computer basics, MS Office, internet skills", icon: Monitor, videos: 14, color: "from-indigo-500 to-blue-400" },
];

const SkillsSection = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-display mb-2">Skill Development</h2>
        <p className="text-muted-foreground">Learn new skills and unlock your potential.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="section-card group cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <skill.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-semibold font-display text-lg mb-1">{skill.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{skill.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{skill.videos} video lessons</span>
              <Button size="sm" variant="outline" className="gap-1 border-primary/30 text-foreground hover:bg-primary/10">
                <Play className="w-3 h-3" /> Start
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
