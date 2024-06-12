export function initializeQuill() {
    var ImageResize = Quill.import('modules/imageResize');
    Quill.register('modules/imageResize', ImageResize);

    window.quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: {
                container: [
                    [{'header': [1, 2, false]}],
                    ['bold', 'italic', 'underline'],
                    ['image', 'link', 'video', 'code-block']
                ],
                handlers: {
                    'image': imageHandler
                }
            },
            imageResize: {
                displaySize: true
            }
        }
    });
}

function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
        const file = input.files[0];
        if (file) {
            const imageUrl = await uploadImage(file);
            const range = this.quill.getSelection(true);
            this.quill.insertEmbed(range.index, 'image', imageUrl, Quill.sources.USER);
            this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        }
    };
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