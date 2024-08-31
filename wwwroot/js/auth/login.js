import { auth, signInWithEmailAndPassword } from '../db.js';

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");
const errAlert = document.getElementById('serverErrMsg');


form.addEventListener('submit', function (event) {
    errAlert.classList.add('visually-hidden');

    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
        const email = emailInput.value;
        const password = passwordInput.value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("Login success");
                window.location.href = "/"
            })
            .catch((error) => {
                console.dir(error)

                errAlert.classList.remove('visually-hidden');

                switch (error.code) {
                    case 'auth/invalid-credential':
                        errAlert.textContent = 'Invalid email or password.'
                        break;
                    default:
                        errAlert.textContent = 'An error occurred.';
                        break;
                }
            });
    }

    form.classList.add('was-validated');
});
