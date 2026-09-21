import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authFetch } from "../src/api";

export type ProviderData = {
  id: string;
  catId: string;
  name: string;
  specialty?: string;
  title?: string;
  rating: number;
  reviews: number;
  experience: string;
  startingAt: string;
  verified: boolean;
  image: string;
  coverImage?: string;
  about?: string;
  serviceCategories?: { icon: string; label: string }[];
  completedJobs?: number;
  reviews_list?: {
    id: string;
    name: string;
    rating: number;
    text: string;
    startingAt: string;
    date: string;
    avatar: string;
  }[];
};

type ProvidersContextType = {
  providers: ProviderData[];
  addProvider: (provider: ProviderData) => void;
};

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined);

const DEFAULT_PROVIDERS: ProviderData[] = [
  {
    id: "1",
    catId: "1",
    name: "Sarah Jenkins",
    specialty: "Deep Cleaning, Standard",
    title: "Master Plumber & Pipe Specialist",
    rating: 4.9,
    reviews: 732,
    experience: "5 Years",
    startingAt: "₹207/hr",
    verified: true,
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
    about: "With over 5 years of experience in residential and commercial plumbing, I specialize in leak detection, pipe repair, and complete bathroom renovations. My commitment is to provide clean, efficient, and long-lasting solutions to keep your home running smoothly. Fully licensed and insured for your peace of mind.",
    completedJobs: 320,
    serviceCategories: [
      { icon: "water-pump", label: "Leak Detection" },
      { icon: "pipe", label: "Pipe Repairs" },
      { icon: "water-boiler", label: "Water Heaters" },
      { icon: "pipe-disconnected", label: "Drain Cleaning" },
      { icon: "faucet", label: "Fixture Install" },
    ],
    reviews_list: [
      {
        id: "1",
        name: "Sarah Jenkins",
        rating: 5,
        text: '"John was absolutely professional and fixed our sink leak in under an hour. Left the work area spotless!"',
        startingAt: "₹85/hr",
        date: "2 days ago",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      }
    ],
  },
  {
    id: "2",
    catId: "1",
    name: "Michael Chang",
    specialty: "Eco-Friendly, Move-Out",
    title: "Eco-Friendly Cleaning Expert",
    rating: 4.8,
    reviews: 410,
    experience: "2 Years",
    startingAt: "₹257/hr",
    verified: true,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
    about: "Specializing in eco-friendly cleaning products and techniques, I ensure your home is spotless while being kind to the environment. From move-out deep cleans to regular maintenance, I handle it all.",
    completedJobs: 198,
    serviceCategories: [
      { icon: "broom", label: "Deep Cleaning" },
      { icon: "window-closed", label: "Window Cleaning" },
      { icon: "sofa", label: "Upholstery" },
      { icon: "silverware-clean", label: "Kitchen Clean" },
      { icon: "home-city", label: "Move-Out" },
    ],
    reviews_list: [],
  },
  {
    id: "3",
    catId: "2",
    name: "Elite Sparkle Team",
    specialty: "Eco-Friendly, Post-Construction",
    rating: 4.8,
    reviews: 312,
    experience: "8 Years",
    startingAt: "₹407/hr",
    verified: true,
    image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "4",
    catId: "3",
    name: "Priya Sharma",
    specialty: "AC Service, General Repairs",
    rating: 4.7,
    reviews: 258,
    experience: "3 Years",
    startingAt: "₹199/hr",
    verified: true,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  },
];

export function ProvidersProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<ProviderData[]>([]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const data = await authFetch('/providers');
      setProviders(data.providers || []);
    } catch (error) {
      console.log("[ProvidersContext] Error fetching providers:", error);
      // Fallback to DEFAULT_PROVIDERS if API fails
      setProviders(DEFAULT_PROVIDERS);
    }
  };

  const addProvider = (provider: ProviderData) => {
    setProviders((prev) => [provider, ...prev]);
  };

  return (
    <ProvidersContext.Provider value={{ providers, addProvider }}>
      {children}
    </ProvidersContext.Provider>
  );
}

export function useProviders() {
  const ctx = useContext(ProvidersContext);
  if (!ctx) throw new Error("useProviders must be used within a ProvidersProvider");
  return ctx;
}
