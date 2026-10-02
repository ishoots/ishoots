import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Camera, Film, Sparkles, Play, ChevronDown, Instagram, Phone, Mail,
  MapPin, Clock, MessageCircle, Send, X, ArrowUpRight, Check, Star, Menu, Video,
} from "lucide-react";

import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import araneaLogo from "@/assets/aranea-den-logo.jpeg";

import {
  useCMSData, saveContactSubmission, CMSData, GalleryItem, ReelItem, PricingPackage,
  ContactInfo, FooterConfig, GallerySectionConfig, ReelsSectionConfig, PricingSectionConfig,
  DEFAULT_CMS_DATA,
} from "@/lib/cms-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ISHOOTS — Cinematic Photography & Videography Studio" },
      {
        name: "description",
        content:
          "ISHOOTS is a premium photography and cinematic videography studio capturing weddings, events, car reveals, birthdays, restaurant launches and corporate stories with editorial quality.",
      },
      { property: "og:title", content: "ISHOOTS — Cinematic Photography & Videography" },
      {
        property: "og:description",
        content:
          "Every smile. Every emotion. Every celebration. Beautifully captured forever.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ISHOOTS — Cinematic Photography & Videography" },
      {
        name: "twitter:description",
        content: "Premium wedding, event & brand cinematography.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "ISHOOTS",
          description: "Premium photography & cinematic videography studio.",
          telephone: "+91 99999 99999",
          email: "hello@ishoots.studio",
          address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressCountry: "IN" },
          sameAs: ["https://instagram.com/ishoots.studio"],
        }),
      },
    ],
  }),
  component: Home,
});

// === REVEAL HOOK ===
function useReveal(dep?: any) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-right");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-visible");
      } else {
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, [dep]);
}

// === NAV ===
const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "gallery", label: "Photo Gallery" },
  { id: "pricing", label: "Pricing" },
  { id: "contact", label: "Contact Us" },
];

function Navbar({ footerData }: { footerData: FooterConfig }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/90 backdrop-blur border-b border-[#99000D]/10 py-3 shadow-sm" : "py-6"
      }`}
    >
      <div className="mx-auto flex max-w-[1800px] w-full items-center justify-between px-6 md:px-10 lg:px-12">
        <button onClick={() => go("home")} className="group flex items-center gap-2">
          <span className="font-display text-2xl tracking-widest text-[#121110]">
            {footerData.logoText || "I"}<span className="gold-text">{footerData.logoHighlight || "SHOOTS"}</span>
          </span>
        </button>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`relative text-[13px] tracking-[0.18em] uppercase transition-colors ${
                active === n.id ? "text-[#99000D] font-semibold" : "text-[#5A5650] hover:text-[#121110]"
              }`}
            >
              {n.label}
              <span
                className={`absolute -bottom-2 left-0 h-0.5 w-full origin-left bg-[#99000D] transition-transform duration-500 ${
                  active === n.id ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => go("contact")}
            className="btn-gold hidden rounded-full px-5 py-2.5 text-[12px] tracking-[0.15em] uppercase lg:inline-flex lg:items-center lg:gap-2"
          >
            Book Your Slot <ArrowUpRight size={14} />
          </button>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#99000D]/40 text-[#99000D] lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="bg-white/95 border border-[#99000D]/15 shadow-xl mx-6 mt-3 rounded-2xl p-6 lg:hidden">
          <div className="flex flex-col gap-4">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`text-left text-sm tracking-widest uppercase ${
                  active === n.id ? "text-[#99000D] font-semibold" : "text-[#5A5650]"
                }`}
              >
                {n.label}
              </button>
            ))}
            <button
              onClick={() => go("contact")}
              className="btn-gold mt-2 rounded-full px-5 py-3 text-xs tracking-widest uppercase"
            >
              Book Your Slot →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// === HERO ===
function Hero({ data }: { data: CMSData["hero"] }) {
  if (!data.enabled) return null;
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const poster = data.posterImg || heroImg;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch(() => {});
    }
  }, [data.videoUrl]);

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFA]">
      {data.videoUrl ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none opacity-100"
          style={{
            transform: "translateZ(0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <source src={data.videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 animate-zoom-slow bg-cover bg-center opacity-100"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      {/* Dynamic Overlay Controlled via CMS Admin */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: data.overlayOpacity !== undefined ? data.overlayOpacity : 0.3,
          background: "linear-gradient(180deg, rgba(250,250,250,0.1) 0%, rgba(250,250,250,0.7) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {data.tagline ? (
          <div
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#99000D]/30 bg-white/80 px-5 py-2 text-[11px] tracking-[0.3em] uppercase text-[#99000D] shadow-sm backdrop-blur"
            style={{ animation: "fadeUp 1s .1s both" }}
          >
            <Sparkles size={12} /> {data.tagline}
          </div>
        ) : null}

        <h1
          className="font-display text-white drop-shadow-md"
          style={{ animation: "fadeUp 1.1s .25s both", fontSize: "clamp(2.75rem, 7vw, 6.5rem)", lineHeight: 1.02, letterSpacing: "-0.03em" }}
        >
          {data.titleLine1 || "Capturing Every"}
          <br />
          <span className="italic gold-text">{data.titleHighlight || "Special Moment"}</span>
        </h1>

        <p
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white drop-shadow-md md:text-lg whitespace-pre-line font-medium"
          style={{ animation: "fadeUp 1.1s .45s both" }}
        >
          {data.subtitle || "Every smile. Every emotion. Every celebration.\nBeautifully captured forever."}
        </p>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] tracking-[0.35em] uppercase text-white drop-shadow-md font-semibold"
          style={{ animation: "fadeUp 1.1s .6s both" }}
        >
          {(data.badges || ["Cinematic Reels", "Creative Edits", "Professional Quality"]).map((badge, idx) => (
            <span key={badge + idx} className="flex items-center gap-2">
              {idx > 0 && <span className="text-[#BE121D] mr-6">•</span>}
              <Sparkles size={14} className="text-[#BE121D]" /> {badge}
            </span>
          ))}
        </div>

        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
          style={{ animation: "fadeUp 1.1s .75s both" }}
        >
          <button
            onClick={() => scrollTo("gallery")}
            className="btn-ghost-gold rounded-full px-8 py-4 text-[12px] tracking-[0.2em] uppercase bg-white/80 shadow-sm"
          >
            {data.secondaryBtnText || "Explore Gallery"}
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="btn-gold flex items-center gap-2 rounded-full px-8 py-4 text-[12px] tracking-[0.2em] uppercase"
          >
            {data.primaryBtnText || "Book Your Slot"} <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      <button
        onClick={() => scrollTo("about")}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white drop-shadow-md hover:text-[#BE121D]"
        style={{ animation: "fadeUp 1.1s 1s both" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.4em] uppercase font-semibold">Scroll</span>
          <ChevronDown className="animate-bounce text-[#BE121D]" size={20} />
        </div>
      </button>
    </section>
  );
}

// === ABOUT ===
function About({ data }: { data: CMSData["about"] }) {
  if (!data.enabled) return null;
  const creates = data.creates || ["Cinematic Reels", "Professional Photography", "Creative Edits", "Storytelling Videos"];
  const covers = data.covers || ["Car Openings", "Marriages", "Events", "Restaurant Openings", "Birthday Celebrations", "Corporate Events", "Private Celebrations"];
  const imageSrc = data.founderImg || aboutImg;

  return (
    <section id="about" className="relative overflow-hidden bg-background py-32">
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(153,0,13,0.12), transparent 70%)" }} />
      <div className="mx-auto grid max-w-[1800px] w-full gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24 lg:px-12">
        <div className="reveal-left">
          <span className="eyebrow">{data.eyebrow || "The Studio"}</span>
          <h2 className="section-title mt-6 text-[#121110]">
            {data.titlePrefix || "About"} <span className="italic gold-text">{data.titleHighlight || "ISHOOTS"}</span>
          </h2>
          <p className="mt-8 text-[#5A5650] leading-relaxed">
            {data.paragraph1}
          </p>
          <p className="mt-4 text-[#5A5650] leading-relaxed">
            {data.paragraph2}
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm tracking-[0.3em] uppercase text-[#99000D] font-semibold">We Create</h3>
              <ul className="mt-5 space-y-3">
                {creates.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-[#121110] font-medium">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#99000D]/40 bg-[#99000D]/10">
                      <Check size={11} className="text-[#99000D]" />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm tracking-[0.3em] uppercase text-[#99000D] font-semibold">We Cover</h3>
              <ul className="mt-5 space-y-3">
                {covers.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-[#121110] font-medium">
                    <span className="h-1 w-3 shrink-0 bg-[#99000D]" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-[#99000D]/20 bg-white p-6 shadow-luxury">
            <p className="font-display text-2xl italic text-[#121110]">
              {data.quote || '"Capturing Every Special Moment"'}
            </p>
            <p className="mt-3 text-xs tracking-[0.3em] uppercase text-[#5A5650] font-medium">
              {data.quoteSub || "Cinematic Reels · Creative Edits · Professional Quality"}
            </p>
          </div>
        </div>

        <div className="reveal-right relative">
          <div className="relative mx-auto max-w-md animate-floaty">
            <div className="absolute -inset-4 rounded-[2rem]"
              style={{ background: "var(--gradient-gold)", filter: "blur(50px)", opacity: 0.2 }} />
            <div className="relative overflow-hidden rounded-[2rem] border border-[#99000D]/25 bg-white"
              style={{ boxShadow: "var(--shadow-luxury)" }}>
              <img
                src={imageSrc}
                alt="ISHOOTS Founder & Lead Cinematographer"
                width={1000}
                height={1300}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#121110]/95 via-[#121110]/50 to-transparent p-6 text-white">
                <p className="font-display text-xl text-white font-semibold">{data.founderName || "The Lens Behind ISHOOTS"}</p>
                <p className="mt-1 text-xs tracking-[0.25em] uppercase text-[#BE121D] font-bold">{data.founderRole || "Founder · Cinematographer"}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {(data.stats || [["500+", "Projects"], ["8+", "Years"], ["100%", "Passion"]]).map((st: any) => {
              const val = typeof st === "object" ? st.value : st[0];
              const lbl = typeof st === "object" ? st.label : st[1];
              return (
                <div key={lbl} className="rounded-xl border border-[#99000D]/15 bg-white p-4 shadow-sm">
                  <p className="font-display text-2xl gold-text font-bold">{val}</p>
                  <p className="mt-1 text-[10px] tracking-[0.25em] uppercase text-[#5A5650] font-medium">{lbl}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// === GALLERY ===
function Gallery({
  header,
  reelsHeader,
  items,
  reels,
  contact,
}: {
  header?: GallerySectionConfig;
  reelsHeader?: ReelsSectionConfig;
  items: GalleryItem[];
  reels: ReelItem[];
  contact: ContactInfo;
}) {
  const [cat, setCat] = useState<string>("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const activeItems = useMemo(
    () => items.filter((i) => i.enabled && (cat === "All" || i.cat === cat)),
    [items, cat]
  );

  const categories = useMemo(() => {
    const setCats = new Set<string>(["All"]);
    items.forEach((i) => i.enabled && setCats.add(i.cat));
    return Array.from(setCats);
  }, [items]);

  return (
    <section id="gallery" className="relative bg-[#F4F1EA] py-32">
      <div className="mx-auto max-w-[1800px] w-full px-6 md:px-10 lg:px-12">
        <div className="reveal flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <span className="eyebrow">{header?.eyebrow || "Portfolio"}</span>
            <h2 className="section-title mt-6 text-[#121110]">
              {header?.titlePrefix || "A Curated"}{" "}
              <span className="italic gold-text">{header?.titleHighlight || "Gallery"}</span>
            </h2>
            <p className="mt-4 max-w-lg text-[#5A5650]">
              {header?.subtitle || "A glimpse into the stories we've had the privilege of framing."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-5 py-2 text-[11px] tracking-[0.2em] uppercase transition-all font-semibold ${
                  cat === c
                    ? "border-[#99000D] bg-[#99000D] text-white shadow-sm"
                    : "border-[#99000D]/20 bg-white text-[#5A5650] hover:border-[#99000D] hover:text-[#99000D]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="reveal mt-14 grid auto-rows-[240px] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {activeItems.map((it, i) => (
            <button
              key={it.id || it.src + i}
              onClick={() => setLightbox(it.src)}
              className={`group relative overflow-hidden rounded-2xl border border-[#99000D]/15 bg-white ${it.span}`}
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <img
                src={it.src}
                alt={it.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-end justify-between p-5 text-white">
                <div className="translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 text-left">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#BE121D] font-bold">{it.cat}</p>
                  <p className="mt-1 font-display text-lg text-white font-semibold">{it.title}</p>
                </div>
                <span className="grid h-11 w-11 shrink-0 translate-y-4 place-items-center rounded-full border border-[#99000D] bg-white/90 text-[#99000D] opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 shadow-md">
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </button>
          ))}
        </div>

        <ReelsStrip header={reelsHeader} reels={reels} contact={contact} />
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close"
            className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white hover:bg-white/10"
          >
            <X size={20} />
          </button>
          <img src={lightbox} alt="" className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl" />
        </div>
      )}
    </section>
  );
}

// === REELS ===
function ReelsStrip({
  header,
  reels,
  contact,
}: {
  header?: ReelsSectionConfig;
  reels: ReelItem[];
  contact: ContactInfo;
}) {
  const activeReels = useMemo(() => reels.filter((r) => r.enabled), [reels]);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDraggingRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Repeat items for seamless, continuous infinite scroll
  const items = useMemo(() => {
    if (!activeReels.length) return [];
    return [...activeReels, ...activeReels, ...activeReels, ...activeReels];
  }, [activeReels]);

  if (!activeReels.length) return null;

  // Auto-scroll loop using requestAnimationFrame
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastTime = performance.now();
    const speed = 40; // Pixels per second

    const animate = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isUserInteracting && !isDraggingRef.current && container) {
        container.scrollLeft += speed * delta;
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isUserInteracting]);

  // Pointer & Drag Event Handlers
  const handlePointerDown = (clientX: number) => {
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    startXRef.current = clientX;
    if (containerRef.current) {
      scrollLeftRef.current = containerRef.current.scrollLeft;
    }
    setIsUserInteracting(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const delta = (clientX - startXRef.current) * 1.5;
    dragDistanceRef.current = Math.abs(delta);
    containerRef.current.scrollLeft = scrollLeftRef.current - delta;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 2000);
  };

  return (
    <div className="reveal mt-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="eyebrow">{header?.eyebrow || "On Instagram"}</span>
          <h3 className="mt-5 font-display text-3xl text-[#121110] md:text-4xl">
            {header?.titlePrefix || "Latest"}{" "}
            <span className="italic gold-text">{header?.titleHighlight || "Reels"}</span>
          </h3>
          {header?.subtitle && (
            <p className="mt-2 text-sm text-[#5A5650]">{header.subtitle}</p>
          )}
        </div>
        <a
          href={contact.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm text-[#99000D] font-semibold hover:underline"
        >
          <Instagram size={16} /> @{contact.instagram}
        </a>
      </div>

      <div
        ref={containerRef}
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={handlePointerUp}
        className="mt-10 flex gap-5 overflow-x-auto select-none cursor-grab active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((r, i) => {
          const reelTargetUrl = r.instagramUrl || r.videoUrl || contact.instagramUrl || "https://instagram.com/ishoots.studio";
          const mediaUrl = r.videoUrl || "https://www.pexels.com/download/video/30251903/";

          return (
            <a
              key={r.id + "_" + i}
              href={reelTargetUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                // Prevent navigation if the click was part of a touch/drag gesture
                if (dragDistanceRef.current > 6) {
                  e.preventDefault();
                }
              }}
              className="group relative aspect-[9/16] w-[220px] shrink-0 overflow-hidden rounded-2xl border border-white/10 md:w-[260px] bg-black"
            >
              <ReelVideoAsset src={mediaUrl} alt={r.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-40" />
              <span className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/90 font-medium pointer-events-none z-10">
                <Instagram size={14} className="text-gold shrink-0" />
                <span className="truncate max-w-[170px]">{r.title || "Reel"}</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function ReelVideoAsset({ src, alt }: { src: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = true;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      preload="none"
      aria-label={alt}
      muted
      loop
      playsInline
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
    />
  );
}

// === PRICING ===
function PackageIcons({ iconType }: { iconType: string }) {
  switch (iconType) {
    case "photos":
      return (
        <div className="flex items-center gap-1.5 text-[#99000D]">
          <Camera size={20} />
        </div>
      );
    case "video":
      return (
        <div className="flex items-center gap-1.5 text-[#99000D]">
          <Video size={20} />
        </div>
      );
    case "photos_video":
      return (
        <div className="flex items-center gap-1.5 text-[#99000D]">
          <Camera size={18} />
          <span className="text-xs font-bold text-white/50">+</span>
          <Video size={18} />
        </div>
      );
    case "photos_2video":
      return (
        <div className="flex items-center gap-1.5 text-[#99000D]">
          <Camera size={18} />
          <span className="text-xs font-bold text-white/50">+</span>
          <Video size={18} />
          <span className="rounded-full bg-[#99000D]/20 px-2 py-0.5 text-[10px] font-bold text-[#99000D]">2x</span>
        </div>
      );
    case "photos_3video":
      return (
        <div className="flex items-center gap-1.5 text-[#99000D]">
          <Camera size={18} />
          <span className="text-xs font-bold text-white/50">+</span>
          <Video size={18} />
          <span className="rounded-full bg-[#99000D]/20 px-2 py-0.5 text-[10px] font-bold text-[#99000D]">3x</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1.5 text-[#99000D]">
          <Sparkles size={20} />
        </div>
      );
  }
}

function Pricing({
  header,
  packs,
  onSelectPackage,
}: {
  header?: PricingSectionConfig;
  packs: PricingPackage[];
  onSelectPackage: (pkg: PricingPackage) => void;
}) {
  const activePacks = useMemo(() => {
    const list: PricingPackage[] = packs && packs.length ? packs : DEFAULT_CMS_DATA.pricing;
    return list.filter((p: PricingPackage) => p.enabled !== false);
  }, [packs]);

  return (
    <section id="pricing" className="relative overflow-hidden bg-background py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-radial-gold)", opacity: 0.5 }}
      />
      <div className="relative mx-auto max-w-[1800px] w-full px-6 md:px-10 lg:px-12">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">{header?.eyebrow || "Investment"}</span>
          <h2 className="section-title mt-6 text-[#121110]">
            {header?.titlePrefix || "Simple"}{" "}
            <span className="italic gold-text">{header?.titleHighlight || "Pricing"}</span>
          </h2>
          <p className="mt-5 text-[#5A5650]">
            {header?.subtitle || "Transparent collections for every celebration. Choose your ideal coverage and book instantly."}
          </p>
        </div>

        {/* Clean, Premium Pricing Cards */}
        <div className="mt-16 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {activePacks.map((pk: PricingPackage, i: number) => (
            <div
              key={pk.id || pk.name}
              className={`reveal group relative flex flex-col justify-between rounded-3xl border p-6 transition-all duration-500 hover:-translate-y-2.5 ${
                pk.highlight
                  ? "border-2 border-[#99000D] bg-white shadow-luxury"
                  : "border border-[#99000D]/15 bg-white shadow-sm hover:border-[#99000D]/40"
              }`}
              style={{
                transitionDelay: `${i * 60}ms`,
              }}
            >
              {pk.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-full bg-[#99000D] px-3.5 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-white shadow-md shrink-0 whitespace-nowrap">
                  <Star size={11} fill="currentColor" /> Most Popular
                </div>
              )}

              <div>
                {/* Header Icon & Number */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <PackageIcons iconType={pk.iconType || "custom"} />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#99000D]/50 font-mono font-bold">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl text-[#121110] font-semibold leading-tight min-h-[50px] flex items-center">
                  {pk.name}
                </h3>

                {/* Price Display */}
                <div className="mt-3 border-y border-[#99000D]/10 py-3">
                  <p className="font-display text-3xl gold-text font-bold tracking-tight">
                    {pk.price}
                  </p>
                </div>

                {/* Package Description */}
                <p className="mt-4 text-xs leading-relaxed text-[#5A5650]">
                  {pk.description || (pk.features && pk.features.join(" • ")) || "Professional coverage."}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectPackage(pk)}
                  className={`w-full rounded-full py-3 text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${
                    pk.highlight
                      ? "btn-gold shadow-luxury hover:scale-[1.03]"
                      : "btn-ghost-gold hover:scale-[1.03]"
                  }`}
                >
                  {pk.btnText || "Book Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === CONTACT ===
// Helper to extract digits for tel: and wa.me links
function cleanPhone(val: string): string {
  if (!val) return "";
  return val.replace(/\D/g, "");
}

// === CONTACT ===
function Contact({
  data,
  selectedPackage,
  onClearPackage,
}: {
  data: ContactInfo;
  selectedPackage: PricingPackage | null;
  onClearPackage: () => void;
}) {
  if (!data.enabled) return null;
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", description: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  // Sync selected package changes into form fields
  useEffect(() => {
    if (selectedPackage) {
      setForm((f) => ({
        ...f,
        subject: `Booking Enquiry: ${selectedPackage.name} (${selectedPackage.price})`,
        description: f.description
          ? f.description
          : `I would like to book the ${selectedPackage.name} package for ${selectedPackage.price}. Please get back to me with availability.`,
      }));
    }
  }, [selectedPackage]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim() || cleanPhone(form.phone).length < 7) errs.phone = "Enter a valid phone number";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Enter a valid email address";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.description.trim()) errs.description = "Description is required";

    setErrors(errs);
    if (Object.keys(errs).length) return;

    // Automatically save form entry to CMS database
    saveContactSubmission({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      description: form.description.trim(),
    });

    const cleanWa = cleanPhone(data.whatsapp || data.phone || "919999999999");
    const pkgDetail = selectedPackage ? `${selectedPackage.name} (${selectedPackage.price})` : "";
    const msg =
      `Hello ISHOOTS 👋\n\n` +
      (pkgDetail ? `*Selected Package:* ${pkgDetail}\n` : "") +
      `*Name:* ${form.name.trim()}\n` +
      `*Phone:* ${form.phone.trim()}\n` +
      `*Email:* ${form.email.trim()}\n` +
      `*Subject:* ${form.subject.trim()}\n` +
      `*Description:* ${form.description.trim()}`;

    window.open(`https://wa.me/${cleanWa}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const cleanWaNumber = cleanPhone(data.whatsapp || data.phone);
  const cleanTelNumber = cleanPhone(data.phone || data.phoneRaw);
  const instaUrl = data.instagramUrl || (data.instagram ? `https://instagram.com/${data.instagram.replace(/^@/, '')}` : '#');
  const instaHandle = `@${(data.instagram || 'ishoots.studio').replace(/^@/, '')}`;

  const details = [
    { icon: Phone, label: "Phone", value: data.phone, href: `tel:${cleanTelNumber}` },
    { icon: MessageCircle, label: "WhatsApp", value: data.phone || data.whatsapp, href: `https://wa.me/${cleanWaNumber}` },
    { icon: Mail, label: "Email", value: data.email, href: `mailto:${data.email}` },
    { icon: Instagram, label: "Instagram", value: instaHandle, href: instaUrl },
    { icon: MapPin, label: "Location", value: data.location },
    { icon: Clock, label: "Working Hours", value: data.hours },
  ];

  return (
    <section id="contact" className="relative overflow-hidden bg-[#F4F1EA] py-32">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(153,0,13,0.14), transparent 70%)" }} />
      <div className="relative mx-auto grid max-w-[1800px] w-full gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24 lg:px-12">
        <div className="reveal-left">
          <span className="eyebrow">{data.eyebrow || "Get In Touch"}</span>
          <h2 className="section-title mt-6 text-[#121110]">
            {data.titlePrefix || "Let's Capture Your"}
            <br />
            <span className="italic gold-text">{data.titleHighlight || "Story"}</span>
          </h2>
          <p className="mt-6 max-w-md text-[#5A5650]">
            {data.subtitle || "Reach out for bookings, quotes and collaborations. We respond within a few hours during working hours."}
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <div className="group flex items-start gap-4 rounded-2xl border border-[#99000D]/12 bg-white p-5 shadow-sm transition-all hover:border-[#99000D]/40 hover:shadow-md">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#99000D]/30 bg-[#99000D]/8 text-[#99000D] transition-transform group-hover:scale-110">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[#5A5650] font-semibold">{label}</p>
                    <p className="mt-1 truncate text-sm text-[#121110] font-medium">{value}</p>
                  </div>
                </div>
              );
              return href ? (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {inner}
                </a>
              ) : (
                <div key={label}>{inner}</div>
              );
            })}
          </div>
        </div>

        <form onSubmit={submit} className="reveal-right relative">
          <div className="glass rounded-3xl p-8 md:p-10 bg-white/95 border-[#99000D]/15" style={{ boxShadow: "var(--shadow-luxury)" }}>
            <p className="text-[11px] tracking-[0.35em] uppercase text-[#99000D] font-bold">Enquiry Form</p>
            <h3 className="mt-3 font-display text-3xl text-[#121110]">Book a Consultation</h3>

            {/* Selected Package Badge */}
            {selectedPackage && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-[#99000D]/30 bg-[#99000D]/8 px-4 py-3 text-xs text-[#121110]">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles size={16} className="text-[#99000D] shrink-0" />
                  <span className="truncate">
                    Selected Package: <strong className="text-[#99000D]">{selectedPackage.name}</strong> ({selectedPackage.price})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClearPackage}
                  className="rounded-full p-1 text-[#5A5650] hover:bg-[#99000D]/10 hover:text-[#99000D] transition"
                  title="Clear Selected Package"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="mt-6 grid gap-5">
              <Field label="Name" value={form.name} onChange={set("name")} error={errors.name} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Phone Number" value={form.phone} onChange={set("phone")} error={errors.phone} />
                <Field label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
              </div>
              <Field label="Subject" value={form.subject} onChange={set("subject")} error={errors.subject} />
              <Field label="Description" textarea value={form.description} onChange={set("description")} error={errors.description} />
              <button
                type="submit"
                className="btn-gold mt-2 flex w-full items-center justify-center gap-2 rounded-full py-4 text-[12px] tracking-[0.25em] uppercase"
              >
                Book Your Slot <ArrowUpRight size={16} />
              </button>
              <p className="text-center text-[10px] tracking-widest text-[#5A5650]">
                Submitting opens WhatsApp with your enquiry pre-filled
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label, value, onChange, error, type = "text", textarea = false,
}: {
  label: string; value: string; onChange: (e: any) => void; error?: string;
  type?: string; textarea?: boolean;
}) {
  const cls =
    "peer w-full rounded-xl border border-[#99000D]/20 bg-white px-4 pb-2.5 pt-6 text-sm text-[#121110] placeholder-transparent outline-none transition focus:border-[#99000D]";
  return (
    <label className="block">
      <div className="relative">
        {textarea ? (
          <textarea placeholder={label} value={value} onChange={onChange} rows={4} className={cls} />
        ) : (
          <input placeholder={label} type={type} value={value} onChange={onChange} className={cls} />
        )}
        <span className="pointer-events-none absolute left-4 top-2 text-[10px] tracking-[0.3em] uppercase text-[#5A5650] font-medium">
          {label}
        </span>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
    </label>
  );
}

// === FLOATING BUTTONS ===
function FloatingActions({ contact }: { contact: ContactInfo }) {
  const cleanWaNumber = cleanPhone(contact.whatsapp || contact.phone);
  const cleanTelNumber = cleanPhone(contact.phone || contact.phoneRaw);
  const instaUrl = contact.instagramUrl || (contact.instagram ? `https://instagram.com/${contact.instagram.replace(/^@/, '')}` : '#');

  const actions = [
    { icon: MessageCircle, href: `https://wa.me/${cleanWaNumber}`, label: "WhatsApp", bg: "bg-[#25D366]" },
    { icon: Instagram, href: instaUrl, label: "Instagram", bg: "bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]" },
    { icon: Phone, href: `tel:${cleanTelNumber}`, label: "Call", bg: "bg-gold text-background" },
  ];
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {actions.map(({ icon: Icon, href, label, bg }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          aria-label={label}
          className={`grid h-12 w-12 place-items-center rounded-full text-white shadow-luxury transition hover:scale-110 ${bg}`}
        >
          <Icon size={20} />
        </a>
      ))}
    </div>
  );
}

// === FOOTER ===
function Footer({ data, contact }: { data: FooterConfig; contact: ContactInfo }) {
  if (!data.enabled) return null;
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const cleanWaNumber = cleanPhone(contact.whatsapp || contact.phone);
  const cleanTelNumber = cleanPhone(contact.phone || contact.phoneRaw);
  const instaUrl = contact.instagramUrl || (contact.instagram ? `https://instagram.com/${contact.instagram.replace(/^@/, '')}` : '#');

  return (
    <footer className="relative border-t border-[#99000D]/20 bg-[#121110] text-white py-16">
      <div className="mx-auto grid max-w-[1800px] w-full gap-12 px-6 md:grid-cols-4 md:px-10 lg:px-12">
        <div className="md:col-span-2">
          <p className="font-display text-3xl tracking-widest text-white">
            {data.logoText || "I"}<span className="gold-text">{data.logoHighlight || "SHOOTS"}</span>
          </p>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            {data.description}
          </p>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.3em] uppercase text-[#BE121D] font-bold">Quick Links</h4>
          <ul className="mt-5 space-y-2">
            {NAV.map((n) => (
              <li key={n.id}>
                <button onClick={() => go(n.id)} className="text-sm text-white/75 hover:text-white transition">
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.3em] uppercase text-[#BE121D] font-bold">Follow</h4>
          <div className="mt-5 flex gap-3">
            {[
              { icon: Instagram, href: instaUrl },
              { icon: MessageCircle, href: `https://wa.me/${cleanWaNumber}` },
              { icon: Mail, href: `mailto:${contact.email}` },
              { icon: Phone, href: `tel:${cleanTelNumber}` },
            ].map(({ icon: Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer"
                 className="grid h-10 w-10 place-items-center rounded-full border border-[#99000D]/40 text-white transition hover:bg-[#99000D] hover:border-[#99000D]">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1800px] w-full flex-col items-center justify-between gap-4 border-t border-white/10 px-6 pt-6 text-xs text-white/50 md:flex-row md:px-10 lg:px-12">
        <p>{data.copyrightText || `© ${new Date().getFullYear()} ISHOOTS. All rights reserved.`}</p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.araneaden.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 transition hover:opacity-100"
          >
            <span className="text-white/50 group-hover:text-white/80 transition-colors">Made by</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#99000D]/40 bg-white/5 px-3 py-1 text-xs text-white/90 transition-all duration-300 group-hover:border-[#99000D] group-hover:bg-[#99000D]/20 group-hover:text-white">
              <img
                src={araneaLogo}
                alt="Aranea Den Logo"
                className="h-5 w-5 rounded-full object-cover shrink-0 border border-[#99000D]/40"
              />
              <span className="font-medium tracking-wide">Aranea Den</span>
            </span>
          </a>
          <a
            href="/admin"
            title="Admin Portal Access"
            className="group grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-white/5 text-white/50 transition hover:border-[#99000D] hover:bg-[#99000D]/20 hover:text-white"
          >
            <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

// === PAGE ===
function Home() {
  const { data } = useCMSData();
  useReveal(data);
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);

  const handleSelectPackage = (pkg: PricingPackage) => {
    setSelectedPackage(pkg);
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar footerData={data.footer} />
      <main>
        <Hero data={data.hero} />
        <About data={data.about} />
        <Gallery
          header={data.galleryHeader}
          reelsHeader={data.reelsHeader}
          items={data.gallery}
          reels={data.reels}
          contact={data.contact}
        />
        <Pricing
          header={data.pricingHeader}
          packs={data.pricing}
          onSelectPackage={handleSelectPackage}
        />
        <Contact
          data={data.contact}
          selectedPackage={selectedPackage}
          onClearPackage={() => setSelectedPackage(null)}
        />
      </main>
      <Footer data={data.footer} contact={data.contact} />
      <FloatingActions contact={data.contact} />
    </div>
  );
}
