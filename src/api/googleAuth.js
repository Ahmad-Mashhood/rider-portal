import { auth, googleProvider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'
import API from '../api'

export const loginWithGoogle = async (role) => {
    try {
        // Step 1 Open Google popup
        const result = await signInWithPopup(
            auth,
            googleProvider
        )
        
        // Step 2 Get Firebase token
        const firebaseToken = await result.user.getIdToken()
        
        // Step 3 Send to FastAPI backend
        const response = await API.post(
            '/api/auth/google',
            {
                token: firebaseToken,
                role: role
            }
        )
        
        // Step 4 Save JWT token
        localStorage.setItem(
            'token',
            response.data.token
        )
        localStorage.setItem(
            'user',
            JSON.stringify(response.data.user)
        )
        
        return response.data
        
    } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
            throw new Error('Login cancelled. Please try again')
        }
        if (error.code === 'auth/cancelled-popup-request') {
            throw new Error('Login cancelled')
        }
        if (error.code === 'auth/popup-blocked') {
            throw new Error('Please allow popups for this site')
        }
        if (error.code === 'auth/network-request-failed') {
            throw new Error('Network error. Check your internet')
        }
        if (error.code === 'auth/too-many-requests') {
            throw new Error('Too many attempts. Try again later')
        }
        throw new Error(
            error.response?.data?.detail
            || error.message
            || 'Google login failed'
        )
    }
}
