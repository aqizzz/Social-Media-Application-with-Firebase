import { onAuthStateChanged, auth, signOut } from './db.js';

const guestEls = document.getElementsByClassName('guestEl');
const authenticatedEls = document.getElementsByClassName('authenticatedEl');
const userDropdown = document.getElementById('userDropdown');

function checkAuthState() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user || null);
        }, (error) => {
            console.error("Auth state check failed:", error);
            reject(error);
        });
    });
}

function hideElement(el) {
    if (el) {
        el.classList.add('d-none');
    }
}

function showElement(el) {
    if (el) {
        el.classList.remove('d-none');
    }
}

function showAuthenticatedEls(user) {
    Array.from(authenticatedEls).forEach(el => {
        showElement(el);
    });

    Array.from(guestEls).forEach(el => {
        hideElement(el);
    });

    userDropdown.textContent = user.email;
}

function showGuestEls() {
    Array.from(guestEls).forEach(el => {
        showElement(el);
    });

    Array.from(authenticatedEls).forEach(el => {
        hideElement(el);
    });
}

function logout() {
    signOut(auth).then(() => {
        window.user = undefined;
        console.log("User signed out successfully");
    }).catch((error) => {
        console.error("Sign out error", error);
    });
}

document.getElementById('logoutBtn').addEventListener('click', () => logout());

checkAuthState()
    .then((user) => {
        if (user) {
            console.log("Logged in user:", user.email);
            showAuthenticatedEls(user);
            window.user = user;
        } else {
            console.log("No user logged in");
            showGuestEls();
        }
    })
    .catch((error) => {
        console.error("Error checking auth state:", error);
    })
    .finally(() => window.dispatchEvent(new Event('authStateChecked')))