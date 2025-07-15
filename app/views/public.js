import { isAuthenticated, getCurrentUser } from '../auth.js';
import { EventService } from '../events.js'; 
/**
 * Muestra contenido accesible para todos los usuarios (autenticados o no) y lista los eventos.
 */
export function publicView() {
    const container = document.createElement('div');
    container.className = "text-center p-8 bg-white rounded-lg shadow-md";

    let authLinks = `<p class="mt-4 text-gray-600">
                        <a href="#/login" class="text-blue-600 hover:underline mx-2">Iniciar Sesión</a> |
                        <a href="#/register" class="text-blue-600 hover:underline mx-2">Registrarse</a>
                    </p>`;
    let authenticatedLinks = `<p class="mt-4 text-gray-600">
                                <a href="#/dashboard" class="text-blue-600 hover:underline mx-2">Ir al Dashboard</a>
                                ${isAuthenticated() ? `| <a href="#/public/my-courses" class="text-blue-600 hover:underline mx-2">Mis Registros</a>` : ''}
                            </p>`;


    container.innerHTML = `
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Bienvenido a la Gestión de Eventos</h1>
        <p class="text-lg text-gray-700 mb-6">Explora nuestros próximos eventos.</p>
        <div id="events-public-list" class="mt-8 bg-white shadow-md rounded-lg p-4">
            <h2 class="text-2xl font-semibold mb-4 text-gray-700">Eventos Disponibles</h2>
            <div id="events-placeholder" class="text-gray-500 text-center py-8">Cargando eventos...</div>
            </div>
        ${isAuthenticated() ? authenticatedLinks : authLinks}
    `;

    // Renderizar la lista de eventos
    const renderEvents = async () => {
        const eventListContainer = container.querySelector('#events-public-list');
        const eventsPlaceholder = container.querySelector('#events-placeholder');

        if (eventsPlaceholder) {
            eventsPlaceholder.textContent = 'Cargando eventos...';
        }

        const events = await EventService.getAllEvents();
        const currentUser = getCurrentUser(); // Obtener el usuario actual para verificar registros

        eventListContainer.innerHTML = `
            <h2 class="text-2xl font-semibold mb-4 text-gray-700">Eventos Disponibles</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th class="py-3 px-6 text-left">Imagen</th>
                            <th class="py-3 px-6 text-left">Título</th>
                            <th class="py-3 px-6 text-left">Descripción</th>
                            <th class="py-3 px-6 text-left">Fecha</th>
                            <th class="py-3 px-6 text-left">Hora</th>
                            <th class="py-3 px-6 text-left">Ubicación</th>
                            <th class="py-3 px-6 text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 text-sm font-light" id="events-table-body-public">
                        </tbody>
                </table>
            </div>
            <div id="no-events-message-public" class="text-gray-500 text-center py-8 hidden">No hay eventos disponibles.</div>
        `;
        const eventsTableBody = eventListContainer.querySelector('#events-table-body-public');
        const noEventsMessage = eventListContainer.querySelector('#no-events-message-public');

        if (events.length === 0) {
            noEventsMessage.classList.remove('hidden');
            return;
        }

        events.forEach(event => {
            const row = document.createElement('tr');
            row.className = "border-b border-gray-200 hover:bg-gray-100";

            const registeredCount = event.attendees ? event.attendees.length : 0;
            const isFull = event.capacity !== -1 && registeredCount >= event.capacity;
            const isRegistered = currentUser && event.attendees && event.attendees.some(attendee => attendee.userId === currentUser.id);

            let actionButtonHtml = '';
            if (!isAuthenticated()) {
                actionButtonHtml = `<span class="text-gray-500">Inicia sesión para registrarte</span>`;
            } else if (isRegistered) {
                actionButtonHtml = `<button data-id="${event.id}" class="unregister-button bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
                                        Cancelar Registro
                                    </button>`;
            } else if (isFull) {
                actionButtonHtml = `<span class="bg-gray-400 text-white font-bold py-2 px-4 rounded-lg">Agotado</span>`;
            } else {
                actionButtonHtml = `<button data-id="${event.id}" class="register-button bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
                                        Registrarse
                                    </button>`;
            }

            row.innerHTML = `
                <td class="py-3 px-6 text-left whitespace-nowrap">
                    <img src="${event.imageUrl || 'https://via.placeholder.com/50x50?text=Event'}" alt="${event.title}" class="w-12 h-12 object-cover rounded-md">
                </td>
                <td class="py-3 px-6 text-left font-semibold">${event.title}</td>
                <td class="py-3 px-6 text-left max-w-xs overflow-hidden truncate">${event.description}</td>
                <td class="py-3 px-6 text-left">${event.date}</td>
                <td class="py-3 px-6 text-left">${event.time}</td>
                <td class="py-3 px-6 text-left">${event.location}</td>
                <td class="py-3 px-6 text-center">
                    ${actionButtonHtml}
                </td>
            `;
            eventsTableBody.appendChild(row);
        });

        if (isAuthenticated()) {
            container.querySelectorAll('.register-button').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const eventId = e.currentTarget.dataset.id;
                    const user = getCurrentUser();
                    const result = await EventService.registerUserToEvent(eventId, { id: user.id, fullName: user.fullName });
                    if (result.success) {
                        alert(result.message);
                        renderEvents(); 
                    } else {
                        alert(`Error al registrarse: ${result.message}`);
                    }
                });
            });

            container.querySelectorAll('.unregister-button').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const eventId = e.currentTarget.dataset.id;
                    const user = getCurrentUser();
                    if (confirm('¿Estás seguro de que quieres cancelar tu registro a este evento?')) {
                        const result = await EventService.unregisterUserFromEvent(eventId, user.id);
                        if (result.success) {
                            alert(result.message);
                            renderEvents(); 
                        } else {
                            alert(`Error al cancelar registro: ${result.message}`);
                        }
                    }
                });
            });
        }
    };

    renderEvents();

    return container;
}