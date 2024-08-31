import { auth, createUserWithEmailAndPassword, } from '../db.js';

const form = document.getElementById("signupForm");
const emailInput = document.getElementById("signupEmail");
const passwordInput = document.getElementById("signupPassword");
const errAlert = document.getElementById('serverErrMsg');

form.addEventListener("submit", function (event) {
    errAlert.classList.add('visually-hidden');

    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
        const email = emailInput.value;
        const password = passwordInput.value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("Sign up successful");
                window.location.href = "/Auth/Login";
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
                        errAlert.classList.remove('visually-hidden');
                        errAlert.textContent = 'An error occurred.';
                        break;
                }
                
            });
    }

    form.classList.add('was-validated');
});

emailInput.addEventListener('input', function () {
    this.setCustomValidity('');
    emailInput.nextElementSibling.textContent = 'Please enter a valid email address.';
});

passwordInput.addEventListener('input', function (event) {
    if (this.value.length < 8) {
        this.setCustomValidity('Password must be at least 8 characters long.');
    } else {
        this.setCustomValidity('');
    }
});
