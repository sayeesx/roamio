import Link from 'next/link'
import { ArrowRight, CheckCircle, Users, Heart, Plane, Star, Shield, Lock, MapPin, Car, FileText, Hotel, Stethoscope } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { FeatureCard, StepIndicator } from '@/components/ui/Cards'
import { CountUpStats } from '@/components/ui/CountUpStats'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI-Powered Medical & Travel Concierge for Kerala',
  description: 'Roamio is your intelligent concierge for medical travel, tourism, and NRI visits to Kerala. Smart planning. Seamless coordination. Trusted execution.',
}

const howItWorks = [
  {
    number: 1,
    label: 'Tell Us Your Plan',
    description: 'Share your purpose for visiting Kerala — whether it\'s relaxation, medical consultation, exploring, or other visits — along with your dates and preferences.',
  },
  {
    number: 2,
    label: 'We Design Your Journey',
    description: 'We arrange everything you need: flight tickets, visa guidance (if required), airport pickup, stays, food preferences, local transport, appointments, and trusted local support.',
  },
  {
    number: 3,
    label: 'We Take Care Until You Return',
    description: 'From the moment you land to the day you fly back, our team coordinates every detail — ensuring a smooth, comfortable, and worry-free experience.',
  },
]

const audiences = [
  {
    icon: <Heart size={20} className="sm:hidden" />,
    iconLg: <Heart size={28} className="hidden sm:block" />,
    title: 'Wellness & Care Travelers',
    description: 'Visiting for Ayurveda or personal well-being? We coordinate appointments, stays, local travel, and everything around it — so you can focus on yourself.',
  },
  {
    icon: <Plane size={20} className="sm:hidden" />,
    iconLg: <Plane size={28} className="hidden sm:block" />,
    title: 'International Explorers',
    description: 'Experience Kerala beyond the usual routes. We create thoughtfully planned journeys that feel authentic, comfortable, and memorable.',
  },
  {
    icon: <Users size={20} className="sm:hidden" />,
    iconLg: <Users size={28} className="hidden sm:block" />,
    title: 'Visitors From Abroad',
    description: 'We handle travel plans, personal errands, cargo and courier needs, and full logistics support — so your visit to Kerala feels effortless.',
  },
]

const destinations = [
  { name: 'Munnar', tag: 'Tea Hills & Mist', color: '#1a5c3a' },
  { name: 'Alappuzha', tag: 'Backwaters & Houseboats', color: '#1a3a5c' },
  { name: 'Kochi', tag: 'Heritage & Cosmopolitan', color: '#3a1a5c' },
  { name: 'Wayanad', tag: 'Forests & Tribal Culture', color: '#5c3a1a' },
]

const testimonials = [
  {
    quote: 'Roamio organized my entire Ayurveda treatment at Kottakkal. From airport to hospital to stay — everything was seamless.',
    author: 'Ahmed Al-Rashidi',
    role: 'Dubai, UAE',
    rating: 5,
  },
  {
    quote: 'As an NRI visiting for two weeks, Roamio packed everything in perfectly — property, family doctor, and a weekend in Munnar.',
    author: 'Priya Menon',
    role: 'London, UK',
    rating: 5,
  },
  {
    quote: 'I was nervous about medical travel abroad. Roamio guided me every step of the way. I felt completely taken care of.',
    author: 'Fatima Al-Qasim',
    role: 'Riyadh, KSA',
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <>
      {/* ——— Hero ——— */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #F2EFE9 0%, #EDE8E0 60%, #E8E2D8 100%)' }}
      >
        {/* Subtle static blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #d4c9a8 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #b8c9c9 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-14 sm:pb-20">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-[#0D6E6E]/10 border border-[#0D6E6E]/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-5 sm:mb-8">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#C9A84C] rounded-full animate-pulse" />
              <span className="text-[#0D6E6E] text-xs sm:text-sm font-semibold">Kerala&apos;s Premier AI Concierge</span>
            </div>

            <h1 className="animate-fade-in-up-delay-1 text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1C1C1E] leading-[1.1] mb-5">
              Travel Kerala,{' '}
              <span className="text-[#0D6E6E]">effortlessly.</span>
            </h1>

            <p className="animate-fade-in-up-delay-2 text-base sm:text-xl text-[#4B5563] mb-8 sm:mb-10 leading-relaxed max-w-2xl">
              Smart planning. Seamless coordination. Trusted execution.
              Your intelligent guide to Kerala whether you&apos;re seeking adventure, or healing.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up-delay-3 flex flex-wrap gap-3 sm:gap-4">
              <CTAButton href="/plan/start" variant="primary" size="lg" className="bg-[#C9A84C] text-white hover:bg-[#b8962f]">
                Plan My Visit <ArrowRight size={20} />
              </CTAButton>
              <CTAButton href="#services" variant="outline" size="lg" className="border-[#0D6E6E] text-[#0D6E6E] hover:bg-[#0D6E6E]/5">
                Explore Services
              </CTAButton>
            </div>

            {/* Trust indicators */}
            <div className="animate-fade-in-up-delay-4 flex flex-wrap items-center gap-4 sm:gap-6 mt-8 sm:mt-10">
              {[
                { icon: <CheckCircle size={16} />, text: 'Verified local partners' },
                { icon: <CheckCircle size={16} />, text: 'AI-powered planning' },
                { icon: <CheckCircle size={16} />, text: '24/7 concierge support' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-[#6B7280] text-sm">
                  <span className="text-[#0D6E6E]">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>


      </section>

      {/* ——— How Roamio Works ——— */}
      <SectionContainer id="how-it-works">
        <SectionHeading
          eyebrow="Our Process"
          title="How Roamio Works"
          subtitle="Three simple steps from intent to execution. We handle everything in between."
        />
        <StepIndicator steps={howItWorks} />
      </SectionContainer>

      {/* ——— We Can Also Arrange ——— */}
      <SectionContainer variant="tinted" id="arrange">
        <SectionHeading
          eyebrow="Individual Services"
          title="We Can Arrange Anything"
          subtitle="Need just one thing sorted? We handle individual services too — no need to book a full package."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { icon: <Car size={22} />, label: 'Cab & Local Transport', color: '#0D6E6E', href: '/services/cabs' },
            { icon: <Plane size={22} />, label: 'Flight Tickets', color: '#1a5c8a', href: '/services/flights' },
            { icon: <Stethoscope size={22} />, label: 'Hospital Consultation', color: '#5c1a3a', href: '/services/hospital' },
            { icon: <Hotel size={22} />, label: 'Hotel & Stays', color: '#5c3a1a', href: '/services/stays' },
            { icon: <MapPin size={22} />, label: 'Airport Pickup', color: '#1a4a1a', href: '/services/airport-pickup' },
            { icon: <FileText size={22} />, label: 'Visa Guidance', color: '#3a1a5c', href: '/services/visa' },
          ].map((service) => (
            <Link
              key={service.label}
              href={service.href}
              className="group flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E4DF] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 bg-[#F2EFE9]"
                style={{ color: service.color }}
              >
                {service.icon}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#1C1C1E] leading-tight">{service.label}</p>
            </Link>
          ))}
        </div>
        <p className="text-center text-sm text-[#6B7280] mt-6">
          Not sure what you need?{' '}
          <Link href="/plan/start" className="text-[#0D6E6E] font-semibold hover:underline">
            Tell us your plan
          </Link>{' '}
          and we&apos;ll figure it out together.
        </p>
      </SectionContainer>

      {/* ——— Who We Serve ——— */}
      <SectionContainer id="services">
        <SectionHeading
          eyebrow="Who We Serve"
          title="Made for Every Kind of Kerala Visitor"
          subtitle="Whether you are returning home, exploring for the first time, or planning something meaningful, we make your time in Kerala smooth and well organised."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {audiences.map((item) => (
            <FeatureCard key={item.title} icon={<>{item.icon}{item.iconLg}</>} title={item.title} description={item.description} />
          ))}
        </div>
      </SectionContainer>

      {/* ——— Kerala Destinations ——— */}
      <SectionContainer id="destinations">
        <SectionHeading
          eyebrow="Featured Destinations"
          title="The Best of Kerala, Curated for You"
          subtitle="Beyond the tourist trail — places chosen for experience, authenticity, and access."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {destinations.map((dest) => (
            <Link
              key={dest.name}
              href={`/tourism#${dest.name.toLowerCase()}`}
              className="group relative h-40 sm:h-56 lg:h-72 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Color block background */}
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(160deg, ${dest.color} 0%, ${dest.color}cc 100%)`,
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 p-3 sm:p-5">
                <p className="text-white/70 text-[10px] sm:text-xs font-medium tracking-wide uppercase mb-0.5 sm:mb-1">{dest.tag}</p>
                <h3 className="text-white text-sm sm:text-xl font-bold leading-tight">{dest.name}</h3>
              </div>
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1">
                <MapPin size={8} className="text-[#C9A84C] sm:hidden" />
                <MapPin size={10} className="text-[#C9A84C] hidden sm:block" />
                <span className="text-white text-[10px] sm:text-xs">Kerala</span>
              </div>
            </Link>
          ))}
        </div>
      </SectionContainer>

      {/* ——— Trust & Safety ——— */}
      <SectionContainer variant="dark" id="trust">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <SectionHeading
              eyebrow="Why Trust Roamio"
              title="Security, Privacy & Local Expertise"
              subtitle="We take your data and health seriously. Your trust is the foundation of everything we do."
              centered={false}
              light
            />
            <div className="space-y-4">
              {[
                { icon: <Lock size={20} />, title: 'Data Security', desc: 'Your personal and medical information is encrypted and never shared without consent.' },
                { icon: <Shield size={20} />, title: 'Medical Disclaimer', desc: 'We coordinate — we do not diagnose. All medical guidance comes from licensed professionals.' },
                { icon: <CheckCircle size={20} />, title: 'Verified Partners', desc: 'Every hospital, hotel, and service provider in our network is verified and reviewed.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <CountUpStats stats={[
            { number: '500+', label: 'Visits Coordinated' },
            { number: '15+', label: 'Hospital Partners' },
            { number: '98%', label: 'Satisfaction Rate' },
            { number: '24/7', label: 'Concierge Support' },
          ]} />
        </div>
      </SectionContainer>

      {/* ——— Testimonials ——— */}
      <SectionContainer variant="tinted" id="testimonials">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Visitors Say"
          subtitle="Real experiences from people we've guided through Kerala."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="bg-white rounded-2xl p-5 sm:p-8 border border-[#E8E4DF] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex gap-1 mb-3 sm:mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-[#C9A84C] text-[#C9A84C]" />
                ))}
              </div>
              <p className="text-[#1C1C1E] text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="font-semibold text-[#1C1C1E] text-sm sm:text-base">{t.author}</p>
                <p className="text-xs sm:text-sm text-[#6B7280]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* ——— Final CTA ——— */}
      <SectionContainer>
        <div className="text-center max-w-2xl mx-auto">
          <SectionHeading
            eyebrow="Ready to Begin"
            title="Your Kerala Journey Starts Here"
            subtitle="Tell us what you need, and we will craft a personalised plan designed around you."
          />
          <div className="flex flex-wrap justify-center gap-4">
            <CTAButton href="/plan/start" variant="secondary" size="lg">
              Plan My Visit <ArrowRight size={20} />
            </CTAButton>
            <CTAButton href="/contact" variant="ghost" size="lg">
              Talk to Us First
            </CTAButton>
          </div>
        </div>
      </SectionContainer>
    </>
  )
}
