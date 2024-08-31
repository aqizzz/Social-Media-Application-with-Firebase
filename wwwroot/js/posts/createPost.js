import { auth, database, ref, push, serverTimestamp, storage, uploadBytes, getDownloadURL } from '../db.js';

const form = document.getElementById('createPostForm');
const contentInput = document.getElementById('postContent');
const imageInput = document.getElementById('postImage');

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
        form.classList.add('was-validated');
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        alert('You must be logged in to create a post.');
        return;
    }

    try {
        let imageUrl = null;
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            const storageRef = ref(storage, `post-images/${user.uid}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const postData = {
            content: contentInput.value,
            imageUrl: imageUrl,
            authorId: user.uid,
            authorName: user.displayName || user.email,
            createdAt: serverTimestamp(),
            likes: 0,
            comments: 0
        };

        const postsRef = ref(database, 'posts');
        await push(postsRef, postData);

        alert('Post created successfully!');
        form.reset();
        form.classList.remove('was-validated');
    } catch (error) {
        console.error('Error creating post:', error);
        alert('An error occurred while creating the post. Please try again.');
    }
});
