import { auth, googleProvider } from '../firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import API from '../api'

export const loginWithGoogle = async (role) => {
    try {
        const result = await signInWithPopup(
            auth,
            googleProvider
        )
        
        const firebaseToken = await result.user.getIdToken()
        
        const response = await API.post(
            '/api/auth/google',
            {
                token: firebaseToken,
                role: role
            }
        )
        
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
            throw new Error(
                'Login cancelled. Please try again'
            )
        }
        if (error.code === 'auth/popup-blocked') {
            throw new Error(
                'Popup blocked. Please allow popups'
            )
        }
        if (error.code === 'auth/network-request-failed') {
            throw new Error(
                'Network error. Check your internet'
            )
        }
        throw new Error(
            error.response?.data?.detail
            || error.message
            || 'Google login failed'
        )
    }
}

export const logoutGoogle = async () => {
    try {
        await signOut(auth)
    } catch (e) {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
}
