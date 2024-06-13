import { formatDate } from '../utils/helpers.js';
import { setupPagination } from '../service/setPagination.js';
import { renderRemovePostOptions } from '../service/setPosts.js';

export var allPosts = [];
export var filteredPosts = [];
export var currentPage = 1;
export var postsPerPage = 2;

export function loadPosts() {
    return db.collection("posts").orderBy("createdAt", "desc").get().then((querySnapshot) => {
        allPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        filteredPosts = allPosts;
        renderPosts(currentPage);
        setupPagination();
        renderRemovePostOptions();
    }).catch((error) => {
        console.error("Erro ao carregar posts: ", error);
    });
}

export function renderPosts(page) {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;
    postsContainer.innerHTML = '';
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);
    postsToShow.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        const postLink = document.createElement('a');
        postLink.textContent = post.title;
        postLink.href = `post.html?id=${post.id}`;
        const postTitle = document.createElement('h2');
        postTitle.appendChild(postLink);
        const formattedDate = formatDate(post.createdAt?.toDate());
        const tagsDisplay = post.tags.join(', ');
        const postInfo = document.createElement('p');
        postInfo.className = 'meta';
        postInfo.innerHTML = `<span class="date">${formattedDate}</span><span class="separator"> | </span><span class="tags">${tagsDisplay}</span>`;
        const postContent = document.createElement('div');
        postContent.className = 'post-content-index';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.content;
        const images = tempDiv.getElementsByTagName('img');
        while (images.length > 0) {
            images[0].parentNode.removeChild(images[0]);
        }
        postContent.innerHTML = tempDiv.innerHTML;
        postElement.appendChild(postTitle);
        postElement.appendChild(postInfo);
        postElement.appendChild(postContent);
        postsContainer.appendChild(postElement);
    });
}

export function searchPosts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    if (query) {
        filteredPosts = allPosts.filter(post => 
            post.title.toLowerCase().includes(query) || 
            post.tags.some(tag => tag.toLowerCase().includes(query))
        );
    } else {
        filteredPosts = allPosts;
    }
    currentPage = 1;
    renderPosts(currentPage);
    setupPagination();
}