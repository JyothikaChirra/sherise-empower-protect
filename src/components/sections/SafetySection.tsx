import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Phone, MapPin, Hospital, Shield, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SafetySection = () => {
  const { toast } = useToast();
  const [sosTriggered, setSosTriggered] = useState(false);
  const [showFakeCall, setShowFakeCall] = useState(false);

  const handleSOS = () => {
    setSosTriggered(true);
    toast({
      title: "🚨 SOS Alert Sent!",
      description: "Emergency contacts notified with your location.",
      variant: "destructive",
    });
    setTimeout(() => setSosTriggered(false), 3000);
  };

  const nearbyPlaces = [
    { name: "Central Police Station", type: "police", distance: "0.8 km", icon: Shield },
    { name: "City Hospital", type: "hospital", distance: "1.2 km", icon: Hospital },
    { name: "Women's Help Center", type: "help", distance: "1.5 km", icon: Phone },
    { name: "District Police HQ", type: "police", distance: "2.1 km", icon: Shield },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-display mb-2">Emergency & Safety</h2>
        <p className="text-muted-foreground">One tap to stay safe. We've got your back.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* SOS Button */}
        <motion.div
          className="section-card flex flex-col items-center justify-center py-12"
          whileHover={{ scale: 1.02 }}
        >
          <motion.button
            onClick={handleSOS}
            className={`w-36 h-36 rounded-full gradient-sos text-primary-foreground flex flex-col items-center justify-center shadow-xl ${
              sosTriggered ? "animate-pulse-glow" : ""
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <AlertTriangle className="w-10 h-10 mb-1" />
            <span className="text-lg font-bold">SOS</span>
          </motion.button>
          <p className="mt-4 text-sm text-muted-foreground">Tap to send emergency alert</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="section-card">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold font-display">Live Location Sharing</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Share your real-time location with trusted contacts.</p>
            <Button
              variant="outline"
              className="border-primary/30 text-foreground hover:bg-primary/10"
              onClick={() => toast({ title: "📍 Location sharing started" })}
            >
              Share Location
            </Button>
          </div>

          <div className="section-card">
            <div className="flex items-center gap-3 mb-3">
              <PhoneCall className="w-5 h-5 text-primary" />
              <h3 className="font-semibold font-display">Fake Call</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Trigger a fake incoming call to exit unsafe situations.</p>
            <Button
              variant="outline"
              className="border-primary/30 text-foreground hover:bg-primary/10"
              onClick={() => {
                setShowFakeCall(true);
                setTimeout(() => setShowFakeCall(false), 5000);
              }}
            >
              Start Fake Call
            </Button>
          </div>
        </div>
      </div>

      {/* Fake Call Modal */}
      {showFakeCall && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
        >
          <div className="glass-card rounded-3xl p-8 text-center max-w-sm w-full">
            <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center animate-pulse">
              <Phone className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="text-lg font-semibold mb-1">Mom</p>
            <p className="text-sm text-muted-foreground mb-6">Incoming Call...</p>
            <div className="flex gap-4 justify-center">
              <Button className="gradient-primary text-primary-foreground rounded-full px-6" onClick={() => setShowFakeCall(false)}>
                Answer
              </Button>
              <Button variant="outline" className="rounded-full px-6 border-destructive text-destructive" onClick={() => setShowFakeCall(false)}>
                Decline
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Nearby Places */}
      <div>
        <h3 className="text-xl font-semibold font-display mb-4">Nearby Help</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {nearbyPlaces.map((place, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="section-card flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <place.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{place.name}</p>
                <p className="text-xs text-muted-foreground">{place.distance}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SafetySection;
