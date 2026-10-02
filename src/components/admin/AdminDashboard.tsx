import { useState } from "react";
import {
  Sparkles, Camera, Film, Image as ImageIcon, DollarSign, Phone,
  Globe, LogOut, Save, Plus, Trash2, ArrowUp, ArrowDown, Check,
  Eye, EyeOff, ShieldCheck, RefreshCw, Key, Video, Inbox, Menu, X
} from "lucide-react";
import { useCMSData, useContactSubmissions, CMSData, GalleryItem, ReelItem, PricingPackage } from "@/lib/cms-store";
import { useAdminAuth } from "@/lib/admin-auth";
import { ImageUploader } from "./ImageUploader";

export function AdminDashboard() {
  const { data, loading, updateData, updateReelsSection } = useCMSData();
  const { submissions, deleteSubmission } = useContactSubmissions();
  const { credentials, logout, updateCredentials } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<
    "global" | "hero" | "about" | "gallery" | "reels" | "pricing" | "contact" | "footer" | "submissions" | "account"
  >("global");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<CMSData>(data);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Account settings form state
  const [accountForm, setAccountForm] = useState({
    email: credentials.email,
    password: credentials.passwordHash,
    confirmPassword: credentials.passwordHash,
  });
  const [accountStatus, setAccountStatus] = useState<string | null>(null);

  // Sync state if external changes arrive
  const handleSave = async (dataToSave = formData) => {
    setSaving(true);
    setSaveSuccess(false);
    await updateData(dataToSave);
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accountForm.password !== accountForm.confirmPassword) {
      setAccountStatus("Passwords do not match");
      return;
    }
    if (!accountForm.email.trim()) {
      setAccountStatus("Email cannot be empty");
      return;
    }

    await updateCredentials(accountForm.email, accountForm.password);
    setAccountStatus("Credentials updated successfully!");
    setTimeout(() => setAccountStatus(null), 4000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0B0E] text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="animate-spin text-[#99000D]" size={24} />
          <span className="text-sm tracking-widest uppercase font-semibold">Loading CMS Dashboard...</span>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "global", label: "Global & Favicon", icon: Globe },
    { id: "hero", label: "Hero Section", icon: Sparkles },
    { id: "about", label: "About Section", icon: Camera },
    { id: "gallery", label: "Photo Gallery", icon: ImageIcon },
    { id: "reels", label: "Instagram Reels", icon: Video },
    { id: "pricing", label: "Pricing Packages", icon: DollarSign },
    { id: "contact", label: "Contact & Info", icon: Phone },
    { id: "submissions", label: "Contact Submissions", icon: Inbox },
    { id: "footer", label: "Footer", icon: Film },
    { id: "account", label: "Admin Account", icon: Key },
  ];

  return (
    <div className="flex min-h-screen bg-[#0B0B0E] text-white font-sans overflow-x-hidden">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Slide-Over Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#111111] border-r border-gold/20 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logos/Logo Transparent.png" alt="ISHOOTS" className="h-7 w-auto object-contain" />
              <span className="text-xs text-gold font-medium uppercase tracking-wider">CMS</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg p-2 text-white/60 hover:text-white hover:bg-white/10"
              aria-label="Close Navigation Menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs tracking-wider uppercase transition-all ${
                    active
                      ? "bg-gold/15 text-gold border border-gold/30 font-semibold"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} className={active ? "text-gold" : "text-white/50"} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 pt-6 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-2.5 text-xs tracking-widest uppercase text-white/80 hover:border-gold hover:text-gold transition"
          >
            View Live Site ↗
          </a>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-2.5 text-xs tracking-widest uppercase text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex lg:w-64 border-r border-gold/15 bg-[#111111] p-6 flex-col justify-between shrink-0">
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logos/Logo Transparent.png" alt="ISHOOTS" className="h-7 w-auto object-contain" />
              <span className="text-xs text-gold font-medium uppercase tracking-wider">CMS</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs tracking-wider uppercase transition-all ${
                    active
                      ? "bg-gold/15 text-gold border border-gold/30 font-semibold"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} className={active ? "text-gold" : "text-white/50"} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 pt-6">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-2.5 text-xs tracking-widest uppercase text-white/80 hover:border-gold hover:text-gold transition mb-3"
          >
            View Live Site ↗
          </a>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-2.5 text-xs tracking-widest uppercase text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 w-full">
        {/* Top Header Bar for Mobile & Desktop */}
        <header className="sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gold/15 bg-[#111111] px-4 py-3 sm:px-8 sm:py-4 gap-3">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="rounded-lg border border-gold/30 bg-gold/10 p-2 text-gold lg:hidden hover:bg-gold/20 transition"
                aria-label="Open Navigation Menu"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="font-display text-xl sm:text-2xl text-white capitalize">
                  {activeTab.replace("-", " ")} Management
                </h1>
                <p className="text-[10px] sm:text-xs text-white/50 hidden sm:block">
                  Changes reflect live on the website immediately upon saving.
                </p>
              </div>
            </div>

            {/* Mobile Logout Quick Icon */}
            <button
              onClick={logout}
              className="lg:hidden grid h-9 w-9 place-items-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
              title="Log Out"
            >
              <LogOut size={16} />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                <Check size={14} /> Saved & Live!
              </span>
            )}
            {activeTab !== "account" && (
              <button
                onClick={() => handleSave()}
                disabled={saving}
                className="btn-gold flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[11px] sm:text-xs tracking-widest uppercase shadow-luxury hover:scale-105 transition"
              >
                <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </header>

        {/* Tab Panels */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {/* GLOBAL & FAVICON TAB */}
          {activeTab === "global" && (
            <div className="space-y-8">
              <div className="rounded-2xl border border-white/10 bg-[#18181C] p-6 space-y-6">
                <h3 className="font-display text-lg text-gold">Favicon & Site Branding</h3>
                <ImageUploader
                  label="Website Favicon (.ico, .png)"
                  value={formData.global.faviconUrl}
                  onChange={(url) =>
                    setFormData((prev) => ({
                      ...prev,
                      global: { ...prev.global, faviconUrl: url },
                    }))
                  }
                />
                <div>
                  <label className="block text-xs uppercase text-gold tracking-wider mb-2">Site Name</label>
                  <input
                    type="text"
                    value={formData.global.siteName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        global: { ...prev.global, siteName: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm text-white"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#18181C] p-6 space-y-6">
                <h3 className="font-display text-lg text-gold">Section Visibility Toggles</h3>
                <p className="text-xs text-white/60">Enable or disable specific sections on your website.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    ["hero", "Hero Section"],
                    ["about", "About Section"],
                    ["contact", "Contact Section"],
                    ["footer", "Footer"],
                  ].map(([key, label]) => {
                    const isEnabled = (formData as any)[key]?.enabled;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            [key]: { ...(prev as any)[key], enabled: !isEnabled },
                          }))
                        }
                        className={`flex items-center justify-between rounded-xl border p-4 text-xs font-semibold uppercase tracking-wider transition ${
                          isEnabled
                            ? "border-gold/40 bg-gold/10 text-gold"
                            : "border-white/10 bg-black/40 text-white/40"
                        }`}
                      >
                        <span>{label}</span>
                        {isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* HERO TAB */}
          {activeTab === "hero" && (
            <div className="space-y-6 rounded-2xl border border-white/10 bg-[#18181C] p-6">
              <h3 className="font-display text-lg text-gold">Hero Section Content</h3>
              
              <ImageUploader
                label="Background Video URL (MP4 / WebM)"
                value={formData.hero.videoUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, hero: { ...prev.hero, videoUrl: url } }))}
                accept="video/*"
              />

              <ImageUploader
                label="Fallback Poster Image"
                value={formData.hero.posterImg}
                onChange={(url) => setFormData((prev) => ({ ...prev, hero: { ...prev.hero, posterImg: url } }))}
              />

              {/* OVERLAY OPACITY CONTROL */}
              <div className="rounded-xl border border-[#99000D]/20 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs uppercase text-[#99000D] font-bold">
                    Hero Background Overlay Opacity
                  </label>
                  <span className="text-xs font-mono font-bold text-[#99000D] bg-[#99000D]/10 px-2.5 py-0.5 rounded-full">
                    {Math.round(((formData.hero.overlayOpacity ?? 0.3) * 100))}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.hero.overlayOpacity ?? 0.3}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, overlayOpacity: val },
                    }));
                  }}
                  className="w-full accent-[#99000D] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#5A5650] mt-1 font-medium">
                  <span>0% (Full Video / Clear)</span>
                  <span>50% (Balanced)</span>
                  <span>100% (Solid Overlay)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Tagline Badge</label>
                  <input
                    type="text"
                    value={formData.hero.tagline}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hero: { ...prev.hero, tagline: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Title Line 1</label>
                  <input
                    type="text"
                    value={formData.hero.titleLine1}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hero: { ...prev.hero, titleLine1: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-gold mb-1">Title Highlight (Gold/Red Italic)</label>
                <input
                  type="text"
                  value={formData.hero.titleHighlight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, hero: { ...prev.hero, titleHighlight: e.target.value } }))}
                  className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gold mb-1">Subtitle</label>
                <textarea
                  rows={3}
                  value={formData.hero.subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
                  className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gold mb-1">
                  Hero Feature Badges (Comma-separated list)
                </label>
                <input
                  type="text"
                  value={(formData.hero.badges || []).join(", ")}
                  onChange={(e) => {
                    const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    setFormData((prev) => ({ ...prev, hero: { ...prev.hero, badges: list } }));
                  }}
                  placeholder="Cinematic Reels, Creative Edits, Professional Quality"
                  className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={formData.hero.primaryBtnText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hero: { ...prev.hero, primaryBtnText: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Secondary Button Text</label>
                  <input
                    type="text"
                    value={formData.hero.secondaryBtnText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hero: { ...prev.hero, secondaryBtnText: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === "about" && (
            <div className="space-y-6 rounded-2xl border border-white/10 bg-[#18181C] p-6">
              <h3 className="font-display text-lg text-gold">About Section Content</h3>

              <ImageUploader
                label="Founder Image"
                value={formData.about.founderImg}
                onChange={(url) => setFormData((prev) => ({ ...prev, about: { ...prev.about, founderImg: url } }))}
              />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={formData.about.eyebrow}
                    onChange={(e) => setFormData((prev) => ({ ...prev, about: { ...prev.about, eyebrow: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Title Prefix</label>
                  <input
                    type="text"
                    value={formData.about.titlePrefix || "About"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, about: { ...prev.about, titlePrefix: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Title Highlight</label>
                  <input
                    type="text"
                    value={formData.about.titleHighlight}
                    onChange={(e) => setFormData((prev) => ({ ...prev, about: { ...prev.about, titleHighlight: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-gold mb-1">Paragraph 1</label>
                <textarea
                  rows={3}
                  value={formData.about.paragraph1}
                  onChange={(e) => setFormData((prev) => ({ ...prev, about: { ...prev.about, paragraph1: e.target.value } }))}
                  className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gold mb-1">Paragraph 2</label>
                <textarea
                  rows={3}
                  value={formData.about.paragraph2}
                  onChange={(e) => setFormData((prev) => ({ ...prev, about: { ...prev.about, paragraph2: e.target.value } }))}
                  className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">"We Create" List (Comma-separated)</label>
                  <input
                    type="text"
                    value={(formData.about.creates || []).join(", ")}
                    onChange={(e) => {
                      const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      setFormData((prev) => ({ ...prev, about: { ...prev.about, creates: list } }));
                    }}
                    placeholder="Cinematic Reels, Professional Photography, Creative Edits"
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">"We Cover" List (Comma-separated)</label>
                  <input
                    type="text"
                    value={(formData.about.covers || []).join(", ")}
                    onChange={(e) => {
                      const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      setFormData((prev) => ({ ...prev, about: { ...prev.about, covers: list } }));
                    }}
                    placeholder="Car Openings, Marriages, Events, Restaurant Openings"
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Quote Box Text</label>
                  <input
                    type="text"
                    value={formData.about.quote || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, about: { ...prev.about, quote: e.target.value } }))}
                    placeholder='"Capturing Every Special Moment"'
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Quote Box Subtitle</label>
                  <input
                    type="text"
                    value={formData.about.quoteSub || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, about: { ...prev.about, quoteSub: e.target.value } }))}
                    placeholder="Cinematic Reels · Creative Edits · Professional Quality"
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Founder Card Title</label>
                  <input
                    type="text"
                    value={formData.about.founderName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, about: { ...prev.about, founderName: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Founder Role</label>
                  <input
                    type="text"
                    value={formData.about.founderRole}
                    onChange={(e) => setFormData((prev) => ({ ...prev, about: { ...prev.about, founderRole: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
              </div>

              {/* Stats Boxes Editor */}
              <div className="border-t border-white/10 pt-4">
                <label className="block text-xs uppercase text-gold font-semibold mb-3">Studio Statistics Boxes</label>
                <div className="grid grid-cols-3 gap-3">
                  {(formData.about.stats || [
                    { value: "500+", label: "Projects" },
                    { value: "8+", label: "Years" },
                    { value: "100%", label: "Passion" },
                  ]).map((st, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-2">
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          const copy = [...(formData.about.stats || [])];
                          copy[i] = { ...copy[i], value: val };
                          setFormData((prev) => ({ ...prev, about: { ...prev.about, stats: copy } }));
                        }}
                        placeholder="Value (e.g. 500+)"
                        className="w-full rounded-lg border border-white/15 bg-black/60 p-2 text-xs text-gold font-bold"
                      />
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          const copy = [...(formData.about.stats || [])];
                          copy[i] = { ...copy[i], label: val };
                          setFormData((prev) => ({ ...prev, about: { ...prev.about, stats: copy } }));
                        }}
                        placeholder="Label (e.g. Projects)"
                        className="w-full rounded-lg border border-white/15 bg-black/60 p-2 text-xs text-white/80"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              {/* Gallery Section Header Config */}
              <div className="rounded-2xl border border-white/10 bg-[#18181C] p-6 space-y-4">
                <h4 className="font-display text-sm text-gold uppercase tracking-wider">Photo Gallery Header Titles</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Eyebrow</label>
                    <input
                      type="text"
                      value={formData.galleryHeader?.eyebrow || "Portfolio"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          galleryHeader: { ...(prev.galleryHeader || { titlePrefix: "A Curated", titleHighlight: "Gallery", subtitle: "" }), eyebrow: val },
                        }));
                      }}
                      className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Title Prefix</label>
                    <input
                      type="text"
                      value={formData.galleryHeader?.titlePrefix || "A Curated"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          galleryHeader: { ...(prev.galleryHeader || { eyebrow: "Portfolio", titleHighlight: "Gallery", subtitle: "" }), titlePrefix: val },
                        }));
                      }}
                      className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Title Highlight</label>
                    <input
                      type="text"
                      value={formData.galleryHeader?.titleHighlight || "Gallery"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          galleryHeader: { ...(prev.galleryHeader || { eyebrow: "Portfolio", titlePrefix: "A Curated", subtitle: "" }), titleHighlight: val },
                        }));
                      }}
                      className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={formData.galleryHeader?.subtitle || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        galleryHeader: { ...(prev.galleryHeader || { eyebrow: "Portfolio", titlePrefix: "A Curated", titleHighlight: "Gallery" }), subtitle: val },
                      }));
                    }}
                    placeholder="A glimpse into the stories we've had the privilege of framing."
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-gold">Photo Items Management</h3>
                <button
                  type="button"
                  onClick={() => {
                    const newItem: GalleryItem = {
                      id: "g_" + Date.now(),
                      src: "/assets/g1.jpg",
                      title: "New Photo",
                      cat: "Weddings",
                      span: "",
                      enabled: true,
                      order: formData.gallery.length + 1,
                    };
                    setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, newItem] }));
                  }}
                  className="btn-gold flex items-center gap-1.5 rounded-full px-4 py-2 text-xs uppercase tracking-wider shrink-0"
                >
                  <Plus size={14} /> Add New Photo
                </button>
              </div>

              <div className="space-y-4">
                {formData.gallery.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border p-5 transition ${
                      item.enabled ? "border-white/10 bg-[#18181C]" : "border-white/5 bg-black/40 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img src={item.src} alt={item.title} className="h-16 w-20 rounded-lg object-cover border border-white/10 shrink-0" />
                      <div className="space-y-2 flex-1 min-w-0">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              gallery: prev.gallery.map((g, i) => (i === idx ? { ...g, title: val } : g)),
                            }));
                          }}
                          placeholder="Photo Title"
                          className="w-full rounded-lg border border-white/15 bg-black/60 px-3 py-1.5 text-xs text-white"
                        />
                        <div className="flex gap-2">
                          <select
                            value={item.cat}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setFormData((prev) => ({
                                ...prev,
                                gallery: prev.gallery.map((g, i) => (i === idx ? { ...g, cat: val } : g)),
                              }));
                            }}
                            className="rounded-lg border border-white/15 bg-black/60 px-2 py-1 text-xs text-gold"
                          >
                            <option value="Weddings">Weddings</option>
                            <option value="Events">Events</option>
                            <option value="Cars">Cars</option>
                            <option value="Birthdays">Birthdays</option>
                            <option value="Restaurants">Restaurants</option>
                            <option value="Other">Other</option>
                          </select>
                          <select
                            value={item.span}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                gallery: prev.gallery.map((g, i) => (i === idx ? { ...g, span: val } : g)),
                              }));
                            }}
                            className="rounded-lg border border-white/15 bg-black/60 px-2 py-1 text-xs text-white/70"
                          >
                            <option value="">Normal Height</option>
                            <option value="row-span-2">Tall Card (2 Rows)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <ImageUploader
                        label=""
                        value={item.src}
                        onChange={(url) =>
                          setFormData((prev) => ({
                            ...prev,
                            gallery: prev.gallery.map((g, i) => (i === idx ? { ...g, src: url } : g)),
                          }))
                        }
                      />

                      {/* Reorder Controls */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx === 0) return;
                          const copy = [...formData.gallery];
                          const temp = copy[idx - 1];
                          copy[idx - 1] = copy[idx];
                          copy[idx] = temp;
                          setFormData((prev) => ({ ...prev, gallery: copy }));
                        }}
                        className="rounded-lg border border-white/10 p-2 text-white/70 hover:border-gold hover:text-gold disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === formData.gallery.length - 1}
                        onClick={() => {
                          if (idx === formData.gallery.length - 1) return;
                          const copy = [...formData.gallery];
                          const temp = copy[idx + 1];
                          copy[idx + 1] = copy[idx];
                          copy[idx] = temp;
                          setFormData((prev) => ({ ...prev, gallery: copy }));
                        }}
                        className="rounded-lg border border-white/10 p-2 text-white/70 hover:border-gold hover:text-gold disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>

                      {/* Enable / Disable */}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            gallery: prev.gallery.map((g, i) => (i === idx ? { ...g, enabled: !g.enabled } : g)),
                          }));
                        }}
                        className={`rounded-lg border p-2 text-xs transition ${
                          item.enabled
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            : "border-white/10 bg-black/40 text-white/40"
                        }`}
                        title={item.enabled ? "Enabled" : "Disabled"}
                      >
                        {item.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            gallery: prev.gallery.filter((_, i) => i !== idx),
                          }));
                        }}
                        className="rounded-lg bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REELS TAB */}
          {activeTab === "reels" && (
            <div className="space-y-6">
              {/* Reels Section Header Config */}
              <div className="rounded-2xl border border-white/10 bg-[#18181C] p-6 space-y-4">
                <h4 className="font-display text-sm text-gold uppercase tracking-wider">Instagram Reels Header Titles</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Eyebrow</label>
                    <input
                      type="text"
                      value={formData.reelsHeader?.eyebrow || "Instagram Cinema"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          reelsHeader: { ...(prev.reelsHeader || { titlePrefix: "Featured", titleHighlight: "Reels", subtitle: "" }), eyebrow: val },
                        }));
                      }}
                      className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Title Prefix</label>
                    <input
                      type="text"
                      value={formData.reelsHeader?.titlePrefix || "Featured"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          reelsHeader: { ...(prev.reelsHeader || { eyebrow: "Instagram Cinema", titleHighlight: "Reels", subtitle: "" }), titlePrefix: val },
                        }));
                      }}
                      className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Title Highlight</label>
                    <input
                      type="text"
                      value={formData.reelsHeader?.titleHighlight || "Reels"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          reelsHeader: { ...(prev.reelsHeader || { eyebrow: "Instagram Cinema", titlePrefix: "Featured", subtitle: "" }), titleHighlight: val },
                        }));
                      }}
                      className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={formData.reelsHeader?.subtitle || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        reelsHeader: { ...(prev.reelsHeader || { eyebrow: "Instagram Cinema", titlePrefix: "Featured", titleHighlight: "Reels" }), subtitle: val },
                      }));
                    }}
                    placeholder="Watch cinematic video highlights crafted for social media."
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display text-lg text-gold flex items-center gap-2">
                    <Video size={20} /> Instagram Reels Management
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    Upload MP4 videos & edit links. Video changes are saved to database instantly and stream live.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const newReel: ReelItem = {
                      id: "r_" + Date.now(),
                      videoUrl: "https://www.pexels.com/download/video/30251903/",
                      instagramUrl: "https://instagram.com/ishoots.studio",
                      title: "New Reel " + (formData.reels.length + 1),
                      enabled: true,
                      order: 1,
                    };
                    const updated = [newReel, ...formData.reels];
                    setFormData((prev) => ({ ...prev, reels: updated }));
                    await updateReelsSection(updated);
                  }}
                  className="btn-gold flex items-center gap-1.5 rounded-full px-4 py-2 text-xs uppercase tracking-wider shadow-luxury shrink-0"
                >
                  <Plus size={14} /> Add New Reel
                </button>
              </div>

              <div className="space-y-4">
                {formData.reels.map((reel, idx) => (
                  <div
                    key={reel.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border p-5 transition ${
                      reel.enabled ? "border-white/10 bg-[#18181C]" : "border-white/5 bg-black/40 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 w-full">
                      {/* Live MP4 Video Preview (First Frame Display) */}
                      <div className="relative h-28 w-20 shrink-0 rounded-xl overflow-hidden border border-white/15 bg-black">
                        {reel.videoUrl ? (
                          <video
                            src={reel.videoUrl + "#t=0.001"}
                            preload="metadata"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full grid place-items-center text-white/30 text-[10px]">No Video</div>
                        )}
                      </div>

                      <div className="space-y-3 flex-1 min-w-0">
                        <div>
                          <label className="block text-[10px] tracking-wider uppercase text-gold font-medium mb-1">
                            Reel Title
                          </label>
                          <input
                            type="text"
                            value={reel.title}
                            onChange={async (e) => {
                              const val = e.target.value;
                              const updated = formData.reels.map((r, i) => (i === idx ? { ...r, title: val } : r));
                              setFormData((prev) => ({ ...prev, reels: updated }));
                              await updateReelsSection(updated);
                            }}
                            placeholder="Reel Title"
                            className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-xs text-white outline-none focus:border-gold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] tracking-wider uppercase text-gold font-medium mb-1">
                            Instagram Reel URL (For Redirection)
                          </label>
                          <input
                            type="text"
                            value={reel.instagramUrl || ""}
                            onChange={async (e) => {
                              const val = e.target.value;
                              const updated = formData.reels.map((r, i) => (i === idx ? { ...r, instagramUrl: val } : r));
                              setFormData((prev) => ({ ...prev, reels: updated }));
                              await updateReelsSection(updated);
                            }}
                            placeholder="https://www.instagram.com/reel/..."
                            className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-xs text-white outline-none focus:border-gold"
                          />
                        </div>

                        <ImageUploader
                          label="MP4 Reel Video File (Upload MP4 Video)"
                          value={reel.videoUrl || ""}
                          accept="video/mp4,video/*"
                          onChange={async (url) => {
                            const updated = formData.reels.map((r, i) => (i === idx ? { ...r, videoUrl: url } : r));
                            setFormData((prev) => ({ ...prev, reels: updated }));
                            await updateReelsSection(updated);
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-center">
                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={async () => {
                          if (idx === 0) return;
                          const copy = [...formData.reels];
                          const temp = copy[idx - 1];
                          copy[idx - 1] = copy[idx];
                          copy[idx] = temp;
                          setFormData((prev) => ({ ...prev, reels: copy }));
                          await updateReelsSection(copy);
                        }}
                        className="rounded-lg border border-white/10 p-2.5 text-white/70 hover:border-gold hover:text-gold disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === formData.reels.length - 1}
                        onClick={async () => {
                          if (idx === formData.reels.length - 1) return;
                          const copy = [...formData.reels];
                          const temp = copy[idx + 1];
                          copy[idx + 1] = copy[idx];
                          copy[idx] = temp;
                          setFormData((prev) => ({ ...prev, reels: copy }));
                          await updateReelsSection(copy);
                        }}
                        className="rounded-lg border border-white/10 p-2.5 text-white/70 hover:border-gold hover:text-gold disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>

                      {/* Enable/Disable Toggle */}
                      <button
                        type="button"
                        onClick={async () => {
                          const updated = formData.reels.map((r, i) =>
                            i === idx ? { ...r, enabled: !r.enabled } : r
                          );
                          setFormData((prev) => ({ ...prev, reels: updated }));
                          await updateReelsSection(updated);
                        }}
                        className={`rounded-lg border p-2.5 text-xs transition ${
                          reel.enabled
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            : "border-white/10 bg-black/40 text-white/40"
                        }`}
                        title={reel.enabled ? "Enabled (Click to Disable)" : "Disabled (Click to Enable)"}
                      >
                        {reel.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={async () => {
                          const updated = formData.reels.filter((_, i) => i !== idx);
                          setFormData((prev) => ({ ...prev, reels: updated }));
                          await updateReelsSection(updated);
                        }}
                        className="rounded-lg bg-red-500/20 p-2.5 text-red-400 hover:bg-red-500/30"
                        title="Delete Reel"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRICING TAB */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              {/* Pricing Section Header Config */}
              <div className="rounded-2xl border border-white/10 bg-[#18181C] p-6 space-y-4">
                <h4 className="font-display text-sm text-gold uppercase tracking-wider">Pricing Section Header Titles</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Eyebrow</label>
                    <input
                      type="text"
                      value={formData.pricingHeader?.eyebrow || "Investment"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          pricingHeader: { ...(prev.pricingHeader || { titlePrefix: "Simple", titleHighlight: "Pricing", subtitle: "" }), eyebrow: val },
                        }));
                      }}
                      className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Title Prefix</label>
                    <input
                      type="text"
                      value={formData.pricingHeader?.titlePrefix || "Simple"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          pricingHeader: { ...(prev.pricingHeader || { eyebrow: "Investment", titleHighlight: "Pricing", subtitle: "" }), titlePrefix: val },
                        }));
                      }}
                      className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Title Highlight</label>
                    <input
                      type="text"
                      value={formData.pricingHeader?.titleHighlight || "Pricing"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          pricingHeader: { ...(prev.pricingHeader || { eyebrow: "Investment", titlePrefix: "Simple", subtitle: "" }), titleHighlight: val },
                        }));
                      }}
                      className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={formData.pricingHeader?.subtitle || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        pricingHeader: { ...(prev.pricingHeader || { eyebrow: "Investment", titlePrefix: "Simple", titleHighlight: "Pricing" }), subtitle: val },
                      }));
                    }}
                    placeholder="Transparent collections for every celebration. Choose your ideal coverage and book instantly."
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display text-lg text-gold flex items-center gap-2">
                    <DollarSign size={20} /> Pricing Packages Management
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    Manage pricing cards, package names, prices, descriptions, icon types, and button labels. Add unlimited packages.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newPkg: PricingPackage = {
                      id: "p_" + Date.now(),
                      name: "New Package",
                      price: "₹1999",
                      description: "Custom photography and video package.",
                      iconType: "photos_video",
                      btnText: "Book Now",
                      highlight: false,
                      enabled: true,
                      order: formData.pricing.length + 1,
                    };
                    setFormData((prev) => ({ ...prev, pricing: [...prev.pricing, newPkg] }));
                  }}
                  className="btn-gold flex items-center gap-1.5 rounded-full px-4 py-2 text-xs uppercase tracking-wider shrink-0"
                >
                  <Plus size={14} /> Add Package
                </button>
              </div>

              <div className="space-y-6">
                {formData.pricing.map((pkg, idx) => (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl border p-6 space-y-4 transition ${
                      pkg.enabled ? "border-white/10 bg-[#18181C]" : "border-white/5 bg-black/40 opacity-60"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-black/60 font-mono text-xs text-white/50 border border-white/10">
                          0{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              pricing: prev.pricing.map((p, i) => (i === idx ? { ...p, name: val } : p)),
                            }));
                          }}
                          placeholder="Package Name"
                          className="font-display text-xl text-white bg-transparent border-b border-gold/40 focus:border-gold focus:outline-none w-full max-w-sm"
                        />
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Highlight Toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              pricing: prev.pricing.map((p, i) => (i === idx ? { ...p, highlight: !p.highlight } : p)),
                            }));
                          }}
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase transition ${
                            pkg.highlight ? "bg-[#99000D] text-white shadow-luxury" : "bg-white/10 text-white/60 hover:bg-white/20"
                          }`}
                        >
                          {pkg.highlight ? "★ Most Popular" : "Normal"}
                        </button>

                        {/* Reorder Up/Down */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const copy = [...formData.pricing];
                            const temp = copy[idx - 1];
                            copy[idx - 1] = copy[idx];
                            copy[idx] = temp;
                            setFormData((prev) => ({ ...prev, pricing: copy }));
                          }}
                          className="rounded-lg border border-white/10 p-2 text-white/70 hover:border-gold hover:text-gold disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === formData.pricing.length - 1}
                          onClick={() => {
                            if (idx === formData.pricing.length - 1) return;
                            const copy = [...formData.pricing];
                            const temp = copy[idx + 1];
                            copy[idx + 1] = copy[idx];
                            copy[idx] = temp;
                            setFormData((prev) => ({ ...prev, pricing: copy }));
                          }}
                          className="rounded-lg border border-white/10 p-2 text-white/70 hover:border-gold hover:text-gold disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>

                        {/* Enable/Disable */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              pricing: prev.pricing.map((p, i) => (i === idx ? { ...p, enabled: !p.enabled } : p)),
                            }));
                          }}
                          className={`rounded-lg border p-2 text-xs transition ${
                            pkg.enabled
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                              : "border-white/10 bg-black/40 text-white/40"
                          }`}
                          title={pkg.enabled ? "Enabled" : "Disabled"}
                        >
                          {pkg.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              pricing: prev.pricing.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="rounded-lg bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30"
                          title="Delete Package"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-wider text-gold uppercase mb-1 font-medium">
                          Package Price
                        </label>
                        <input
                          type="text"
                          value={pkg.price}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              pricing: prev.pricing.map((p, i) => (i === idx ? { ...p, price: val } : p)),
                            }));
                          }}
                          placeholder="e.g. ₹2499"
                          className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white outline-none focus:border-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-wider text-gold uppercase mb-1 font-medium">
                          Icon Style / Badge
                        </label>
                        <select
                          value={pkg.iconType || "photos_video"}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              pricing: prev.pricing.map((p, i) => (i === idx ? { ...p, iconType: val } : p)),
                            }));
                          }}
                          className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white outline-none focus:border-gold"
                        >
                          <option value="photos">📷 Only Photos (Camera)</option>
                          <option value="video">🎥 Only Video (Video Reel)</option>
                          <option value="photos_video">📷+🎥 Photos + Video</option>
                          <option value="photos_2video">📷+🎥 2x Photos + 2 Videos</option>
                          <option value="photos_3video">📷+🎥 3x Photos + 3 Videos</option>
                          <option value="custom">✨ Custom (Sparkles)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-wider text-gold uppercase mb-1 font-medium">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={pkg.btnText || "Book Now"}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              pricing: prev.pricing.map((p, i) => (i === idx ? { ...p, btnText: val } : p)),
                            }));
                          }}
                          placeholder="e.g. Book Now"
                          className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] tracking-wider text-gold uppercase mb-1 font-medium">
                        Short Description / Details
                      </label>
                      <textarea
                        rows={2}
                        value={pkg.description || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            pricing: prev.pricing.map((p, i) => (i === idx ? { ...p, description: val } : p)),
                          }));
                        }}
                        placeholder="Package details and features overview..."
                        className="w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-xs text-white outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT & FOOTER TABS */}
          {activeTab === "contact" && (
            <div className="space-y-6 rounded-2xl border border-white/10 bg-[#18181C] p-6">
              <h3 className="font-display text-lg text-gold">Contact Section & Business Details</h3>

              {/* Contact Section Header Titles Config */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                <h4 className="font-display text-xs text-gold uppercase tracking-wider">Contact Section Header Titles</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Eyebrow</label>
                    <input
                      type="text"
                      value={formData.contact.eyebrow || "Get In Touch"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, eyebrow: e.target.value } }))}
                      className="w-full rounded-xl border border-white/15 bg-black/60 p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Title Prefix</label>
                    <input
                      type="text"
                      value={formData.contact.titlePrefix || "Let's Capture Your"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, titlePrefix: e.target.value } }))}
                      className="w-full rounded-xl border border-white/15 bg-black/60 p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Title Highlight</label>
                    <input
                      type="text"
                      value={formData.contact.titleHighlight || "Story"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, titleHighlight: e.target.value } }))}
                      className="w-full rounded-xl border border-white/15 bg-black/60 p-2 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={formData.contact.subtitle || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, subtitle: e.target.value } }))}
                    placeholder="Reach out for bookings, quotes and collaborations."
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-2 text-xs text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Phone Number (Display)</label>
                  <input
                    type="text"
                    value={formData.contact.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">WhatsApp Number (e.g. 919999999999)</label>
                  <input
                    type="text"
                    value={formData.contact.whatsapp}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, whatsapp: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Instagram Handle (e.g. ishoots.studio)</label>
                  <input
                    type="text"
                    value={formData.contact.instagram}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, instagram: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Instagram Profile URL</label>
                  <input
                    type="text"
                    value={formData.contact.instagramUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, instagramUrl: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.contact.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, location: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase text-gold mb-1">Working Hours</label>
                  <input
                    type="text"
                    value={formData.contact.hours}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, hours: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FOOTER TAB */}
          {activeTab === "footer" && (
            <div className="space-y-6 rounded-2xl border border-white/10 bg-[#18181C] p-6">
              <h3 className="font-display text-lg text-gold">Footer Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Logo Text</label>
                  <input
                    type="text"
                    value={formData.footer.logoText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, footer: { ...prev.footer, logoText: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gold mb-1">Logo Highlight</label>
                  <input
                    type="text"
                    value={formData.footer.logoHighlight}
                    onChange={(e) => setFormData((prev) => ({ ...prev, footer: { ...prev.footer, logoHighlight: e.target.value } }))}
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase text-gold mb-1">Footer Description</label>
                <textarea
                  rows={3}
                  value={formData.footer.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, footer: { ...prev.footer, description: e.target.value } }))}
                  className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                />
              </div>
            </div>
          )}

          {/* CONTACT SUBMISSIONS TAB */}
          {activeTab === "submissions" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
                <div>
                  <h3 className="font-display text-xl text-white font-bold flex items-center gap-2">
                    <Inbox size={22} className="text-[#BE121D]" /> Contact Form Submissions
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    All messages submitted via the Contact Us form on the website are saved here automatically in real time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-[#BE121D]/40 bg-[#BE121D]/15 px-4 py-1.5 text-xs text-white font-bold shadow-sm">
                    Total: {submissions.length} Submissions
                  </span>
                </div>
              </div>

              {submissions.length === 0 ? (
                <div className="rounded-2xl border border-white/15 bg-[#18181C] p-12 text-center text-white/50 shadow-xl">
                  <Inbox className="mx-auto mb-3 text-[#BE121D]/50" size={44} />
                  <p className="text-sm font-semibold text-white">No contact submissions yet</p>
                  <p className="text-xs text-white/50 mt-1">Submissions from website visitors will appear here automatically.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="rounded-2xl border border-[#99000D]/25 bg-[#18181C] p-6 space-y-4 shadow-xl transition hover:border-[#99000D]/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                        <div>
                          <h4 className="font-display text-lg font-bold text-white">{sub.name}</h4>
                          <p className="text-xs text-white/50 font-mono mt-0.5">{sub.createdAt}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {sub.phone && (
                            <a
                              href={`https://wa.me/${sub.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-xl border border-[#25D366]/40 bg-[#25D366]/20 px-3.5 py-1.5 text-xs font-semibold text-[#25D366] hover:bg-[#25D366]/30 transition flex items-center gap-1.5 shadow-sm"
                            >
                              WhatsApp Reply
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteSubmission(sub.id)}
                            className="rounded-xl bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 transition border border-red-500/40 shadow-sm"
                            title="Delete Submission"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3 text-xs bg-[#222228] p-4 rounded-xl border border-white/10">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#BE121D] font-bold mb-1">Email</span>
                          <a href={`mailto:${sub.email}`} className="text-white hover:text-[#BE121D] font-medium underline break-all">
                            {sub.email}
                          </a>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#BE121D] font-bold mb-1">Phone Number</span>
                          <a href={`tel:${sub.phone}`} className="text-white hover:text-[#BE121D] font-medium">
                            {sub.phone}
                          </a>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#BE121D] font-bold mb-1">Subject</span>
                          <span className="text-white font-semibold">{sub.subject}</span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/12 bg-[#222228] p-4">
                        <span className="block text-[10px] uppercase tracking-wider text-white/50 font-bold mb-1.5">Message / Description</span>
                        <p className="text-xs text-white/95 whitespace-pre-wrap leading-relaxed font-normal">{sub.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADMIN ACCOUNT TAB */}
          {activeTab === "account" && (
            <form onSubmit={handleAccountUpdate} className="space-y-6 rounded-2xl border border-white/10 bg-[#18181C] p-6">
              <h3 className="font-display text-lg text-gold flex items-center gap-2">
                <ShieldCheck size={20} /> Admin Credentials Management
              </h3>
              <p className="text-xs text-white/60">Update your email and password used to access this CMS.</p>

              <div>
                <label className="block text-xs uppercase text-gold mb-1">Admin Email</label>
                <input
                  type="email"
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gold mb-1">New Password</label>
                <input
                  type="password"
                  value={accountForm.password}
                  onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={accountForm.confirmPassword}
                  onChange={(e) => setAccountForm({ ...accountForm, confirmPassword: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm"
                />
              </div>

              {accountStatus && (
                <p className={`text-xs ${accountStatus.includes("successfully") ? "text-emerald-400" : "text-red-400"}`}>
                  {accountStatus}
                </p>
              )}

              <button
                type="submit"
                className="btn-gold rounded-full px-6 py-3 text-xs tracking-widest uppercase shadow-luxury"
              >
                Update Admin Account
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
