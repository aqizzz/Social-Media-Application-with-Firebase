import { auth, database, ref, onValue, set, remove } from '/js/db.js';

window.addEventListener('authStateChecked', () => {
    const currentUserId = window.user ? window.user.uid : null;

    if (!currentUserId) {
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '<p class="text-center text-danger">You need to be logged in to view this page.</p>';
        return;
    }

    // Capture the search query from the URL
    const query = new URLSearchParams(window.location.search).get('query');
    const lowercasedQuery = query ? query.toLowerCase() : '';

    const usersList = document.getElementById('usersList');
    const usersRef = ref(database, `users`);
    const followsRef = ref(database, `follows/${currentUserId}/following`);

    onValue(usersRef, (snapshot) => {
        usersList.innerHTML = '';
        let usersFound = false;

        snapshot.forEach((childSnapshot) => {
            const userId = childSnapshot.key;
            const userData = childSnapshot.val();

            // Skip the current user
            if (userId === currentUserId) return;

            const name = userData.name ? userData.name.toLowerCase() : '';
            const email = userData.email ? userData.email.toLowerCase() : '';

            // Filter users based on the search query
            if (name.includes(lowercasedQuery) || email.includes(lowercasedQuery)) {
                usersFound = true;
                const userItem = document.createElement('div');
                userItem.className = 'list-group-item list-group-item-action';

                userItem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            
                            <p class="mb-1 text-muted"><a href="/MyProfile/${userId}">${userData.email}</a></p>
                        </div>
                        <button class="btn btn-primary btn-sm follow-btn" data-user-id="${userId}">Follow</button>
                    </div>
                `;

                usersList.appendChild(userItem);
            }
        });

        if (!usersFound) {
            usersList.innerHTML = '<p class="text-center text-muted">No users found matching your search.</p>';
        }

        // Add event listeners for follow buttons
        document.querySelectorAll('.follow-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const targetUserId = e.target.getAttribute('data-user-id');
                toggleFollow(currentUserId, targetUserId);
            });
        });

        // Remove the query parameter from the URL after processing
        const url = new URL(window.location);
        url.searchParams.delete('query');
        window.history.replaceState({}, document.title, url.pathname);
    });

    onValue(followsRef, (snapshot) => {
        const follows = snapshot.val() || {};
        document.querySelectorAll('.follow-btn').forEach(button => {
            const targetUserId = button.getAttribute('data-user-id');
            if (follows[targetUserId]) {
                button.textContent = 'Following';
                button.classList.remove('btn-primary');
                button.classList.add('btn-secondary');
            } else {
                button.textContent = 'Follow';
                button.classList.remove('btn-secondary');
                button.classList.add('btn-primary');
            }
        });
    });
});

function toggleFollow(currentUserId, targetUserId) {
    const followingRef = ref(database, `follows/${currentUserId}/following/${targetUserId}`);
    const followersRef = ref(database, `follows/${targetUserId}/followers/${currentUserId}`);

    onValue(followingRef, (snapshot) => {
        const isFollowing = snapshot.exists();
        if (isFollowing) {
            // Unfollow: Remove the following relationship from both users
            remove(followingRef); // Remove from current user's following list
            remove(followersRef);  // Remove from target user's followers list

            const button = document.querySelector(`.follow-btn[data-user-id="${targetUserId}"]`);
            button.textContent = 'Follow';
            button.classList.remove('btn-secondary');
            button.classList.add('btn-primary');
        } else {
            // Follow: Add the following relationship to both users
            set(followingRef, true);  // Add to current user's following list
            set(followersRef, true);  // Add to target user's followers list

            const button = document.querySelector(`.follow-btn[data-user-id="${targetUserId}"]`);
            button.textContent = 'Following';
            button.classList.remove('btn-primary');
            button.classList.add('btn-secondary');
        }
    }, { onlyOnce: true });
}
