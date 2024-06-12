import { loadPosts, renderPosts, setupPagination} from './posts.js';
import { login, logout } from './auth.js';
import { initializeQuill } from './quill.js';
import { createPost } from './posts.js';

window.onload = () => {
    if (window.location.pathname.includes('admin.html')) {
        initializeQuill();
    } else {
        loadPosts();
    }
};

firebase.auth().onAuthStateChanged(user => {
    if (!user && window.location.pathname.includes('admin.html')) {
        window.location.href = 'login.html';
    }
});


window.login = login;
window.logout = logout;
window.createPost = createPost;