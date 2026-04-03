import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const demoResponses: Record<string, string> = {
  default: `Based on your interest, here are some suggestions:\n\n**Recommended Careers:**\n- Digital Marketing Specialist\n- Content Writer\n- Data Analyst\n\n**Learning Path:**\n1. Start with free online courses on Coursera/Udemy\n2. Build a portfolio with personal projects\n3. Apply for internships\n\nWould you like more specific guidance?`,
  "10th": `Great! After 10th class, here are your options:\n\n**Streams:**\n- **Science (PCM/PCB)** → Engineering, Medicine\n- **Commerce** → CA, BBA, Banking\n- **Arts/Humanities** → Law, Journalism, Design\n\n**Vocational Courses:**\n- ITI courses (Electrician, Fashion Design)\n- Diploma in Nursing\n- Beautician certification\n\nWhat interests you the most?`,
  "12th": `After 12th, exciting paths await!\n\n**If Science:** B.Tech, MBBS, B.Sc, BCA\n**If Commerce:** B.Com, BBA, CA, CS\n**If Arts:** BA, BFA, Law, Journalism\n\n**Skill-based options:**\n- Web Development Bootcamp (3-6 months)\n- Digital Marketing Certificate\n- Graphic Design Course\n\nTell me your stream and interests!`,
  graduate: `For graduates, here are top career paths:\n\n**Tech:** Software Dev, Data Science, UI/UX\n**Business:** MBA, Startup, Consulting\n**Creative:** Content, Design, Social Media\n**Government:** UPSC, SSC, Banking\n\n**Quick upskill ideas:**\n- Python programming (3 months)\n- Google Analytics certification\n- Advanced Excel + SQL\n\nWhat's your degree in?`,
};

const ChatbotSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! 👋 I'm your AI Career Guide. Tell me your qualification (10th, 12th, graduate, etc.) and I'll suggest careers, job roles, and a learning path for you!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const lower = input.toLowerCase();
    let response = demoResponses.default;
    if (lower.includes("10th") || lower.includes("10")) response = demoResponses["10th"];
    else if (lower.includes("12th") || lower.includes("12")) response = demoResponses["12th"];
    else if (lower.includes("graduat") || lower.includes("degree") || lower.includes("b.tech") || lower.includes("bsc")) response = demoResponses.graduate;

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-display mb-2">AI Career Guide</h2>
        <p className="text-muted-foreground">Get personalized career advice based on your qualifications.</p>
      </div>

      <div className="max-w-2xl mx-auto section-card flex flex-col" style={{ height: "500px" }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "assistant" ? "gradient-primary" : "bg-muted"
              }`}>
                {msg.role === "assistant" ? <Bot className="w-4 h-4 text-primary-foreground" /> : <User className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user" ? "gradient-primary text-primary-foreground" : "bg-muted/80"
              }`}>
                <div className="whitespace-pre-line">{msg.content}</div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted/80 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-border/50 p-4 flex gap-2">
          <Input
            placeholder="Tell me your qualification..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="bg-muted/30"
          />
          <Button className="gradient-primary text-primary-foreground hover:opacity-90 shrink-0" onClick={handleSend} disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotSection;
