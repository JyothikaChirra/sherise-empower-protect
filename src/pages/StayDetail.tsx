import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft, ChevronLeft, ChevronRight, MapPin, ShieldCheck, Star,
  Phone, Calendar, Home, Cctv, Shield, Building, Hospital, ShoppingBag,
  Wifi, Wind, UtensilsCrossed, Dumbbell, Car, Zap, Droplets, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { stays } from "@/data/stays";
import { toast } from "sonner";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-4 h-4" />,
  AC: <Wind className="w-4 h-4" />,
  Meals: <UtensilsCrossed className="w-4 h-4" />,
  Gym: <Dumbbell className="w-4 h-4" />,
  Parking: <Car className="w-4 h-4" />,
  "Power Backup": <Zap className="w-4 h-4" />,
  "Hot Water": <Droplets className="w-4 h-4" />,
  "Study Room": <BookOpen className="w-4 h-4" />,
};

const nearbyIcons: Record<string, React.ReactNode> = {
  police: <Shield className="w-4 h-4 text-blue-500" />,
  hospital: <Hospital className="w-4 h-4 text-red-500" />,
  shopping: <ShoppingBag className="w-4 h-4 text-amber-500" />,
};

const StayDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const stay = stays.find((s) => s.id === id);

  if (!stay) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Stay not found</h2>
          <Button onClick={() => navigate("/")} variant="outline">Go Back Home</Button>
        </div>
      </div>
    );
  }

  const nextImage = () => setCurrentImage((p) => (p + 1) % stay.images.length);
  const prevImage = () => setCurrentImage((p) => (p - 1 + stay.images.length) % stay.images.length);

  const handleBook = () => {
    toast.success("Booking request sent! The owner will contact you shortly.", { duration: 4000 });
  };

  const handleCall = () => {
    toast.info(`Calling owner at ${stay.ownerPhone}`, { duration: 3000 });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold truncate">{stay.name}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-muted group"
        >
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={stay.images[currentImage]}
              alt={`${stay.name} - Photo ${currentImage + 1}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
            />
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {stay.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? "bg-white w-5" : "bg-white/50"}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
            {currentImage + 1} / {stay.images.length}
          </div>
        </motion.div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {stay.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === currentImage ? "border-primary ring-2 ring-primary/30" : "border-transparent opacity-60 hover:opacity-100"}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & rating */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{stay.name}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{stay.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-amber-600">{stay.rating}</span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="section-card">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{stay.description}</p>
            </motion.div>

            {/* Safety Features */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="section-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" /> Safety Features
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {stay.safetyFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2 bg-green-500/10 rounded-lg px-3 py-2">
                    <Cctv className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="section-card">
              <h3 className="font-semibold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stay.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 bg-primary/5 rounded-lg px-3 py-2">
                    {amenityIcons[a] || <Home className="w-4 h-4 text-primary" />}
                    <span className="text-sm">{a}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Map */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="section-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Location
              </h3>
              <div className="rounded-xl overflow-hidden border border-border">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${stay.location.lng - 0.01},${stay.location.lat - 0.01},${stay.location.lng + 0.01},${stay.location.lat + 0.01}&layer=mapnik&marker=${stay.location.lat},${stay.location.lng}`}
                  width="100%"
                  height="300"
                  className="border-0"
                  loading="lazy"
                  title={`Map of ${stay.name}`}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stay.address}</p>
            </motion.div>

            {/* Nearby Places */}
            {stay.nearbyPlaces.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="section-card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" /> Nearby Places
                </h3>
                <div className="space-y-2">
                  {stay.nearbyPlaces.map((p) => (
                    <div key={p.name} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        {nearbyIcons[p.type] || <MapPin className="w-4 h-4" />}
                        <span className="text-sm">{p.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{p.distance}</Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Pricing & Actions */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="section-card sticky top-20"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-primary">
                    ₹{stay.price.toLocaleString()}
                    <span className="text-sm text-muted-foreground font-normal">/month</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Security Deposit: ₹{stay.deposit.toLocaleString()}
                  </p>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <Button className="w-full gradient-primary text-primary-foreground" onClick={handleBook}>
                    <Calendar className="w-4 h-4 mr-2" /> Book Now
                  </Button>
                  <Button variant="outline" className="w-full border-primary/30 text-foreground hover:bg-primary/10" onClick={handleCall}>
                    <Phone className="w-4 h-4 mr-2" /> Call Owner
                  </Button>
                </div>

                <div className="border-t border-border pt-4">
                  <Badge className="gradient-primary text-primary-foreground gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Safe Stay
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StayDetail;
