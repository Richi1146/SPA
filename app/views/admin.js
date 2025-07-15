
import { getCurrentUser, isAuthenticated } from '../auth.js'; 

/**
 * Componente de la vista de Administración
 * Contenido para usuarios con rol admin
 */
export function adminView() {
    const user = getCurrentUser();
    // Esta verificación es un seguro, el router ya debería haber redirigido
    if (!isAuthenticated() || user.role !== 'admin') {
        window.location.hash = '#/public';
        return document.createElement('div');
    }

    const container = document.createElement('div');
    container.className = "text-center p-8 bg-white rounded-lg shadow-md w-full max-w-2xl";
    container.innerHTML = `
        <h1 class="text-4xl font-bold text-green-700 mb-4">Panel de Administración</h1>
        <p class="text-lg text-gray-700 mb-6">¡Hola, ${user.fullName}! Aquí tienes acceso a todas las herramientas de administración de eventos.</p>
        <nav class="mt-8 flex flex-col space-y-4">
            <a href="#/dashboard/events/create" class="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-xl font-semibold">
                Crear Nuevo Evento
            </a>
            <a href="#/dashboard" class="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-xl font-semibold">
                Ver Todos los Eventos
            </a>
            </nav>
        <p class="mt-6 text-gray-600">Puedes volver al <a href="#/dashboard" class="text-blue-600 hover:underline">Dashboard General</a>.</p>
    `;

    return container;
}