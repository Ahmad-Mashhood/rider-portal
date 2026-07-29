import { auth, googleProvider } from '../firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import API from '../api'

export const loginRiderWithGoogle = async (extraDetails = null) => {
    try {
        const result = await signInWithPopup(
            auth,
            googleProvider
        )
        
        const firebaseToken = await result.user.getIdToken()
        
        const payload = {
            token: firebaseToken,
            role: 'rider',
            ...(extraDetails || {})
        }

        const response = await API.post(
            '/api/auth/google',
            payload
        )
        
        if (response.data.requires_details) {
            return {
                requires_details: true,
                firebaseToken,
                googleProfile: {
                    name: result.user.displayName || 'Delivery Partner',
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                    ...response.data.google_profile
                }
            }
        }

        if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            localStorage.setItem('rider_email', response.data.user?.email || result.user.email)
            localStorage.setItem('rider_name', response.data.user?.name || result.user.displayName)
            localStorage.setItem('rider_logged_in', 'true')
        }
        
        return response.data
        
    } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
            throw new Error('Login cancelled. Please try again')
        }
        if (error.code === 'auth/popup-blocked') {
            throw new Error('Popup blocked. Please allow popups')
        }
        if (error.code === 'auth/network-request-failed') {
            throw new Error('Network error. Check your internet connection')
        }
        throw new Error(
            error.response?.data?.detail
            || error.message
            || 'Google login failed'
        )
    }
}

export const completeRiderOnboarding = async (firebaseToken, details) => {
    const response = await API.post('/api/auth/google', {
        token: firebaseToken,
        role: 'rider',
        ...details
    })

    if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('rider_email', response.data.user?.email)
        localStorage.setItem('rider_name', response.data.user?.name)
        localStorage.setItem('rider_logged_in', 'true')
    }

    return response.data
}

export const logoutGoogle = async () => {
    try {
        await signOut(auth)
    } catch (e) {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('rider_logged_in')
    window.location.href = '/login'
}
