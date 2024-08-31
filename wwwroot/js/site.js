import { onAuthStateChanged, auth, signOut } from './db.js';

function checkAuthState() {
    const authNavs = document.getElementsByClassName('auth');
    const logoutNav = document.getElementById('logoutNav');

    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in:", user);

                document.getElementById('userDropdown').textContent = user.email;

                Array.from(authNavs).forEach(el => {
                    hideElement(el);
                });

                showElement(logoutNav);
                resolve(user);
            } else {
                console.log("No user is signed in.");

                Array.from(authNavs).forEach(el => {
                    showElement(el);
                });

                hideElement(logoutNav);
                resolve(null);
            }
        }, (error) => {
            console.error("Auth state check failed:", error);
            reject(error);
        });
    });
}

function hideElement(el) {
    if (el) {
        el.style.display = 'none';
    }
}

function showElement(el) {
    if (el) {
        el.style.display = '';
    }
}

function logout() {
    signOut(auth).then(() => {
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
        } else {
            console.log("No user logged in");
        }
    })
    .catch((error) => {
        console.error("Error checking auth state:", error);
    });
