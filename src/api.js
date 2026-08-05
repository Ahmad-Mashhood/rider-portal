import axios from 'axios'

const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return 'https://backend-fawn-six-97.vercel.app'
    }
    return 'http://localhost:8000'
}

const API = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json'
    }
})

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/reset-password')) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export const forgotPassword = async (email, frontendUrl = null) => {
    const response = await API.post('/api/auth/forgot-password', {
        email,
        frontend_url: frontendUrl || window.location.origin
    })
    return response.data
}

export const resetPassword = async (token, newPassword) => {
    const response = await API.post('/api/auth/reset-password', {
        token: token,
        new_password: newPassword
    })
    return response.data
}

export default API
