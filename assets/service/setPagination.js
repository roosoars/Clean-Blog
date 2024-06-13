import { filteredPosts, postsPerPage, currentPage, renderPosts } from '../js/index.js';

export function setupPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            renderPosts(i);
        });
        paginationContainer.appendChild(pageButton);
    }
}