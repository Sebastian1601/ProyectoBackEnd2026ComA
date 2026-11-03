// Cambiá esta URL por la de tu endpoint real.
const LOGIN_ENDPOINT = '/apiV1/auth';
console.log("vinculado");

const form = document.querySelector('#login-form');
const errorBox = document.querySelector('#login-error');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.textContent = '';

    const user = document.querySelector('#username').value;
    const contra = document.querySelector('#password').value;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Ingresando...';

    try {
        const res = await fetch(LOGIN_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // enviá/recibí cookies de sesión si tu backend las usa
            body: JSON.stringify({ user, contra })
        });

        if (!res.ok) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        // El token viaja en una cookie httpOnly que el navegador guarda y reenvía solo: acá solo se redirige
        window.location.href = '/index';

    } catch (err) {
        errorBox.textContent = err.message;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ingresar';
    }
});