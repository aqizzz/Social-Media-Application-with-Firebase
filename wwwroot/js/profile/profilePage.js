import { auth, database, ref, onValue, get, query, orderByChild, onChildChanged, set, remove } from '../db.js';
import { initializeLikeButton } from '../posts/like.js';
import { updatePostLikes } from '../posts/feed.js';

window.addEventListener('authStateChecked', () => {
    const pathSegments = window.location.pathname.split('/');
    const userIdFromPath = pathSegments[pathSegments.length - 1];
    console.log('Path Segments:', pathSegments);
    console.log('Extracted userIdFromPath:', userIdFromPath);

    const user = auth.currentUser;

    let userId;

    if (userIdFromPath && userIdFromPath !== 'profile') {
        userId = userIdFromPath;
    } else if (userIdFromPath === 'profile' && user) {
        userId = user.uid;
    } else {
        window.location.href = '/login';
        return;
    }

    // Load profile, posts, followers, and following lists
    loadUserProfile(userId);
    loadUserPosts(userId);
    loadFollowers(userId);
    loadFollowing(userId);

    // Initialize the follow button if viewing another user's profile
    const followBtnContainer = document.getElementById('followBtnContainer')
    const editProfileBtnContainer = document.getElementById('editProfileBtnContainer');
    if (user && user.uid !== userId) {
        initializeFollowButton(user.uid, userId);
        followBtnContainer.classList.remove('d-none');
    } else {
        editProfileBtnContainer.classList.remove('d-none');
    }
});

function loadUserProfile(userId) {
    const userRef = ref(database, 'users/' + userId);

    get(userRef).then(snapshot => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log(userData);

            document.getElementById('profileName').innerText = userData.name || 'N/A';
            document.getElementById('profileEmail').innerText = userData.email || 'N/A';
            document.getElementById('profileBio').innerText = userData.bio || 'N/A';

            const profilePictureUrl = userData.profilePictureUrl || '/images/default-profile.png'; // Default profile picture
            const profilePicture = document.getElementById('profilePicture');
            profilePicture.src = profilePictureUrl;
            profilePicture.style.display = 'block';

            // Load follower and following counts
            loadFollowerCount(userId);
            loadFollowingCount(userId);
        } else {
            console.log('No user data available');
        }
    }).catch(error => {
        console.error('Error fetching user data:', error);
    });
}

function loadFollowerCount(userId) {
    const followersRef = ref(database, `follows/${userId}/followers`);

    onValue(followersRef, (snapshot) => {
        const followersCount = snapshot.size; // Number of followers
        document.getElementById('profileFollowers').innerText = followersCount || 0;
    }, { onlyOnce: true });
}

function loadFollowingCount(userId) {
    const followingRef = ref(database, `follows/${userId}/following`);

    onValue(followingRef, (snapshot) => {
        const followingCount = snapshot.size; // Number of following
        document.getElementById('profileFollowing').innerText = followingCount || 0;
    }, { onlyOnce: true });
}


function loadUserPosts(userId) {
    const postsFeed = document.getElementById('postsFeed');
    console.log("Loading posts...");

    const postsRef = ref(database, 'posts');
    const userPostsQuery = query(postsRef, orderByChild('authorId'));

    onValue(userPostsQuery, async (snapshot) => {
        postsFeed.innerHTML = '';
        const posts = [];
        snapshot.forEach((childSnapshot) => {
            const post = childSnapshot.val();
            if (post.authorId === userId) {
                posts.push({ id: childSnapshot.key, ...post });
            }
        });

        const userData = await getUserData(userId);

        posts.reverse().forEach((post) => {
            const postElement = createPostElement(post, post.id, userData);
            postsFeed.appendChild(postElement);

            // Initialize like button
            const likeButton = document.getElementById(`likeButton-${post.id}`);
            initializeLikeButton(post.id, likeButton);
        });

        if (posts.length === 0) {
            postsFeed.innerHTML = '<p class="text-center">No posts to display.</p>';
        }
    }, { onlyOnce: true });

    onChildChanged(postsRef, (snapshot) => {
        const updatedPost = snapshot.val();
        updatePostLikes(snapshot.key, updatedPost.likes);
    });
}

function createPostElement(post, postId, userData) {
    const userName = userData.name || userData.email || 'Unknown';
    const profilePictureUrl = userData.profilePictureUrl || '/images/default-profile.png'; // Default profile picture

    const postElement = document.createElement('div');
    postElement.className = 'card shadow-lg border-0 mb-3';
    postElement.innerHTML = `
        <div class="card-body">
            <div class="d-flex align-items-center gap-3 mb-3">
                <a href="/profile/${post.authorId}">
                    <img src="${profilePictureUrl}" class="rounded-circle" style="width:45px;height:45px;" />
                </a>
                <a href="/profile/${post.authorId}">
                    <h6 class="text-start" style="margin-right: 15px;">${userName}</h6>
                </a>
            </div>
                                    
            <p class="card-text" style="cursor: pointer;" onClick="window.location.href='/posts/post?id=${postId}'">${post.content}</p>
            ${post.imageUrl ? `<a href="/posts/post?id=${postId}"><img src="${post.imageUrl}" class="mb-2" alt="Post image" style="height:200px;" /></a>` : ''}
            <p class="card-text"><small class="text-muted">Posted on ${new Date(post.createdAt).toLocaleString()}</small></p>
            <button id="likeButton-${postId}" class="btn btn-outline-primary btn-sm me-2"><i class="fa-regular fa-thumbs-up"></i> (<span>${post.likes}</span>)</button>
            <a class="btn btn-secondary btn-sm" href="/posts/post?id=${postId}">Comments (${post.comments})</a>
        </div>
    `;
    return postElement;
}

function loadFollowers(userId) {
    const followersList = document.getElementById('followersList');
    const followersRef = ref(database, `follows/${userId}/followers`);

    onValue(followersRef, async (snapshot) => {
        followersList.innerHTML = '';
        const followers = [];

        snapshot.forEach((childSnapshot) => {
            followers.push(childSnapshot.key);
        });

        if (followers.length === 0) {
            followersList.innerHTML = '<p class="text-center text-muted mt-3">No followers found.</p>';
            return;
        }

        for (const followerId of followers.slice(0, 5)) {
            const userData = await getUserData(followerId);
            const userName = userData.name || userData.email || 'Unknown';
            const profilePictureUrl = userData.profilePictureUrl || '/images/default-profile.png'; // Default profile picture

            const followerItem = document.createElement('div');
            followerItem.className = 'list-group-item list-group-item-action border-0';

            followerItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <a href="/profile/${followerId}">
                        <img src="${profilePictureUrl}" class="rounded-circle me-3" style="width:30px;height:30px" />
                    </a>
                    <a href="/profile/${followerId}">
                        <span>${userName}</span>
                    </a>
                </div>
            `;

            followersList.appendChild(followerItem);
        }
    });
}

function loadFollowing(userId) {
    const followingList = document.getElementById('followingList');
    const followingRef = ref(database, `follows/${userId}/following`);

    onValue(followingRef, async (snapshot) => {
        followingList.innerHTML = '';

        const following = [];
        snapshot.forEach((childSnapshot) => {
            following.push(childSnapshot.key);
        });

        if (following.length === 0) {
            followingList.innerHTML = '<p class="text-center text-muted mt-3">No following users found.</p>';
            return;
        }

        for (const followedId of following.slice(0, 5)) {
            const userData = await getUserData(followedId);
            const userName = userData.name || userData.email || 'Unknown';
            const profilePictureUrl = userData.profilePictureUrl || '/images/default-profile.png'; // Default profile picture

            const followedItem = document.createElement('div');
            followedItem.className = 'list-group-item list-group-item-action border-0';

            followedItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <a href="/profile/${followedId}">
                        <img src="${profilePictureUrl}" class="rounded-circle me-3" style="width:30px;height:30px" />
                    </a>
                    <a href="/profile/${followedId}">
                        <span>${userName}</span>
                    </a>
                </div>
            `;

            followingList.appendChild(followedItem);
        }
    });
}

async function getUserData(userId) {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    const data = snapshot.val();
    console.log(`Retrieved data for userId ${userId}:`, data);
    return data || {};
}

function initializeFollowButton(currentUserId, profileUserId) {
    const followButton = document.getElementById('followButton');
    const followRef = ref(database, `follows/${currentUserId}/following/${profileUserId}`);

    // Update the button text and style based on current follow status
    onValue(followRef, (snapshot) => {
        if (snapshot.exists()) {
            followButton.textContent = 'Following';
            followButton.classList.remove('btn-success');
            followButton.classList.add('btn-secondary');
        } else {
            followButton.textContent = 'Follow';
            followButton.classList.remove('btn-secondary');
            followButton.classList.add('btn-success');
        }
    });

    // Add event listener to handle follow/unfollow action
    followButton.addEventListener('click', () => {
        toggleFollow(currentUserId, profileUserId);
    });
}

function toggleFollow(currentUserId, profileUserId) {
    const followingRef = ref(database, `follows/${currentUserId}/following/${profileUserId}`);
    const followersRef = ref(database, `follows/${profileUserId}/followers/${currentUserId}`);

    onValue(followingRef, (snapshot) => {
        const isFollowing = snapshot.exists();
        if (isFollowing) {
            // Unfollow: Remove the following relationship from both users
            remove(followingRef); // Remove from current user's following list
            remove(followersRef);  // Remove from target user's followers list

            const button = document.querySelector(`.follow-btn[data-user-id="${profileUserId}"]`);
            button.textContent = 'Follow';
            button.classList.remove('btn-secondary');
            button.classList.add('btn-primary');
        } else {
            // Follow: Add the following relationship to both users
            set(followingRef, true);  // Add to current user's following list
            set(followersRef, true);  // Add to target user's followers list

            const button = document.querySelector(`.follow-btn[data-user-id="${profileUserId}"]`);
            button.textContent = 'Following';
            button.classList.remove('btn-primary');
            button.classList.add('btn-secondary');
        }
    }, { onlyOnce: true });
}
