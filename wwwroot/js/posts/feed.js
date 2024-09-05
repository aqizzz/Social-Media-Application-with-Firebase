import { auth, database, ref, get, onValue, query, orderByChild } from '../db.js';
import { initializeLikeButton } from './like.js';

async function createPostElement(post, postId) {
    const userRef = ref(database, `users/${post.authorId}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

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
            <button id="likeButton-${postId}" class="btn btn-primary btn-sm me-2">Like (${post.likes})</button>
            <a class="btn btn-secondary btn-sm" href="/posts/post?id=${postId}">Comments (${post.comments})</a>
        </div>
    `;
    return postElement;
}

function loadPosts() {
    const postsFeed = document.getElementById('postsFeed');

    const user = auth.currentUser;
    if (!user) {
        postsFeed.innerHTML = '<p class="text-center">Please log in to view your feed.</p>';
        return;
    }

    const postsRef = ref(database, 'posts');
    const postsQuery = query(postsRef, orderByChild('createdAt'));

    onValue(postsQuery, (snapshot) => {
        postsFeed.innerHTML = '';
        const posts = [];
        snapshot.forEach((childSnapshot) => {
            posts.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });

        posts.reverse().forEach(async (post) => {
            const postElement = await createPostElement(post, post.id);
            postsFeed.appendChild(postElement);

            // like
            const likeButton = document.getElementById(`likeButton-${post.id}`);
            initializeLikeButton(post.id, likeButton);
        });

        if (posts.length === 0) {
            postsFeed.innerHTML = '<p class="text-center">No posts to display.</p>';
        }
    });
}

window.addEventListener('authStateChecked', () => loadPosts());