import { formatDate } from './utils.js';

export function renderPost(postData) {
    let postContainer = document.getElementById('post-container');
    postContainer.innerHTML = '';
    postContainer.className = 'post';

    let postTitle = document.createElement('h1');
    postTitle.textContent = postData.title;

    let postDate = document.createElement('p');
    postDate.className = 'meta';
    let formattedDate = formatDate(postData.createdAt.toDate());
    let tagsDisplay = 'Tags: ' + postData.tags.join(', ');
    postDate.innerHTML = `<span class="date">${formattedDate}</span><span class="separator"> | </span><span class="tags">${tagsDisplay}</span>`;

    let postContent = document.createElement('div');
    postContent.innerHTML = postData.content;
    postContent.className = 'post-content';

    postContainer.appendChild(postTitle);
    postContainer.appendChild(postDate);
    postContainer.appendChild(postContent);
}