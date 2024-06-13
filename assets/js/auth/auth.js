export function login() {
    var email = escapeHTML(document.getElementById('email').value);
    var password = escapeHTML(document.getElementById('password').value);
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = 'admin.html';
        })
        .catch(error => {
            document.getElementById('login-error').textContent = "Erro de login: " + escapeHTML(error.message);
        });
}

export function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'login.html';
    }).catch(error => {
        console.error("Erro ao sair: ", error);
    });
}