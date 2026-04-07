export interface Stay {
  id: string;
  name: string;
  price: number;
  deposit: number;
  address: string;
  location: { lat: number; lng: number };
  rating: number;
  images: string[];
  safetyFeatures: string[];
  amenities: string[];
  description: string;
  ownerPhone: string;
  nearbyPlaces: { name: string; type: string; distance: string }[];
}

export const stays: Stay[] = [
  {
    id: "sakhi-womens-pg",
    name: "Sakhi Women's PG",
    price: 4500,
    deposit: 5000,
    address: "3rd Cross, 6th Block, Koramangala, Bangalore - 560095",
    location: { lat: 12.9352, lng: 77.6245 },
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800",
    ],
    safetyFeatures: ["Women-Only", "CCTV Surveillance", "24/7 Security Guard", "Biometric Entry"],
    amenities: ["WiFi", "AC", "Security", "Hot Water", "Power Backup"],
    description: "Sakhi Women's PG offers a safe, comfortable, and homely living space exclusively for women. Located in the heart of Koramangala, it provides easy access to IT parks, shopping malls, and public transport. The PG features spacious rooms, home-cooked meals, and round-the-clock security.",
    ownerPhone: "+91 98765 43210",
    nearbyPlaces: [
      { name: "Koramangala Police Station", type: "police", distance: "0.5 km" },
      { name: "Apollo Hospital", type: "hospital", distance: "1.2 km" },
      { name: "Forum Mall", type: "shopping", distance: "0.8 km" },
    ],
  },
  {
    id: "rosenest-hostel",
    name: "RoseNest Hostel",
    price: 3500,
    deposit: 3000,
    address: "14, Link Road, Andheri West, Mumbai - 400053",
    location: { lat: 19.1364, lng: 72.8296 },
    rating: 4.2,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    safetyFeatures: ["Women-Only", "CCTV Surveillance", "Night Curfew", "Warden On-site"],
    amenities: ["WiFi", "Meals", "CCTV", "Laundry", "Common Area"],
    description: "RoseNest Hostel is a budget-friendly women's hostel in the vibrant Andheri area. With nutritious home-cooked meals included, a warm community atmosphere, and strict safety protocols, it's perfect for working women and students.",
    ownerPhone: "+91 98765 12345",
    nearbyPlaces: [
      { name: "Andheri Police Station", type: "police", distance: "0.8 km" },
      { name: "Holy Spirit Hospital", type: "hospital", distance: "1.5 km" },
    ],
  },
  {
    id: "graceliving-pg",
    name: "GraceLiving PG",
    price: 2500,
    deposit: 2000,
    address: "B-47, Sector 62, Noida, UP - 201309",
    location: { lat: 28.6271, lng: 77.3649 },
    rating: 4.0,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
      "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800",
    ],
    safetyFeatures: ["Women-Only", "CCTV Surveillance", "Gated Entry"],
    amenities: ["WiFi", "Laundry", "Power Backup", "RO Water"],
    description: "GraceLiving PG provides affordable accommodation for women in the IT hub of Noida Sector 62. Clean rooms, reliable WiFi, and a peaceful environment make it ideal for professionals and students.",
    ownerPhone: "+91 91234 56789",
    nearbyPlaces: [
      { name: "Sector 58 Police Station", type: "police", distance: "1.0 km" },
      { name: "Fortis Hospital", type: "hospital", distance: "2.0 km" },
    ],
  },
  {
    id: "shepod-coliving",
    name: "ShePod Co-living",
    price: 6000,
    deposit: 8000,
    address: "302, Hinjewadi Phase 1, Pune - 411057",
    location: { lat: 18.5912, lng: 73.7388 },
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800",
    ],
    safetyFeatures: ["Women-Only", "CCTV Surveillance", "24/7 Security Guard", "Smart Lock", "Fire Safety"],
    amenities: ["WiFi", "AC", "Gym", "Security", "Meals", "Housekeeping"],
    description: "ShePod Co-living is a premium women's co-living space in Pune's IT corridor. Featuring modern amenities, a fully-equipped gym, organic meals, and a vibrant community of like-minded women professionals. Experience luxury living with uncompromised safety.",
    ownerPhone: "+91 87654 32109",
    nearbyPlaces: [
      { name: "Hinjewadi Police Station", type: "police", distance: "0.3 km" },
      { name: "Ruby Hall Clinic", type: "hospital", distance: "1.8 km" },
      { name: "Xion Mall", type: "shopping", distance: "1.0 km" },
    ],
  },
  {
    id: "lilypad-hostel",
    name: "LilyPad Hostel",
    price: 1800,
    deposit: 1500,
    address: "12A, CK Block, Salt Lake, Kolkata - 700091",
    location: { lat: 22.5804, lng: 88.4131 },
    rating: 3.9,
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
      "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800",
    ],
    safetyFeatures: ["Women-Only", "CCTV Surveillance", "Night Watchman"],
    amenities: ["Meals", "CCTV", "Common Kitchen", "Study Room"],
    description: "LilyPad Hostel offers the most affordable women's accommodation in Kolkata's Salt Lake area. Ideal for students and job seekers, with wholesome Bengali meals included and a supportive community environment.",
    ownerPhone: "+91 90123 45678",
    nearbyPlaces: [
      { name: "Salt Lake Police Station", type: "police", distance: "0.6 km" },
      { name: "AMRI Hospital", type: "hospital", distance: "1.0 km" },
    ],
  },
  {
    id: "nesther-pg",
    name: "NestHer PG",
    price: 5500,
    deposit: 6000,
    address: "Plot 42, Madhapur, Hyderabad - 500081",
    location: { lat: 17.4483, lng: 78.3915 },
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800",
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800",
    ],
    safetyFeatures: ["Women-Only", "CCTV Surveillance", "24/7 Security Guard", "Intercom System"],
    amenities: ["WiFi", "AC", "Meals", "Security", "Parking", "Hot Water"],
    description: "NestHer PG is a premium women's paying guest accommodation in Hyderabad's tech hub Madhapur. With delicious home-cooked meals, modern amenities, and top-notch security, it feels like a home away from home.",
    ownerPhone: "+91 81234 56789",
    nearbyPlaces: [
      { name: "Madhapur Police Station", type: "police", distance: "0.4 km" },
      { name: "Continental Hospital", type: "hospital", distance: "1.5 km" },
      { name: "Inorbit Mall", type: "shopping", distance: "0.7 km" },
    ],
  },
];
