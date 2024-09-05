import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getDatabase, ref, set, get, push, onValue, update, remove, query, orderByChild, onChildChanged, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js';

// Function to fetch Firebase config
async function getFirebaseConfig() {
    try {
        const response = await fetch('/Config/GetFirebaseConfig');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();
        return config;
    } catch (error) {
        console.error('Error fetching Firebase config:', error);
        throw error;
    }
}

// Function to initialize Firebase
async function initializeFirebase() {
    try {
        const firebaseConfig = await getFirebaseConfig();

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        return app;
    } catch (error) {
        console.error('Failed to initialize Firebase:', error);
    }
}

const app = await initializeFirebase();
console.log('Firebase initialized successfully');

const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { database, ref, set, get, push, onValue, update, remove, query, orderByChild, onChildChanged, serverTimestamp, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider, storage, storageRef, uploadBytes, getDownloadURL };