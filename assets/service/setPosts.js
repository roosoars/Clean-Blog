import { allPosts, currentPage, renderPosts } from '../js/index.js';
import { setupPagination } from './setPagination.js';

let editPostId = null;
let editPostIndex = null;


export async function createOrUpdatePost() {
    const title = document.getElementById('post-title').value;
    const tags = document.getElementById('post-tags').value;
    const categories = Array.from(document.getElementById('post-categories').options).map(option => option.value);
    const content = quill.root.innerHTML;

    try {
        const updatedContent = await uploadQuillImages(content);

        if (editPostId) {
            await db.collection("posts").doc(editPostId).update({
                title,
                tags: tags.split(','),
                categories,
                content: updatedContent,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            // Atualiza o post no array
            allPosts[editPostIndex] = {
                id: editPostId,
                title,
                tags: tags.split(','),
                categories,
                content: updatedContent,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            alert('Post atualizado com sucesso!');
        } else {
            const docRef = await db.collection("posts").add({
                title,
                tags: tags.split(','),
                categories,
                content: updatedContent,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            allPosts.unshift({
                id: docRef.id,
                title,
                tags: tags.split(','),
                categories,
                content: updatedContent,
                createdAt: new Date()
            });
            alert('Post criado com sucesso!');
        }

        document.getElementById('post-title').value = '';
        document.getElementById('post-tags').value = '';
        document.getElementById('post-categories').innerHTML = '';
        quill.setContents([]);
        editPostId = null;
        editPostIndex = null;

        // Recarregar os posts e as opções para remoção
        renderPosts(currentPage);
        setupPagination();
        renderRemovePostOptions();

    } catch (error) {
        console.error("Erro ao criar ou atualizar o post: ", error);
    }
}

export function renderRemovePostOptions() {
    const removePostSelect = document.getElementById('remove-post-select');
    if (!removePostSelect) return; // Verifique se o select existe
    removePostSelect.innerHTML = '';
    allPosts.forEach((post, index) => {
        const option = document.createElement('option');
        option.value = index; // Use o índice do array como valor
        option.textContent = post.title;
        removePostSelect.appendChild(option);
    });
}

export function removeSelectedPost() {
    const removePostSelect = document.getElementById('remove-post-select');
    const selectedIndex = removePostSelect.value;

    if (selectedIndex !== "") {
        const selectedPostId = allPosts[selectedIndex].id;
        db.collection("posts").doc(selectedPostId).delete().then(() => {
            allPosts.splice(selectedIndex, 1); // Remove o post do array
            renderPosts(currentPage);
            setupPagination();
            renderRemovePostOptions();
            alert('Post removido com sucesso!');
        }).catch((error) => {
            console.error("Erro ao remover post: ", error);
        });
    } else {
        alert('Por favor, selecione um post para remover.');
    }
}

export function editSelectedPost() {
    const removePostSelect = document.getElementById('remove-post-select');
    const selectedIndex = removePostSelect.value;

    if (selectedIndex !== "") {
        const post = allPosts[selectedIndex];
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-tags').value = post.tags.join(', ');
        const postCategoriesSelect = document.getElementById('post-categories');
        postCategoriesSelect.innerHTML = '';
        post.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            postCategoriesSelect.appendChild(option);
        });
        quill.root.innerHTML = post.content;
        editPostId = post.id;
        editPostIndex = selectedIndex;
    } else {
        alert('Por favor, selecione um post para editar.');
    }
}

export function loadPostForEdit(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (post) {
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-tags').value = post.tags.join(', ');
        const postCategoriesSelect = document.getElementById('post-categories');
        postCategoriesSelect.innerHTML = '';
        post.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            postCategoriesSelect.appendChild(option);
        });
        quill.root.innerHTML = post.content;
        editPostId = postId;
        editPostIndex = allPosts.findIndex(p => p.id === postId);
    } else {
        console.error("Post não encontrado para edição: ", postId);
    }
}

async function uploadQuillImages(content) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const images = tempDiv.getElementsByTagName('img');

    for (const img of images) {
        try {
            const file = await fetch(img.src).then(r => r.blob());
            const imageUrl = await uploadImage(file);
            img.src = imageUrl;
        } catch (error) {
            console.error("Erro ao carregar imagem:", error);
        }
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
                }).catch(error => {
                    console.error("Erro ao obter URL de download:", error);
                    reject(error);
                });
            }
        );
    });
}