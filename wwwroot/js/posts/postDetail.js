import { auth, database, ref, onValue, push, serverTimestamp, get, update } from '../db.js';
import { initializeLikeButton } from './like.js'; 

const postDetails = document.getElementById('postDetails');
const commentForm = document.getElementById('commentForm');
const commentContent = document.getElementById('commentContent');
const commentsList = document.getElementById('commentsList');

// Get the post ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
    postDetails.innerHTML = '<p class="text-center">Post not found.</p>';
}

function loadPostDetails() {
    const postRef = ref(database, `posts/${postId}`);
    onValue(postRef, async (snapshot) => {
        const post = snapshot.val();
        const userRef = ref(database, `users/${post.authorId}`);
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.val();

        const userName = userData.name || userData.email || 'Unknown';
        const profilePictureUrl = userData.profilePictureUrl || '/images/default-profile.png'; // Default profile picture

        if (post) {
            postDetails.innerHTML = `
                    <div class="card-body">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <a href="/profile/${post.authorId}">
                                <img src="${profilePictureUrl}" class="rounded-circle" style="width:45px;height:45px;" />
                            </a>
                            <a href="/profile/${post.authorId}">
                                <h6 class="text-start" style="margin-right: 15px;">${userName}</h6>
                            </a>
                        </div>

                        <p class="card-text">${post.content}</p>
                        ${post.imageUrl ? `<img src="${post.imageUrl}" class="img-fluid mb-2" alt="Post image">` : ''}
                        <p class="card-text"><small class="text-muted">Posted on ${new Date(post.createdAt).toLocaleString()}</small></p>
                        <button id="likeButton" class="btn btn-primary btn-sm me-2">Like (${post.likes})</button>
                    </div>
                `;

            const likeButton = document.getElementById('likeButton');
            initializeLikeButton(postId, likeButton);
        } else {
            postDetails.innerHTML = '<p class="text-center">Post not found.</p>';
        }
    });
}

function loadComments() {
    const commentsRef = ref(database, `comments/${postId}`);
    onValue(commentsRef, (snapshot) => {
        commentsList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const comment = childSnapshot.val();
            const commentElement = document.createElement('div');
            commentElement.className = 'card mb-2';
            commentElement.innerHTML = `
                    <div class="card-body">
                        <p class="card-text">${comment.content}</p>
                        <p class="card-text"><small class="text-muted">By <a href="/profile/${comment.authorId}">${comment.authorName}</a> on ${new Date(comment.createdAt).toLocaleString()}</small></p>
                    </div>
                `;
            commentsList.appendChild(commentElement);
        });
    });
}

commentForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        alert('You must be logged in to comment.');
        return;
    }

    const commentData = {
        content: commentContent.value,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        createdAt: serverTimestamp()
    };

    try {
        const commentsRef = ref(database, `comments/${postId}`);
        await push(commentsRef, commentData);

        // Update comment count
        const postRef = ref(database, `posts/${postId}`);
        const postSnapshot = await get(postRef);
        const post = postSnapshot.val();

        if (post) {
            let commentCount = post.comments || 0;
            commentCount++;
            await update(postRef, { comments: commentCount });
        }

        commentForm.reset();
    } catch (error) {
        console.log('Error adding comment:', error);
        alert('An error occurred while adding the comment. Please try again.');
    }
});

loadPostDetails();
loadComments();
