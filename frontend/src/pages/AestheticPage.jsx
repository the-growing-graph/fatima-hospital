import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// ─── Shared data ──────────────────────────────────────────────────────────────
export const AESTHETIC_CATEGORIES = [
  {
    id: "consultation",
    title: "Consultation & Basic Services",
    subtitle: "Start your aesthetic journey with an expert evaluation",
    icon: "🩺",
    image: "/skinCare/consultation_basic_service.png",
    description1:
      "Every great aesthetic result begins with a thorough, personalised consultation. Our board-certified dermatologists and aesthetic physicians invest time in understanding your unique skin type, lifestyle, and beauty goals before recommending any treatment.",
    description2:
      "Using advanced Visia skin-analysis technology, we map skin texture, pores, UV damage, and pigmentation to create a scientifically-backed treatment roadmap. Follow-up consultations ensure we track progress and adjust plans for optimal, lasting results.",
    description3:
      "Our commitment is to guide you step-by-step, ensuring transparent cost projections, realistic outcome expectations, and an honest clinical approach.",
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
    image: "/skinCare/medi_facial.png",
    description1:
      "Unlike salon facials, Medi Facials are prescribed and supervised by certified aesthetic physicians and use clinically-tested active ingredients — retinoids, peptides, AHAs, antioxidants and growth factors — in precise therapeutic concentrations.",
    description2:
      "From deep hydration to anti-ageing, brightening, acne control and detan — each variant targets a specific skin concern. Regular sessions improve cellular turnover, collagen density, and radiance, delivering results that are visible from the very first session.",
    description3:
      "Every session is tailored, combining medical extraction, clean steam, chemical exfoliation, and advanced custom masks to suit your current skin condition.",
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
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
    description1:
      "Hydra Facials use patented Vortex-Fusion technology to deeply cleanse, exfoliate, extract impurities, and simultaneously infuse skin with hyaluronic acid, peptides, and antioxidants — leaving it plump, dewy, and visibly luminous.",
    description2:
      "Our Signature Facials, including Korean Glass Skin, Hollywood Glow, and Bridal Glow, combine advanced serums and skilled hand techniques to deliver an unmatched radiance that lasts weeks. Suitable for all skin types with zero downtime.",
    description3:
      "By targeting dry patches, fine expression lines, and clogged pores, this premium treatment ensures a refined texture and a long-lasting, youthful radiance.",
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
    image: "/skinCare/chemical_peels.png",
    description1:
      "Chemical peels use precisely-formulated acids to remove the outer damaged skin layers, stimulating new cell growth, collagen production, and melanin regulation. The result is a dramatically smoother, clearer, and more even-toned complexion.",
    description2:
      "We offer a complete spectrum from superficial glycolic and salicylic peels for mild concerns, to medium-depth TCA and Jessner peels for scarring, melasma and deep pigmentation, to the gold-standard Cosmelan Depigmentation protocol for stubborn discolouration.",
    description3:
      "Our medical team provides comprehensive post-peel guidance and sunscreen protocols to protect the fresh, new skin layers during the brief healing phase.",
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
    image: "/skinCare/laser_and_skin.png",
    description1:
      "Our state-of-the-art US FDA-approved laser systems target pigmentation, acne, scarring, open pores, and skin laxity with pinpoint precision — treating the root cause without damaging surrounding healthy tissue. Minimal downtime, maximum results.",
    description2:
      "From Q-Switch Toning and CO₂ Fractional resurfacing to HIFU skin tightening and RF — our laser menu covers the complete spectrum of skin concerns. Procedures like mole removal, skin-tag removal, and wart removal are performed with surgical precision in a sterile environment.",
    description3:
      "All procedures are executed by trained clinicians under strict medical supervision, ensuring maximum comfort, zero infection risk, and consistent outcomes.",
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
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    description1:
      "Hair loss — whether from androgenetic alopecia, hormonal shifts, or nutritional deficiencies — responds remarkably well to modern biologic therapies. Our protocols are designed to reactivate dormant follicles, strengthen hair shafts, and restore scalp health.",
    description2:
      "We offer the full spectrum: PRP, GFC (Growth Factor Concentrate), Exosome Therapy, and Mesotherapy — all performed by trained physicians using sterile, hospital-grade equipment. Each treatment plan is customised to your hair loss grade and scalp condition.",
    description3:
      "With structured sessions spaced over 4–6 weeks, we ensure a gradual and sustainable improvement in hair density and strength.",
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
    image: "/skinCare/injectables.png",
    description1:
      "Injectables are the gold standard of non-surgical facial rejuvenation. From Botulinum Toxin (Botox) to smooth dynamic wrinkles, to Hyaluronic Acid fillers that sculpt lips, jawlines, and cheeks — results are immediate, natural-looking, and fully reversible.",
    description2:
      "We use only internationally-certified, physician-grade neuromodulators and fillers. Advanced biostimulators like Profhilo, Polynucleotides and Salmon DNA stimulate collagen deep within the dermis for a more youthful skin quality — not just surface enhancement.",
    description3:
      "Our certified aesthetic injectors possess a deep understanding of facial anatomy, ensuring precise placements that respect your natural expressions.",
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
    image: "/skinCare/acne_scar.png",
    description1:
      "Acne, post-acne scarring, and pigmentation are among the most complex skin conditions — requiring multi-modal, physician-supervised programs rather than single treatments. Our evidence-based protocols combine lasers, peels, and biostimulators for synergistic results.",
    description2:
      "Whether you're dealing with comedonal acne, cystic breakouts, ice-pick scars, boxcar scars, hyperpigmentation or melasma — our structured 6–12 session programs tackle the problem at multiple levels: sebum control, inflammation, melanin regulation, and collagen remodelling.",
    description3:
      "We also customise home-care prescriptions to support the clinical treatments, ensuring long-term remission and preventing future breakouts.",
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
    image: "/skinCare/body_treatments.png",
    description1:
      "Our body aesthetics services go far beyond surface-level treatments. From targeted brightening of underarms and intimate areas, to cellulite reduction, body polishing and stretch mark correction — each procedure is clinician-designed for measurable, lasting improvement.",
    description2:
      "We combine advanced RF and cool-sculpting technology for non-surgical fat reduction and body contouring, alongside premium IV Drip therapies (Glutathione, Vitamin Cocktails, Detox) that work from within to enhance your glow, immunity, and overall vitality.",
    description3:
      "All body treatments are performed in absolute privacy, adhering to hospital-grade sanitization protocols to guarantee your complete comfort.",
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
    image: "/skinCare/laser_hair_reduction.png",
    description1:
      "Laser Hair Reduction (LHR) uses targeted light energy to permanently destroy the hair follicle's growth cycle — delivering up to 90% long-term reduction after a course of sessions. Our medical-grade diode lasers are safe for all Indian skin tones (Fitzpatrick III–VI).",
    description2:
      "Treatments cover every area of the body — from delicate facial zones to legs, arms, back, underarms, bikini line and more. Each session takes 15–45 minutes depending on area, with no downtime. A personalised session count is recommended after a patch test.",
    description3:
      "Our advanced cooling tips keep the treatment virtually painless, making it comfortable even for sensitive areas like the upper lip, bikini line, and underarms.",
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
  { icon: "👨‍⚕️", text: "Expert Dermatologists" },
  { icon: "📋", text: "Customized Plans" },
  { icon: "✅", text: "Safe & Result Oriented" },
  { icon: "🧪", text: "Clinically Tested Products" },
  { icon: "🎧", text: "24/7 Dedicated Support" },
];

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ cat }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-350 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={cat.image}
          alt={cat.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Icon badge */}
        <div className="absolute top-3 left-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-lg shadow-md">
          {cat.icon}
        </div>
        {/* treatment count pill */}
        <div className="absolute bottom-3 right-3 bg-[#0D8B6F] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg uppercase tracking-wider">
          {cat.treatments.length} Services
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-5">
        <h3 className="text-[15px] font-bold text-gray-900 font-serif mb-1.5 leading-snug group-hover:text-[#0D8B6F] transition-colors">
          {cat.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed flex-1">{cat.subtitle}</p>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4" />

        {/* CTA */}
        <Link
          to={`/aesthetic/${cat.id}`}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0D8B6F] to-[#0a6b56] hover:from-[#0a6b56] hover:to-[#084f41] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all duration-200 hover:shadow-md"
        >
          View Services <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AestheticPage() {
  return (
    <div className="bg-[#F8FAFB] min-h-screen">

      {/* ─── HERO ─── */}
      <div className="relative bg-gradient-to-br from-[#0a3d2e] via-[#0D8B6F] to-[#1a5c46] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#B88A28] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center gap-12">

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
                World-class aesthetic treatments tailored to your unique skin needs — delivered by expert doctors using FDA-approved technology.
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

            <div className="flex-shrink-0 w-full md:w-80 lg:w-96">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src="/skinCare/skin_care_heading.png"
                  alt="Aesthetic Treatment at Fatima Hospital"
                  className="w-full h-72 md:h-80 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-white font-bold text-sm">✦ Premium Aesthetic Care</p>
                  <p className="text-white/70 text-xs">Compassion | Care | Cure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#F8FAFB]" style={{ clipPath: "ellipse(65% 100% at 50% 100%)" }} />
      </div>

      {/* ─── WHY US ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10 mb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {whyUs.map((item, i) => (
            <div key={i} className="text-center p-3">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-xs font-semibold text-gray-700 leading-snug">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SERVICES GRID ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D8B6F] mb-3 inline-block">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 font-serif">
            Explore Aesthetic Treatments
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Choose a category below to explore treatments, pricing and everything you need to know.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="w-8 h-1 rounded-full bg-[#0D8B6F]" />
            <span className="w-4 h-1 rounded-full bg-[#B88A28]" />
            <span className="w-2 h-1 rounded-full bg-gray-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {AESTHETIC_CATEGORIES.map((cat) => (
            <ServiceCard key={cat.id} cat={cat} />
          ))}
        </div>

        {/* ─── BOTTOM CTA ─── */}
        <div className="mt-16 bg-gradient-to-r from-[#0a3d2e] to-[#0D8B6F] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-white text-xl sm:text-2xl font-bold font-serif mb-1">
              Ready to Begin Your Transformation?
            </h3>
            <p className="text-green-100 text-sm">Schedule your personalised consultation today.</p>
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
