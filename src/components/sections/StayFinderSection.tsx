import { useState } from "react";
import { motion } from "framer-motion";
import { Home, MapPin, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stays = [
  { name: "Sakhi Women's PG", location: "Koramangala, Bangalore", price: 4500, rating: 4.5, safe: true, amenities: ["WiFi", "AC", "Security"] },
  { name: "RoseNest Hostel", location: "Andheri, Mumbai", price: 3500, rating: 4.2, safe: true, amenities: ["WiFi", "Meals", "CCTV"] },
  { name: "GraceLiving PG", location: "Sector 62, Noida", price: 2500, rating: 4.0, safe: true, amenities: ["WiFi", "Laundry"] },
  { name: "ShePod Co-living", location: "Hinjewadi, Pune", price: 6000, rating: 4.8, safe: true, amenities: ["WiFi", "AC", "Gym", "Security"] },
  { name: "LilyPad Hostel", location: "Salt Lake, Kolkata", price: 1800, rating: 3.9, safe: true, amenities: ["Meals", "CCTV"] },
  { name: "NestHer PG", location: "Madhapur, Hyderabad", price: 5500, rating: 4.6, safe: true, amenities: ["WiFi", "AC", "Meals", "Security"] },
];

const priceFilters = ["All", "Below ₹2000", "Below ₹3000", "Below ₹5000", "Below ₹10000"];

const StayFinderSection = () => {
  const [priceFilter, setPriceFilter] = useState("All");

  const getMaxPrice = (filter: string) => {
    if (filter === "Below ₹2000") return 2000;
    if (filter === "Below ₹3000") return 3000;
    if (filter === "Below ₹5000") return 5000;
    if (filter === "Below ₹10000") return 10000;
    return Infinity;
  };

  const filtered = stays.filter((s) => s.price <= getMaxPrice(priceFilter));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-display mb-2">Safe Stay Finder</h2>
        <p className="text-muted-foreground">Women-only PG & hostels you can trust.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {priceFilters.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={priceFilter === f ? "default" : "outline"}
            className={priceFilter === f ? "gradient-primary text-primary-foreground" : "border-primary/30 text-foreground hover:bg-primary/10"}
            onClick={() => setPriceFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((stay, i) => (
          <motion.div
            key={stay.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="section-card"
          >
            <div className="flex items-start justify-between mb-3">
              <Home className="w-8 h-8 text-primary" />
              {stay.safe && (
                <Badge className="gradient-primary text-primary-foreground gap-1 text-xs">
                  <ShieldCheck className="w-3 h-3" /> Safe
                </Badge>
              )}
            </div>
            <h3 className="font-semibold mb-1">{stay.name}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <MapPin className="w-3 h-3" /> {stay.location}
            </div>
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium">{stay.rating}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {stay.amenities.map((a) => (
                <Badge key={a} variant="outline" className="text-xs border-primary/20">{a}</Badge>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-primary font-bold text-lg">₹{stay.price.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/mo</span></p>
              <Button size="sm" variant="outline" className="border-primary/30 text-foreground hover:bg-primary/10">View</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StayFinderSection;
