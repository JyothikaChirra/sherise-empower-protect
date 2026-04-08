import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { signOut } from "@/lib/auth";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft, Camera, Edit2, Save, X, LogOut, Shield, Phone, Trash2,
  Plus, AlertTriangle, MapPin, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileData {
  display_name: string | null;
  avatar_url: string | null;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface SOSAlert {
  id: string;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  const [profile, setProfile] = useState<ProfileData>({ display_name: null, avatar_url: null });
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "Family" });
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [editContactData, setEditContactData] = useState({ name: "", phone: "", relationship: "" });

  const [sosAlerts, setSOSAlerts] = useState<SOSAlert[]>([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/"); return; }

      setUserId(user.id);
      setUserEmail(user.email || "");

      const [profileRes, contactsRes, sosRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("emergency_contacts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("sos_alerts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      ]);

      if (profileRes.data) {
        setProfile({ display_name: profileRes.data.display_name, avatar_url: profileRes.data.avatar_url });
        setEditName(profileRes.data.display_name || "");
      }
      if (contactsRes.data) setContacts(contactsRes.data);
      if (sosRes.data) setSOSAlerts(sosRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: editName.trim() })
        .eq("user_id", userId);
      if (error) throw error;
      setProfile((p) => ({ ...p, display_name: editName.trim() }));
      setEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be less than 2MB"); return; }

    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage.from("evidence").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("evidence").getPublicUrl(path);
      const avatarUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("user_id", userId);
      if (updateError) throw updateError;

      setProfile((p) => ({ ...p, avatar_url: avatarUrl }));
      toast.success("Avatar updated!");
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast.error("Name and phone are required"); return;
    }
    try {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .insert({ user_id: userId, name: newContact.name.trim(), phone: newContact.phone.trim(), relationship: newContact.relationship })
        .select()
        .single();
      if (error) throw error;
      setContacts((c) => [data, ...c]);
      setNewContact({ name: "", phone: "", relationship: "Family" });
      setShowAddContact(false);
      toast.success("Contact added!");
    } catch {
      toast.error("Failed to add contact");
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const { error } = await supabase.from("emergency_contacts").delete().eq("id", id);
      if (error) throw error;
      setContacts((c) => c.filter((ct) => ct.id !== id));
      toast.success("Contact deleted");
    } catch {
      toast.error("Failed to delete contact");
    }
  };

  const startEditContact = (contact: EmergencyContact) => {
    setEditingContactId(contact.id);
    setEditContactData({ name: contact.name, phone: contact.phone, relationship: contact.relationship });
  };

  const handleUpdateContact = async () => {
    if (!editingContactId || !editContactData.name.trim() || !editContactData.phone.trim()) {
      toast.error("Name and phone are required"); return;
    }
    try {
      const { error } = await supabase
        .from("emergency_contacts")
        .update({ name: editContactData.name.trim(), phone: editContactData.phone.trim(), relationship: editContactData.relationship })
        .eq("id", editingContactId);
      if (error) throw error;
      setContacts((c) => c.map((ct) =>
        ct.id === editingContactId
          ? { ...ct, name: editContactData.name.trim(), phone: editContactData.phone.trim(), relationship: editContactData.relationship }
          : ct
      ));
      setEditingContactId(null);
      toast.success("Contact updated!");
    } catch {
      toast.error("Failed to update contact");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-bold font-display gradient-text">My Profile</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20" />
            <CardContent className="relative pt-0 pb-6 px-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-muted flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-primary">
                        {(profile.display_name || userEmail)?.[0]?.toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  {editing ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your name" className="max-w-xs" />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveProfile} disabled={saving} className="gradient-primary text-primary-foreground">
                          <Save className="w-4 h-4 mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setEditName(profile.display_name || ""); }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h2 className="text-xl font-bold text-foreground">{profile.display_name || "User"}</h2>
                      <button onClick={() => setEditing(true)} className="p-1 rounded-md hover:bg-muted transition-colors">
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">{userEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" /> Emergency Contacts
              </CardTitle>
              <Button size="sm" variant="outline" onClick={() => setShowAddContact(!showAddContact)}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {showAddContact && (
                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <Input placeholder="Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
                  <Input placeholder="Phone" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} />
                  <select
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option>Family</option>
                    <option>Friend</option>
                    <option>Colleague</option>
                    <option>Other</option>
                  </select>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddContact} className="gradient-primary text-primary-foreground">Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowAddContact(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              {contacts.length === 0 && !showAddContact && (
                <p className="text-sm text-muted-foreground text-center py-4">No emergency contacts yet. Add one above.</p>
              )}

              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  {editingContactId === contact.id ? (
                    <div className="flex-1 space-y-2">
                      <Input value={editContactData.name} onChange={(e) => setEditContactData({ ...editContactData, name: e.target.value })} />
                      <Input value={editContactData.phone} onChange={(e) => setEditContactData({ ...editContactData, phone: e.target.value })} />
                      <select
                        value={editContactData.relationship}
                        onChange={(e) => setEditContactData({ ...editContactData, relationship: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option>Family</option>
                        <option>Friend</option>
                        <option>Colleague</option>
                        <option>Other</option>
                      </select>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateContact} className="gradient-primary text-primary-foreground">Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingContactId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-medium text-foreground">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.phone} · {contact.relationship}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => startEditContact(contact)} className="p-1.5 rounded-md hover:bg-muted transition-colors">
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => handleDeleteContact(contact.id)} className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent SOS Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" /> Recent SOS Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sosAlerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No SOS alerts recorded.</p>
              ) : (
                <div className="space-y-2">
                  {sosAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                      <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(alert.created_at).toLocaleString()}
                        </p>
                        {alert.latitude && alert.longitude && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
