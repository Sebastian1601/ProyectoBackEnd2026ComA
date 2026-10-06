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
            const data = await res.json().catch(() => ({}));
            throw new Error('Usuario o contraseña incorrectos');
        }

        const data = await res.json();

        // Ajustá esto según lo que devuelva tu endpoint:
        // - si usás cookies de sesión, probablemente solo necesites redirigir
        // - si devuelve un token, guardalo antes de redirigir
        if (data.token) {
            localStorage.setItem('token', data.token);
        }

        window.location.href = '/index';

    } catch (err) {
        errorBox.textContent = err.message;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ingresar';
    }
});