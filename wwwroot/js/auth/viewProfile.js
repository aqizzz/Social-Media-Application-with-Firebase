import { auth, database, ref, get } from '../db.js';

window.addEventListener('authStateChecked', () => {
    const user = auth.currentUser;

    if (user) {
        // User is signed in
        const userId = user.uid;

        // Reference to the user's profile in Realtime Database
        const userRef = ref(database, 'users/' + userId);

        // Get user data
        get(userRef).then(snapshot => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                console.log(userData);

                document.getElementById('profileName').innerText = userData.name || 'N/A';
                document.getElementById('profileEmail').innerText = userData.email || 'N/A';
                document.getElementById('profileBio').innerText = userData.bio || 'N/A';

                if (userData.profilePictureUrl) {
                    document.getElementById('profilePicture').src = userData.profilePictureUrl;
                    document.getElementById('profilePicture').style.display = 'block';
                }
            } else {
                console.log('No user data available');
            }
        }).catch(error => {
            console.error('Error fetching user data:', error);
        });
    } else {
        // No user is signed in
        window.location.href = '/login';
    }
});
