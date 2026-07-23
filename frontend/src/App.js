import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import AestheticPage from "./pages/AestheticPage";
import { 
  Phone, 
  Calendar, 
  MessageSquare, 
  Heart, 
  Award, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Menu, 
  X, 
  Baby, 
  Activity, 
  Users, 
  Plus, 
  ShieldAlert, 
  FileText, 
  Stethoscope, 
  TrendingUp, 
  BookOpen, 
  CheckCircle, 
  Trash2, 
  Edit, 
  LogOut, 
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { 
  AUTH, 
  NAVIGATION, 
  FOOTER, 
  HOME_PAGE, 
  MATERNITY_PAGE, 
  APPOINTMENT_FORM, 
  CONTACT_PAGE, 
  ADMIN_PANEL, 
  FLOATING_ACTIONS 
} from "@/constants/testIds";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://fatima-health-1.preview.emergentagent.com";
const API_URL = `${BACKEND_URL}/api`;

// Axios default credentials configuration
axios.defaults.withCredentials = true;

// Resolve a media URL: prepend backend host for uploaded /api file paths, leave external URLs untouched
const resolveMedia = (url) => {
  if (!url) return "";
  if (url.startsWith("/api/")) return `${BACKEND_URL}${url}`;
  return url;
};

// Extract a YouTube video id from any common URL form
const youtubeId = (url) => {
  if (!url) return "";
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : "";
};

// ----------------------------------------------------------------------
// AUTH CONTEXT
// ----------------------------------------------------------------------
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/me`);
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      setUser(data);
      toast.success("Welcome back, Admin!");
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Invalid email or password";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
      setUser(null);
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// ----------------------------------------------------------------------
// DATA & CONSTANTS
// ----------------------------------------------------------------------
const HOSPITAL_LOGO = "/logo.png";

const DEPARTMENTS = [
  {
    id: "gynaecology",
    name: "Obstetrics & Gynaecology",
    shortName: "Gynaecology",
    icon: Baby,
    description: "Dedicated maternity care, advanced labor rooms, high-risk pregnancy management, and fertility treatments.",
    conditions: ["High-Risk Pregnancy", "Normal Delivery", "C-Section Delivery", "PCOD/PCOS", "Infertility Management", "Uterine Fibroids"],
    facilities: ["Advanced Labour Rooms", "Pre-Labour Monitoring Unit", "Private Maternity Suites", "Dedicated Lactation Area"]
  },
  {
    id: "pediatrics",
    name: "Pediatrics & Neonatology",
    shortName: "Pediatrics",
    icon: Heart,
    description: "24x7 specialized newborn and pediatric care with advanced Level-III NICU facilities.",
    conditions: ["Newborn Jaundice", "Premature Birth Care", "Pediatric Emergencies", "Growth & Nutrition", "Child Immunization"],
    facilities: ["Advanced Level-III NICU", "Pediatric ICU (PICU)", "Immunization Center", "Neonatal Transport Service"]
  },
  {
    id: "medicine",
    name: "General Medicine",
    shortName: "Medicine",
    icon: Activity,
    description: "Comprehensive management of acute & chronic adult illnesses, lifestyle disorders, and metabolic diseases.",
    conditions: ["Hypertension & Diabetes", "Infectious Diseases", "Asthma & COPD", "Thyroid Disorders", "Geriatric Care"],
    facilities: ["In-House Diagnostics", "Preventive Health Lounge", "24x7 Emergency Care"]
  },
  {
    id: "orthopaedics",
    name: "Orthopaedics & Joint Care",
    shortName: "Orthopaedics",
    icon: Stethoscope,
    description: "Advanced trauma care, joint replacement surgeries, arthroscopy, and specialized physiotherapy.",
    conditions: ["Joint Pain & Arthritis", "Sports Injuries", "Bone Fractures & Trauma", "Spine Disorders", "Osteoporosis"],
    facilities: ["Modular Operation Theatre", "C-Arm Imaging Technology", "Advanced Physiotherapy Unit"]
  },
  {
    id: "surgery",
    name: "General & Laparoscopic Surgery",
    shortName: "Surgery",
    icon: Activity,
    description: "Minimally invasive, safe laparoscopic procedures for faster patient recovery.",
    conditions: ["Hernia Surgery", "Gallbladder Stones", "Appendicitis", "Piles & Fissures", "Thyroid & Breast Tumors"],
    facilities: ["Modular OT with HEPA Filters", "Advanced Laparoscopy Stack", "Day Care Surgery Center"]
  },
  {
    id: "urology",
    name: "Urology & Kidney Care",
    shortName: "Urology",
    icon: Activity,
    description: "State-of-the-art care for urinary tract conditions, kidney stones, and prostate health.",
    conditions: ["Kidney Stones", "Prostate Enlargement (BPH)", "Urinary Tract Infections (UTI)", "Urological Cancers"],
    facilities: ["C-Arm Imaging", "Lithotripsy Setup", "Endourology Suite"]
  },
  {
    id: "physiotherapy",
    name: "Physiotherapy & Rehabilitation",
    shortName: "Physiotherapy",
    icon: Award,
    description: "Tailored rehabilitation and post-surgical recovery programs to restore optimal mobility.",
    conditions: ["Post-Stroke Rehab", "Back & Neck Pain", "Sports Injury Recovery", "Post-Joint Replacement Care"],
    facilities: ["Electrotherapy Station", "Therapeutic Gym", "Manual Therapy Zone"]
  },
  {
    id: "critical_care",
    name: "Critical Care (ICU)",
    shortName: "Critical Care",
    icon: ShieldAlert,
    description: "High-dependency multi-bed ICU equipped with advanced life-support ventilators and monitors.",
    conditions: ["Sepsis", "Multiorgan Failure", "Post-Surgical Critical Care", "Severe Respiratory Distress"],
    facilities: ["24x7 Intensivist Cover", "Advanced Multi-Channel Monitors", "In-House Blood Gas Analysis"]
  },
  {
    id: "emergency_medicine",
    name: "Emergency Medicine",
    shortName: "Emergency",
    icon: Phone,
    description: "24x7 trauma and triage center managed by highly qualified emergency physicians.",
    conditions: ["Cardiac Arrest & Chest Pain", "Severe Trauma & Accidents", "Acute Respiratory Distress", "Poisoning Case Care"],
    facilities: ["Emergency Entrance with Ambulance Bay", "Triage Beds", "24x7 Pharmacy & Diagnostic Lab"]
  },
  {
    id: "diagnostics",
    name: "In-House Diagnostics",
    shortName: "Diagnostics",
    icon: FileText,
    description: "Comprehensive pathology laboratory and imaging support under one secure roof.",
    conditions: ["Routine Blood Tests", "Hormonal Assays", "Digital X-Ray & Ultrasounds", "Cardiology Screening (ECG/ECHO)"],
    facilities: ["Fully Automated Chemistry Analyzer", "Digital X-Ray Machine", "High-Resolution Ultrasound"]
  }
];

const INFRASTRUCTURE_GALLERY = [
  { title: "Emergency Department", url: "/images/patient-ward.jpg", category: "clinical" },
  { title: "Reception & Waiting Area", url: "/images/reception.jpg", category: "general" },
  { title: "Premium Private Suite", url: "/images/private-suite.jpg", category: "rooms" },
  { title: "Modular Operation Theatre", url: "/images/operation-theatre.jpg", category: "clinical" },
  { title: "NICU Facilities", url: "/images/nicu.jpg", category: "maternity" },
  { title: "Labor & Delivery Suite", url: "/images/labour-suite.jpg", category: "maternity" }
];

// ----------------------------------------------------------------------
// SHARED COMPONENTS
// ----------------------------------------------------------------------

function AnimatedCounter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStarted(true);
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let raf;
    let startTime;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setCount(end);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* Editorial Top Marquee */}
      <div className="bg-[#0D8B6F] text-white py-2 overflow-hidden border-b border-[#0A6B56]">
        <div className="flex w-max whitespace-nowrap text-xs uppercase tracking-widest font-semibold animate-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0">
              <span className="mx-4">⚡ 24x7 Emergency Helpline: 011-41675390, +91 8800402219</span>
              <span className="mx-4">•</span>
              <span className="mx-4">👶 14,000+ Successful Deliveries</span>
              <span className="mx-4">•</span>
              <span className="mx-4">🏥 Premium Multispeciality Hospital in South Delhi</span>
              <span className="mx-4">•</span>
              <span className="mx-4">🌟 20+ Years of Healthcare Excellence Since 2002</span>
              <span className="mx-4">•</span>
              <span className="mx-4">🩸 Fully Automated In-House Diagnostics</span>
              <span className="mx-4">•</span>
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" data-testid={NAVIGATION.logo} className="flex items-center gap-3">
            <img src={HOSPITAL_LOGO} alt="Fatima Hospital Logo" className="h-20 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-7 text-sm font-semibold tracking-wide text-gray-700">
            <Link to="/" data-testid={NAVIGATION.homeLink} className="hover:text-[#0D8B6F] transition-colors">Home</Link>

            <div className="relative group">
              <button data-testid={NAVIGATION.aboutLink} className="flex items-center gap-1 h-20 hover:text-[#0D8B6F] transition-colors">
                About <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 w-60 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col">
                  <Link to="/about" data-testid={NAVIGATION.aboutUsLink} className="px-4 py-3 rounded-xl text-gray-700 hover:bg-[#0D8B6F]/5 hover:text-[#0D8B6F] transition-colors">About Us</Link>
                  <Link to="/facilities" data-testid={NAVIGATION.facilitiesLink} className="px-4 py-3 rounded-xl text-gray-700 hover:bg-[#0D8B6F]/5 hover:text-[#0D8B6F] transition-colors">Facilities & Infrastructure</Link>
                  <Link to="/gallery" data-testid={NAVIGATION.galleryLink} className="px-4 py-3 rounded-xl text-gray-700 hover:bg-[#0D8B6F]/5 hover:text-[#0D8B6F] transition-colors">Photo Gallery</Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-1 h-20 hover:text-[#0D8B6F] transition-colors">
                Patient Care <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 w-60 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col">
                  <Link to="/departments" data-testid={NAVIGATION.departmentsLink} className="px-4 py-3 rounded-xl text-gray-700 hover:bg-[#0D8B6F]/5 hover:text-[#0D8B6F] transition-colors">Departments</Link>
                  <Link to="/maternity" data-testid={NAVIGATION.maternityLink} className="px-4 py-3 rounded-xl text-gray-700 hover:bg-[#0D8B6F]/5 hover:text-[#0D8B6F] transition-colors">Maternity Excellence</Link>
                  <Link to="/aesthetic" className="px-4 py-3 rounded-xl text-gray-700 hover:bg-[#0D8B6F]/5 hover:text-[#0D8B6F] transition-colors">Aesthetic & Skin Care</Link>
                  <Link to="/doctors" data-testid={NAVIGATION.doctorsLink} className="px-4 py-3 rounded-xl text-gray-700 hover:bg-[#0D8B6F]/5 hover:text-[#0D8B6F] transition-colors">Our Doctors</Link>
                  <Link to="/blog" data-testid={NAVIGATION.blogLink} className="px-4 py-3 rounded-xl text-gray-700 hover:bg-[#0D8B6F]/5 hover:text-[#0D8B6F] transition-colors">Health Blog</Link>
                </div>
              </div>
            </div>

            <Link to="/contact" data-testid={NAVIGATION.contactLink} className="hover:text-[#0D8B6F] transition-colors">Contact</Link>
          </nav>

          <div className="hidden xl:flex items-center gap-5">
            <a href="tel:01141675390" className="flex items-center gap-2 text-[#E63946] font-bold text-sm">
              <Phone className="h-4 w-4" /> 011-41675390
            </a>
            <Link 
              to="/contact?action=book" 
              data-testid={NAVIGATION.bookAppointmentBtn} 
              className="bg-[#B88A28] text-white hover:bg-[#9A7320] px-6 py-2.5 rounded-full font-bold text-sm shadow-md transition-all duration-300 hover:scale-105"
            >
              Book Appointment
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="xl:hidden text-gray-700 hover:text-[#0D8B6F] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-gray-100 py-6 px-4 space-y-4 shadow-xl absolute top-full left-0 w-full z-40 transition-transform duration-300">
            <nav className="flex flex-col gap-4 text-sm font-semibold text-gray-700">
              <Link to="/" data-testid={NAVIGATION.homeLink} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D8B6F] py-2 border-b border-gray-50">Home</Link>
              <Link to="/about" data-testid={NAVIGATION.aboutLink} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D8B6F] py-2 border-b border-gray-50">About Us</Link>
              <Link to="/departments" data-testid={NAVIGATION.departmentsLink} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D8B6F] py-2 border-b border-gray-50">Departments</Link>
              <Link to="/maternity" data-testid={NAVIGATION.maternityLink} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D8B6F] py-2 border-b border-gray-50">Maternity Excellence</Link>
              <Link to="/aesthetic" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D8B6F] py-2 border-b border-gray-50">Aesthetic & Skin Care</Link>
              <Link to="/facilities" data-testid={NAVIGATION.facilitiesLink} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D8B6F] py-2 border-b border-gray-50">Infrastructure & Facilities</Link>
              <Link to="/doctors" data-testid={NAVIGATION.doctorsLink} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D8B6F] py-2 border-b border-gray-50">Our Doctors</Link>
              <Link to="/gallery" data-testid={NAVIGATION.galleryLink} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D8B6F] py-2 border-b border-gray-50">Gallery</Link>
              <Link to="/blog" data-testid={NAVIGATION.blogLink} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D8B6F] py-2 border-b border-gray-50">Health Blog</Link>
              <Link to="/contact" data-testid={NAVIGATION.contactLink} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D8B6F] py-2 border-b border-gray-50">Contact Us</Link>
            </nav>
            <div className="pt-2">
              <Link 
                to="/contact?action=book" 
                data-testid={NAVIGATION.bookAppointmentBtn} 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-[#B88A28] text-white py-3 rounded-full font-bold text-sm shadow-md"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1F2937] text-gray-300 pt-16 pb-8 border-t-4 border-[#0D8B6F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <img src={HOSPITAL_LOGO} alt="Fatima Hospital Logo" className="h-16 w-auto mb-5 bg-white p-2 rounded-xl" />
          <p className="text-sm leading-relaxed mb-4">
            Fatima Multispeciality Hospital has been providing premium, trusted healthcare in South Delhi & Okhla since 2002. Aapki Sehat. Aapka Parivaar. Hamara Vaada.
          </p>
          <div className="text-[#B88A28] font-semibold text-xs tracking-widest uppercase">
            20+ Years of Dedication
          </div>
        </div>

        <div>
          <h4 className="text-white text-lg font-bold mb-5 tracking-wide">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="hover:text-[#0D8B6F] transition-colors">Our 20+ Year Journey</Link></li>
            <li><Link to="/departments" className="hover:text-[#0D8B6F] transition-colors">Speciality Departments</Link></li>
            <li><Link to="/maternity" className="hover:text-[#0D8B6F] transition-colors">Maternity Excellence</Link></li>
            <li><Link to="/facilities" className="hover:text-[#0D8B6F] transition-colors">Advanced Infrastructure</Link></li>
            <li><Link to="/doctors" className="hover:text-[#0D8B6F] transition-colors">Meet Specialists</Link></li>
            <li><Link to="/blog" className="hover:text-[#0D8B6F] transition-colors">Pregnancy & Health Tips</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-lg font-bold mb-5 tracking-wide">Maternity Specialties</h4>
          <ul className="space-y-3 text-sm">
            <li>High-Risk Pregnancy Care</li>
            <li>Advanced Pre-Labour & Labour Rooms</li>
            <li>Level-III NICU Facilities</li>
            <li>14,000+ Safe Deliveries</li>
            <li>Painless Normal Deliveries</li>
            <li>Dedicated Feeding & Lactation Zone</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-lg font-bold mb-5 tracking-wide">Emergency & Location</h4>
          <p className="text-sm leading-relaxed mb-4" data-testid={FOOTER.address}>
            Fatima Multispeciality Hospital,<br />
          275 A, Lane no 13, Zakir Nagar, Okhla,<br />
          New Delhi - 110025
          </p>
          <div className="space-y-2 text-sm font-semibold">
            <div className="flex items-center gap-2 text-red-400">
              <Phone className="h-4 w-4" />
              <a href="tel:01141675390" data-testid={FOOTER.phoneLink1} className="hover:underline">011-41675390</a>
            </div>
            <div className="flex items-center gap-2 text-red-400">
              <Phone className="h-4 w-4" />
              <a href="tel:+918800402219" data-testid={FOOTER.phoneLink2} className="hover:underline">+91 8800402219</a>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <MessageSquare className="h-4 w-4" />
              <a href="https://wa.me/918800402219" data-testid={FOOTER.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp Support</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        <p className="mb-2">© {new Date().getFullYear()} Fatima Multispeciality Hospital. All Rights Reserved. | Designed for South Delhi, Jamia Nagar, New Friends Colony, Jasola, Sarita Vihar.</p>
        <p className="text-[10px] leading-relaxed max-w-4xl mx-auto">
          Target SEO Keywords: Best Hospital in Okhla • Multispeciality Hospital in Okhla • Maternity Hospital in Okhla • Best Gynaecologist in Okhla • NICU Hospital in Delhi • ICU Hospital in Okhla • 24x7 Emergency Hospital in Okhla • Pregnancy Care in Delhi
        </p>
      </div>
    </footer>
  );
}

function FloatingCTA() {
  return (
    <>
      {/* Floating Emergency Action (Bottom-Left) */}
      <a 
        href="tel:+918800402219" 
        data-testid={FLOATING_ACTIONS.emergencyBtn}
        className="fixed bottom-6 left-6 z-50 bg-[#E63946] text-white hover:bg-[#C1121F] p-4 rounded-full flex items-center gap-2 font-bold text-sm uppercase transition-transform duration-300 hover:scale-110 group animate-glow-red"
      >
        <Phone className="h-5 w-5" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
          24x7 Emergency Room
        </span>
      </a>

      {/* Floating WhatsApp Support (Bottom-Right) */}
      <a 
        href="https://wa.me/918800402219" 
        data-testid={FLOATING_ACTIONS.whatsappBtn}
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white hover:bg-[#128C7E] p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm transition-all duration-300 hover:scale-110 group"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
          Chat With Us
        </span>
      </a>
    </>
  );
}

// ----------------------------------------------------------------------
// PAGES
// ----------------------------------------------------------------------

// 1. HOME PAGE
function HomePage() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900 text-white min-h-[85vh] flex items-center">
        {/* Absolute Background Image with 30% overlay opacity for premium contrast */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?crop=entropy&cs=srgb&fm=jpg&q=85" 
            alt="Fatima Multispeciality Hospital Sanctuary" 
            className="w-full h-full object-cover object-center opacity-40 filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A28] bg-[#B88A28]/10 px-4 py-2 rounded-full border border-[#B88A28]/20 mb-6 inline-block">
            Established 2002 • Over 20 Years of Caring
          </span>
          <h1 data-testid={HOME_PAGE.heroTitle} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-3xl leading-tight font-serif">
            20+ Years of <span className="text-[#0D8B6F]">Trusted Healthcare</span> in South Delhi
          </h1>
          <p data-testid={HOME_PAGE.heroSubtitle} className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed font-sans">
            Providing compassionate, advanced, and patient-focused healthcare since 2002. Experience state-of-the-art surgery, premium maternity excellence, and 24x7 emergencies under one roof.
          </p>

          <div className="flex flex-wrap gap-4">
            <a 
              href="tel:+918800402219" 
              data-testid={HOME_PAGE.heroEmergencyBtn}
              className="bg-[#E63946] hover:bg-[#C1121F] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-transform duration-300 hover:scale-105 animate-glow-red"
            >
              <Phone className="h-5 w-5" /> 24x7 Emergency Care
            </a>
            <Link 
              to="/contact?action=book" 
              data-testid={HOME_PAGE.heroBookBtn}
              className="bg-[#0D8B6F] hover:bg-[#0A6B56] text-white px-8 py-4 rounded-full font-bold shadow-lg transition-transform duration-300 hover:scale-105"
            >
              Book Appointment
            </Link>
            <a 
              href="https://wa.me/918800402219" 
              data-testid={HOME_PAGE.heroWhatsappBtn}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-transparent border border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-transform duration-300 hover:scale-105"
            >
              <MessageSquare className="h-5 w-5 text-green-400" /> WhatsApp Enquiry
            </a>
          </div>
        </div>
      </section>

      {/* Trust Statistics Strip */}
      <section className="bg-white py-12 border-y border-gray-100 shadow-sm relative z-20 -mt-10 max-w-6xl mx-auto rounded-2xl sm:rounded-3xl grid grid-cols-2 lg:grid-cols-4 gap-8 px-6 text-center">
        <div className="border-r border-gray-100 last:border-0" data-testid={HOME_PAGE.statsGrid}>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0D8B6F]"><AnimatedCounter end={20} suffix="+" /></div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-medium">Years Experience</div>
        </div>
        <div className="border-r border-gray-100 last:border-0">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0D8B6F]"><AnimatedCounter end={14000} suffix="+" /></div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-medium">Successful Deliveries</div>
        </div>
        <div className="border-r border-gray-100 last:border-0">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0D8B6F]">24/7</div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-medium">Emergency Cover</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0D8B6F]"><AnimatedCounter end={15} suffix="+" /></div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-medium">Experienced Specialists</div>
        </div>
      </section>

      {/* About Section */}
      <section data-testid={HOME_PAGE.aboutSection} className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img 
            src="https://i.ibb.co/1JYqdgpJ/Whats-App-Image-2026-07-11-at-6-50-06-PM.jpg" 
            alt="Caring Specialists at Fatima Hospital" 
            className="rounded-3xl shadow-2xl object-cover w-full h-[450px]"
          />
          <div className="absolute -bottom-6 -right-6 bg-[#0D8B6F] text-white p-6 rounded-2xl shadow-xl hidden sm:block max-w-xs border-4 border-white animate-floaty">
            <h5 className="font-bold text-lg mb-1">Our Core Promise</h5>
            <p className="text-xs text-gray-100">"Aapki Sehat. Aapka Parivaar. Hamara Vaada." Commitment to elite treatment and family care.</p>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D8B6F] mb-3 inline-block">Our Foundation</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-serif">
            A Sanctuary of Compassionate & Advanced Healthcare Since 2002
          </h2>
          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            Fatima Multispeciality Hospital has stood as a beacon of clinical excellence and community trust in Okhla, Jamia Nagar, and South Delhi for over two decades. Known for our pioneering maternal and newborn care, we offer a comprehensive spectrum of medical disciplines under one roof.
          </p>
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            Our state-of-the-art facilities include advanced Modular Operation Theatres with HEPA filters, High-Resolution C-Arm imaging, fully automated diagnostics labs, and round-the-clock emergency support. We treat each patient like our own family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-[#B88A28]" />
              <span className="text-sm font-bold text-gray-800">Advanced ICU & Neonatal NICU</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-[#B88A28]" />
              <span className="text-sm font-bold text-gray-800">24×7 In-House Pharmacy & Lab</span>
            </div>
          </div>
          <Link to="/about" className="inline-flex items-center gap-2 text-[#0D8B6F] hover:text-[#0A6B56] font-bold text-sm tracking-wide uppercase transition-colors">
            Discover Our Complete Story <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Speciality Departments Bento Grid */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D8B6F] mb-3 inline-block">Multispeciality Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-serif">Our Specialized Departments</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-16 leading-relaxed">
            From critical care medicine to life-enriching maternal treatment, our clinical teams are equipped with modern technology and deep medical expertise.
          </p>

          <div data-testid={HOME_PAGE.departmentsGrid} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DEPARTMENTS.slice(0, 6).map((dept) => {
              const IconComp = dept.icon;
              return (
                <div key={dept.id} className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-left">
                  <div className="bg-[#0D8B6F]/10 text-[#0D8B6F] h-12 w-12 rounded-xl flex items-center justify-center mb-6">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">{dept.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">{dept.description}</p>
                  <Link to={`/departments?tab=${dept.id}`} className="inline-flex items-center gap-2 text-[#0D8B6F] font-bold text-xs uppercase hover:text-[#0A6B56]">
                    Explore Speciality <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link to="/departments" className="bg-[#0D8B6F] text-white hover:bg-[#0A6B56] px-8 py-3 rounded-full font-bold text-sm tracking-wide shadow-md transition-transform duration-300 hover:scale-105 inline-block">
              View All 10 Departments
            </Link>
          </div>
        </div>
      </section>

      {/* Maternity Excellence Banner */}
      <section className="bg-white py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A28] mb-3 inline-block">Maternity Excellence</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-serif">
            A Sanctuary of New Beginnings: 14,000+ Happy Deliveries
          </h2>
          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            Maternity care is at the very core of Fatima Multispeciality Hospital's legacy. For over two decades, our high-risk obstetric specialists and round-the-clock neonatologists have guided thousands of families safely through pregnancy and birth.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#0D8B6F]"></span>
              <span className="text-sm font-semibold text-gray-700">Pre-Labour & Labour Rooms</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#0D8B6F]"></span>
              <span className="text-sm font-semibold text-gray-700">Level-III advanced NICU</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#0D8B6F]"></span>
              <span className="text-sm font-semibold text-gray-700">Dedicated Lactation Areas</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#0D8B6F]"></span>
              <span className="text-sm font-semibold text-gray-700">Painless Delivery Options</span>
            </div>
          </div>
          <Link 
            to="/maternity" 
            data-testid={HOME_PAGE.maternityCta}
            className="bg-[#B88A28] text-white hover:bg-[#9A7320] px-8 py-3.5 rounded-full font-bold text-sm tracking-wide shadow-md transition-transform duration-300 hover:scale-105 inline-block"
          >
            Explore Maternity Care & Pricing
          </Link>
        </div>

        <div className="relative">
          <img 
            src="https://images.pexels.com/photos/4041804/pexels-photo-4041804.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" 
            alt="Maternity Excellence newborn" 
            className="rounded-3xl shadow-2xl object-cover w-full h-[450px]"
          />
        </div>
      </section>

      {/* Infrastructure Showcase (Filterable Media) */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D8B6F] mb-3 inline-block">Modern Technology</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-serif">Advanced Infrastructure</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-16">
            Witness our clean, premium clinical spaces equipped with the latest medical machinery to optimize your recovery and safety.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {INFRASTRUCTURE_GALLERY.map((item, index) => (
              <div key={index} className="bg-white p-3 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-300">
                <img src={item.url} alt={item.title} className="w-full h-56 object-cover rounded-xl mb-4" />
                <h4 className="text-base font-bold text-gray-800 text-left px-2 mb-2 font-serif">{item.title}</h4>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/facilities" className="inline-flex items-center gap-2 text-[#0D8B6F] hover:text-[#0A6B56] font-bold text-sm tracking-wide uppercase transition-colors">
              Explore Complete Infrastructure Gallery <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Patient Testimonials */}
      <section data-testid={HOME_PAGE.testimonialsSection} className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D8B6F] mb-3 inline-block">Patient Love</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-serif">Stories of Care & Gratitude</h2>
        <p className="text-base text-gray-600 max-w-2xl mx-auto mb-16 leading-relaxed">
          Nothing makes us prouder than receiving warm letters of thankfulness from the mothers, fathers, and families we have served since 2002.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm text-left relative">
            <div className="text-[#B88A28] text-xl mb-4">★★★★★</div>
            <p className="text-sm text-gray-600 italic leading-relaxed mb-6">
              "We welcomed our baby girl at Fatima Hospital in September. The maternity doctors were incredibly supportive, explaining every step. The labor room was modern, and the nursing team in the feeding area helped me transition so comfortably."
            </p>
            <h5 className="font-bold text-gray-900">- Mrs. Aisha Rahman, Jamia Nagar</h5>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm text-left relative">
            <div className="text-[#B88A28] text-xl mb-4">★★★★★</div>
            <p className="text-sm text-gray-600 italic leading-relaxed mb-6">
              "My elderly father was rushed to Fatima's emergency ward late at night. The triage was fast, and they instantly moved him to the ICU. Thanks to their seasoned critical care specialists, he recovered quickly. Truly the best hospital in South Delhi."
            </p>
            <h5 className="font-bold text-gray-900">- Mr. Sameer Dixit, New Friends Colony</h5>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm text-left relative">
            <div className="text-[#B88A28] text-xl mb-4">★★★★★</div>
            <p className="text-sm text-gray-600 italic leading-relaxed mb-6">
              "Highly professional surgeons and fully sterile operation theater. I underwent standard laparoscopic hernia surgery here, and was discharged within 24 hours. Minimal pain, clean rooms, and reasonable pricing."
            </p>
            <h5 className="font-bold text-gray-900">- Mr. Faraz Ahmed, Jasola</h5>
          </div>
        </div>
      </section>

      {/* Large Emergency CTA block */}
      <section className="bg-[#E63946] text-white py-16 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <ShieldAlert className="h-14 w-14 mx-auto mb-6 text-white animate-bounce" />
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 font-serif">Have a Medical Emergency?</h2>
          <p className="text-base sm:text-lg mb-8 text-red-100 max-w-xl mx-auto">
            Our trauma center and ambulance bays are operational 24 hours a day, 365 days a year. Call our medical command unit immediately.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 text-xl sm:text-2xl font-black mb-8">
            <a href="tel:01141675390" data-testid={HOME_PAGE.emergencyCallBtn} className="bg-white text-[#E63946] px-8 py-4 rounded-full shadow-lg hover:bg-red-50 transition-colors inline-flex items-center justify-center gap-3">
              <Phone className="h-6 w-6" /> 011-41675390
            </a>
            <a href="tel:+918800402219" className="bg-gray-950 text-white px-8 py-4 rounded-full shadow-lg hover:bg-gray-900 transition-colors inline-flex items-center justify-center gap-3">
              <Phone className="h-6 w-6 text-[#E63946]" /> +91 8800402219
            </a>
          </div>
          <span className="text-xs text-red-100 tracking-wider uppercase font-semibold">
            Emergency Entrance Located Main Road, Okhla • Immediate Intensivist Cover
          </span>
        </div>
      </section>
    </div>
  );
}

// 2. ABOUT PAGE
function MeetTheFounder() {
  const [team, setTeam] = useState([]);
  useEffect(() => {
    axios.get(`${API_URL}/team`).then(({ data }) => setTeam(data)).catch(() => {});
  }, []);
  if (!team.length) return null;
  const ordered = [...team.filter(t => t.is_founder), ...team.filter(t => !t.is_founder)];
  return (
    <div className="mb-20" data-testid="about-founder-section">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A28] mb-3 inline-block">Leadership</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">Meet the Founder & Our Leaders</h2>
      </div>
      <div className="space-y-10">
        {ordered.map((m) => {
          const vid = youtubeId(m.youtube_url);
          return (
            <div key={m.id || m._id} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                {m.photo_url ? (
                  <img src={resolveMedia(m.photo_url)} alt={m.name} className="h-40 w-40 rounded-2xl object-cover object-top shrink-0 border-4 border-[#0D8B6F]/10" />
                ) : null}
                <div className="text-center sm:text-left">
                  {m.is_founder && <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88A28]">Founder</span>}
                  <h3 className="text-xl font-bold text-gray-900 font-serif">{m.name}</h3>
                  <p className="text-xs text-[#0D8B6F] font-bold uppercase tracking-wider mb-3">{m.role}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{m.bio}</p>
                </div>
              </div>
              {vid ? (
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-md">
                  <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${vid}`} title={m.name} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              ) : (
                <div className="hidden lg:flex items-center justify-center bg-[#F8FAFB] rounded-2xl h-full min-h-[220px] text-gray-400 text-sm border border-dashed border-gray-200">
                  Founder video coming soon
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D8B6F] mb-3 inline-block">Our Heritage</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-serif">Over 20 Years of Serving with Compassion</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Founded in 2002, Fatima Multispeciality Hospital has evolved into one of the most reliable and trusted medical providers in South Delhi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">The Hospital Story</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Established with a vision to provide world-class medical facilities at moderate pricing to the residents of South Delhi, Jamia Nagar, Okhla, Jasola, and surrounding areas, Fatima Hospital has remained steadfast in its commitment to patient safety and recovery.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Our journey began in 2002 with a humble gynaecology clinic. Today, we are a leading multispeciality tertiary institution containing full-scale surgical divisions, modern diagnostic systems, multi-bed ICUs, and a world-renowned maternity center which has delivered over 14,000 precious newborns safely.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Our clinical approach centers on strict medical ethics, high professional qualifications, absolute sterile cleanliness, and empathetic patient-centric counseling.
          </p>
        </div>
        <div>
          <img src="https://images.pexels.com/photos/12081340/pexels-photo-12081340.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Hospital story" className="rounded-2xl shadow-xl w-full h-[350px] object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3 font-serif text-[#0D8B6F]">Our Mission</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            To provide clinical excellence, medical luxury, and absolute emotional trust to each family we serve, through advanced healthcare infrastructure and highly qualified specialists.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3 font-serif text-[#0D8B6F]">Our Vision</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            To be recognized as the foremost patient-first multispeciality and maternity hospital in Northern India, setting global standards for compassionate clinical recovery.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3 font-serif text-[#0D8B6F]">Our Core Values</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Patient safety above all else, medical transparency, sterile superiority, empathy toward mothers and infants, and clinical expertise guided by continuous learning.
          </p>
        </div>
      </div>

      <MeetTheFounder />

      <div className="bg-[#F8FAFB] p-8 sm:p-12 rounded-3xl border border-gray-100 mb-10 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Community Impact</h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto mb-6">
          Beyond general healthcare, Fatima Hospital organizes weekly free vaccination camps, maternity safety drives for underprivileged mothers in South Delhi, and preventative medicine webinars to foster public wellness.
        </p>
        <div className="text-sm font-bold text-[#B88A28]">
          "Aapki Sehat. Aapka Parivaar. Hamara Vaada."
        </div>
      </div>
    </div>
  );
}

// 3. DEPARTMENTS PAGE
function DepartmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "gynaecology";

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D8B6F] mb-3 inline-block">Clinical Mastery</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-serif">Our Specialities & Departments</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Fatima Hospital holds comprehensive specialities staffed by senior medical faculty, ensuring highly detailed evaluation and sterile clinical support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* Tab Buttons Navigation */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-[#B88A28] uppercase tracking-widest px-3 mb-2">Speciality List</span>
          {DEPARTMENTS.map((dept) => {
            const isActive = currentTab === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSearchParams({ tab: dept.id })}
                className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-[#0D8B6F] text-white shadow-md" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {dept.shortName}
              </button>
            );
          })}
        </div>

        {/* Tab Panel Content Details */}
        <div className="lg:col-span-3 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-50">
          {DEPARTMENTS.map((dept) => {
            if (currentTab !== dept.id) return null;
            const IconComp = dept.icon;
            return (
              <div key={dept.id} className="animate-fadeIn">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#0D8B6F]/10 text-[#0D8B6F] p-4 rounded-2xl">
                    <IconComp className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">{dept.name}</h2>
                    <p className="text-xs text-[#B88A28] font-bold tracking-widest uppercase">Speciality Care Division</p>
                  </div>
                </div>

                <p className="text-base text-gray-600 mb-8 leading-relaxed border-b border-gray-100 pb-8">
                  {dept.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-4 tracking-wide">Common Conditions Treated</h3>
                    <ul className="space-y-3">
                      {dept.conditions.map((cond, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0D8B6F]"></span>
                          {cond}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-4 tracking-wide">Advanced Unit Facilities</h3>
                    <ul className="space-y-3">
                      {dept.facilities.map((fac, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-[#0D8B6F] font-semibold">
                          <CheckCircle className="h-4 w-4 text-[#B88A28]" />
                          {fac}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Need customized consulting? Book a priority review.
                  </div>
                  <Link 
                    to={`/contact?action=book&dept=${dept.id}`}
                    className="bg-[#0D8B6F] text-white hover:bg-[#0A6B56] px-8 py-3 rounded-full font-bold text-xs tracking-wider uppercase shadow-md transition-transform hover:scale-105"
                  >
                    Schedule department consultation
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 4. MATERNITY PAGE
function MaternityPage() {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A28] mb-3 inline-block">Premium Birth Suites</span>
        <h1 data-testid={MATERNITY_PAGE.maternityHeader} className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-serif">Maternity & Neonatal Excellence</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Fatima Hospital is celebrated for maternity luxury, boasting over <span data-testid={MATERNITY_PAGE.deliveriesStat} className="font-extrabold text-[#0D8B6F]">14,000+ happy deliveries</span> since 2002. Our clinical teams guide mothers at each step of the sacred journey.
        </p>
      </div>

      {/* Maternity Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif text-[#0D8B6F]">Pregnancy Care</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Comprehensive antenatal counseling, scheduled ultra-sound screenings, glucose tolerance tests, and prenatal exercise counseling.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif text-[#0D8B6F]">Normal Delivery</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Painless normal delivery supported by continuous painless epidural options and highly experienced midwives.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif text-[#0D8B6F]">C-Section Delivery</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Sterile surgical C-section care performed in our modular OT, prioritizing minimal scarring and immediate mother-baby bonding.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif text-[#0D8B6F]">High-Risk Pregnancy</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Advanced management of gestational diabetes, high blood pressure, multi-fetal gestation, and repeat C-sections.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif text-[#0D8B6F]">Advanced NICU</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Level-III neonatological support containing top-tier incubators, ventilators, and phototherapy to nurture premature babies safely.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif text-[#0D8B6F]">Postnatal Care</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Lactation and latching advice, routine postpartum checkups, pediatric vaccine planning, and maternal support.
          </p>
        </div>
      </div>

      {/* Advanced Infrastructure Callout */}
      <div className="bg-gradient-to-r from-[#0D8B6F] to-[#0A6B56] text-white p-8 sm:p-16 rounded-3xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 font-serif">State-of-the-Art Labour Rooms</h3>
          <p className="text-sm text-gray-100 leading-relaxed mb-6">
            We contain specialized Pre-Labour beds and dedicated modern labour units to ensure you give birth in maximum safety, comfort, and clinical sterility. Our NICU is located directly adjacent, minimizing response times.
          </p>
          <div className="flex gap-4">
            <Link 
              to="/contact?action=book&dept=gynaecology" 
              data-testid={MATERNITY_PAGE.nicuCta}
              className="bg-[#B88A28] hover:bg-[#9A7320] text-white px-6 py-3 rounded-full font-bold text-xs uppercase shadow-lg transition-transform hover:scale-105"
            >
              Consult Gynecologist
            </Link>
            <Link 
              to="/facilities" 
              data-testid={MATERNITY_PAGE.highRiskCta}
              className="bg-transparent border border-white/40 hover:bg-white/10 px-6 py-3 rounded-full font-bold text-xs uppercase"
            >
              View Labour Room
            </Link>
          </div>
        </div>
        <div>
          <img src="https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Newborn baby" className="rounded-2xl shadow-xl w-full h-[300px] object-cover" />
        </div>
      </div>
    </div>
  );
}

// 5. FACILITIES PAGE
function FacilitiesPage() {
  const facilitiesList = [
    { title: "Intensive Care Unit (ICU)", desc: "Equipped with advanced ventilator support, bedside dialysis, and high-frequency multi-channel monitors." },
    { title: "Neonatal ICU (NICU)", desc: "Level-III specialized unit for delicate neonates, premature babies, and intensive neonatal nursing." },
    { title: "Modular Operation Theatre", desc: "Equipped with positive pressure HEPA filters to maintain absolute sterility for advanced surgeries." },
    { title: "C-Arm Imaging Technology", desc: "Live high-resolution fluoroscopy for accurate orthopaedic and urological surgeries." },
    { title: "Digital X-Ray Unit", desc: "High-frequency diagnostics generating precise imaging within minutes with minimal dose exposure." },
    { title: "Pathology Laboratory", desc: "24x7 automated laboratory executing routine chemistry, hematology, and biochemical assays." },
    { title: "24x7 In-House Pharmacy", desc: "Stocked with comprehensive medical drugs, surgical gear, and emergency life-saving therapeutics." },
    { title: "Ambulance Support", desc: "Fully structured emergency transport vehicles containing standard transport oxygen and monitors." }
  ];

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D8B6F] mb-3 inline-block">Advanced Infrastructure</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-serif">Our Infrastructure & Facilities</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Witness Fatima Hospital's advanced clinical departments designed to maximize hygiene, sterility, and swift emergency action.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {facilitiesList.map((fac, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 flex gap-4 text-left">
            <div className="bg-[#0D8B6F]/10 text-[#0D8B6F] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">{fac.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{fac.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center bg-gray-50 p-12 rounded-3xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">Book a Facility Tour</h3>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-6">
          Pregnant mothers and families are welcome to schedule a pre-delivery hospital tour to visit our private maternity suites and feeding lounge.
        </p>
        <Link to="/contact?action=book" className="bg-[#B88A28] text-white hover:bg-[#9A7320] px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider">
          Schedule A Facility Tour
        </Link>
      </div>
    </div>
  );
}

// 6. DOCTORS PAGE
function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/doctors`);
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D8B6F] mb-3 inline-block">Our Medical Faculty</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-serif">Meet Our Seasoned Specialists</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Our team consists of highly qualified consultants with decades of experience, committed to giving patients transparent counseling.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-sm text-gray-500">Loading specialist registry...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doc) => (
            <div key={doc.id || doc._id} className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300">
              <img src={doc.photo_url} alt={doc.name} className="w-full h-72 object-cover object-center" />
              <div className="p-6 text-left flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 font-serif">{doc.name}</h3>
                  <p className="text-xs text-[#B88A28] font-bold uppercase tracking-wider mb-3">{doc.specialization}</p>
                  <div className="text-xs text-gray-500 mb-2 font-medium">{doc.qualification}</div>
                  <div className="text-xs text-gray-600 mb-4">Experience: <strong>{doc.experience_years} Years</strong></div>
                  {doc.availability && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      🕒 Availability: <strong>{doc.availability}</strong>
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link 
                    to={`/contact?action=book&doctor=${doc.id || doc._id}`} 
                    className="block text-center bg-[#0D8B6F] hover:bg-[#0A6B56] text-white py-2.5 rounded-full font-bold text-xs uppercase shadow-sm transition-colors"
                  >
                    Schedule Appointment
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 7. GALLERY PAGE
function GalleryPage() {
  const staticImages = [
    { title: "Advanced modular OT", url: "/images/operation-theatre.jpg" },
    { title: "Spacious Waiting Lobby", url: "/images/waiting-area.jpg" },
    { title: "Maternity delivery suite", url: "/images/pre-labour-room.jpg" },
    { title: "Premium Private Suite", url: "/images/private-room.jpg" },
    { title: "Level-III Neonatal NICU", url: "/images/icu-ward.jpg" },
    { title: "Emergency Command Bay", url: "/images/opd.jpg" }
  ];

  const [media, setMedia] = useState([]);
  useEffect(() => {
    axios.get(`${API_URL}/media`).then(({ data }) => setMedia(data)).catch(() => {});
  }, []);

  const dynamicImages = media
    .filter(m => m.media_type === "image")
    .map(m => ({ title: m.title, url: resolveMedia(m.url) }));
  const videos = media.filter(m => m.media_type === "youtube");
  const images = dynamicImages.length ? dynamicImages : staticImages;

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D8B6F] mb-3 inline-block">Visual Tour</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-serif">Fatima Hospital Media Gallery</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Witness our clinical spaces, patient-centric lounge, and state-of-the-art diagnostic machinery.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img, idx) => (
          <div key={idx} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-50 overflow-hidden hover:scale-[1.02] transition-transform duration-300">
            <img src={img.url} alt={img.title} className="w-full h-60 object-cover rounded-xl mb-4" />
            <h4 className="text-sm font-bold text-gray-800 text-left px-2 mb-2 font-serif">{img.title}</h4>
          </div>
        ))}
      </div>

      {videos.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 font-serif text-center">Video Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((v) => {
              const vid = youtubeId(v.url);
              if (!vid) return null;
              return (
                <div key={v.id || v._id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-50">
                  <div className="aspect-video w-full rounded-xl overflow-hidden">
                    <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${vid}`} title={v.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 text-left px-2 my-2 font-serif">{v.title}</h4>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// 8. BLOG PAGE (LIST & DETAILS)
function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/blogs`);
        setBlogs(data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = ["All", "Pregnancy Care", "Women's Health", "Child Health", "Emergency Care", "General Wellness"];

  const filteredBlogs = activeCategory === "All" 
    ? blogs 
    : blogs.filter(b => b.category === activeCategory);

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D8B6F] mb-3 inline-block">SEO Patient Education</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-serif">Maternity & Medical Blogs</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Expert recommendations written by our clinical faculty on prenatal safety, baby immunization, bone health, and urgent medicine.
        </p>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              activeCategory === cat 
                ? "bg-[#0D8B6F] text-white border-[#0D8B6F] shadow-sm" 
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-sm text-gray-500">Loading educational posts...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((b) => (
            <div key={b.id || b._id} className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 text-left">
              <div>
                <img src={b.image_url} alt={b.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#B88A28]/10 text-[#B88A28] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {b.category}
                    </span>
                    <span className="text-[10px] text-gray-400">🕒 {b.read_time} read</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif line-clamp-2">{b.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{b.summary}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">By <strong>{b.author}</strong></span>
                <Link to={`/blog/${b.slug || b.id || b._id}`} className="text-[#0D8B6F] font-bold text-xs uppercase hover:text-[#0A6B56] inline-flex items-center gap-1">
                  Read Article <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// BLOG DETAIL PAGE
function BlogDetailPage() {
  const { id_or_slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/blogs/${id_or_slug}`);
        setBlog(data);
      } catch (err) {
        toast.error("Failed to load article detail.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetail();
  }, [id_or_slug]);

  if (loading) return <div className="text-center py-20 text-sm text-gray-500">Loading educational post...</div>;
  if (!blog) return <div className="text-center py-20 text-sm text-gray-500">Post not found. <Link to="/blog" className="text-[#0D8B6F] underline">Go back</Link></div>;

  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-left mb-10">
        <Link to="/blog" className="inline-flex items-center gap-1 text-[#0D8B6F] hover:text-[#0A6B56] font-bold text-xs uppercase tracking-wider mb-6">
          ← Back to Blog
        </Link>
        <span className="bg-[#B88A28]/10 text-[#B88A28] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
          {blog.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-serif leading-tight">{blog.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <span>Author: <strong>{blog.author}</strong></span>
          <span>•</span>
          <span>Read time: <strong>{blog.read_time}</strong></span>
          <span>•</span>
          <span>Published: <strong>{new Date(blog.created_at).toLocaleDateString()}</strong></span>
        </div>
      </div>

      <img src={blog.image_url} alt={blog.title} className="w-full h-[400px] object-cover rounded-3xl shadow-md mb-10" />

      {/* Blog Post Content Area */}
      <div 
        className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-sm sm:text-base font-sans blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div className="mt-16 pt-8 border-t border-gray-100 bg-[#F8FAFB] p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-bold text-gray-900 mb-1 font-serif">Need Specialized Health Counseling?</h4>
          <p className="text-xs text-gray-500">Schedule an outpatient evaluation with our medical writers and physicians.</p>
        </div>
        <Link to="/contact?action=book" className="bg-[#0D8B6F] text-white hover:bg-[#0A6B56] px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider">
          Book Appointment Now
        </Link>
      </div>
    </div>
  );
}

// 9. CONTACT & ONLINE APPOINTMENT PAGE
function ContactPage() {
  const [searchParams] = useSearchParams();
  const isBookQuery = searchParams.get("action") === "book";
  const preSelectedDept = searchParams.get("dept") || "";
  const preSelectedDoctor = searchParams.get("doctor") || "";

  // Contact Enquiry States
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  // Appointment Booking States
  const [bookName, setBookName] = useState("");
  const [bookPhone, setBookPhone] = useState("");
  const [bookEmail, setBookEmail] = useState("");
  const [bookDept, setBookDept] = useState(preSelectedDept);
  const [bookDoctor, setBookDoctor] = useState(preSelectedDoctor);
  const [bookDate, setBookDate] = useState("");
  const [bookMsg, setBookMessage] = useState("");
  const [bookSuccess, setBookSuccess] = useState(false);

  // Doctors database for the select box
  const [doctorsList, setDoctorsList] = useState([]);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/doctors`);
        setDoctorsList(data);
      } catch (err) {
        console.error("Failed to load doctor lists for select option");
      }
    };
    loadDoctors();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !contactEmail || !contactMsg) {
      toast.error("Please fill in all contact lead fields.");
      return;
    }
    try {
      await axios.post(`${API_URL}/enquiries`, {
        name: contactName,
        phone: contactPhone,
        email: contactEmail,
        message: contactMsg
      });
      setContactSuccess(true);
      toast.success("Contact Enquiry Submitted! Our desk will call you back.");
      setContactName("");
      setContactPhone("");
      setContactEmail("");
      setContactMessage("");
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    if (!bookName || !bookPhone || !bookEmail || !bookDate || !bookDept) {
      toast.error("Please fill in all core appointment fields.");
      return;
    }
    try {
      await axios.post(`${API_URL}/appointments`, {
        name: bookName,
        phone: bookPhone,
        email: bookEmail,
        department: bookDept,
        doctor_id: bookDoctor || null,
        preferred_date: bookDate,
        message: bookMsg
      });
      setBookSuccess(true);
      toast.success("Appointment Requested Successfully!");
      setBookName("");
      setBookPhone("");
      setBookEmail("");
      setBookDate("");
      setBookMessage("");
    } catch (err) {
      toast.error("Appointment booking failed. Please try again.");
    }
  };

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D8B6F] mb-3 inline-block">Locate & Book</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-serif">Contact Us & Priority Booking</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Reach Fatima Hospital round-the-clock for ambulance calls, general medical inquiries, and high-risk maternity reservations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        {/* Contact Info & Interactive Google Map */}
        <div className="space-y-8 text-left">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif text-[#0D8B6F]">Emergency & Desk Contacts</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-red-50 text-[#E63946] p-3 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">24x7 Ambulance & Emergencies</div>
                  <div className="text-lg font-black text-gray-900 mt-1">
                    <a href="tel:01141675390" className="hover:underline">011-41675390</a> / <a href="tel:+918800402219" className="hover:underline">+91 8800402219</a>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-[#0D8B6F]/10 text-[#0D8B6F] p-3 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">WhatsApp Inquiries</div>
                  <div className="text-base font-bold text-gray-900 mt-1">
                    <a href="https://wa.me/918800402219" target="_blank" rel="noopener noreferrer" className="text-[#0D8B6F] hover:underline">Click to chat: +91 8800402219</a>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-[#B88A28]/10 text-[#B88A28] p-3 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Main Campus Address</div>
                  <p className="text-sm text-gray-600 mt-1">
              Fatima Multispeciality Hospital, 275 A, Lane no 13, Zakir Nagar, Okhla, New Delhi - 110025.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Google Map Iframe for Okhla */}
          <div className="rounded-3xl overflow-hidden shadow-md border border-gray-100 h-[320px]" data-testid={CONTACT_PAGE.googleMapIframe}>
            <iframe 
              title="Fatima Multispeciality Hospital Location Map"
        src="https://www.google.com/maps?q=275+A+Lane+no+13+Zakir+Nagar+Okhla+New+Delhi+110025&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Lead Capture form or Appointment Booking System */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-50 text-left">
          <div className="flex gap-4 border-b border-gray-100 pb-6 mb-8">
            <Link 
              to="/contact" 
              className={`text-sm font-bold pb-2 uppercase tracking-wider border-b-2 transition-all ${
                !isBookQuery ? "border-[#0D8B6F] text-[#0D8B6F]" : "border-transparent text-gray-400"
              }`}
            >
              General Enquiry
            </Link>
            <Link 
              to="/contact?action=book" 
              className={`text-sm font-bold pb-2 uppercase tracking-wider border-b-2 transition-all ${
                isBookQuery ? "border-[#0D8B6F] text-[#0D8B6F]" : "border-transparent text-gray-400"
              }`}
            >
              Book Appointment
            </Link>
          </div>

          {!isBookQuery ? (
            // General Enquiry Form
            <form onSubmit={handleContactSubmit} className="space-y-6">
              {contactSuccess && (
                <div data-testid={CONTACT_PAGE.successAlert} className="bg-green-50 border border-green-200 text-[#0D8B6F] p-4 rounded-xl text-sm font-semibold">
                  ✓ Thank you! Our support executive will contact you shortly.
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  data-testid={CONTACT_PAGE.nameInput}
                  value={contactName} 
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Aisha Rahman"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Mobile Number</label>
                <input 
                  type="tel" 
                  data-testid={CONTACT_PAGE.phoneInput}
                  value={contactPhone} 
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 8800402219"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  data-testid={CONTACT_PAGE.emailInput}
                  value={contactEmail} 
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. aisha@gmail.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Message</label>
                <textarea 
                  rows="4" 
                  data-testid={CONTACT_PAGE.messageInput}
                  value={contactMsg} 
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="How can Fatima Hospital assist you?"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                data-testid={CONTACT_PAGE.submitButton}
                className="w-full bg-[#0D8B6F] hover:bg-[#0A6B56] text-white py-3.5 rounded-full font-bold text-sm tracking-wider uppercase shadow-md"
              >
                Submit General Enquiry
              </button>
            </form>
          ) : (
            // Appointment Booking System Form
            <form onSubmit={handleAppointmentSubmit} className="space-y-6">
              {bookSuccess && (
                <div data-testid={APPOINTMENT_FORM.successAlert} className="bg-green-50 border border-green-200 text-[#0D8B6F] p-4 rounded-xl text-sm font-semibold">
                  ✓ Priority Appointment Requested! Check console for simulated email alert.
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  data-testid={APPOINTMENT_FORM.nameInput}
                  value={bookName} 
                  onChange={(e) => setBookName(e.target.value)}
                  placeholder="Patient Name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Mobile Number</label>
                  <input 
                    type="tel" 
                    data-testid={APPOINTMENT_FORM.phoneInput}
                    value={bookPhone} 
                    onChange={(e) => setBookPhone(e.target.value)}
                    placeholder="e.g. 8800402219"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    data-testid={APPOINTMENT_FORM.emailInput}
                    value={bookEmail} 
                    onChange={(e) => setBookEmail(e.target.value)}
                    placeholder="e.g. patient@gmail.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Select Department</label>
                  <select 
                    data-testid={APPOINTMENT_FORM.departmentSelect}
                    value={bookDept}
                    onChange={(e) => setBookDept(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                    required
                  >
                    <option value="">Choose department</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.shortName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Select Doctor (Optional)</label>
                  <select 
                    data-testid={APPOINTMENT_FORM.doctorSelect}
                    value={bookDoctor}
                    onChange={(e) => setBookDoctor(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                  >
                    <option value="">Any available specialist</option>
                    {doctorsList.map(doc => (
                      <option key={doc.id || doc._id} value={doc.id || doc._id}>{doc.name} - {doc.specialization}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Preferred Date</label>
                <input 
                  type="date" 
                  data-testid={APPOINTMENT_FORM.preferredDateInput}
                  value={bookDate} 
                  onChange={(e) => setBookDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Message or Symptoms</label>
                <textarea 
                  rows="3" 
                  data-testid={APPOINTMENT_FORM.messageInput}
                  value={bookMsg} 
                  onChange={(e) => setBookMessage(e.target.value)}
                  placeholder="Briefly state symptoms or clinical requests"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                ></textarea>
              </div>

              <button 
                type="submit" 
                data-testid={APPOINTMENT_FORM.submitButton}
                className="w-full bg-[#B88A28] hover:bg-[#9A7320] text-white py-3.5 rounded-full font-bold text-sm tracking-wider uppercase shadow-md"
              >
                Schedule Priority Appointment
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// 10. ADMIN DASHBOARD PANEL (PERSISTENT LOGGED TABS)
function AdminPage() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const navigate = useNavigate();

  // Login inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tab switcher
  const [activeTab, setActiveTab] = useState("appointments");

  // Admin Data Storage
  const [appointments, setAppointments] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Add doctor states
  const [docName, setDocName] = useState("");
  const [docSpecialization, setDocSpecialization] = useState("");
  const [docQualification, setDocQualification] = useState("");
  const [docExp, setDocExperience] = useState(5);
  const [docAvailability, setDocAvailability] = useState("9:00 AM - 5:00 PM");
  const [docPhotoUrl, setDocPhotoUrl] = useState("https://i.ibb.co/1JYqdgpJ/Whats-App-Image-2026-07-11-at-6-50-06-PM.jpg");

  // Add blog states
  const [blogTitle, setBlogTitle] = useState("");
  const [blogCategory, setBlogCategory] = useState("Pregnancy Care");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogContent, setBlogContent] = useState("");

  // Site Media states
  const [media, setMedia] = useState([]);
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [mediaCategory, setMediaCategory] = useState("Gallery");
  const [mediaUrl, setMediaUrl] = useState("");

  // Team / Founder states
  const [teamMembers, setTeamMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberBio, setMemberBio] = useState("");
  const [memberYoutube, setMemberYoutube] = useState("");
  const [memberPhoto, setMemberPhoto] = useState("");
  const [memberIsFounder, setMemberIsFounder] = useState(false);

  const [uploading, setUploading] = useState(false);

  // Loading indicator for lists
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeTab]);

  const loadAdminData = async () => {
    setDataLoading(true);
    try {
      if (activeTab === "appointments") {
        const { data } = await axios.get(`${API_URL}/appointments`);
        setAppointments(data);
      } else if (activeTab === "enquiries") {
        const { data } = await axios.get(`${API_URL}/enquiries`);
        setEnquiries(data);
      } else if (activeTab === "doctors") {
        const { data } = await axios.get(`${API_URL}/doctors`);
        setDoctors(data);
      } else if (activeTab === "blogs") {
        const { data } = await axios.get(`${API_URL}/blogs`);
        setBlogs(data);
      } else if (activeTab === "media") {
        const { data } = await axios.get(`${API_URL}/media`);
        setMedia(data);
      } else if (activeTab === "team") {
        const { data } = await axios.get(`${API_URL}/team`);
        setTeamMembers(data);
      }
    } catch (err) {
      toast.error("Failed to load admin lists. Your session may have expired.");
    } finally {
      setDataLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await login(email, password);
    } catch (err) {
      setLoginError(err.message || "Failed to authenticate.");
    }
  };

  // Appointment State changes
  const handleUpdateAppointment = async (id, statusVal) => {
    try {
      await axios.put(`${API_URL}/appointments/${id}`, { status: statusVal });
      toast.success(`Appointment status set to: ${statusVal}`);
      loadAdminData();
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment lead?")) return;
    try {
      await axios.delete(`${API_URL}/appointments/${id}`);
      toast.success("Appointment lead deleted.");
      loadAdminData();
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  // Enquiries State changes
  const handleUpdateEnquiry = async (id, statusVal) => {
    try {
      await axios.put(`${API_URL}/enquiries/${id}`, { status: statusVal });
      toast.success(`Enquiry lead marked: ${statusVal}`);
      loadAdminData();
    } catch (err) {
      toast.error("Failed to update lead.");
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact lead?")) return;
    try {
      await axios.delete(`${API_URL}/enquiries/${id}`);
      toast.success("Enquiry lead deleted.");
      loadAdminData();
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  // Doctors action changes
  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    if (!docName || !docSpecialization || !docQualification) {
      toast.error("Please fill required Doctor values.");
      return;
    }
    try {
      await axios.post(`${API_URL}/doctors`, {
        name: docName,
        qualification: docQualification,
        specialization: docSpecialization,
        experience_years: parseInt(docExp),
        availability: docAvailability,
        photo_url: docPhotoUrl,
        is_active: true
      });
      toast.success("New doctor registered successfully!");
      setDocName("");
      setDocQualification("");
      setDocSpecialization("");
      loadAdminData();
    } catch (err) {
      toast.error("Failed to register doctor.");
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Delete doctor registration?")) return;
    try {
      await axios.delete(`${API_URL}/doctors/${id}`);
      toast.success("Doctor listing deleted.");
      loadAdminData();
    } catch (err) {
      toast.error("Failed to delete doctor.");
    }
  };

  // Blogs action changes
  const handleAddBlogSubmit = async (e) => {
    e.preventDefault();
    if (!blogTitle || !blogSummary || !blogContent) {
      toast.error("Please write blog title, summary, and rich content.");
      return;
    }
    const slug = blogTitle.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    try {
      await axios.post(`${API_URL}/blogs`, {
        title: blogTitle,
        slug: slug,
        category: blogCategory,
        summary: blogSummary,
        content: blogContent,
        author: "Fatima Medical Editorial",
        read_time: "5 mins",
        image_url: "https://images.pexels.com/photos/4041804/pexels-photo-4041804.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
      });
      toast.success("New health educational blog published!");
      setBlogTitle("");
      setBlogSummary("");
      setBlogContent("");
      loadAdminData();
    } catch (err) {
      toast.error("Failed to publish blog.");
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await axios.delete(`${API_URL}/blogs/${id}`);
      toast.success("Blog post deleted.");
      loadAdminData();
    } catch (err) {
      toast.error("Failed to delete blog.");
    }
  };

  // Generic image upload -> returns the stored url (e.g. /api/files/...)
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const { data } = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Image uploaded successfully!");
      return data.url;
    } catch (err) {
      toast.error("Image upload failed. Please try again.");
      return "";
    } finally {
      setUploading(false);
    }
  };

  // Site Media handlers
  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setMediaUrl(url);
  };

  const handleAddMedia = async (e) => {
    e.preventDefault();
    if (!mediaTitle || !mediaUrl) {
      toast.error("Add a title and an image upload / URL or YouTube link.");
      return;
    }
    try {
      await axios.post(`${API_URL}/media`, {
        title: mediaTitle,
        media_type: mediaType,
        url: mediaUrl,
        category: mediaCategory
      });
      toast.success("Media added to the website!");
      setMediaTitle("");
      setMediaUrl("");
      loadAdminData();
    } catch (err) {
      toast.error("Failed to add media.");
    }
  };

  const handleDeleteMedia = async (id) => {
    if (!window.confirm("Remove this media item?")) return;
    try {
      await axios.delete(`${API_URL}/media/${id}`);
      toast.success("Media removed.");
      loadAdminData();
    } catch (err) {
      toast.error("Failed to remove media.");
    }
  };

  // Team / Founder handlers
  const handleMemberUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setMemberPhoto(url);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberName || !memberRole) {
      toast.error("Name and role are required.");
      return;
    }
    try {
      await axios.post(`${API_URL}/team`, {
        name: memberName,
        role: memberRole,
        bio: memberBio,
        youtube_url: memberYoutube,
        photo_url: memberPhoto,
        is_founder: memberIsFounder
      });
      toast.success("Team member saved!");
      setMemberName("");
      setMemberRole("");
      setMemberBio("");
      setMemberYoutube("");
      setMemberPhoto("");
      setMemberIsFounder(false);
      loadAdminData();
    } catch (err) {
      toast.error("Failed to save team member.");
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Delete this team member?")) return;
    try {
      await axios.delete(`${API_URL}/team/${id}`);
      toast.success("Team member deleted.");
      loadAdminData();
    } catch (err) {
      toast.error("Failed to delete team member.");
    }
  };

  if (authLoading) return <div className="text-center py-20 text-sm text-gray-500">Loading admin credentials...</div>;

  if (!user) {
    return (
      <div className="py-20 max-w-md mx-auto px-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 text-left">
          <div className="text-center mb-8">
            <img src={HOSPITAL_LOGO} alt="Fatima Hospital" className="h-14 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 font-serif">Admin Portal Login</h2>
            <p className="text-xs text-gray-500 mt-1">Authorized Fatima Hospital Staff Only</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {loginError && (
              <div data-testid={AUTH.errorMessage} className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-semibold">
                ⚠ {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Staff Email Address</label>
              <input 
                type="email" 
                data-testid={AUTH.loginEmailInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@fatimahospital.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Security Password</label>
              <input 
                type="password" 
                data-testid={AUTH.loginPasswordInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                required
              />
            </div>

            <button 
              type="submit" 
              data-testid={AUTH.loginSubmitButton}
              className="w-full bg-[#0D8B6F] hover:bg-[#0A6B56] text-white py-3 rounded-full font-bold text-sm tracking-wider uppercase shadow-md"
            >
              Sign In to Staff Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 pb-6 mb-10 text-left">
        <div>
          <h1 data-testid={ADMIN_PANEL.dashboardTitle} className="text-3xl font-bold text-gray-900 font-serif">Staff Panel</h1>
          <p className="text-xs text-[#B88A28] font-bold uppercase tracking-wider mt-1">Welcome back, {user.name} ({user.role})</p>
        </div>
        <button 
          onClick={logout} 
          data-testid={AUTH.logoutButton}
          className="mt-4 sm:mt-0 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-red-600 px-6 py-2.5 rounded-full font-bold text-xs uppercase flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-2 rounded-2xl max-w-4xl mx-auto border border-gray-100">
        <button 
          onClick={() => setActiveTab("appointments")}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "appointments" ? "bg-white text-[#0D8B6F] shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          📅 Appointments
        </button>
        <button 
          onClick={() => setActiveTab("enquiries")}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "enquiries" ? "bg-white text-[#0D8B6F] shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          📩 Contact Leads
        </button>
        <button 
          onClick={() => setActiveTab("doctors")}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "doctors" ? "bg-white text-[#0D8B6F] shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          🩺 Manage Doctors
        </button>
        <button 
          onClick={() => setActiveTab("blogs")}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "blogs" ? "bg-white text-[#0D8B6F] shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          ✍ Manage Blogs
        </button>
        <button 
          onClick={() => setActiveTab("media")}
          data-testid="admin-tab-media"
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "media" ? "bg-white text-[#0D8B6F] shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          🖼 Site Media
        </button>
        <button 
          onClick={() => setActiveTab("team")}
          data-testid="admin-tab-team"
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "team" ? "bg-white text-[#0D8B6F] shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          ⭐ Founders & Team
        </button>
      </div>

      {/* List / Form areas */}
      {dataLoading ? (
        <div className="text-center py-20 text-sm text-gray-400">Syncing database data...</div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-50">
          
          {/* APPOINTMENTS TABLE */}
          {activeTab === "appointments" && (
            <div className="overflow-x-auto text-left">
              <h2 className="text-lg font-bold text-gray-900 mb-6 font-serif">Patient Appointment Requests</h2>
              <table data-testid={ADMIN_PANEL.appointmentsTable} className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Phone / Email</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Date Requested</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-10 text-center text-gray-400">No scheduled appointments inside database.</td>
                    </tr>
                  ) : (
                    appointments.map((app) => (
                      <tr key={app.id || app._id} className="hover:bg-gray-50/50">
                        <td className="py-4 px-4 font-bold text-gray-900">{app.name}</td>
                        <td className="py-4 px-4 text-xs text-gray-600">
                          <div>{app.phone}</div>
                          <div>{app.email}</div>
                        </td>
                        <td className="py-4 px-4"><span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full font-semibold">{app.department}</span></td>
                        <td className="py-4 px-4 text-xs font-semibold text-gray-600">{app.preferred_date}</td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                            app.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            app.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button 
                            onClick={() => handleUpdateAppointment(app.id || app._id, "Confirmed")}
                            data-testid={ADMIN_PANEL.appointmentConfirmBtn}
                            className="bg-green-50 hover:bg-green-100 text-green-700 p-2 rounded-xl text-xs font-bold"
                            title="Confirm"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => handleUpdateAppointment(app.id || app._id, "Cancelled")}
                            data-testid={ADMIN_PANEL.appointmentCancelBtn}
                            className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-2 rounded-xl text-xs font-bold"
                            title="Cancel"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleDeleteAppointment(app.id || app._id)}
                            data-testid={ADMIN_PANEL.appointmentDeleteBtn}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl text-xs font-bold"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* CONTACT LEADS / ENQUIRIES TABLE */}
          {activeTab === "enquiries" && (
            <div className="overflow-x-auto text-left">
              <h2 className="text-lg font-bold text-gray-900 mb-6 font-serif">General Enquiries & Contact Leads</h2>
              <table data-testid={ADMIN_PANEL.enquiriesTable} className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Sender Name</th>
                    <th className="py-3 px-4">Phone / Email</th>
                    <th className="py-3 px-4">Message / Query</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-gray-400">No contact leads registered.</td>
                    </tr>
                  ) : (
                    enquiries.map((enq) => (
                      <tr key={enq.id || enq._id} className="hover:bg-gray-50/50">
                        <td className="py-4 px-4 font-bold text-gray-900">{enq.name}</td>
                        <td className="py-4 px-4 text-xs text-gray-600">
                          <div>{enq.phone}</div>
                          <div>{enq.email}</div>
                        </td>
                        <td className="py-4 px-4 text-xs text-gray-600 max-w-xs truncate">{enq.message}</td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                            enq.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {enq.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button 
                            onClick={() => handleUpdateEnquiry(enq.id || enq._id, "Resolved")}
                            data-testid={ADMIN_PANEL.enquiryResolveBtn}
                            className="bg-green-50 hover:bg-green-100 text-green-700 p-2 rounded-xl text-xs font-bold"
                          >
                            Resolve
                          </button>
                          <button 
                            onClick={() => handleDeleteEnquiry(enq.id || enq._id)}
                            data-testid={ADMIN_PANEL.enquiryDeleteBtn}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl text-xs font-bold"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* DOCTORS MANAGING */}
          {activeTab === "doctors" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
              {/* Add form */}
              <div className="lg:col-span-1 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-6 font-serif">Register New Specialist</h3>
                <form onSubmit={handleAddDoctorSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Doctor Name</label>
                    <input 
                      type="text" 
                      data-testid={ADMIN_PANEL.doctorNameInput}
                      value={docName} 
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="e.g. Dr. Farhana Khan"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Specialization</label>
                    <input 
                      type="text" 
                      data-testid={ADMIN_PANEL.doctorSpecializationInput}
                      value={docSpecialization} 
                      onChange={(e) => setDocSpecialization(e.target.value)}
                      placeholder="e.g. Gynaecology"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Qualification</label>
                    <input 
                      type="text" 
                      data-testid={ADMIN_PANEL.doctorQualificationInput}
                      value={docQualification} 
                      onChange={(e) => setDocQualification(e.target.value)}
                      placeholder="e.g. MBBS, MD"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Experience (Yrs)</label>
                      <input 
                        type="number" 
                        data-testid={ADMIN_PANEL.doctorExperienceInput}
                        value={docExp} 
                        onChange={(e) => setDocExperience(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Availability</label>
                      <input 
                        type="text" 
                        data-testid={ADMIN_PANEL.doctorAvailabilityInput}
                        value={docAvailability} 
                        onChange={(e) => setDocAvailability(e.target.value)}
                        placeholder="10am-2pm"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Photo URL</label>
                    <input 
                      type="text" 
                      data-testid={ADMIN_PANEL.doctorPhotoUrlInput}
                      value={docPhotoUrl} 
                      onChange={(e) => setDocPhotoUrl(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    data-testid={ADMIN_PANEL.doctorSubmitBtn}
                    className="w-full bg-[#0D8B6F] hover:bg-[#0A6B56] text-white py-2.5 rounded-full font-bold text-xs uppercase shadow-sm"
                  >
                    Add Doctor Specialist
                  </button>
                </form>
              </div>

              {/* List grid */}
              <div className="lg:col-span-2">
                <h3 className="text-base font-bold text-gray-900 mb-6 font-serif">Registered Specialists Registry</h3>
                <div data-testid={ADMIN_PANEL.doctorsList} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctors.map((doc) => (
                    <div key={doc.id || doc._id} className="bg-white border border-gray-100 p-4 rounded-xl flex gap-4 items-center">
                      <img src={doc.photo_url} alt={doc.name} className="h-14 w-14 object-cover rounded-full shrink-0" />
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900 text-sm">{doc.name}</h4>
                        <p className="text-[10px] text-[#B88A28] font-semibold">{doc.specialization}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{doc.experience_years} Years Exp</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteDoctor(doc.id || doc._id)}
                        data-testid={ADMIN_PANEL.doctorDeleteBtn}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg"
                        title="Delete Doctor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BLOGS MANAGING */}
          {activeTab === "blogs" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
              {/* Add form */}
              <div className="lg:col-span-1 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-6 font-serif">Publish Patient Education Blog</h3>
                <form onSubmit={handleAddBlogSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Article Title</label>
                    <input 
                      type="text" 
                      data-testid={ADMIN_PANEL.blogTitleInput}
                      value={blogTitle} 
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder="e.g. Safe Pregnancy Routines"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Category</label>
                    <select 
                      data-testid={ADMIN_PANEL.blogCategorySelect}
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D8B6F]"
                      required
                    >
                      <option value="Pregnancy Care">Pregnancy Care</option>
                      <option value="Women's Health">Women's Health</option>
                      <option value="Child Health">Child Health</option>
                      <option value="Emergency Care">Emergency Care</option>
                      <option value="General Wellness">General Wellness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Summary Paragraph</label>
                    <textarea 
                      rows="2" 
                      data-testid={ADMIN_PANEL.blogSummaryInput}
                      value={blogSummary} 
                      onChange={(e) => setBlogSummary(e.target.value)}
                      placeholder="Short excerpt summarizing key aspects..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Rich Content (HTML Allowed)</label>
                    <textarea 
                      rows="6" 
                      data-testid={ADMIN_PANEL.blogContentInput}
                      value={blogContent} 
                      onChange={(e) => setBlogContent(e.target.value)}
                      placeholder="<p>Full educational text here...</p><h4>Key Steps</h4>"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none font-mono"
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    data-testid={ADMIN_PANEL.blogSubmitBtn}
                    className="w-full bg-[#0D8B6F] hover:bg-[#0A6B56] text-white py-2.5 rounded-full font-bold text-xs uppercase shadow-sm"
                  >
                    Publish Article Post
                  </button>
                </form>
              </div>

              {/* List grid */}
              <div className="lg:col-span-2">
                <h3 className="text-base font-bold text-gray-900 mb-6 font-serif">Published Educational Articles</h3>
                <div data-testid={ADMIN_PANEL.blogsList} className="space-y-4">
                  {blogs.map((b) => (
                    <div key={b.id || b._id} className="bg-white border border-gray-100 p-4 rounded-xl flex gap-4 items-center">
                      <img src={b.image_url} alt={b.title} className="h-12 w-20 object-cover rounded-lg shrink-0" />
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900 text-xs line-clamp-1">{b.title}</h4>
                        <p className="text-[10px] text-[#B88A28] font-semibold mt-0.5">{b.category}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteBlog(b.id || b._id)}
                        data-testid={ADMIN_PANEL.blogDeleteBtn}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg"
                        title="Delete Blog"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-4 font-serif">Add Site Media</h3>
                <form onSubmit={handleAddMedia} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Title</label>
                    <input data-testid="admin-media-title-input" value={mediaTitle} onChange={(e) => setMediaTitle(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none" placeholder="e.g. New ICU Wing" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Type</label>
                    <select data-testid="admin-media-type-select" value={mediaType} onChange={(e) => { setMediaType(e.target.value); setMediaUrl(""); }} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none">
                      <option value="image">Image</option>
                      <option value="youtube">YouTube Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Category</label>
                    <select value={mediaCategory} onChange={(e) => setMediaCategory(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none">
                      <option>Gallery</option>
                      <option>Hero</option>
                      <option>Infrastructure</option>
                      <option>Other</option>
                    </select>
                  </div>
                  {mediaType === "image" ? (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Upload Image</label>
                      <input type="file" accept="image/*" data-testid="admin-media-upload-input" onChange={handleMediaUpload} className="w-full text-xs" />
                      <p className="text-[10px] text-gray-400 my-2">— or paste an image URL —</p>
                      <input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none" placeholder="https://..." />
                      {mediaUrl && <img src={resolveMedia(mediaUrl)} alt="preview" className="mt-3 h-24 w-full object-cover rounded-lg border border-gray-200" />}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">YouTube Link</label>
                      <input data-testid="admin-media-youtube-input" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none" placeholder="https://youtube.com/watch?v=..." />
                    </div>
                  )}
                  {uploading && <p className="text-[10px] text-[#0D8B6F] font-bold">Uploading…</p>}
                  <button type="submit" data-testid="admin-media-submit-button" className="w-full bg-[#0D8B6F] hover:bg-[#0A6B56] text-white py-2.5 rounded-full font-bold text-xs uppercase shadow-sm">Add Media</button>
                </form>
              </div>

              <div className="lg:col-span-2">
                <h3 className="text-base font-bold text-gray-900 mb-6 font-serif">Website Media Library</h3>
                <div data-testid="admin-media-list" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {media.length === 0 ? (
                    <p className="text-xs text-gray-400 col-span-full py-8 text-center">No media yet. Add images or videos to show on the Gallery page.</p>
                  ) : media.map((m) => (
                    <div key={m.id || m._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden relative">
                      {m.media_type === "youtube" ? (
                        <div className="aspect-video bg-gray-900 flex items-center justify-center text-white text-[10px] px-2 text-center">▶ {m.title}</div>
                      ) : (
                        <img src={resolveMedia(m.url)} alt={m.title} className="h-24 w-full object-cover" />
                      )}
                      <div className="p-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-700 line-clamp-1">{m.title}</span>
                        <button onClick={() => handleDeleteMedia(m.id || m._id)} data-testid="admin-media-delete-button" className="text-red-500 hover:text-red-700"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                      <span className="absolute top-1 left-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded">{m.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-4 font-serif">Add Founder / Team Member</h3>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <input data-testid="admin-member-name-input" value={memberName} onChange={(e) => setMemberName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none" placeholder="Full Name" required />
                  <input data-testid="admin-member-role-input" value={memberRole} onChange={(e) => setMemberRole(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none" placeholder="Role (e.g. Founder & Director)" required />
                  <textarea rows="3" data-testid="admin-member-bio-input" value={memberBio} onChange={(e) => setMemberBio(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none" placeholder="Short bio / message"></textarea>
                  <input data-testid="admin-member-youtube-input" value={memberYoutube} onChange={(e) => setMemberYoutube(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none" placeholder="YouTube video link (optional)" />
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">Photo</label>
                    <input type="file" accept="image/*" data-testid="admin-member-upload-input" onChange={handleMemberUpload} className="w-full text-xs" />
                    {memberPhoto && <img src={resolveMedia(memberPhoto)} alt="preview" className="mt-3 h-24 w-24 object-cover rounded-lg border border-gray-200" />}
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <input type="checkbox" data-testid="admin-member-founder-checkbox" checked={memberIsFounder} onChange={(e) => setMemberIsFounder(e.target.checked)} /> Mark as Founder
                  </label>
                  {uploading && <p className="text-[10px] text-[#0D8B6F] font-bold">Uploading…</p>}
                  <button type="submit" data-testid="admin-member-submit-button" className="w-full bg-[#0D8B6F] hover:bg-[#0A6B56] text-white py-2.5 rounded-full font-bold text-xs uppercase shadow-sm">Save Member</button>
                </form>
              </div>

              <div className="lg:col-span-2">
                <h3 className="text-base font-bold text-gray-900 mb-6 font-serif">Leadership shown on the About page</h3>
                <div data-testid="admin-team-list" className="space-y-4">
                  {teamMembers.length === 0 ? (
                    <p className="text-xs text-gray-400 py-8 text-center">No team members yet.</p>
                  ) : teamMembers.map((t) => (
                    <div key={t.id || t._id} className="bg-white border border-gray-100 p-4 rounded-xl flex gap-4 items-center">
                      {t.photo_url ? <img src={resolveMedia(t.photo_url)} alt={t.name} className="h-12 w-12 object-cover rounded-full shrink-0" /> : <div className="h-12 w-12 rounded-full bg-gray-100 shrink-0" />}
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900 text-xs">{t.name} {t.is_founder && <span className="text-[9px] text-[#B88A28]">(Founder)</span>}</h4>
                        <p className="text-[10px] text-[#0D8B6F] font-semibold">{t.role}</p>
                      </div>
                      <button onClick={() => handleDeleteMember(t.id || t._id)} data-testid="admin-member-delete-button" className="text-red-500 hover:text-red-700 p-2"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// ----------------------------------------------------------------------
// ROUTER & APP COMPONENT
// ----------------------------------------------------------------------
function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen font-sans bg-[#F8FAFB]">
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/maternity" element={<MaternityPage />} />
              <Route path="/facilities" element={<FacilitiesPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id_or_slug" element={<BlogDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/aesthetic" element={<AestheticPage />} />
              <Route path="/staff-portal" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
          <FloatingCTA />
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </div>
    </AuthProvider>
  );
}

export default App;
