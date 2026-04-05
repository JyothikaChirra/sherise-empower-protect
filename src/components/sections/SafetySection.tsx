import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Phone, MapPin, Hospital, Shield, PhoneCall, Plus, Trash2, Loader2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SafetySection = () => {
  const { toast } = useToast();
  const [sosTriggered, setSosTriggered] = useState(false);
  const [showFakeCall, setShowFakeCall] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRelation, setNewRelation] = useState("Family");
  const [adding, setAdding] = useState(false);
  const [sosHistory, setSosHistory] = useState<any[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    loadContacts();
    loadSosHistory();
  }, []);

  const loadContacts = async () => {
    const { data } = await supabase
      .from("emergency_contacts")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setContacts(data);
  };

  const loadSosHistory = async () => {
    const { data } = await supabase
      .from("sos_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setSosHistory(data);
  };

  const addContact = async () => {
    if (!newName.trim() || !newPhone.trim()) return;
    setAdding(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("emergency_contacts").insert({
        user_id: user.id,
        name: newName,
        phone: newPhone,
        relationship: newRelation,
      });
      if (error) throw error;
      setNewName("");
      setNewPhone("");
      setShowAddContact(false);
      loadContacts();
      toast({ title: "✅ Contact Added", description: `${newName} added to emergency contacts.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const deleteContact = async (id: string) => {
    await supabase.from("emergency_contacts").delete().eq("id", id);
    loadContacts();
  };

  const handleSOS = async () => {
    setSosTriggered(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let lat: number | null = null;
      let lng: number | null = null;

      // Try to get real location
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          );
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch {
          // Location unavailable, save without coordinates
        }
      }

      await supabase.from("sos_alerts").insert({
        user_id: user.id,
        latitude: lat,
        longitude: lng,
      });

      toast({
        title: "🚨 SOS Alert Recorded!",
        description: lat ? `Location: ${lat.toFixed(4)}, ${lng?.toFixed(4)}. ${contacts.length} emergency contacts on file.` : `Alert saved. ${contacts.length} emergency contacts on file.`,
        variant: "destructive",
      });

      loadSosHistory();
    } catch (err: any) {
      toast({ title: "SOS Alert", description: "Alert triggered locally.", variant: "destructive" });
    }

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
        <motion.div className="section-card flex flex-col items-center justify-center py-12" whileHover={{ scale: 1.02 }}>
          <motion.button
            onClick={handleSOS}
            className={`w-36 h-36 rounded-full gradient-sos text-primary-foreground flex flex-col items-center justify-center shadow-xl ${sosTriggered ? "animate-pulse-glow" : ""}`}
            whileTap={{ scale: 0.95 }}
          >
            <AlertTriangle className="w-10 h-10 mb-1" />
            <span className="text-lg font-bold">SOS</span>
          </motion.button>
          <p className="mt-4 text-sm text-muted-foreground">Tap to send emergency alert</p>
        </motion.div>

        {/* Emergency Contacts + Quick Actions */}
        <div className="space-y-4">
          {/* Emergency Contacts */}
          <div className="section-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold font-display flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" /> Emergency Contacts
              </h3>
              <Button size="sm" variant="outline" className="border-primary/30 text-foreground" onClick={() => setShowAddContact(!showAddContact)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {showAddContact && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2 mb-3 p-3 rounded-xl bg-muted/30">
                <Input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-background" />
                <Input placeholder="Phone number" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="bg-background" />
                <select
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option>Family</option>
                  <option>Friend</option>
                  <option>Colleague</option>
                  <option>Other</option>
                </select>
                <Button size="sm" className="gradient-primary text-primary-foreground" onClick={addContact} disabled={adding}>
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Contact"}
                </Button>
              </motion.div>
            )}

            {contacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No emergency contacts yet. Add one above.</p>
            ) : (
              <div className="space-y-2">
                {contacts.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.phone} • {c.relationship}</p>
                    </div>
                    <button onClick={() => deleteContact(c.id)} className="text-muted-foreground hover:text-destructive p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="section-card">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold font-display">Live Location Sharing</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Share your real-time location with trusted contacts.</p>
            <Button
              variant="outline"
              className="border-primary/30 text-foreground hover:bg-primary/10"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
                      if (navigator.share) {
                        navigator.share({ title: "My Location", url });
                      } else {
                        navigator.clipboard.writeText(url);
                        toast({ title: "📍 Location copied to clipboard!" });
                      }
                    },
                    () => toast({ title: "Location unavailable", variant: "destructive" })
                  );
                }
              }}
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
              onClick={() => { setShowFakeCall(true); setTimeout(() => setShowFakeCall(false), 5000); }}
            >
              Start Fake Call
            </Button>
          </div>
        </div>
      </div>

      {/* Fake Call Modal */}
      {showFakeCall && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="glass-card rounded-3xl p-8 text-center max-w-sm w-full">
            <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center animate-pulse">
              <Phone className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="text-lg font-semibold mb-1">Mom</p>
            <p className="text-sm text-muted-foreground mb-6">Incoming Call...</p>
            <div className="flex gap-4 justify-center">
              <Button className="gradient-primary text-primary-foreground rounded-full px-6" onClick={() => setShowFakeCall(false)}>Answer</Button>
              <Button variant="outline" className="rounded-full px-6 border-destructive text-destructive" onClick={() => setShowFakeCall(false)}>Decline</Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* SOS History */}
      {sosHistory.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold font-display mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> SOS Alert History
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sosHistory.map((alert) => (
              <div key={alert.id} className="section-card text-sm">
                <p className="font-medium">{new Date(alert.created_at).toLocaleString()}</p>
                {alert.latitude && (
                  <p className="text-xs text-muted-foreground mt-1">
                    📍 {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Places */}
      <div>
        <h3 className="text-xl font-semibold font-display mb-4">Nearby Help</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {nearbyPlaces.map((place, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="section-card flex items-center gap-4">
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
