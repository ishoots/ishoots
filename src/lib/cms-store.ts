import { useEffect, useState } from "react";
import { rtdb } from "./firebase";
import { ref, onValue, set } from "firebase/database";

export interface HeroContent {
  enabled: boolean;
  tagline: string;
  titleLine1: string;
  titleHighlight: string;
  subtitle: string;
  videoUrl: string;
  posterImg: string;
  badges: string[];
  primaryBtnText: string;
  secondaryBtnText: string;
  overlayOpacity?: number;
}

export interface AboutContent {
  enabled: boolean;
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  paragraph1: string;
  paragraph2: string;
  creates: string[];
  covers: string[];
  quote: string;
  quoteSub: string;
  founderName: string;
  founderRole: string;
  founderImg: string;
  stats: { value: string; label: string }[];
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  cat: "Weddings" | "Events" | "Cars" | "Birthdays" | "Restaurants" | "Other";
  span: string; // e.g. "row-span-2" or ""
  enabled: boolean;
  order: number;
}

export interface ReelItem {
  id: string;
  title: string;
  instagramUrl: string; // Original Instagram Reel URL for redirection
  videoUrl: string; // MP4 Reel video URL (used for preview & playback)
  enabled: boolean;
  order: number;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  iconType: "photos" | "video" | "photos_video" | "photos_2video" | "photos_3video" | "custom" | string;
  btnText?: string;
  highlight?: boolean;
  enabled: boolean;
  order: number;
  img?: string;
  features?: string[];
}

export interface GallerySectionConfig {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
}

export interface ReelsSectionConfig {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
}

export interface PricingSectionConfig {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
}

export interface ContactInfo {
  enabled: boolean;
  eyebrow?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  subtitle?: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  location: string;
  hours: string;
}

export interface FooterConfig {
  enabled: boolean;
  logoText: string;
  logoHighlight: string;
  description: string;
  copyrightText: string;
  creditText: string;
}

export interface GlobalSettings {
  faviconUrl: string;
  siteName: string;
}

export interface CMSData {
  global: GlobalSettings;
  hero: HeroContent;
  about: AboutContent;
  galleryHeader?: GallerySectionConfig;
  gallery: GalleryItem[];
  reelsHeader?: ReelsSectionConfig;
  reels: ReelItem[];
  pricingHeader?: PricingSectionConfig;
  pricing: PricingPackage[];
  contact: ContactInfo;
  footer: FooterConfig;
}

export const DEFAULT_CMS_DATA: CMSData = {
  global: {
    faviconUrl: "/logos/Profile Pic Logo.PNG",
    siteName: "ISHOOTS",
  },
  hero: {
    enabled: true,
    tagline: "",
    titleLine1: "Capturing Every",
    titleHighlight: "Special Moment",
    subtitle: "Every smile. Every emotion. Every celebration.\nBeautifully captured forever.",
    videoUrl: "https://www.pexels.com/download/video/30251903/",
    posterImg: "/assets/hero.jpg",
    badges: ["Cinematic Reels", "Creative Edits", "Professional Quality"],
    primaryBtnText: "Book Your Slot",
    secondaryBtnText: "Explore Gallery",
    overlayOpacity: 0.3,
  },
  about: {
    enabled: true,
    eyebrow: "The Studio",
    titlePrefix: "About",
    titleHighlight: "ISHOOTS",
    paragraph1:
      "ISHOOTS is a boutique photography & cinematic videography studio built on one belief — a moment lived is a moment worth immortalising. We don't just take photos; we craft cinematic memories that feel as vivid a decade later as the day they were captured.",
    paragraph2:
      "From the first golden light of a wedding morning to the roaring reveal of a new supercar, every frame is directed, lit and edited with obsessive detail.",
    creates: ["Cinematic Reels", "Professional Photography", "Creative Edits", "Storytelling Videos"],
    covers: [
      "Car Openings",
      "Marriages",
      "Events",
      "Restaurant Openings",
      "Birthday Celebrations",
      "Corporate Events",
      "Private Celebrations",
    ],
    quote: '"Capturing Every Special Moment"',
    quoteSub: "Cinematic Reels · Creative Edits · Professional Quality",
    founderName: "The Lens Behind ISHOOTS",
    founderRole: "Founder · Cinematographer",
    founderImg: "/assets/about.jpg",
    stats: [
      { value: "500+", label: "Projects" },
      { value: "8+", label: "Years" },
      { value: "100%", label: "Passion" },
    ],
  },
  galleryHeader: {
    eyebrow: "Portfolio",
    titlePrefix: "A Curated",
    titleHighlight: "Gallery",
    subtitle: "A glimpse into the stories we've had the privilege of framing.",
  },
  reelsHeader: {
    eyebrow: "Instagram Cinema",
    titlePrefix: "Featured",
    titleHighlight: "Reels",
    subtitle: "Watch cinematic video highlights crafted for social media.",
  },
  pricingHeader: {
    eyebrow: "Investment",
    titlePrefix: "Simple",
    titleHighlight: "Pricing",
    subtitle: "Transparent collections for every celebration. Choose your ideal coverage and book instantly.",
  },
  gallery: [
    { id: "g1", src: "/assets/g1.jpg", title: "Golden Vows", cat: "Weddings", span: "row-span-2", enabled: true, order: 1 },
    { id: "g2", src: "/assets/g2.jpg", title: "Midnight Reveal", cat: "Cars", span: "", enabled: true, order: 2 },
    { id: "g3", src: "/assets/g3.jpg", title: "Sparkler Wishes", cat: "Birthdays", span: "", enabled: true, order: 3 },
    { id: "g4", src: "/assets/g4.jpg", title: "Plated Elegance", cat: "Restaurants", span: "", enabled: true, order: 4 },
    { id: "g5", src: "/assets/g5.jpg", title: "Stage Lights", cat: "Events", span: "row-span-2", enabled: true, order: 5 },
    { id: "g6", src: "/assets/g6.jpg", title: "The Promise", cat: "Weddings", span: "", enabled: true, order: 6 },
  ],
  reels: [
    { id: "r1", videoUrl: "https://www.pexels.com/download/video/30251903/", instagramUrl: "https://instagram.com/ishoots.studio", title: "Wedding Reel", enabled: true, order: 1 },
    { id: "r2", videoUrl: "https://www.pexels.com/download/video/30251903/", instagramUrl: "https://instagram.com/ishoots.studio", title: "Ceremony Moments", enabled: true, order: 2 },
    { id: "r3", videoUrl: "https://www.pexels.com/download/video/30251903/", instagramUrl: "https://instagram.com/ishoots.studio", title: "Party Highlights", enabled: true, order: 3 },
    { id: "r4", videoUrl: "https://www.pexels.com/download/video/30251903/", instagramUrl: "https://instagram.com/ishoots.studio", title: "Stage Performance", enabled: true, order: 4 },
    { id: "r5", videoUrl: "https://www.pexels.com/download/video/30251903/", instagramUrl: "https://instagram.com/ishoots.studio", title: "Supercar Reveal", enabled: true, order: 5 },
    { id: "r6", videoUrl: "https://www.pexels.com/download/video/30251903/", instagramUrl: "https://instagram.com/ishoots.studio", title: "Culinary Cinema", enabled: true, order: 6 },
  ],
  pricing: [
    {
      id: "p1",
      name: "Only Photos",
      price: "₹699",
      description: "High-resolution edited photographs capturing every key moment of your event.",
      iconType: "photos",
      btnText: "Book Now",
      highlight: false,
      enabled: true,
      order: 1,
    },
    {
      id: "p2",
      name: "Only Video",
      price: "₹1999",
      description: "1 Cinematic 4K video reel edit with color grading and background score.",
      iconType: "video",
      btnText: "Book Now",
      highlight: false,
      enabled: true,
      order: 2,
    },
    {
      id: "p3",
      name: "Photos + Video",
      price: "₹2499",
      description: "Complete photography coverage accompanied by 1 cinematic video reel.",
      iconType: "photos_video",
      btnText: "Book Now",
      highlight: true,
      enabled: true,
      order: 3,
    },
    {
      id: "p4",
      name: "Photos + 2 Videos",
      price: "₹2999",
      description: "Full event photography session plus 2 cinematic video reels.",
      iconType: "photos_2video",
      btnText: "Book Now",
      highlight: false,
      enabled: true,
      order: 4,
    },
    {
      id: "p5",
      name: "Photos + 3 Videos",
      price: "₹3699",
      description: "Ultimate luxury coverage with complete photos and 3 cinematic video reels.",
      iconType: "photos_3video",
      btnText: "Book Now",
      highlight: false,
      enabled: true,
      order: 5,
    },
  ],
  contact: {
    enabled: true,
    phone: "+91 99999 99999",
    phoneRaw: "919999999999",
    whatsapp: "919999999999",
    email: "hello@ishoots.studio",
    instagram: "ishoots.studio",
    instagramUrl: "https://instagram.com/ishoots.studio",
    location: "Mumbai, India",
    hours: "Mon – Sat · 10:00 AM – 8:00 PM",
  },
  footer: {
    enabled: true,
    logoText: "I",
    logoHighlight: "SHOOTS",
    description:
      "Cinematic photography & videography studio. Crafting timeless visual stories for the moments that matter most.",
    copyrightText: `© ${new Date().getFullYear()} ISHOOTS. All rights reserved.`,
    creditText: "Aranea Den",
  },
};

const LOCAL_STORAGE_KEY = "ishoots_cms_content_v1";

/**
 * Hook to reactively fetch & sync CMS data across the live website and CMS admin
 */
export function useCMSData(): {
  data: CMSData;
  loading: boolean;
  updateData: (newData: CMSData) => Promise<void>;
  updateReelsSection: (newReels: ReelItem[]) => Promise<void>;
} {
  const [data, setData] = useState<CMSData>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        try {
          return { ...DEFAULT_CMS_DATA, ...JSON.parse(cached) };
        } catch (e) {
          // ignore cache parse error
        }
      }
    }
    return DEFAULT_CMS_DATA;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Firebase Realtime Database Listener
    try {
      const cmsRef = ref(rtdb, "website_content");
      const unsubscribe = onValue(cmsRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const merged = { ...DEFAULT_CMS_DATA, ...val };
          setData(merged);
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          }
        } else {
          // Initialize RTDB with defaults if empty
          set(cmsRef, DEFAULT_CMS_DATA).catch(() => {});
        }
        setLoading(false);
      }, () => {
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setLoading(false);
    }
  }, []);

  const updateData = async (newData: CMSData) => {
    setData(newData);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    }
    try {
      const cmsRef = ref(rtdb, "website_content");
      await set(cmsRef, newData);
    } catch (err) {
      console.warn("Realtime Database sync warning, saved to local cache fallback:", err);
    }
  };

  const updateReelsSection = async (newReels: ReelItem[]) => {
    setData((prev) => {
      const updated = { ...prev, reels: newReels };
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      const reelsRef = ref(rtdb, "website_content/reels");
      await set(reelsRef, newReels);
    } catch (err) {
      console.warn("RTDB reels node update warning:", err);
    }
  };

  return { data, loading, updateData, updateReelsSection };
}

/**
 * Hook to dynamically apply favicon URL changes to document head
 */
export function useFavicon(faviconUrl: string) {
  useEffect(() => {
    if (typeof window === "undefined" || !faviconUrl) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }
    link.href = faviconUrl;
  }, [faviconUrl]);
}

/**
 * Contact Us Form Submissions Interface & Management
 */
export interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  description: string;
  createdAt: string;
}

export async function saveContactSubmission(sub: Omit<ContactSubmission, "id" | "createdAt">) {
  const newSub: ContactSubmission = {
    ...sub,
    id: "sub_" + Date.now(),
    createdAt: new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  if (typeof window !== "undefined") {
    const existingStr = localStorage.getItem("ishoots_contact_submissions") || "[]";
    try {
      const list: ContactSubmission[] = JSON.parse(existingStr);
      list.unshift(newSub);
      localStorage.setItem("ishoots_contact_submissions", JSON.stringify(list));
    } catch (e) {}
  }

  try {
    const subRef = ref(rtdb, `contact_submissions/${newSub.id}`);
    await set(subRef, newSub);
  } catch (err) {
    console.warn("RTDB contact submission save warning:", err);
  }
}

export function useContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("ishoots_contact_submissions");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }
    return [];
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const subsRef = ref(rtdb, "contact_submissions");
      const unsubscribe = onValue(
        subsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            const list: ContactSubmission[] = Object.values(val);
            list.sort((a, b) => b.id.localeCompare(a.id));
            setSubmissions(list);
            if (typeof window !== "undefined") {
              localStorage.setItem("ishoots_contact_submissions", JSON.stringify(list));
            }
          } else {
            setSubmissions([]);
          }
          setLoading(false);
        },
        () => setLoading(false)
      );

      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const deleteSubmission = async (id: string) => {
    setSubmissions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("ishoots_contact_submissions", JSON.stringify(updated));
      }
      return updated;
    });

    try {
      const subRef = ref(rtdb, `contact_submissions/${id}`);
      await set(subRef, null);
    } catch (err) {
      console.warn("RTDB delete submission warning:", err);
    }
  };

  return { submissions, loading, deleteSubmission };
}
