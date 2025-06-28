// Main function to initialize the app
function main() {
    displayPosts().then(() => {
        if (posts.length > 0) handlePostClick(posts[0].id); // Advanced: Show first post on load
    });
    addNewPostListener();
    setupEditDeleteListeners(); // Advanced: Setup edit/delete functionality
}

// Fetch and display all posts
function displayPosts() {
    return fetch('http://localhost:3000/posts')
        .then(response => response.json())
        .then(data => {
            posts = data; // Store posts globally for reference
            const postList = document.getElementById('post-list');
            postList.innerHTML = '';
            posts.forEach(post => {
                const li = createPostElement(post);
                postList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
}

// Create a reusable post element
function createPostElement(post) {
    const li = document.createElement('li');
    li.textContent = post.title;
    li.dataset.id = post.id; // Store ID for reference
    li.addEventListener('click', () => handlePostClick(post.id));
    return li;
}

// Handle click on a post title to show details
function handlePostClick(postId) {
    const post = posts.find(p => p.id === postId);
    const postDetail = document.getElementById('post-detail');
    postDetail.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <p>By ${post.author}</p>
        <button onclick="showEditForm(${post.id})">Edit</button>
        <button onclick="deletePost(${post.id})">Delete</button>
    `;
}

// Handle adding a new post
function addNewPostListener() {
    const form = document.getElementById('new-post-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = form.querySelector('input[name="title"]').value;
        const author = form.querySelector('input[name="author"]').value;
        const imageUrl = form.querySelector('input[name="imageURL"]').value;
        const content = form.querySelector('textarea').value;

        const newPost = { title, author, imageUrl, content };
        fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        })
        .then(response => response.json())
        .then(post => {
            const postList = document.getElementById('post-list');
            postList.appendChild(createPostElement(post));
            form.reset();
        })
        .catch(error => console.error('Error adding post:', error));
    });
}
// Setup edit and delete functionality
function setupEditDeleteListeners() {
    // Edit form setup (assumes #edit-post-form exists in index.html)
    document.getElementById('edit-post-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const postId = parseInt(document.getElementById('edit-post-form').dataset.id);
        const newTitle = document.getElementById('edit-title').value;
        const newContent = document.getElementById('edit-content').value;

        fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, content: newContent })
        })
        .then(() => displayPosts()) // Refresh list
        .catch(error => console.error('Error updating post:', error));
    });

    // Delete post
    window.deletePost = function(postId) {
        fetch(`http://localhost:3000/posts/${postId}`, { method: 'DELETE' })
        .then(() => {
            displayPosts();
            document.getElementById('post-detail').innerHTML = 'Nothing';
        })
        .catch(error => console.error('Error deleting post:', error));
    };
}

// Show edit form
window.showEditForm = function(postId) {
    const post = posts.find(p => p.id === postId);
    const form = document.getElementById('edit-post-form');
    form.dataset.id = postId;
    form.querySelector('#edit-title').value = post.title;
    form.querySelector('#edit-content').value = post.content;
    form.classList.remove('hidden');
    document.getElementById('post-detail').innerHTML = '';
    form.style.display = 'block'; // Show form
};

// Run the app when the DOM is loaded
let posts = []; // Global array to store posts
document.addEventListener('DOMContentLoaded', main);