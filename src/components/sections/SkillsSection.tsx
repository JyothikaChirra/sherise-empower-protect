import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, ChefHat, Sparkles, Music, Languages, Monitor, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const skills = [
  {
    title: "Stitching & Tailoring",
    desc: "Learn basic to advanced stitching techniques",
    icon: Scissors,
    color: "from-pink-500 to-rose-400",
    videos: [
      { title: "How to Hand Sew an Invisible Stitch", id: "WbE5hXt27uU" },
      { title: "Beginners Sewing Course - The Basics", id: "IGITrkYdjJs" },
      { title: "Basic Embroidery Techniques", id: "4tboUqTV41U" },
    ],
  },
  {
    title: "Cooking Classes",
    desc: "Master regional and international cuisines",
    icon: ChefHat,
    color: "from-orange-400 to-amber-400",
    videos: [
      { title: "Beginner's Guide to Spices for Indian Cooking", id: "FztdLxp01WA" },
      { title: "How I Cook 20 Healthy Meals in 1 Hour", id: "LzWb_P4lYgA" },
      { title: "Healthy Meal Prep That Actually Tastes Good", id: "n8dAvpqE0M4" },
    ],
  },
  {
    title: "Beautician Training",
    desc: "Skincare, makeup & salon skills",
    icon: Sparkles,
    color: "from-purple-500 to-violet-400",
    videos: [
      { title: "10 Minute Makeup Tutorial for Beginners", id: "6kFhFMB-DQg" },
      { title: "Natural Everyday Makeup Tutorial", id: "5vSHFSFRdx8" },
      { title: "Easy Hairstyles for Beginners", id: "CIwzw1BgSaQ" },
    ],
  },
  {
    title: "Dancing & Singing",
    desc: "Express yourself through art and music",
    icon: Music,
    color: "from-cyan-500 to-blue-400",
    videos: [
      { title: "12 Basic Bollywood Dance Moves", id: "ZC0zn5KRsfI" },
      { title: "Beginner Bollywood Dance Moves", id: "SsGtNa3Oo3Y" },
      { title: "Beginner Singing Lessons", id: "WH_OV7yEDf4" },
    ],
  },
  {
    title: "Spoken English",
    desc: "Build confidence in English communication",
    icon: Languages,
    color: "from-emerald-500 to-green-400",
    videos: [
      { title: "English Speaking Practice", id: "BbEE2XYUoRk" },
      { title: "Everyday English Conversation Practice", id: "henIVlCPVIY" },
      { title: "Improve English Speaking Fluency", id: "vHBrMxIEEwY" },
    ],
  },
  {
    title: "Digital Skills",
    desc: "Computer basics, MS Office, internet skills",
    icon: Monitor,
    color: "from-indigo-500 to-blue-400",
    videos: [
      { title: "Computer Basics for Absolute Beginners", id: "y2kg3MOk1sY" },
      { title: "Excel Full Course Tutorial", id: "rro5t8eHXaY" },
      { title: "Microsoft Word Tutorial for Beginners", id: "5Im87VPQZ_0" },
    ],
  },
];

const SkillsSection = () => {
  const [selectedSkill, setSelectedSkill] = useState<typeof skills[0] | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const openSkill = (skill: typeof skills[0]) => {
    setSelectedSkill(skill);
    setPlayingVideo(skill.videos[0]?.id ?? null);
  };

  const closeSkill = () => {
    setSelectedSkill(null);
    setPlayingVideo(null);
  };

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
            onClick={() => openSkill(skill)}
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <skill.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-semibold font-display text-lg mb-1">{skill.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{skill.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{skill.videos.length} video lessons</span>
              <Button size="sm" variant="outline" className="gap-1 border-primary/30 text-foreground hover:bg-primary/10">
                <Play className="w-3 h-3" /> Watch
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4"
            onClick={closeSkill}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedSkill.color} flex items-center justify-center`}>
                    <selectedSkill.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold font-display">{selectedSkill.title}</h3>
                </div>
                <button
                  onClick={closeSkill}
                  className="p-2 rounded-xl hover:bg-muted/60 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {playingVideo && (
                <div className="mb-6 space-y-3">
                  <div className="rounded-2xl overflow-hidden bg-black aspect-video">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${playingVideo}?autoplay=1&rel=0&modestbranding=1`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {selectedSkill.videos.map((video, idx) => (
                  <button
                    key={video.id}
                    onClick={() => setPlayingVideo(video.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${
                      playingVideo === video.id
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted/60 border border-transparent"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title}
                        loading="lazy"
                        className="w-28 h-16 rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-foreground/70 flex items-center justify-center">
                          <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{video.title}</p>
                      <p className="text-xs text-muted-foreground">Lesson {idx + 1}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsSection;
