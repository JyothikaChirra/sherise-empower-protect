import { useState, useEffect } from "react";
import { onAuthStateChange, type User } from "@/lib/auth";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Auth />;

  return <Dashboard onLogout={() => setUser(null)} />;
};

export default Index;
