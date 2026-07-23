import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Calendar, Phone } from "lucide-react";
import { AESTHETIC_CATEGORIES } from "./AestheticPage";

const BENEFITS_MAP = {
  consultation: [
    "Comprehensive skin health analysis using Visia diagnostic technology.",
    "Personalised treatment plans tailored to your skin type and budget.",
    "Expert advice from board-certified, highly-experienced dermatologists.",
    "Careful monitoring of treatment progress through follow-up reviews.",
    "Transparent cost projections and realistic outcome expectations.",
    "Honest clinical guidance with a patient-centric approach."
  ],
  "medi-facials": [
    "Deep skin rejuvenation with clinical-grade active ingredients.",
    "Boosts collagen production, improving skin elasticity & firmness.",
    "Addresses specific concerns: acne, fine lines, tanning, & dullness.",
    "Zero downtime with immediate, visible glow and refinement.",
    "Medical-grade extractions, sanitised steam, and custom face masks.",
    "Supervised by certified aesthetic physicians for optimal safety."
  ],
  "hydra-facials": [
    "Vortex-Fusion technology deeply cleanses & extracts impurities.",
    "Simultaneous hydration & nourishment with premium serums.",
    "Provides a visible, long-lasting 'Korean Glass Skin' radiance.",
    "Perfect prep for weddings, events, and special occasions.",
    "Targets dry patches and fine lines for immediate skin plumping.",
    "Completely non-invasive procedure with zero recovery time."
  ],
  "chemical-peels": [
    "Accelerates skin renewal by removing outer damaged layers.",
    "Fades melasma, sun spots, & stubborn hyperpigmentation.",
    "Smooths rough skin texture & reduces acne breakouts.",
    "Stimulates natural collagen synthesis for youthful skin.",
    "Tailored depths (superficial to deep) based on skin tolerance.",
    "Comprehensive post-procedure guidance and protection protocols."
  ],
  "laser-skin": [
    "US FDA-approved technology targets concerns at root level.",
    "Highly precise treatment without affecting healthy skin.",
    "Minimizes acne scars, open pores, and stretch marks.",
    "Non-surgical skin tightening & lifting (HIFU/RF).",
    "Pinpoint accuracy for safe, quick mole & skin tag removal.",
    "Supervised by clinical experts in a fully sterile environment."
  ],
  hair: [
    "Reactivates dormant hair follicles to promote new growth.",
    "Strengthens hair roots & reduces active hair shedding.",
    "Improves scalp health, hair density, & overall thickness.",
    "Uses safe, clinically-proven growth factors & biologic treatments.",
    "Gradual, highly sustainable results with structured sessions.",
    "Safe, hospital-grade equipment with strict hygiene standards."
  ],
  injectables: [
    "Smooths dynamic wrinkles & fine lines instantly.",
    "Restores lost volume in cheeks, lips, chin, & jawline.",
    "Deep, long-lasting dermal hydration using biostimulators.",
    "Natural-looking, customizable, and fully reversible results.",
    "Uses only globally-certified, premium neuromodulators and fillers.",
    "Administered by expert injectors with deep anatomical knowledge."
  ],
  "acne-scar": [
    "Combats active acne breakouts and controls sebum production.",
    "Reduces post-inflammatory redness and hyperpigmentation.",
    "Promotes skin remodelling to fill deep boxcar/rolling scars.",
    "Structured, multi-modal programs for long-term clear skin.",
    "Tailored combination of lasers, peels, and medical subcision.",
    "Prescribed clinical home-care support to prevent recurrences."
  ],
  body: [
    "Targeted skin brightening & polishing for full-body radiance.",
    "Reduces appearance of stubborn cellulite & stretch marks.",
    "Non-surgical fat reduction with advanced body contouring.",
    "IV Nutrient Drips detoxify the body & boost overall vitality.",
    "Brightens sensitive areas like underarms with clinical safety.",
    "Private, hygienic treatment suites ensuring complete comfort."
  ],
  "laser-hair": [
    "Up to 90% permanent hair reduction after completing course.",
    "Prevents painful ingrown hairs, razor bumps, & skin irritation.",
    "Saves time & money compared to lifetime waxing or shaving.",
    "Fast, comfortable sessions using state-of-the-art diode lasers.",
    "Advanced cooling technology keeps the process virtually painless.",
    "Safe for all Indian skin tones with custom wavelength options."
  ]
};

export default function AestheticServicePage() {
  const { categoryId } = useParams();
  const cat = AESTHETIC_CATEGORIES.find((c) => c.id === categoryId);

  // Unknown category → redirect to listing
  if (!cat) return <Navigate to="/aesthetic" replace />;

  // Adjacent categories for "see also" navigation
  const idx = AESTHETIC_CATEGORIES.indexOf(cat);
  const prevCat = AESTHETIC_CATEGORIES[idx - 1] || null;
  const nextCat = AESTHETIC_CATEGORIES[idx + 1] || null;

  return (
    <div className="bg-[#F8FAFB] min-h-screen">

      {/* ─── HERO BANNER ─── */}
      <div className="relative h-72 sm:h-80 md:h-96 overflow-hidden">
        <img
          src={cat.image}
          alt={cat.title}
          className="w-full h-full object-cover object-center"
        />
        {/* dark scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />

        {/* Back link */}
        <Link
          to="/aesthetic"
          className="absolute top-6 left-4 sm:left-8 inline-flex items-center gap-2 text-white/80 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All Services
        </Link>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-12">
          <span className="inline-block text-[#B88A28] font-semibold text-[10px] uppercase tracking-[0.25em] mb-3 border border-[#B88A28]/40 px-3 py-1 rounded-full">
            Department of Aesthetic Medicine
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-serif mb-1 leading-tight drop-shadow-lg">
            {cat.icon} {cat.title}
          </h1>
          <p className="text-white/80 text-sm max-w-lg">{cat.subtitle}</p>
        </div>
      </div>

      {/* ─── BODY ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── LEFT: main content ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-sm border border-slate-400">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-[#0D8B6F] rounded-full" />
                <h2 className="text-xl font-bold text-gray-900 font-serif">About This Service</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{cat.description1}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{cat.description2}</p>
              {cat.description3 && (
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{cat.description3}</p>
              )}

              {/* Benefits list */}
              {BENEFITS_MAP[cat.id] && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-1.5">
                    ✨ Key Benefits
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BENEFITS_MAP[cat.id].map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                        <CheckCircle className="w-3.5 h-3.5 text-[#0D8B6F] mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Treatment List */}
            <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-sm border border-slate-400">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-[#B88A28] rounded-full" />
                <h2 className="text-xl font-bold text-gray-900 font-serif">Treatments & Pricing</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#0D8B6F] to-[#0a6b56] text-white">
                      <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-tl-xl">
                        Treatment
                      </th>
                      <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider">
                        Sessions
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-tr-xl">
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
                        <td className="px-4 py-3 text-gray-800 font-medium text-xs flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-[#0D8B6F] flex-shrink-0" />
                          {tr.name}
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-gray-500">
                          {tr.sessions}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-[#0D8B6F] font-bold text-xs">{tr.price}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-gray-400 mt-4 italic">
                * Prices are indicative. Final pricing may vary based on individual assessment. All procedures are performed by certified medical professionals.
              </p>
            </div>

            {/* Prev / Next navigation */}
            <div className="flex gap-4">
              {prevCat && (
                <Link
                  to={`/aesthetic/${prevCat.id}`}
                  className="flex-1 flex items-center gap-3 bg-white border border-slate-400 rounded-xl p-4 hover:border-[#0D8B6F]/40 hover:shadow-md transition-all group"
                >
                  <ArrowLeft className="w-4 h-4 text-[#0D8B6F] flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Previous</p>
                    <p className="text-xs font-bold text-gray-800 truncate">{prevCat.title}</p>
                  </div>
                </Link>
              )}
              {nextCat && (
                <Link
                  to={`/aesthetic/${nextCat.id}`}
                  className="flex-1 flex items-center justify-end gap-3 bg-white border border-slate-400 rounded-xl p-4 hover:border-[#0D8B6F]/40 hover:shadow-md transition-all group text-right"
                >
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Next</p>
                    <p className="text-xs font-bold text-gray-800 truncate">{nextCat.title}</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-[#0D8B6F] rotate-180 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>

          {/* ── RIGHT: sticky sidebar ── */}
          <div className="space-y-5 self-start sticky top-24">

            {/* Book Card */}
            <div className="bg-gradient-to-br from-[#0a3d2e] to-[#0D8B6F] rounded-2xl p-6 text-white shadow-xl">
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="font-bold text-base font-serif mb-1">{cat.title}</h3>
              <p className="text-green-100/80 text-xs mb-5 leading-relaxed">{cat.subtitle}</p>

              <div className="space-y-3">
                <Link
                  to="/contact?action=book"
                  className="flex items-center justify-center gap-2 w-full bg-[#B88A28] hover:bg-[#9a7220] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Appointment
                </Link>
                <a
                  href="tel:+918800402219"
                  className="flex items-center justify-center gap-2 w-full border border-white/30 hover:border-white text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:bg-white/10"
                >
                  <Phone className="w-3.5 h-3.5" /> +91 88004 02219
                </a>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 text-[10px] text-green-100/60 leading-relaxed">
                📍 275A, Lane 13, Zakir Nagar, Okhla, New Delhi – 110025
              </div>
            </div>

            {/* Why us card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-400">
              <h4 className="font-bold text-sm text-gray-900 mb-4">Why Choose Us?</h4>
              {[
                "Certified Aesthetic Physicians",
                "Zero Compromise on Hygiene",
                "Personalised Treatment Plans",
                "International-Grade Protocols",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 mb-2.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#0D8B6F] flex-shrink-0" />
                  <span className="text-xs text-gray-600">{item}</span>
                </div>
              ))}
            </div>

            {/* Browse other services */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-400">
              <h4 className="font-bold text-sm text-gray-900 mb-4">Other Services</h4>
              <div className="space-y-1.5">
                {AESTHETIC_CATEGORIES.filter((c) => c.id !== cat.id).slice(0, 6).map((c) => (
                  <Link
                    key={c.id}
                    to={`/aesthetic/${c.id}`}
                    className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#0D8B6F] transition-colors py-1"
                  >
                    <span>{c.icon}</span> {c.title}
                  </Link>
                ))}
                <Link to="/aesthetic" className="block mt-2 text-[10px] font-bold text-[#0D8B6F] uppercase tracking-wider hover:underline">
                  View All →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
