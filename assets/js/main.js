import { loadPosts, searchPosts } from './index.js';
import { login, logout } from './auth/auth.js';
import { initializeQuill } from '../service/editor.js';
import { createOrUpdatePost, removeSelectedPost, editSelectedPost } from '../service/setPosts.js';
import { addCategoryToPost, removeCategoryFromPost, loadCategories, addCategory, removeCategory, removeSelectedCategory } from '../service/setCategories.js';

window.onload = () => {
    if (window.location.pathname.includes('admin.html')) {
        initializeQuill();
        loadCategories();
        loadPosts();
    } else {
        loadPosts();
        setupEventListeners();
    }
};

firebase.auth().onAuthStateChanged(user => {
    if (!user && window.location.pathname.includes('admin.html')) {
        window.location.href = 'login.html';
    }
});

window.login = login;
window.logout = logout;
window.createOrUpdatePost = createOrUpdatePost;
window.addCategory = addCategory;
window.removeCategory = removeCategory;
window.removeSelectedCategory = removeSelectedCategory;
window.removeSelectedPost = removeSelectedPost;
window.editSelectedPost = editSelectedPost;
window.addCategoryToPost = addCategoryToPost;
window.removeCategoryFromPost = removeCategoryFromPost;

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchPosts();
        }
    });

    searchButton.addEventListener('click', () => {
        searchPosts();
    });
}