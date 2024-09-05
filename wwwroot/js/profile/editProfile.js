import { auth, database, ref, update, get, storage, storageRef, uploadBytes, getDownloadURL } from '../db.js';

window.addEventListener('authStateChecked', function () {
    const user = window.user;

        if (user) {
            const userId = user.uid;
            const userRef = ref(database, 'users/' + userId);

            get(userRef).then(snapshot => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();

                    document.getElementById('name').value = userData.name || '';
                    document.getElementById('email').value = userData.email || '';
                    document.getElementById('bio').value = userData.bio || '';

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
            window.location.href = '/login';
        }
});

document.getElementById('updateProfileButton').addEventListener('click', async () => {
    const user = auth.currentUser;

    if (user) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const bio = document.getElementById('bio').value;

        const updates = {
            name: name,
            email: email,
            bio: bio
        };

        // Update profile picture
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        try {
            if (file) {
                const fileRef = storageRef(storage, 'profile_pictures/' + user.uid + '/' + file.name);
                await uploadBytes(fileRef, file);
                const downloadURL = await getDownloadURL(fileRef);
                updates.profilePictureUrl = downloadURL;
            }

            // Update other fields
            await update(ref(database, 'users/' + user.uid), updates);
            alert('Profile updated successfully');
            window.location.href = '/profile';
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    }
});