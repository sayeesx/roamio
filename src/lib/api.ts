import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    headers: { 'Content-Type': 'application/json' },
})

// Attach auth token from localStorage when available
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('roamio_token')
        if (token) config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

export interface IntakePayload {
    purpose: 'medical' | 'tourism' | 'nri' | 'hybrid' | 'cab' | 'hotel' | 'logistics' | 'service'
    details: Record<string, unknown>
    contact: {
        name: string
        email: string
        phone: string
        country: string
    }
}

export async function submitIntake(data: IntakePayload) {
    const res = await api.post('/api/intake', data)
    return res.data as { planId: string; message: string }
}

export async function getUserPlan(userId: string) {
    const res = await api.get(`/api/plan/${userId}`)
    return res.data
}

export async function getStatus(userId: string) {
    const res = await api.get(`/api/status/${userId}`)
    return res.data as { status: 'pending' | 'confirmed' | 'in_progress' | 'completed' }
}

export async function submitBooking(data: IntakePayload) {
    const res = await api.post('/api/bookings', data)
    return res.data as { success: boolean; bookingId: string; message: string }
}
