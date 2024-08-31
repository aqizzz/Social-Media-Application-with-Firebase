import { auth, database, ref, onValue, push, serverTimestamp, get, update } from '../db.js';

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
    onValue(postRef, (snapshot) => {
        const post = snapshot.val();
        if (post) {
            postDetails.innerHTML = `
                    <div class="card-body">
                        <h3 class="card-title">${post.authorName}</h3>
                        <p class="card-text">${post.content}</p>
                        ${post.imageUrl ? `<img src="${post.imageUrl}" class="img-fluid mb-2" alt="Post image">` : ''}
                        <p class="card-text"><small class="text-muted">Posted on ${new Date(post.createdAt).toLocaleString()}</small></p>
                        <button id="likeButton" class="btn btn-primary btn-sm me-2">Like (${post.likes})</button>
                    </div>
                `;

            // Add like functionality
            document.getElementById('likeButton').addEventListener('click', () => {
                // Implement like functionality here
            });
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
                        <p class="card-text"><small class="text-muted">By ${comment.authorName} on ${new Date(comment.createdAt).toLocaleString()}</small></p>
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
