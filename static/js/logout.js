const logoutButton = document.getElementById('logout');

if (logoutButton) {
    logoutButton.addEventListener('click', cerrarSesion);
}

async function cerrarSesion() {
    try {
        const response = await fetch('/apiV1/auth/logout', {
            method: 'POST'
        });

        if (response.ok) {
            window.location.replace('/');
        } else {
            console.error('Error al cerrar sesión:', response.status);
        }

    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}