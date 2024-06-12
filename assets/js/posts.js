export var allPosts = [];
export var currentPage = 1;
export var postsPerPage = 3;

export function loadPosts() {
    db.collection("posts").orderBy("createdAt", "desc").get().then((querySnapshot) => {
        allPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderPosts(currentPage);
        setupPagination();
    }).catch((error) => {
        console.error("Erro ao carregar posts: ", error);
    });
}

export function renderPosts(page) {
    let postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
    let startIndex = (page - 1) * postsPerPage;
    let endIndex = startIndex + postsPerPage;
    let postsToShow = allPosts.slice(startIndex, endIndex);
    postsToShow.forEach(post => {
        let postElement = document.createElement('div');
        postElement.className = 'post';
        let postLink = document.createElement('a');
        postLink.textContent = post.title;
        postLink.href = `post.html?id=${post.id}`;
        let postTitle = document.createElement('h2');
        postTitle.appendChild(postLink);
        let formattedDate = formatDate(post.createdAt?.toDate());
        let tagsDisplay = post.tags.join(', ');
        let postInfo = document.createElement('p');
        postInfo.className = 'meta';
        postInfo.innerHTML = `<span class="date">${formattedDate}</span><span class="separator"> | </span><span class="tags">${tagsDisplay}</span>`;
        let postContent = document.createElement('div');
        postContent.className = 'post-content-2';
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.content;
        let images = tempDiv.getElementsByTagName('img');
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

function formatDate(date) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options).toUpperCase().replace(/\.| DE/g, '');
}

export function setupPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';
    let totalPages = Math.ceil(allPosts.length / postsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderPosts(currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }
}

export async function createPost() {
    let title = document.getElementById('post-title').value;
    let tags = document.getElementById('post-tags').value;
    let content = quill.root.innerHTML;

    try {
        const updatedContent = await uploadQuillImages(content);

        await db.collection("posts").add({
            title: title,
            tags: tags.split(','),
            content: updatedContent,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert('Post criado com sucesso!');
        document.getElementById('post-title').value = '';
        document.getElementById('post-tags').value = '';
        quill.setContents([]);

    } catch (error) {
        console.error("Erro ao criar o post: ", error);
    }
}

async function uploadQuillImages(content) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const images = tempDiv.getElementsByTagName('img');

    for (let img of images) {
        const file = await fetch(img.src).then(r => r.blob());
        const imageUrl = await uploadImage(file);
        img.src = imageUrl;
    }

    return tempDiv.innerHTML;
}

function uploadImage(file) {
    return new Promise((resolve, reject) => {
        const storageRef = storage.ref(`images/${Date.now()}_${file.name}`);
        const uploadTask = storageRef.put(file);
        uploadTask.on('state_changed',
            (snapshot) => {
                // Implementar feedback de progresso aqui, se desejado
            },
            error => reject(error),
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                    resolve(downloadURL);
                });
            }
        );
    });
}