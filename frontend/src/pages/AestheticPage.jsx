import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
  {
    id: "consultation",
    title: "Consultation & Basic Services",
    subtitle: "Start your aesthetic journey with an expert evaluation",
    icon: "🩺",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
    treatments: [
      { name: "Aesthetic Consultation", sessions: 1, price: "₹500" },
      { name: "Skin Analysis (VISIA Based)", sessions: 1, price: "₹800" },
      { name: "Follow-up Consultation", sessions: 1, price: "₹300" },
    ],
  },
  {
    id: "medi-facials",
    title: "Medi Facials",
    subtitle: "Medical-grade facials for radiant, refreshed skin",
    icon: "✨",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
    treatments: [
      { name: "Express Medi Facial", sessions: 1, price: "₹1,499" },
      { name: "Classic Medi Facial", sessions: 1, price: "₹1,999" },
      { name: "Premium Medi Facial", sessions: 1, price: "₹2,999" },
      { name: "Luxury Medi Facial", sessions: 1, price: "₹3,999" },
      { name: "Acne Medi Facial", sessions: 1, price: "₹2,999" },
      { name: "Anti-Ageing Medi Facial", sessions: 1, price: "₹3,499" },
      { name: "Brightening Medi Facial", sessions: 1, price: "₹2,999" },
      { name: "Sensitive Skin Medi Facial", sessions: 1, price: "₹2,499" },
      { name: "Deep Hydration Facial", sessions: 1, price: "₹2,999" },
      { name: "Vitamin-C Facial", sessions: 1, price: "₹2,999" },
      { name: "Oxygen Facial", sessions: 1, price: "₹2,999" },
      { name: "Diamond Facial", sessions: 1, price: "₹3,499" },
      { name: "Gold Facial", sessions: 1, price: "₹3,499" },
      { name: "Pearl Facial", sessions: 1, price: "₹2,999" },
      { name: "Red Carpet Facial", sessions: 1, price: "₹5,999" },
      { name: "Detan Facial", sessions: 1, price: "₹2,499" },
    ],
  },
  {
    id: "hydra-facials",
    title: "Hydra & Signature Facials",
    subtitle: "Deep hydration & signature glow treatments",
    icon: "💧",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
    treatments: [
      { name: "Hydra Facial Basic", sessions: 1, price: "₹4,999" },
      { name: "Hydra Facial Deluxe", sessions: 1, price: "₹4,999" },
      { name: "Hydra Facial Platinum", sessions: 1, price: "₹6,999" },
      { name: "Korean Glass Skin Facial", sessions: 1, price: "₹4,999" },
      { name: "Korean Shine Facial", sessions: 1, price: "₹3,999" },
      { name: "Baby Glow Facial", sessions: 1, price: "₹5,999" },
      { name: "BB Glow Treatment", sessions: 1, price: "₹5,999" },
      { name: "Hollywood Glow Facial", sessions: 1, price: "₹5,999" },
      { name: "Bridal Glow Facial", sessions: 1, price: "₹6,999" },
      { name: "Diamond Glow Facial", sessions: 1, price: "₹4,999" },
      { name: "Youth Glow Facial", sessions: 1, price: "₹3,999" },
      { name: "Hydra + Oxygen Combo", sessions: 1, price: "₹5,999" },
    ],
  },
  {
    id: "chemical-peels",
    title: "Chemical Peels",
    subtitle: "Exfoliation & skin renewal with clinical-grade peels",
    icon: "🧪",
    image: "/images/chemical_peels.png",
    treatments: [
      { name: "Glycolic Peel", sessions: 1, price: "₹2,499" },
      { name: "Salicylic Peel", sessions: 1, price: "₹2,999" },
      { name: "Mandelic Peel", sessions: 1, price: "₹2,999" },
      { name: "Lactic Peel", sessions: 1, price: "₹2,999" },
      { name: "Acne Peel", sessions: 1, price: "₹2,999" },
      { name: "Pigmentation Peel", sessions: 1, price: "₹3,499" },
      { name: "Melasma Peel", sessions: 1, price: "₹3,999" },
      { name: "Glow Peel", sessions: 1, price: "₹2,999" },
      { name: "Yellow Peel", sessions: 1, price: "₹4,999" },
      { name: "TCA Peel", sessions: 1, price: "₹5,999" },
      { name: "Jessner Peel", sessions: 1, price: "₹3,499" },
      { name: "Cosmelan Peel (Depigmentation)", sessions: 1, price: "₹8,999" },
      { name: "Carbon Peel", sessions: 1, price: "₹3,999" },
    ],
  },
  {
    id: "laser-skin",
    title: "Laser & Skin Treatments",
    subtitle: "Advanced laser technology for flawless skin",
    icon: "💡",
    image: "/images/laser_skin_treatments.png",
    treatments: [
      { name: "IPL Photo Facial", sessions: 1, price: "₹3,999" },
      { name: "Laser Skin Rejuvenation", sessions: 1, price: "₹4,999" },
      { name: "Carbon Laser Peel", sessions: 1, price: "₹3,999" },
      { name: "Hollywood Carbon Peel", sessions: 1, price: "₹4,999" },
      { name: "Laser Pigmentation Treatment", sessions: 1, price: "₹4,999" },
      { name: "Laser Acne Treatment", sessions: 1, price: "₹4,999" },
      { name: "Laser Scar Reduction", sessions: 1, price: "₹5,999" },
      { name: "Laser Melasma Treatment", sessions: 1, price: "₹5,999" },
      { name: "Skin Tightening (Laser)", sessions: 1, price: "₹5,999" },
      { name: "RF Skin Tightening", sessions: 1, price: "₹5,999" },
      { name: "HIFU (Face & Neck)", sessions: 1, price: "₹19,999" },
      { name: "CO₂ Fractional Laser", sessions: 1, price: "₹8,999" },
      { name: "Q-Switch Laser (Toning)", sessions: 1, price: "₹4,999" },
      { name: "Tattoo Removal (Per Sq. Inch)", sessions: 1, price: "₹1,999" },
      { name: "Mole Removal", sessions: "—", price: "₹1,000 onwards" },
      { name: "Skin Tag Removal", sessions: "—", price: "₹1,000 onwards" },
      { name: "Wart Removal", sessions: "—", price: "₹1,000 onwards" },
      { name: "Xanthelasma Removal", sessions: "—", price: "₹2,900 onwards" },
    ],
  },
  {
    id: "hair",
    title: "Hair Treatments",
    subtitle: "Restore thickness, strength & confidence",
    icon: "💇",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    treatments: [
      { name: "Hair PRP", sessions: 1, price: "₹3,999" },
      { name: "Face PRP (Vampire Facial)", sessions: 1, price: "₹6,999" },
      { name: "GFC Hair Treatment", sessions: 1, price: "₹8,999" },
      { name: "Exosome Hair Therapy", sessions: 1, price: "₹11,999" },
      { name: "Hair Mesotherapy", sessions: 1, price: "₹4,999" },
      { name: "Dandruff Therapy", sessions: 1, price: "₹3,499" },
      { name: "Microneedling Hair", sessions: 1, price: "₹3,999" },
      { name: "Hair Regrowth Booster", sessions: 1, price: "₹4,999" },
    ],
  },
  {
    id: "injectables",
    title: "Injectables",
    subtitle: "Non-surgical solutions for a youthful appearance",
    icon: "💉",
    image: "/images/injectables.png",
    treatments: [
      { name: "Botox (Per Unit)", sessions: "—", price: "₹350–500 / Unit" },
      { name: "Baby Botox", sessions: "—", price: "₹12,999 onwards" },
      { name: "Forehead Botox", sessions: "—", price: "₹24,999 onwards" },
      { name: "Full Face Botox", sessions: "—", price: "₹7,999" },
      { name: "Lip Fillers", sessions: "—", price: "₹19,999 onwards" },
      { name: "Chin Fillers", sessions: "—", price: "₹22,999 onwards" },
      { name: "Jawline Fillers", sessions: "—", price: "₹24,999 onwards" },
      { name: "Cheek Fillers", sessions: "—", price: "₹20,999 onwards" },
      { name: "Under Eye Fillers (Non-Surgical)", sessions: "—", price: "₹19,999 onwards" },
      { name: "Skin Boosters (Per Session)", sessions: "—", price: "₹12,999 onwards" },
      { name: "Profhilo", sessions: "—", price: "₹24,999 onwards" },
      { name: "Polynucleotides (PN) Therapy", sessions: "—", price: "₹19,999 onwards" },
      { name: "Salmon DNA (PDRN)", sessions: "—", price: "₹19,999 onwards" },
      { name: "Glutathione Injection", sessions: "—", price: "₹5,999 onwards" },
    ],
  },
  {
    id: "acne-scar",
    title: "Acne, Scar & Pigmentation Programs",
    subtitle: "Targeted programs for clear, even-toned skin",
    icon: "🌿",
    image: "/images/acne_scar.png",
    treatments: [
      { name: "Acne Treatment (Per Session)", sessions: 1, price: "₹3,499" },
      { name: "Acne Scar Treatment (Per Session)", sessions: 1, price: "₹4,999" },
      { name: "Acne Program (6 Sessions)", sessions: 6, price: "₹18,999" },
      { name: "Acne Scar Program (6 Sessions)", sessions: 6, price: "₹26,990" },
      { name: "Pigmentation Treatment", sessions: 1, price: "₹4,999" },
      { name: "Melasma Treatment", sessions: 1, price: "₹4,999" },
      { name: "Pigmentation Program (6 Sessions)", sessions: 6, price: "₹19,990" },
      { name: "Melasma Program (6 Sessions)", sessions: 6, price: "₹24,990" },
      { name: "Open Pore Treatment", sessions: 1, price: "₹3,999" },
      { name: "Brightening Treatment", sessions: 1, price: "₹3,999" },
      { name: "Anti-Ageing Program", sessions: 6, price: "₹24,995" },
      { name: "Glass Skin Program", sessions: 6, price: "₹24,995" },
    ],
  },
  {
    id: "body",
    title: "Body Treatments",
    subtitle: "Reshape, tone & rejuvenate from head to toe",
    icon: "🏃",
    image: "/images/body_treatments.png",
    treatments: [
      { name: "Underarm Brightening", sessions: 1, price: "₹2,999" },
      { name: "Bikini Brightening", sessions: 1, price: "₹3,999" },
      { name: "Full Body Brightening", sessions: 1, price: "₹4,999" },
      { name: "Back Polishing", sessions: 1, price: "₹3,999" },
      { name: "Body Polishing", sessions: 1, price: "₹4,999" },
      { name: "Stretch Mark Treatment (Per Session)", sessions: 1, price: "₹5,999" },
      { name: "Cellulite Reduction (Per Session)", sessions: 1, price: "₹5,999" },
      { name: "RF Body Tightening", sessions: 1, price: "₹7,999" },
      { name: "Cool Sculpting (Fat Reduction)", sessions: 1, price: "₹24,999 onwards" },
      { name: "IV Vitamin Therapy", sessions: 1, price: "₹4,999" },
      { name: "Glutathione Drip", sessions: 1, price: "₹4,999" },
      { name: "Anti-Ageing Drip", sessions: 1, price: "₹4,999" },
      { name: "Detox Drip", sessions: 1, price: "₹3,999" },
      { name: "Immunity Booster Drip", sessions: 1, price: "₹3,999" },
    ],
  },
  {
    id: "laser-hair",
    title: "Laser Hair Reduction",
    subtitle: "Permanent hair reduction for silky, smooth skin",
    icon: "⚡",
    image: "/images/laser_hair_reduction.png",
    treatments: [
      { name: "Full Legs", sessions: 1, price: "₹5,199" },
      { name: "Half Legs", sessions: 1, price: "₹2,999" },
      { name: "Chin", sessions: 1, price: "₹699" },
      { name: "Bikini Line", sessions: 1, price: "₹2,999" },
      { name: "Side Locks", sessions: 1, price: "₹799" },
      { name: "Brazilian", sessions: 1, price: "₹2,999" },
      { name: "Full Face", sessions: 1, price: "₹2,699" },
      { name: "Full Arms", sessions: 1, price: "₹3,999" },
      { name: "Neck", sessions: 1, price: "₹1,499" },
      { name: "Abdomen", sessions: 1, price: "₹3,999" },
      { name: "Underarms", sessions: 1, price: "₹2,499" },
      { name: "Back", sessions: 1, price: "₹2,499" },
      { name: "Half Arms", sessions: 1, price: "₹2,499" },
      { name: "Shoulders", sessions: 1, price: "₹2,499" },
      { name: "Full Body", sessions: 1, price: "₹14,999 onwards" },
    ],
  },
];

const whyUs = [
  { icon: "🏥", text: "US FDA Approved Technology" },
  { icon: "👨‍⚕️", text: "Experienced Dermatologists & Aesthetic Experts" },
  { icon: "📋", text: "Customized Treatment Plans" },
  { icon: "🌍", text: "International Standard Protocols" },
  { icon: "✅", text: "Safe, Hygienic & Result Oriented" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryCard({ cat, idx, isOpen, onToggle }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-[#0D8B6F] shadow-lg"
          : "border-gray-100 hover:border-[#0D8B6F]/30 hover:shadow-md"
      }`}
    >
      {/* ── HEADER ── */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left group"
      >
        {/* Icon + number badge */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-white transition-all ${
            isOpen
              ? "bg-[#0D8B6F] scale-105"
              : "bg-gradient-to-br from-[#0D8B6F] to-[#0a6b56] group-hover:scale-105"
          }`}
        >
          <span className="text-lg leading-none">{cat.icon}</span>
          <span className="text-[9px] mt-0.5 opacity-80">
            {String(idx + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 font-serif group-hover:text-[#0D8B6F] transition-colors leading-snug">
            {cat.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{cat.subtitle}</p>
          <span className="inline-block mt-1.5 text-[10px] font-semibold text-[#0D8B6F] bg-[#0D8B6F]/10 px-2.5 py-0.5 rounded-full">
            {cat.treatments.length} treatments
          </span>
        </div>

        {/* Thumbnail */}
        <div className="hidden sm:block flex-shrink-0 w-24 h-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Fatima Hospital Logo"  
            className="w-full h-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`flex-shrink-0 w-5 h-5 text-[#0D8B6F] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── EXPANDABLE TABLE ── */}
      <div
        style={{
          maxHeight: isOpen ? "2400px" : "0",
          transition: "max-height 0.55s cubic-bezier(0.4,0,0.2,1)",
        }}
        className="overflow-hidden"
      >
        <div className="px-5 sm:px-6 pb-6">
          <div className="border-t border-gray-100 mb-5" />

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Sidebar image */}
            <div className="hidden sm:block flex-shrink-0 w-44 xl:w-52 rounded-xl overflow-hidden self-start border border-gray-100 bg-white">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-44 xl:h-52 object-contain"
              />
              <div className="bg-[#0D8B6F]/10 border border-[#0D8B6F]/20 rounded-b-xl p-3 text-center">
                <p className="text-[11px] text-[#0D8B6F] font-semibold">
                  {cat.icon} {cat.title}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {cat.treatments.length} Treatments
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#0D8B6F] to-[#0a6b56] text-white">
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-tl-lg">
                      Treatment
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider">
                      Sessions
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-tr-lg">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cat.treatments.map((tr, i) => (
                    <tr
                      key={i}
                      className={`border-b border-gray-50 hover:bg-[#0D8B6F]/5 transition-colors ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                      }`}
                    >
                      <td className="px-4 py-2.5 text-gray-800 font-medium text-xs">
                        {tr.name}
                      </td>
                      <td className="px-4 py-2.5 text-center text-xs text-gray-500">
                        {tr.sessions}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="text-[#0D8B6F] font-bold text-xs">
                          {tr.price}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex justify-end">
                <Link
                  to="/contact?action=book"
                  className="inline-flex items-center gap-1.5 bg-[#0D8B6F] hover:bg-[#0a6b56] text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  Book This Treatment{" "}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AestheticPage() {
  const [openSection, setOpenSection] = useState(null);

  const toggle = (id) =>
    setOpenSection((prev) => (prev === id ? null : id));

  return (
    <div className="bg-[#F8FAFB] min-h-screen">

      {/* ────── HERO ────── */}
      <div className="relative bg-gradient-to-br from-[#0a3d2e] via-[#0D8B6F] to-[#1a5c46] overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#B88A28] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center gap-12">

            {/* Left copy */}
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block text-[#B88A28] font-semibold text-xs uppercase tracking-[0.25em] mb-4 border border-[#B88A28]/40 px-4 py-1.5 rounded-full">
                Department of Aesthetic Medicine
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 font-serif leading-tight">
                Skin, Hair &<br />
                <span className="text-[#B88A28]">Laser Treatments</span>
              </h1>
              <p className="text-green-100 text-base max-w-md mb-2 tracking-widest font-light">
                Enhance • Rejuvenate • Transform
              </p>
              <p className="text-green-100/80 text-sm max-w-lg mb-8 leading-relaxed">
                World-class aesthetic treatments tailored to your unique skin
                needs — delivered by expert doctors using FDA-approved
                technology.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  to="/contact?action=book"
                  className="bg-[#B88A28] hover:bg-[#9a7220] text-white px-7 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Book Consultation
                </Link>
                <a
                  href="tel:+918800402219"
                  className="border border-white/40 hover:border-white text-white px-7 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all hover:bg-white/10"
                >
                  📞 +91 88004 02219
                </a>
              </div>
            </div>

            {/* Right image */}
            <div className="flex-shrink-0 w-full md:w-80 lg:w-96">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=80"
                  alt="Aesthetic Treatment at Fatima Hospital"
                  className="w-full h-72 md:h-80 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-white font-bold text-sm">
                    ✦ Premium Aesthetic Care
                  </p>
                  <p className="text-white/70 text-xs">
                    Compassion | Care | Cure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* wave divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-10 bg-[#F8FAFB]"
          style={{ clipPath: "ellipse(65% 100% at 50% 100%)" }}
        />
      </div>

      {/* ────── WHY CHOOSE US STRIP ────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10 mb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {whyUs.map((item, i) => (
            <div key={i} className="text-center p-3">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-xs font-semibold text-gray-700 leading-snug">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ────── SECTION HEADING ────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D8B6F] mb-3 inline-block">
          Our Services
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 font-serif">
          Aesthetic Treatment Price List
        </h2>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          Click on any category to view detailed treatments, sessions and
          pricing.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <span className="w-8 h-1 rounded-full bg-[#0D8B6F]" />
          <span className="w-4 h-1 rounded-full bg-[#B88A28]" />
          <span className="w-2 h-1 rounded-full bg-gray-300" />
        </div>
      </div>

      {/* ────── ACCORDION LIST ────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-4">
        {categories.map((cat, idx) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            idx={idx}
            isOpen={openSection === cat.id}
            onToggle={() => toggle(cat.id)}
          />
        ))}

        {/* ────── BOTTOM CTA ────── */}
        <div className="bg-gradient-to-r from-[#0a3d2e] to-[#0D8B6F] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-white text-xl sm:text-2xl font-bold font-serif mb-1">
              Ready to Begin Your Transformation?
            </h3>
            <p className="text-green-100 text-sm">
              Schedule your personalised consultation today.
            </p>
            <p className="text-[#B88A28] font-bold text-sm mt-1">
              📍 275A, Lane no. 13, Zakir Nagar, Okhla, New Delhi – 110025
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="tel:+918800402219"
              className="bg-[#B88A28] hover:bg-[#9a7220] text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider text-center transition-all hover:shadow-lg"
            >
              📞 +91 88004 02219
            </a>
            <Link
              to="/contact"
              className="border-2 border-white/50 hover:border-white text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider text-center transition-all hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
