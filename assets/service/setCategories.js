export var categories = [];

export function loadCategories() {
    return db.collection("categories").get().then((querySnapshot) => {
        categories = querySnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name
        }));
        renderCategories();
        renderRemoveCategoryOptions(); // Adiciona as opções para remoção
    }).catch((error) => {
        console.error("Erro ao carregar categorias: ", error);
    });
}


function renderCategories() {
    const categorySelect = document.getElementById('all-categories');
    if (!categorySelect) return; // Verifique se o select existe
    categorySelect.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });

    const categoryList = document.getElementById('category-list');
    if (categoryList) {
        categoryList.innerHTML = '';
        categories.forEach(category => {
            const listItem = document.createElement('li');
            listItem.textContent = category.name;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remover';
            removeButton.onclick = () => removeCategory(category.id);
            listItem.appendChild(removeButton);
            categoryList.appendChild(listItem);
        });
    }
}

function renderRemoveCategoryOptions() {
    const removeCategorySelect = document.getElementById('remove-category-select');
    if (!removeCategorySelect) return; // Verifique se o select existe
    removeCategorySelect.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        removeCategorySelect.appendChild(option);
    });
}

export function addCategory() {
    const newCategory = document.getElementById('new-category').value;

    if (newCategory && !categories.some(category => category.name === newCategory)) {
        db.collection("categories").add({ name: newCategory }).then((docRef) => {
            categories.push({ id: docRef.id, name: newCategory });
            renderCategories();
            renderRemoveCategoryOptions(); // Atualizar as opções para remoção
            document.getElementById('new-category').value = '';
            alert('Categoria adicionada com sucesso!');
        }).catch((error) => {
            console.error("Erro ao adicionar categoria: ", error);
        });
    } else {
        alert('Categoria já existe ou é inválida.');
    }
}

export function addCategoryToPost() {
    const selectedCategory = document.getElementById('all-categories').value;
    const postCategoriesSelect = document.getElementById('post-categories');
    if (!Array.from(postCategoriesSelect.options).some(option => option.value === selectedCategory)) {
        const option = document.createElement('option');
        option.value = selectedCategory;
        option.textContent = selectedCategory;
        postCategoriesSelect.appendChild(option);
    } else {
        alert('Categoria já adicionada ao post.');
    }
}

export function removeCategoryFromPost() {
    const postCategoriesSelect = document.getElementById('post-categories');
    if (postCategoriesSelect.selectedIndex !== -1) {
        postCategoriesSelect.remove(postCategoriesSelect.selectedIndex);
    } else {
        alert('Por favor, selecione uma categoria para remover.');
    }
}

export function removeCategory(categoryId) {
    db.collection("categories").doc(categoryId).delete().then(() => {
        categories = categories.filter(category => category.id !== categoryId);
        renderCategories();
        renderRemoveCategoryOptions();
        alert('Categoria removida com sucesso!');
    }).catch((error) => {
        console.error("Erro ao remover categoria: ", error);
    });
}

export function removeSelectedCategory() {
    const removeCategorySelect = document.getElementById('remove-category-select');
    const selectedCategoryId = removeCategorySelect.value;

    if (selectedCategoryId) {
        db.collection("categories").doc(selectedCategoryId).delete().then(() => {
            categories = categories.filter(category => category.id !== selectedCategoryId);
            renderCategories();
            renderRemoveCategoryOptions();
            alert('Categoria removida com sucesso!');
        }).catch((error) => {
            console.error("Erro ao remover categoria: ", error);
        });
    } else {
        alert('Por favor, selecione uma categoria para remover.');
    }
}