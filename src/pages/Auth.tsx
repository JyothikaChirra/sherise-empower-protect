import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Shield } from "lucide-react";
import { loginUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface AuthProps {
  onAuth: () => void;
}

const Auth = ({ onAuth }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(email, password, isLogin ? undefined : name);
    onAuth();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-30 blur-3xl gradient-primary" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl bg-accent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold font-display gradient-text">SheRise</h1>
            </div>
            <p className="text-muted-foreground text-sm">Empower. Protect. Rise.</p>
            <p className="text-muted-foreground text-xs mt-2 italic">
              "Your safety matters. Let's rise together."
            </p>
          </div>

          {/* Toggle */}
          <div className="flex rounded-xl bg-muted p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                isLogin ? "gradient-primary text-primary-foreground shadow-md" : "text-muted-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                !isLogin ? "gradient-primary text-primary-foreground shadow-md" : "text-muted-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-muted/50 border-border/50"
                    required
                  />
                </div>
              </motion.div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-muted/50 border-border/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-xs text-muted-foreground">Remember me</label>
                </div>
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
