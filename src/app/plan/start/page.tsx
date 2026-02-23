'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, ArrowLeft, CheckCircle, XCircle, Loader2, HeartPulse, Plane, Users, Layers, Car, Hotel, FileText, Globe } from 'lucide-react'
import { submitBooking } from '@/lib/api'
import { CountrySelect } from '@/components/ui/form/CountrySelect'
import { TravelDatePicker } from '@/components/ui/form/TravelDatePicker'
import { PhoneInput } from '@/components/ui/form/PhoneInput'
import emailjs from '@emailjs/browser'
import { motion, AnimatePresence } from 'framer-motion'

/* ——— Zod Schemas ——— */
const step1Schema = z.object({
    purpose: z.enum([
        'medical', 'tourism', 'nri', 'hybrid',
        'cab', 'hotel', 'logistics', 'service',
    ], { message: 'Please select a purpose' }),
})

const medicalSchema = z.object({
    country: z.string().min(2, 'Required'),
    travelDates: z.string().min(2, 'Required'),
    conditionSummary: z.string().min(10, 'Please provide a brief summary (min 10 chars)'),
    budget: z.string().min(1, 'Required'),
    duration: z.string().min(1, 'Required'),
})

const tourismSchema = z.object({
    country: z.string().min(2, 'Required'),
    travelers: z.string().min(1, 'Required'),
    budget: z.string().min(1, 'Required'),
    interests: z.string().min(2, 'Required'),
    travelDates: z.string().min(2, 'Required'),
})

const nriSchema = z.object({
    country: z.string().min(2, 'Required'),
    visitDuration: z.string().min(1, 'Required'),
    priorities: z.string().min(5, 'Please describe your priorities'),
})

const contactSchema = z.object({
    name: z.string().min(2, 'Required'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().min(7, 'Enter a valid phone number'),
    country: z.string().min(2, 'Required'),
})

type MedicalFormData = z.infer<typeof medicalSchema>
type TourismFormData = z.infer<typeof tourismSchema>
type NRIFormData = z.infer<typeof nriSchema>
type ContactFormData = z.infer<typeof contactSchema>

type Purpose = 'medical' | 'tourism' | 'nri' | 'hybrid' | 'cab' | 'hotel' | 'logistics' | 'service'

const purposeOptions = [
    { value: 'medical', label: 'Medical Visit', desc: 'Hospital treatment, Ayurveda, health check-ups', icon: <HeartPulse size={28} /> },
    { value: 'tourism', label: 'Tourism', desc: 'Leisure travel, backwaters, cultural experiences', icon: <Plane size={28} /> },
    { value: 'nri', label: 'NRI Visit', desc: 'Short homecoming, family logistics, property visits', icon: <Users size={28} /> },
    { value: 'hybrid', label: 'Hybrid', desc: 'Medical care + Tourism combo', icon: <Layers size={28} /> },
    { value: 'cab', label: 'Cab & Transport', desc: 'Airport transfers, local commute, inter-city', icon: <Car size={28} /> },
    { value: 'hotel', label: 'Hotel & Stays', desc: 'Luxury resorts, budget stays, medical-adjacent', icon: <Hotel size={28} /> },
    { value: 'logistics', label: 'Logistics', desc: 'Cargo, courier, personal errands', icon: <FileText size={28} /> },
    { value: 'service', label: 'Other Service', desc: 'Visa guidance, appointments, etc.', icon: <CheckCircle size={28} /> },
]

const inputCls = 'w-full rounded-xl border border-[#E8E4DF] px-4 py-3 text-sm bg-white text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/10 transition-all'
const labelCls = 'block text-sm font-medium text-[#1C1C1E] mb-1.5'
const errorCls = 'text-xs text-red-500 mt-1'

function IntakeForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [step, setStep] = useState(1)
    const [purpose, setPurpose] = useState<Purpose>('medical')
    const [details, setDetails] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Pre-select purpose from URL ?purpose=... or ?service=...
    useEffect(() => {
        const p = searchParams.get('purpose')
        const s = searchParams.get('service')
        const val = (p || s) as Purpose | null

        const validPurposes = purposeOptions.map(o => o.value)
        if (val && validPurposes.includes(val)) {
            setPurpose(val)
        }
    }, [searchParams])

    /* — Step 1 Form — */
    const s1 = useForm({ resolver: zodResolver(step1Schema), defaultValues: { purpose: 'medical' as Purpose } })

    /* — Step 2 Forms — */
    const medForm = useForm<MedicalFormData>({ resolver: zodResolver(medicalSchema) })
    const tourForm = useForm<TourismFormData>({ resolver: zodResolver(tourismSchema) })
    const nriForm = useForm<NRIFormData>({ resolver: zodResolver(nriSchema) })

    /* — Step 3 Form — */
    const contactForm = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: '', email: '', phone: '', country: '' }
    })
    const selectedCountry = contactForm.watch('country')

    const totalSteps = 4

    const handleStep1 = (data: { purpose: Purpose }) => {
        setPurpose(data.purpose)
        setStep(2)
    }

    const handleStep2 = async (data: Record<string, string>) => {
        setDetails(data)
        // Auto-fill Step 3 if country was provided in Step 2
        if (data.country) {
            contactForm.setValue('country', data.country)
        }
        setStep(3)
    }

    const handleStep3 = async (contact: ContactFormData) => {
        setSubmitting(true)
        setError(null)
        console.log('Submitting booking payload:', { purpose, details, contact })
        try {
            const result = await submitBooking({ purpose, details, contact })
            console.log('Submission result:', result)

            // Format details for the email
            const formattedDetails = Object.entries(details)
                .map(([key, val]) => {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                    return `<li><strong>${label}:</strong> ${val}</li>`
                })
                .join('')

            // EmailJS verification email
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

            console.log('EmailJS Config:', { serviceId, templateId, hasKey: !!publicKey })

            if (serviceId && templateId && publicKey) {
                try {
                    await emailjs.send(
                        serviceId,
                        templateId,
                        {
                            to_name: contact.name,
                            to_email: contact.email,
                            purpose_label: purposeOptions.find(o => o.value === purpose)?.label,
                            trip_details: `<ul>${formattedDetails}</ul>`,
                            message: `An agent will be in touch with you shortly to finalize your ${purposeOptions.find(o => o.value === purpose)?.label} plan.`,
                        },
                        publicKey
                    )
                } catch (emailErr: any) {
                    console.error('EmailJS direct error:', emailErr?.text || emailErr?.message || emailErr)
                }
            } else {
                console.warn('EmailJS keys missing in environment.')
            }

            setStep(4)
        } catch (err: any) {
            console.error('Critical booking error:', err)
            setError(err.message || 'Something went wrong. Please try again or contact us directly.')
            setStep(5) // Step 5 for failure
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F9F7F4] flex flex-col">
            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-[#E8E4DF]">
                <div
                    className="h-full gradient-primary transition-all duration-500"
                    style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                />
            </div>

            <div className="flex-1 flex items-start justify-center pt-24 pb-16 px-4">
                <div className="w-full max-w-2xl">
                    {/* Step indicator */}
                    {step < 4 && (
                        <div className="flex items-center justify-center gap-2 mb-8">
                            {Array.from({ length: totalSteps - 1 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i + 1 ? 'gradient-primary text-white' :
                                        step === i + 1 ? 'bg-[#0D6E6E] text-white ring-4 ring-[#0D6E6E]/20' :
                                            'bg-[#E8E4DF] text-[#6B7280]'
                                        }`}>
                                        {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
                                    </div>
                                    {i < totalSteps - 2 && <div className={`h-0.5 w-8 sm:w-20 rounded transition-all ${step > i + 1 ? 'bg-[#0D6E6E]' : 'bg-[#E8E4DF]'}`} />}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-white rounded-2xl border border-[#E8E4DF] shadow-sm p-5 sm:p-8">

                        {/* ——— Step 1: Purpose ——— */}
                        {step === 1 && (
                            <form onSubmit={s1.handleSubmit(handleStep1 as Parameters<typeof s1.handleSubmit>[0])}>
                                <h1 className="text-2xl font-bold text-[#1C1C1E] mb-2">What brings you to Kerala?</h1>
                                <p className="text-[#6B7280] mb-8">Select the primary purpose of your visit so we can personalize your plan.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                                    {purposeOptions.map((opt) => (
                                        <label key={opt.value} className="cursor-pointer group">
                                            <input
                                                type="radio"
                                                value={opt.value}
                                                {...s1.register('purpose')}
                                                className="sr-only"
                                                onChange={() => setPurpose(opt.value as Purpose)}
                                            />
                                            <div className={`p-4 rounded-xl border-2 transition-all hover:border-[#0D6E6E]/50 h-full ${purpose === opt.value
                                                ? 'border-[#0D6E6E] bg-[#0D6E6E]/5'
                                                : 'border-[#E8E4DF] bg-white'
                                                }`}>
                                                <div className={`mb-2.5 ${purpose === opt.value ? 'text-[#0D6E6E]' : 'text-[#6B7280]'}`}>
                                                    {opt.icon}
                                                </div>
                                                <h3 className="font-bold text-[#1C1C1E] text-sm mb-1">{opt.label}</h3>
                                                <p className="text-[10px] text-[#6B7280] leading-tight">{opt.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {s1.formState.errors.purpose && <p className={errorCls}>{s1.formState.errors.purpose.message}</p>}
                                <button suppressHydrationWarning type="submit" className="w-full py-3.5 rounded-xl font-semibold text-white gradient-primary hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                    Continue <ArrowRight size={18} />
                                </button>
                            </form>
                        )}

                        {/* ——— Step 2: Medical Fields ——— */}
                        {step === 2 && purpose === 'medical' && (
                            <form onSubmit={medForm.handleSubmit((d) => handleStep2(d as Record<string, string>))}>
                                <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">Medical Travel Details</h2>
                                <p className="text-[#6B7280] mb-8">Share your situation so we can match you with the right hospital and specialists.</p>
                                <div className="space-y-5">
                                    <div>
                                        <Controller
                                            name="country"
                                            control={medForm.control}
                                            render={({ field }) => (
                                                <CountrySelect
                                                    label="Country of Residence"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    error={medForm.formState.errors.country?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <TravelDatePicker label="Intended Travel Dates" error={medForm.formState.errors.travelDates?.message} {...medForm.register('travelDates')} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Condition / Purpose of Visit</label>
                                        <textarea rows={3} className={inputCls} placeholder="Briefly describe your condition or treatment need..." {...medForm.register('conditionSummary')} />
                                        {medForm.formState.errors.conditionSummary && <p className={errorCls}>{medForm.formState.errors.conditionSummary.message}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelCls}>Approx. Budget (USD)</label>
                                            <select className={inputCls} {...medForm.register('budget')}>
                                                <option value="">Select range</option>
                                                <option value="under-2000">Under $2,000</option>
                                                <option value="2000-5000">$2,000 – $5,000</option>
                                                <option value="5000-15000">$5,000 – $15,000</option>
                                                <option value="over-15000">Over $15,000</option>
                                            </select>
                                            {medForm.formState.errors.budget && <p className={errorCls}>{medForm.formState.errors.budget.message}</p>}
                                        </div>
                                        <div>
                                            <label className={labelCls}>Duration of Stay</label>
                                            <select className={inputCls} {...medForm.register('duration')}>
                                                <option value="">Select...</option>
                                                <option value="1-2w">1–2 weeks</option>
                                                <option value="3-4w">3–4 weeks</option>
                                                <option value="1-2m">1–2 months</option>
                                                <option value="2m+">2+ months</option>
                                            </select>
                                            {medForm.formState.errors.duration && <p className={errorCls}>{medForm.formState.errors.duration.message}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-8">
                                    <button suppressHydrationWarning type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E8E4DF] text-[#6B7280] text-sm font-medium hover:border-[#0D6E6E] transition-colors">
                                        <ArrowLeft size={16} /> Back
                                    </button>
                                    <button suppressHydrationWarning type="submit" className="flex-1 py-3.5 rounded-xl font-semibold text-white gradient-primary hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                        Continue <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ——— Step 2: Tourism Fields ——— */}
                        {step === 2 && (purpose === 'tourism' || purpose === 'hybrid') && (
                            <form onSubmit={tourForm.handleSubmit((d) => handleStep2(d as Record<string, string>))}>
                                <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">Travel Preferences</h2>
                                <p className="text-[#6B7280] mb-8">Help us understand your travel style so we can build the perfect Kerala itinerary.</p>
                                <div className="space-y-5">
                                    <div>
                                        <Controller
                                            name="country"
                                            control={tourForm.control}
                                            render={({ field }) => (
                                                <CountrySelect
                                                    label="Country of Residence"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    error={tourForm.formState.errors.country?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelCls}>Number of Travelers</label>
                                            <select className={inputCls} {...tourForm.register('travelers')}>
                                                <option value="">Select...</option>
                                                {['1', '2', '3-5', '6-10', '10+'].map(v => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                            {tourForm.formState.errors.travelers && <p className={errorCls}>{tourForm.formState.errors.travelers.message}</p>}
                                        </div>
                                        <div>
                                            <label className={labelCls}>Budget (USD / person)</label>
                                            <select className={inputCls} {...tourForm.register('budget')}>
                                                <option value="">Select...</option>
                                                <option value="budget">Under $500</option>
                                                <option value="mid">$500 – $1,500</option>
                                                <option value="premium">$1,500 – $3,000</option>
                                                <option value="luxury">$3,000+</option>
                                            </select>
                                            {tourForm.formState.errors.budget && <p className={errorCls}>{tourForm.formState.errors.budget.message}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Interests</label>
                                        <input className={inputCls} placeholder="e.g. backwaters, Ayurveda, wildlife, food, culture..." {...tourForm.register('interests')} />
                                        {tourForm.formState.errors.interests && <p className={errorCls}>{tourForm.formState.errors.interests.message}</p>}
                                    </div>
                                    <div>
                                        <TravelDatePicker label="Travel Dates" error={tourForm.formState.errors.travelDates?.message} {...tourForm.register('travelDates')} />
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-8">
                                    <button suppressHydrationWarning type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E8E4DF] text-[#6B7280] text-sm font-medium hover:border-[#0D6E6E] transition-colors">
                                        <ArrowLeft size={16} /> Back
                                    </button>
                                    <button suppressHydrationWarning type="submit" className="flex-1 py-3.5 rounded-xl font-semibold text-white gradient-primary hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                        Continue <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ——— Step 2: NRI Fields ——— */}
                        {step === 2 && purpose === 'nri' && (
                            <form onSubmit={nriForm.handleSubmit((d) => handleStep2(d as Record<string, string>))}>
                                <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">NRI Visit Details</h2>
                                <p className="text-[#6B7280] mb-8">Tell us about your upcoming Kerala visit so we can maximize every day.</p>
                                <div className="space-y-5">
                                    <div>
                                        <Controller
                                            name="country"
                                            control={nriForm.control}
                                            render={({ field }) => (
                                                <CountrySelect
                                                    label="Country of Residence"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    error={nriForm.formState.errors.country?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Duration of Visit</label>
                                        <select className={inputCls} {...nriForm.register('visitDuration')}>
                                            <option value="">Select...</option>
                                            {['1 week', '2 weeks', '3 weeks', '1 month', '2+ months'].map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                        {nriForm.formState.errors.visitDuration && <p className={errorCls}>{nriForm.formState.errors.visitDuration.message}</p>}
                                    </div>
                                    <div>
                                        <label className={labelCls}>What are your top priorities?</label>
                                        <textarea rows={3} className={inputCls} placeholder="e.g. property visit, medical check-ups, family wedding, legal matters..." {...nriForm.register('priorities')} />
                                        {nriForm.formState.errors.priorities && <p className={errorCls}>{nriForm.formState.errors.priorities.message}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-8">
                                    <button suppressHydrationWarning type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E8E4DF] text-[#6B7280] text-sm font-medium hover:border-[#0D6E6E] transition-colors">
                                        <ArrowLeft size={16} /> Back
                                    </button>
                                    <button suppressHydrationWarning type="submit" className="flex-1 py-3.5 rounded-xl font-semibold text-white gradient-primary hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                        Continue <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ——— Step 3: Contact ——— */}
                        {step === 3 && (
                            <form onSubmit={contactForm.handleSubmit(handleStep3)}>
                                <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">Your Contact Details</h2>
                                <p className="text-[#6B7280] mb-8">We&apos;ll use this to send your personalized plan and follow up with any questions.</p>
                                <div className="space-y-5">
                                    <div>
                                        <label className={labelCls}>Full Name</label>
                                        <input className={inputCls} placeholder="Ahmed Al-Rashidi" {...contactForm.register('name')} />
                                        {contactForm.formState.errors.name && <p className={errorCls}>{contactForm.formState.errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <label className={labelCls}>Email Address</label>
                                        <input type="email" className={inputCls} placeholder="ahmed@example.com" {...contactForm.register('email')} />
                                        {contactForm.formState.errors.email && <p className={errorCls}>{contactForm.formState.errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <Controller
                                            name="phone"
                                            control={contactForm.control}
                                            render={({ field }) => (
                                                <PhoneInput
                                                    label="Phone / WhatsApp"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    error={contactForm.formState.errors.phone?.message}
                                                    selectedCountryName={selectedCountry}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name="country"
                                            control={contactForm.control}
                                            render={({ field }) => (
                                                <CountrySelect
                                                    label="Country"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    error={contactForm.formState.errors.country?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                {error && (
                                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
                                )}
                                <div className="flex gap-3 mt-8">
                                    <button suppressHydrationWarning type="button" onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E8E4DF] text-[#6B7280] text-sm font-medium hover:border-[#0D6E6E] transition-colors">
                                        <ArrowLeft size={16} /> Back
                                    </button>
                                    <button
                                        suppressHydrationWarning
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 py-3.5 rounded-xl font-semibold text-white gradient-primary hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {submitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <>Submit Plan Request <ArrowRight size={18} /></>}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ——— Step 4: Confirmation (Success) ——— */}
                        {step === 4 && (
                            <div className="text-center py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle size={40} className="text-white" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-[#1C1C1E] mb-3">Your Request is Sent!</h2>
                                <p className="text-[#6B7280] leading-relaxed mb-8 max-w-md mx-auto">
                                    Your request has been sent, our agent will be in contact with you soon...
                                </p>
                                <button
                                    suppressHydrationWarning
                                    onClick={() => router.push('/dashboard')}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white gradient-primary hover:opacity-90 transition-opacity text-sm"
                                >
                                    View My Dashboard <ArrowRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* ——— Step 5: Failure ——— */}
                        {step === 5 && (
                            <div className="text-center py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-6"
                                >
                                    <XCircle size={40} className="text-white" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-[#1C1C1E] mb-3">Submission Failed</h2>
                                <p className="text-[#6B7280] leading-relaxed mb-8 max-w-md mx-auto">
                                    {error || 'Something went wrong. Please try again or contact us directly.'}
                                </p>
                                <button
                                    suppressHydrationWarning
                                    onClick={() => setStep(3)}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white gradient-primary hover:opacity-90 transition-opacity text-sm"
                                >
                                    Try Again <ArrowLeft size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Trust note */}
                    {step < 4 && (
                        <p className="text-center text-xs text-[#9CA3AF] mt-6">
                            🔒 Your information is encrypted and never shared without your consent.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

// The page export wraps IntakeForm in Suspense because useSearchParams()
// requires a Suspense boundary during static prerendering on Vercel.
export default function IntakeStartPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 size={32} className="animate-spin text-[#0D6E6E]" />
                        <p className="text-sm text-[#6B7280]">Loading...</p>
                    </div>
                </div>
            }
        >
            <IntakeForm />
        </Suspense>
    )
}
