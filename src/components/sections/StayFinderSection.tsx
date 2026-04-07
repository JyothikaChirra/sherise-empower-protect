import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MapPin, ShieldCheck, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { stays } from "@/data/stays";

const priceFilters = ["All", "Below ₹2000", "Below ₹3000", "Below ₹5000", "Below ₹10000"];

const StayFinderSection = () => {
  const [priceFilter, setPriceFilter] = useState("All");
  const navigate = useNavigate();

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
            key={stay.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="section-card overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/stay/${stay.id}`)}
          >
            {/* Thumbnail */}
            <div className="relative -mx-4 -mt-4 mb-3 h-40 overflow-hidden">
              <img
                src={stay.images[0]}
                alt={stay.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {stay.safetyFeatures.includes("Women-Only") && (
                <Badge className="absolute top-2 right-2 gradient-primary text-primary-foreground gap-1 text-xs">
                  <ShieldCheck className="w-3 h-3" /> Safe
                </Badge>
              )}
            </div>

            <h3 className="font-semibold mb-1">{stay.name}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <MapPin className="w-3 h-3" /> {stay.address.split(",").slice(0, 2).join(",")}
            </div>
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium">{stay.rating}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {stay.amenities.slice(0, 4).map((a) => (
                <Badge key={a} variant="outline" className="text-xs border-primary/20">{a}</Badge>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-primary font-bold text-lg">₹{stay.price.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/mo</span></p>
              <Button size="sm" className="gradient-primary text-primary-foreground gap-1">
                <Eye className="w-3.5 h-3.5" /> View
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StayFinderSection;
