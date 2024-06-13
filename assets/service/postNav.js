import { postIds, loadPost, currentIndex, setCurrentIndex } from './post.js';

export function navigatePost(direction) {
    let index = currentIndex; 
    
    console.log('Current Index:', index);
    console.log('Post IDs:', postIds);

    if (direction === 'next' && index < postIds.length - 1) {
        index++;
    } else if (direction === 'prev' && index > 0) {
        index--;
    } else {
        console.log('Não há mais posts nesta direção');
        return;
    }
    
    setCurrentIndex(postIds[index]); 
    const newPostId = postIds[index];
    window.history.pushState({ id: newPostId }, '', `?id=${newPostId}`);
    loadPost(newPostId);
    updateNavigationButtons(); 
}

export function updateNavigationButtons() {
    const prevButton = document.getElementById('prevPost');
    const nextButton = document.getElementById('nextPost');

    if (currentIndex === 0) {
        prevButton.style.display = 'none';
        nextButton.style.flex = '1'; 
        nextButton.style.textAlign = 'right'; 
    } else {
        prevButton.style.display = 'inline-block';
        prevButton.style.flex = '1'; 
        prevButton.style.textAlign = 'left'; 
        nextButton.style.flex = '1'; 
        nextButton.style.textAlign = 'right';
    }

    if (currentIndex === postIds.length - 1) {
        nextButton.style.display = 'none';
        prevButton.style.flex = '1'; 
        prevButton.style.textAlign = 'left';
    } else {
        nextButton.style.display = 'inline-block';
    }
}