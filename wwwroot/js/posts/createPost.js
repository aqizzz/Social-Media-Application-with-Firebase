import { auth, database, ref, storageRef, push, serverTimestamp, storage, uploadBytes, getDownloadURL } from '../db.js';

document.getElementById('uploadImageButton').addEventListener('click', () => {
    document.getElementById('postImage').click();
});

document.getElementById('postImage').addEventListener('change', (event) => {
    const fileName = event.target.files[0] ? event.target.files[0].name : '';
    document.getElementById('selectedFileName').textContent = fileName;
});

const form = document.getElementById('createPostForm');
const contentInput = document.getElementById('postContent');
const imageInput = document.getElementById('postImage');
const submitBtn = document.getElementById('createPostBtn');

contentInput.addEventListener('input', (event) => submitBtn.disabled = !event.target.value.length);

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    event.stopPropagation();

    const user = auth.currentUser;
    if (!user) {
        alert('You must be logged in to create a post.');
        return;
    }

    const postData = {
        content: contentInput.value,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0
    };

    try {
        const file = imageInput.files[0];

        if (file) {
            const fileRef = storageRef(storage, `post-images/${user.uid}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(fileRef, file);
            const imageUrl = await getDownloadURL(snapshot.ref);
            postData.imageUrl = imageUrl;
        }

        const postsRef = ref(database, 'posts');
        await push(postsRef, postData);

        alert('Post created successfully!');
        form.reset();
        submitBtn.disabled = true;
    } catch (error) {
        console.dir('Error creating post:', error);
        alert('An error occurred while creating the post. Please try again.');
    }
});
