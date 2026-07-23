# Fatima Multispeciality Hospital — PRD

## Original Problem Statement
Build a modern, premium, highly trustworthy hospital website for "Fatima Multispeciality Hospital" (Okhla & South Delhi, since 2002). Goal: increase appointment bookings, emergency calls, WhatsApp inquiries, and trust. Pages: Home, About, Departments, Maternity, Facilities, Doctors, Gallery, Blog, Contact. Features: online appointment system, sticky header, WhatsApp/Emergency floating buttons, click-to-call, lead capture forms, Admin Panel. Mock data managed via Admin Panel; email notifications (logged).

## User Personas
- Families & local residents (Okhla, Jamia Nagar, New Friends Colony, Jasola, Sarita Vihar) seeking trusted care
- Pregnant women & parents (maternity, NICU, pediatrics)
- Emergency/elderly patients needing 24x7 care
- Hospital admin managing appointments, enquiries, doctors, blogs

## Architecture (Tech Stack)
- Frontend: React 19 + Tailwind + Shadcn UI + lucide-react + sonner (SPA in /app/frontend/src/App.js)
- Backend: FastAPI + Motor (MongoDB), JWT httponly-cookie auth, bcrypt, brute-force protection
- Brand: Green #0D8B6F, Gold #B88A28, Emergency Red #E63946; Poppins headings / Inter body

## Core Requirements (static)
- All 9 public pages + secure Admin Panel
- Online appointment booking + contact enquiry lead capture (public)
- Floating WhatsApp + Emergency CTAs, click-to-call, sticky glass header
- Admin CRUD: appointments (status), enquiries (status), doctors, blogs

## Implemented (2026-06-24)
- Full frontend: Home, About, Departments (tabbed), Maternity, Facilities, Doctors (API), Gallery, Blog (API + categories), Contact (booking + enquiry + Google Map)
- Backend APIs: auth, doctors, appointments, blogs, enquiries — all with /api prefix
- Admin Panel (hidden route `/staff-portal`) with login + 4 management tabs; seeded admin, doctors, blogs
- Real Gmail SMTP email wired (patient acknowledgement + confirmation/cancellation + hospital notifications); non-blocking on failure
- Iteration 2: moving header marquee, grouped nav dropdowns (About / Patient Care), hero emergency button moved left + red glow, animated stat counters, floating Core Promise card, steady-glow floating emergency widget (no flicker), solid-white header (no logo color bleed), removed Emergent badge, hidden admin login from nav, SEO meta/OG tags

## Backlog / Next Tasks
- Iteration 3 (2026-06-24): Site Media manager (image upload via Emergent object storage + image URL + YouTube), Founders & Team manager (photo upload + bio + YouTube), public "Meet the Founder" section on About, dynamic Gallery (images + video), Gmail SMTP emails now live (App Password). 40/40 backend tests pass.
- BLOCKER: Gmail SMTP returns 535 BadCredentials — needs a Gmail App Password (16-char, 2FA enabled), not the account password. Update SMTP_PASSWORD in backend/.env once available.
- P2: Make API responses return `id` instead of `_id` (cosmetic; frontend already handles both)
- P2: Doctor edit (currently add/delete only); blog edit
- P2: SEO schema markup, Open Graph tags, Google Analytics/Meta Pixel wiring
- P3: (Optional) Refactor monolithic App.js into modular pages/components
