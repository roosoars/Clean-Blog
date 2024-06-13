import { formatDate } from '../utils/helpers.js';
import { updateNavigationButtons } from './postNav.js';

export let postIds = [];
export let postsData = [];
export let currentIndex = 0;

export function loadPostIds() {
    db.collection("posts").orderBy("createdAt", "desc").get().then(querySnapshot => {
        postsData = querySnapshot.docs.map(doc => doc.data());
        postIds = querySnapshot.docs.map(doc => doc.id);
        const params = new URLSearchParams(window.location.search);
        const currentId = params.get('id');
        currentIndex = postIds.indexOf(currentId);
        if (currentIndex === -1) currentIndex = 0;
        console.log('Loaded Post IDs:', postIds);
        renderPost(postsData[currentIndex]);
        updateNavigationButtons();
    }).catch(error => {
        console.error("Erro ao carregar os IDs dos posts: ", error);
    });
}

export function loadPost(postId) {
    db.collection("posts").doc(postId).get().then(doc => {
        if (!doc.exists) {
            document.getElementById('post-container').innerHTML = '<p>Post não encontrado.</p>';
        } else {
            setCurrentIndex(postId);
            console.log('Loaded Post:', doc.data()); 
            renderPost(doc.data());
            updateNavigationButtons();
        }
    }).catch(error => {
        console.error("Erro ao carregar o post: ", error);
    });
}

export function setCurrentIndex(postId) {
    currentIndex = postIds.indexOf(postId);
    if (currentIndex === -1) currentIndex = 0;
    console.log('Current Index set to:', currentIndex);
}

export function renderPost(postData) {
    const postContainer = document.getElementById('post-container');
    if (!postContainer) {
        console.error('post-container element not found');
        return;
    }
    postContainer.innerHTML = '';
    postContainer.className = 'post';

    const postTitle = document.createElement('h1');
    postTitle.textContent = postData.title;

    const postDate = document.createElement('p');
    postDate.className = 'meta';
    const formattedDate = formatDate(postData.createdAt.toDate());
    const tagsDisplay = 'Tags: ' + postData.tags.join(', ');
    postDate.innerHTML = `<span class="date">${formattedDate}</span><span class="separator"> | </span><span class="tags">${tagsDisplay}</span>`;

    const postContent = document.createElement('div');
    postContent.innerHTML = postData.content;
    postContent.className = 'post-content';

    postContainer.appendChild(postTitle);
    postContainer.appendChild(postDate);
    postContainer.appendChild(postContent);
}