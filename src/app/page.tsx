import Link from 'next/link'
import { ArrowRight, CheckCircle, Users, Heart, Plane, Star, Shield, Lock, MapPin } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { FeatureCard, StepIndicator } from '@/components/ui/Cards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI-Powered Medical & Travel Concierge for Kerala',
  description: 'Roamio is your intelligent concierge for medical travel, tourism, and NRI visits to Kerala. Smart planning. Seamless coordination. Trusted execution.',
}

const howItWorks = [
  { number: 1, label: 'Submit Your Details', description: 'Tell us your purpose — medical, tourism, or NRI visit — and share relevant details.' },
  { number: 2, label: 'AI Creates Your Plan', description: 'Our AI analyzes your needs and generates a personalized, actionable plan within hours.' },
  { number: 3, label: 'Human Team Executes', description: 'Our verified local team coordinates every detail — appointments, stays, logistics.' },
]

const audiences = [
  {
    icon: <Heart size={28} />,
    title: 'Medical Visitors',
    description: 'Access world-class Ayurveda and modern medical care in Kerala. We coordinate hospitals, consultations, stays, and follow-up care.',
  },
  {
    icon: <Users size={28} />,
    title: 'NRIs & Gulf Expats',
    description: 'Back home for a short visit? We help you maximize your time — property checks, family logistics, medical appointments, and more.',
  },
  {
    icon: <Plane size={28} />,
    title: 'International Tourists',
    description: 'Discover Kerala authentically. We build personalized itineraries that go beyond the tourist trail — curated, coordinated, cultural.',
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-[#0D6E6E]/10 border border-[#0D6E6E]/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
              <span className="text-[#0D6E6E] text-sm font-semibold">Kerala&apos;s Premier AI Concierge</span>
            </div>

            <h1 className="animate-fade-in-up-delay-1 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1C1C1E] leading-[1.1] mb-6">
              AI-Powered{' '}
              <span className="text-[#0D6E6E]">Medical & Travel</span>{' '}
              Concierge for Kerala
            </h1>

            <p className="animate-fade-in-up-delay-2 text-xl text-[#4B5563] mb-10 leading-relaxed max-w-2xl">
              Smart planning. Seamless coordination. Trusted execution.
              Your intelligent guide to Kerala — whether you&apos;re seeking healing, adventure, or home.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up-delay-3 flex flex-wrap gap-4">
              <CTAButton href="/plan/start" variant="primary" size="lg" className="bg-[#C9A84C] text-white hover:bg-[#b8962f]">
                Plan My Visit <ArrowRight size={20} />
              </CTAButton>
              <CTAButton href="#services" variant="outline" size="lg" className="border-[#0D6E6E] text-[#0D6E6E] hover:bg-[#0D6E6E]/5">
                Explore Services
              </CTAButton>
            </div>

            {/* Trust indicators */}
            <div className="animate-fade-in-up-delay-4 flex flex-wrap items-center gap-6 mt-10">
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

      {/* ——— Who We Serve ——— */}
      <SectionContainer id="services" variant="tinted">
        <SectionHeading
          eyebrow="Who We Serve"
          title="Built for Every Type of Kerala Visitor"
          subtitle="Whether you're seeking healing, reconnecting with home, or discovering Kerala for the first time."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.map((dest) => (
            <Link
              key={dest.name}
              href={`/tourism#${dest.name.toLowerCase()}`}
              className="group relative h-56 lg:h-72 rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Color block background */}
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(160deg, ${dest.color} 0%, ${dest.color}cc 100%)`,
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <p className="text-white/70 text-xs font-medium tracking-wide uppercase mb-1">{dest.tag}</p>
                <h3 className="text-white text-xl font-bold">{dest.name}</h3>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1">
                <MapPin size={10} className="text-[#C9A84C]" />
                <span className="text-white text-xs">Kerala</span>
              </div>
            </Link>
          ))}
        </div>
      </SectionContainer>

      {/* ——— Trust & Safety ——— */}
      <SectionContainer variant="dark" id="trust">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
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
          <div className="grid grid-cols-2 gap-4">
            {[
              { number: '500+', label: 'Visits Coordinated' },
              { number: '15+', label: 'Hospital Partners' },
              { number: '98%', label: 'Satisfaction Rate' },
              { number: '24/7', label: 'Concierge Support' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                <p className="text-3xl font-bold text-[#C9A84C] mb-1">{stat.number}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
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
              className="bg-white rounded-2xl p-8 border border-[#E8E4DF] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-[#C9A84C] text-[#C9A84C]" />
                ))}
              </div>
              <p className="text-[#1C1C1E] leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="font-semibold text-[#1C1C1E]">{t.author}</p>
                <p className="text-sm text-[#6B7280]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* ——— Final CTA ——— */}
      <SectionContainer>
        <div className="text-center max-w-2xl mx-auto">
          <SectionHeading
            eyebrow="Ready to Begin?"
            title="Your Kerala Journey Starts Here"
            subtitle="Tell us what you need. Our AI will build your personalized plan in minutes."
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
