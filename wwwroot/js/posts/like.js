import { auth, database, ref, get, update, remove, set } from '../db.js';

export function initializeLikeButton(postId, likeButton) {
    if (!likeButton) return;

    const user = auth.currentUser;
    if (user) {
        const userLikesRef = ref(database, `likes/${postId}/${user.uid}`);
        get(userLikesRef).then((likeSnapshot) => {
            const userLiked = likeSnapshot.exists();
            const likeButtonClass = userLiked ? 'btn-primary' : 'btn-outline-primary';

            likeButton.className = `btn ${likeButtonClass} btn-sm me-2`;
            likeButton.addEventListener('click', () => {
                likeButton.disabled = true;
                toggleLike(postId, likeButton, userLiked);
                likeButton.disabled = false;
            });
        });
    }
}

function toggleLike(postId, likeButton, userLiked) {
    const user = auth.currentUser;
    if (!user) {
        alert('You must be logged in to like the post.');
        return;
    }

    const userLikesRef = ref(database, `likes/${postId}/${user.uid}`);
    const postRef = ref(database, `posts/${postId}`);

    get(postRef).then((snapshot) => {
        const post = snapshot.val();
        if (!post) return;

        if (userLiked) {
            // Unlike the post
            remove(userLikesRef).then(async () => {
                const newLikesCount = (post.likes || 0) - 1;
                await update(postRef, { likes: newLikesCount });
                initializeLikeButton(postId, likeButton);
            });
        } else {
            // Like the post
            set(userLikesRef, true).then(async () => {
                const newLikesCount = (post.likes || 0) + 1;
                await update(postRef, { likes: newLikesCount });
                initializeLikeButton(postId, likeButton);
            });
        }
    });
}
