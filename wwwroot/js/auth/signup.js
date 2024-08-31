import { auth, createUserWithEmailAndPassword, database, ref, set } from '../db.js';

const form = document.getElementById("signupForm");
const emailInput = document.getElementById("signupEmail");
const passwordInput = document.getElementById("signupPassword");
const errAlert = document.getElementById('serverErrMsg');

form.addEventListener("submit", function (event) {
    errAlert.classList.add('d-none');

    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
        const email = emailInput.value;
        const password = passwordInput.value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Registration successful
                const user = userCredential.user;
                console.log('User registered:', user.uid); // Debug: Log user ID

                // User information to be stored in Realtime Database
                const userInfo = {
                    name: "",
                    email: user.email,
                    bio: "",
                    profilePictureUrl: ""
                };

                // Reference to the location where user information will be stored
                const userRef = ref(database, 'users/' + user.uid);
                console.log('Database ref:', userRef.toString());

                // Set user information in the Realtime Database
                set(userRef, userInfo)
                    .then(() => {
                        console.log('User information saved to Realtime Database');
                        alert("Registration successful");
                        window.location.href = "/";
                    })
                    .catch((error) => {
                        console.error('Error saving user information:', error);
                        alert('Error saving user information');
                    });
            })
            .catch((error) => {
                console.dir(error)
                
                switch (error.code) {
                    case 'auth/invalid-email':
                        emailInput.setCustomValidity('Invalid Email.');
                        break;
                    case 'auth/email-already-in-use':
                        emailInput.setCustomValidity('Email already in use.');
                        emailInput.nextElementSibling.textContent = 'Email already in use.'
                        break;
                    default:
                        errAlert.classList.remove('d-none');
                        errAlert.textContent = 'An error occurred.';
                        break;
                }
                
            });
    }

    form.classList.add('was-validated');
});

emailInput.addEventListener('input', function () {
    this.setCustomValidity('');
    this.nextElementSibling.textContent = 'Please enter a valid email address.';
});

passwordInput.addEventListener('input', function () {
    if (this.value.length < 6) {
        this.setCustomValidity('Password must be at least 6 characters long.');
    } else {
        this.setCustomValidity('');
    }
});
