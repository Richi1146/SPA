// app/views/dashboard.js
import { getCurrentUser, AuthService } from '../auth.js';
import { EventService } from '../events.js';
import { router } from '../../index.js';

/**
 * Muestra el panel principal para usuarios autenticados y lista los eventos.
 */
export function dashboardView() {
    const user = getCurrentUser();
    if (!user) {
        window.location.hash = '#/login';
        return document.createElement('div');
    }

    const container = document.createElement('div');
    container.className = "flex flex-col md:flex-row min-h-screen w-full";
    container.innerHTML = `
        <aside class="w-full md:w-64 bg-purple-700 text-white p-6 flex flex-col items-center shadow-lg">
            <div class="text-center mb-8">
                <div class="rounded-full mx-auto mb-2 border-4 border-purple-300 w-24 h-24 flex items-center justify-center overflow-hidden bg-purple-500">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-white">
                        <path d="M12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4Z" fill="currentColor"/>
                        <path d="M4 18C4 15.7909 5.79086 14 8 14H16C18.2091 14 20 15.7909 20 18V20H4V18Z" fill="currentColor"/>
                    </svg>
                </div>
                <h2 class="text-xl font-semibold">${user.fullName}</h2>
                <p class="text-purple-200 text-sm capitalize">${user.role}</p>
            </div>
            <nav class="w-full">
                <ul>
                    <li class="mb-4">
                        <a href="#/dashboard" class="block bg-purple-800 hover:bg-purple-900 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Eventos</span>
                        </a>
                    </li>
                    ${user.role === 'visitor' ? `
                    <li class="mb-4">
                        <a href="#/public/my-courses" class="block bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2">
                            <i class="fas fa-ticket-alt"></i>
                            <span>Mis Registros</span>
                        </a>
                    </li>
                    ` : ''}
                    <li class="mt-auto">
                        <button id="logout-button" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Cerrar Sesión</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>

        <main id="dashboard-content" class="flex-1 p-8 bg-gray-50 overflow-auto">
            <h1 class="text-4xl font-bold text-gray-800 mb-6">Panel de Eventos</h1>
            ${user.role === 'admin' ? `
                <button id="add-new-event-button" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mb-6">
                    <i class="fas fa-plus mr-2"></i>Añadir Nuevo Evento
                </button>
            ` : ''}
            <div id="event-list-container" class="mt-8 bg-white shadow-md rounded-lg p-4">
                <h2 class="text-2xl font-semibold mb-4 text-gray-700">Eventos Disponibles</h2>
                <div id="events-placeholder" class="text-gray-500 text-center py-8">Cargando eventos...</div>
                </div>
        </main>
    `;

    // listener para el boton de logout
    const logoutButton = container.querySelector('#logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            AuthService.logout();
            window.location.hash = '#/login';
            alert('Sesión cerrada correctamente.');
        });
    }

    // boton "Añadir Nuevo Evento" (solo para admin)
    const addNewEventButton = container.querySelector('#add-new-event-button');
    if (addNewEventButton) {
        addNewEventButton.addEventListener('click', () => {
            window.location.hash = '#/dashboard/events/create';
        });
    }

    // Función para renderizar la lista de eventos
    const renderEvents = async () => {
        const eventListContainer = container.querySelector('#event-list-container');
        const eventsPlaceholder = container.querySelector('#events-placeholder');

        if (eventsPlaceholder) {
            eventsPlaceholder.textContent = 'Cargando eventos...';
        }

        const events = await EventService.getAllEvents();
        
        
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
                            <th class="py-3 px-6 text-left">Capacidad</th>
                            <th class="py-3 px-6 text-center">Registrados</th>
                            ${user.role === 'admin' ? '<th class="py-3 px-6 text-center">Acciones</th>' : ''}
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 text-sm font-light" id="events-table-body">
                        </tbody>
                </table>
            </div>
            <div id="no-events-message" class="text-gray-500 text-center py-8 hidden">No hay eventos disponibles.</div>
        `;
        const eventsTableBody = eventListContainer.querySelector('#events-table-body');
        const noEventsMessage = eventListContainer.querySelector('#no-events-message');

        if (events.length === 0) {
            noEventsMessage.classList.remove('hidden');
            return;
        }

        events.forEach(event => {
            const row = document.createElement('tr');
            row.className = "border-b border-gray-200 hover:bg-gray-100";
            
            const registeredCount = event.attendees ? event.attendees.length : 0;
            const capacityDisplay = event.capacity === -1 ? 'Ilimitada' : event.capacity;
            const isFull = event.capacity !== -1 && registeredCount >= event.capacity;

            row.innerHTML = `
                <td class="py-3 px-6 text-left whitespace-nowrap">
                    <img src="${event.imageUrl || 'https://via.placeholder.com/50x50?text=Event'}" alt="${event.title}" class="w-12 h-12 object-cover rounded-md">
                </td>
                <td class="py-3 px-6 text-left font-semibold">${event.title}</td>
                <td class="py-3 px-6 text-left max-w-xs overflow-hidden truncate">${event.description}</td>
                <td class="py-3 px-6 text-left">${event.date}</td>
                <td class="py-3 px-6 text-left">${event.time}</td>
                <td class="py-3 px-6 text-left">${event.location}</td>
                <td class="py-3 px-6 text-left ${isFull ? 'text-red-500 font-bold' : ''}">${capacityDisplay}</td>
                <td class="py-3 px-6 text-center">${registeredCount}</td>
                ${user.role === 'admin' ? `
                    <td class="py-3 px-6 text-center">
                        <div class="flex item-center justify-center space-x-4">
                            <button data-id="${event.id}" class="edit-event-button w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button data-id="${event.id}" class="delete-event-button w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                ` : ''}
            `;
            eventsTableBody.appendChild(row);
        });

        // botones de editar y eliminar (solo para admin)
        if (user.role === 'admin') {
            container.querySelectorAll('.edit-event-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const eventId = e.currentTarget.dataset.id;
                    window.location.hash = `#/dashboard/events/edit?id=${eventId}`;
                });
            });

            container.querySelectorAll('.delete-event-button').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const eventId = e.currentTarget.dataset.id;
                    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
                        const result = await EventService.deleteEvent(eventId);
                        if (result.success) {
                            alert('Evento eliminado exitosamente.');
                            renderEvents(); // Vuelve a cargar la lista de eventos
                        } else {
                            alert(`Error al eliminar el evento: ${result.message}`);
                        }
                    }
                });
            });
        }
    };


    renderEvents();

    return container;
}