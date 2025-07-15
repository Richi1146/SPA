// Importación de las vistas
import { loginView } from './app/views/login.js';
import { registerView } from './app/views/register.js';
import { dashboardView } from './app/views/dashboard.js';
import { adminView } from './app/views/admin.js';
import { notFoundView } from './app/views/notFound.js';
import { publicView } from './app/views/public.js';
import { createEventView } from './app/views/CreateEvent.js';
import { editEventView } from './app/views/EditEvent.js';

// Importación de las funciones de autenticación
import { getCurrentUser, isAuthenticated, AuthService } from './app/auth.js'; // Importa el objeto AuthService también

/**
 * Funcion que lee el hash de la URL y renderiza la vista correspondiente.
 */
export function router() {
    const route = window.location.hash || '#/public'; // Detectamos el # actual, por defecto a #/public
    const app = document.getElementById('app');

    // Limpiamos el contenido
    app.innerHTML = '';


    if (route === '#/login') {
        if (isAuthenticated()) { 
            window.location.hash = '#/dashboard';
            return;
        }
        app.appendChild(loginView());
    } else if (route === '#/register') {
        if (isAuthenticated()) { // 
            window.location.hash = '#/dashboard';
            return;
        }
        app.appendChild(registerView());
    } else if (route === '#/public') {
        app.appendChild(publicView());
    }

    else if (route === '#/public/my-courses') {
        if (!isAuthenticated()) { // Requiere autenticacion
            window.location.hash = '#/login';
            return;
        }
        app.appendChild(publicView()); 
    }

    else if (route === '#/dashboard') {
        if (!isAuthenticated()) { // 
            window.location.hash = '#/login';
            return;
        }
        app.appendChild(dashboardView());
    }
    else if (route === '#/admin') { 
        if (!isAuthenticated()) {
            window.location.hash = '#/login';
            return;
        }
        const user = getCurrentUser();
        if (user.role !== 'admin') { 
            window.location.hash = '#/public';
            return;
        }
        app.appendChild(adminView());
    }
    else if (route === '#/dashboard/events/create') {
        if (!isAuthenticated()) {
            window.location.hash = '#/login';
            return;
        }
        const user = getCurrentUser();
        if (user.role !== 'admin') { 
            window.location.hash = '#/dashboard'; //redirige al dashboard general
            return;
        }
        app.appendChild(createEventView());
    }
    else if (route.startsWith('#/dashboard/events/edit')) {
        if (!isAuthenticated()) {
            window.location.hash = '#/login';
            return;
        }
        const user = getCurrentUser();
        if (user.role !== 'admin') { 
            window.location.hash = '#/dashboard';
            return;
        }
        app.appendChild(editEventView()); 
    }
    else {
        app.appendChild(notFoundView());
    }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

document.addEventListener('click', (e) => {

    if (e.target && e.target.id === 'global-logout-button') {
        AuthService.logout(); 
        window.location.hash = '#/login';
        alert('Sesión cerrada desde el botón global.');
    }
});