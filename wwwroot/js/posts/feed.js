import { auth, database, ref, onValue, query, orderByChild } from '../db.js';

window.addEventListener('authStateChecked', () => {
    const postsFeed = document.getElementById('postsFeed');

    function createPostElement(post, postId) {
        const postElement = document.createElement('div');
        postElement.className = 'card mb-3';
        postElement.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${post.authorName}</h5>
            <p class="card-text" style="cursor: pointer;" onClick="window.location.href='/posts/post?id=${postId}'">${post.content}</p>
            ${post.imageUrl ? `<img src="${post.imageUrl}" class="img-fluid mb-2" alt="Post image">` : ''}
            <p class="card-text"><small class="text-muted">Posted on ${new Date(post.createdAt).toLocaleString()}</small></p>
            <button class="btn btn-primary btn-sm me-2">Like (${post.likes})</button>
            <a class="btn btn-secondary btn-sm" href="/posts/post?id=${postId}">Comments (${post.comments})</a>
        </div>
    `;
        return postElement;
    }

    function loadPosts() {
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

            posts.reverse().forEach((post) => {
                const postElement = createPostElement(post, post.id);
                postsFeed.appendChild(postElement);
            });

            if (posts.length === 0) {
                postsFeed.innerHTML = '<p class="text-center">No posts to display.</p>';
            }
        });
    }

    loadPosts();
})