import { renderPost } from './render.js';
import { updateNavigationButtons } from './navigation.js';

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
}