// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase configuration (replace with your own keys from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyBzWY2S08MQAdpisyoEgP91iz6k0mmnD_Y",
    authDomain: "portfolio-4a38e.firebaseapp.com",
    projectId: "portfolio-4a38e",
    storageBucket: "portfolio-4a38e.firebasestorage.app",
    messagingSenderId: "143891765662",
    appId: "1:143891765662:web:82657a5dfd5c46a54e1e8f",
    measurementId: "G-XKEEPM7VN9"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
