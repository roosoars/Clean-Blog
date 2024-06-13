import { loadPostIds, loadPost } from '../../service/post.js';
import { navigatePost } from '../../service/postNav.js';

window.onload = () => {
    console.log('Window loaded');
    const params = new URLSearchParams(window.location.search);
    const currentId = params.get('id');

    loadPostIds();

    if (currentId) {
        setTimeout(() => {
            console.log(`Loading post with ID: ${currentId}`);
            loadPost(currentId);
        }, 1000); 
    }

    document.getElementById('nextPost').addEventListener('click', () => {
        console.log('Next button clicked');
        navigatePost('next');
    });
    document.getElementById('prevPost').addEventListener('click', () => {
        console.log('Previous button clicked');
        navigatePost('prev');
    });
};