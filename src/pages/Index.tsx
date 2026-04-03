import { useState, useEffect } from "react";
import { getUser } from "@/lib/auth";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!getUser());
  }, []);

  if (!isAuthenticated) {
    return <Auth onAuth={() => setIsAuthenticated(true)} />;
  }

  return <Dashboard onLogout={() => setIsAuthenticated(false)} />;
};

export default Index;
