import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SafetySection from "@/components/sections/SafetySection";
import HarassmentSection from "@/components/sections/HarassmentSection";
import ScholarshipsSection from "@/components/sections/ScholarshipsSection";
import JobsSection from "@/components/sections/JobsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import StayFinderSection from "@/components/sections/StayFinderSection";
import ChatbotSection from "@/components/sections/ChatbotSection";
import MyApplications from "@/components/sections/MyApplications";

interface DashboardProps {
  onLogout: () => void;
}

const sections = [
  { id: "Safety", component: SafetySection },
  { id: "Harassment Detection", component: HarassmentSection },
  { id: "Scholarships", component: ScholarshipsSection },
  { id: "Jobs", component: JobsSection },
  { id: "My Applications", component: MyApplications },
  { id: "Skills", component: SkillsSection },
  { id: "Stay Finder", component: StayFinderSection },
  { id: "AI Assistant", component: ChatbotSection },
];

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeSection, setActiveSection] = useState("");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    sectionRefs.current[section]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLogout={onLogout} activeSection={activeSection} onNavigate={handleNavigate} />
      <HeroSection onNavigate={handleNavigate} />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
        {sections.map(({ id, component: Component }) => (
          <div
            key={id}
            ref={(el) => { sectionRefs.current[id] = el; }}
            className="scroll-mt-20"
          >
            <Component />
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Made with 💜 for women everywhere • <span className="gradient-text font-semibold">SheRise</span> © 2025
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
