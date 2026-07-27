import { initializeApp } from 'firebase/app'
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDxXKJvx9XDWoFLdXnctP42BLFPrhmeAcA",
    authDomain: "food-genie-c07a7.firebaseapp.com",
    projectId: "food-genie-c07a7",
    storageBucket: "food-genie-c07a7.firebasestorage.app",
    messagingSenderId: "92326725096",
    appId: "1:92326725096:web:6e35fdbcada0c2739c505d",
    measurementId: "G-GGXEL54DLS"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
