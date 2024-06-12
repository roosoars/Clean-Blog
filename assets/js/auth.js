export function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = 'admin.html';
        })
        .catch(error => {
            document.getElementById('login-error').textContent = "Erro de login: " + error.message;
        });
}

export function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'login.html';
    }).catch(error => {
        console.error("Erro ao sair: ", error);
    });
}