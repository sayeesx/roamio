This is not a template.
This is a structured product-level frontend instruction.


---

FRONTEND BUILD PROMPT
Project: Roamio – Agentic AI Travel & Medical Concierge


---

Act as a senior frontend architect and product designer.

Build a production-grade frontend for:

Roamio
An AI-powered Medical & Travel Concierge Platform focused on Kerala, targeting NRIs, Gulf tourists, and international visitors.

Use a premium, trustworthy, medical-hospitality tone.

Do not build a generic travel listing site.
Do not create a marketplace UI.
Build a guided orchestration experience.


---

1. TECH STACK REQUIREMENTS



Use:

Next.js 14+ (App Router)
TypeScript
Tailwind CSS
ShadCN UI components
Framer Motion (subtle animations only)
Zod for form validation
React Hook Form
Axios or Fetch
i18n support (English + Arabic RTL support)

Architecture must be scalable.


---

2. GLOBAL LAYOUT STRUCTURE



Create a consistent layout system:

Root Layout:

Header (transparent → solid on scroll)

Main content

Footer


Header:

Logo (Roamio)

Navigation: Medical Concierge Tourism Planning NRI Concierge About Contact

Language toggle (EN / AR)

Primary CTA button: Plan My Visit


Footer:

About summary

Contact details

WhatsApp quick link

Legal disclaimer (No medical diagnosis)

Privacy policy

Social links



---

3. DESIGN SYSTEM



Visual tone: Premium medical + calm hospitality.

Color palette: Primary: Deep teal or navy Accent: Soft gold or warm green Background: Light neutral / off-white Text: Dark charcoal

UI Style: Rounded-xl containers Soft shadows Glass subtle effects only where necessary Large spacing Readable typography

Typography: Modern sans-serif Strong headings Clear hierarchy

Avoid: Overcrowded cards Too many images Marketplace grid style


---

4. CORE PAGES STRUCTURE



A. Home Page

Hero Section: Headline: AI-Powered Travel & Medical Concierge for Kerala

Subheadline: Smart planning. Seamless coordination. Trusted execution.

Primary CTA: Plan My Visit

Secondary CTA: Explore Services

Sections:

1. How Roamio Works (3 steps) Submit details AI creates plan Human team executes


2. Who We Serve Medical Visitors NRIs International Tourists


3. Featured Kerala Destinations Munnar Alappuzha Kochi Wayanad


4. Trust & Safety Section Data security Medical disclaimer Local verified partners


5. Testimonials (static for now)




---

B. Medical Concierge Page

Structure:

Hero: Medical Travel to Kerala Made Simple

Sections:

1. Why Kerala Mention: Kottakkal Arya Vaidya Sala Aster Medcity Baby Memorial Hospital


2. Step-by-Step Process



Submit medical details

AI hospital suggestions

Consultation booking

Stay & logistics

Follow-up support


3. Intake Form Button: Start Medical Plan


4. FAQ Section




---

C. Tourism Planning Page

Hero: Personalized Kerala Travel Planning

Sections:

Destinations overview

Smart itinerary builder explanation

Sample itinerary preview

CTA: Create My Travel Plan



---

D. NRI Concierge Page

Focus on: Short-visit optimization Property visits Wedding coordination Family logistics

CTA: Plan My NRI Visit


---

E. Intake Flow Page (Most Important)

Route example: /plan/start

Multi-step form using React Hook Form + Zod.

Step 1: Select Purpose: Medical Tourism NRI Visit Hybrid

Step 2: Conditional form fields based on selection.

Medical Fields: Country Travel dates Condition summary File upload (PDF/image) Budget range Duration

Tourism Fields: Number of travelers Budget Interests Travel dates

Step 3: Contact Information

Step 4: Confirmation Screen Show: “AI is generating your personalized plan.”

After submission: Call backend API: POST /api/intake

Redirect to: Dashboard (temporary static summary page)


---

F. User Dashboard (Client View)

Route: /dashboard

Display:

1. Plan Summary


2. Recommended Hospitals (if medical)


3. Stay Suggestions


4. Tentative Itinerary


5. Estimated Budget


6. Status: Pending Review Confirmed In Progress



Include: Download PDF plan Chat support button


---

5. COMPONENT ARCHITECTURE



Organize components:

/components /layout /ui /sections /forms /dashboard /cards /modals

Reusable components:

SectionContainer

HeroSection

CTAButton

FeatureCard

StepIndicator

PlanCard

StatusBadge


Keep components clean and modular.


---

6. RTL SUPPORT (Arabic)



Use: dir="rtl" toggle on html Conditional Tailwind classes

Ensure: Navigation alignment flips Text alignment flips Spacing respects RTL


---

7. RESPONSIVENESS



Design mobile-first.

Breakpoints: sm md lg xl

Mobile must:

Keep intake form smooth

Avoid long scroll fatigue

Use sticky CTA buttons



---

8. ANIMATION RULES



Use Framer Motion for:

Section fade-ins

Step transitions

Page transitions


Avoid: Excessive movement Flashy effects Travel marketplace feel


---

9. API INTEGRATION STRUCTURE



Prepare API layer:

/lib/api.ts

Functions: submitIntake(data) getUserPlan(userId) getStatus(userId)

Use loading states. Use error boundary handling. Show skeleton loaders.


---

10. SEO & STRUCTURE



Each page must include:

Proper meta tags

Structured headings

OpenGraph tags

Language alternate links (EN/AR)



---

11. ACCESS CONTROL



Public routes: Home Medical Tourism NRI About

Protected: Dashboard

Use simple token-based auth for MVP.


---

12. FUTURE EXPANSION PREPARATION



Structure code so it can scale to:

Admin dashboard

Vendor dashboard

Field agent mobile panel

Payment gateway integration



---

End Goal:

The frontend must feel like:

An intelligent private concierge system
Not a booking portal
Not a travel blog
Not a hospital directory

It should guide users into structured intake, not browsing.