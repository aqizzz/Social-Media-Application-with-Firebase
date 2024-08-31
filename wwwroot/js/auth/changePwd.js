import { auth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from '../db.js';

window.addEventListener('authStateChecked', () => {
    const user = auth.currentUser;

    if (!user) {
        // No user is signed in
        window.location.href = '/Auth/Login';
    }
});

const form = document.getElementById('changePasswordForm');
const currentPassword = document.getElementById('currentPassword');
const newPassword = document.getElementById('newPassword');
const confirmNewPassword = document.getElementById('confirmNewPassword');
const serverErrMsg = document.getElementById('serverErrMsg');

form.addEventListener('submit', function (event) {
    serverErrMsg.classList.add('d-none');

    event.preventDefault();
    event.stopPropagation();

    // Additional custom validation
    if (newPassword.value !== confirmNewPassword.value) {
        confirmNewPassword.setCustomValidity('Passwords do not match.');
    } else {
        confirmNewPassword.setCustomValidity('');
    }

    if (form.checkValidity()) {
        const user = auth.currentUser;

        // Reauthenticate user
        const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
        reauthenticateWithCredential(user, credential)
            .then(() => {
                // Reauthentication successful, now update the password
                updatePassword(user, newPassword.value)
                    .then(() => {
                        alert('Password updated successfully');
                        window.location.href = '/Auth/EditProfile';
                    })
                    .catch((error) => {
                        console.error('Error updating password:', error);
                        showError('Error updating password');
                    });
            })
            .catch((error) => {
                console.error('Error reauthenticating:', error);

                switch (error.code) {
                    case 'auth/invalid-credential':
                        currentPassword.setCustomValidity('Current password is incorrect');
                        currentPassword.nextElementSibling.textContent = 'Current password is incorrect'
                        break;
                    case 'auth/too-many-requests':
                        showError('Too many failed login attempts. Please try again later.');
                        break;
                    default:
                        showError('An error occurred.');
                        break;
                }
            });
    }

    form.classList.add('was-validated');
});

// Clear custom validity on input
currentPassword.addEventListener('input', function () {
    this.setCustomValidity('');
    this.nextElementSibling.textContent = 'Please enter your current password.';
});

newPassword.addEventListener('input', function () {
    this.setCustomValidity('');
});

confirmNewPassword.addEventListener('input', function () {
    if (newPassword.value !== confirmNewPassword.value) {
        confirmNewPassword.setCustomValidity('Passwords do not match.');
    } else {
        confirmNewPassword.setCustomValidity('');
    }
});

function showError(message) {
    serverErrMsg.textContent = message;
    serverErrMsg.classList.remove('d-none');
}
