// app/views/EditEvent.js
import { EventService } from '../events.js'; 
import { getCurrentUser } from '../auth.js'; 
import { router } from '../../index.js'; 


export function editEventView() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.hash = '#/public'; // O a notFound, segun la preferencia
        return document.createElement('div');
    }

    const container = document.createElement('div');
    container.className = "bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto";
    container.innerHTML = `
        <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Editar Evento</h1>
        <form id="edit-event-form">
            <div class="mb-4 text-left">
                <label for="title" class="block text-gray-700 text-sm font-bold mb-2">Título del Evento</label>
                <input type="text" id="title" name="title" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>
            <div class="mb-4 text-left">
                <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                <textarea id="description" name="description" rows="4" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="text-left">
                    <label for="date" class="block text-gray-700 text-sm font-bold mb-2">Fecha</label>
                    <input type="date" id="date" name="date" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                </div>
                <div class="text-left">
                    <label for="time" class="block text-gray-700 text-sm font-bold mb-2">Hora</label>
                    <input type="time" id="time" name="time" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                </div>
            </div>
            <div class="mb-4 text-left">
                <label for="location" class="block text-gray-700 text-sm font-bold mb-2">Ubicación</label>
                <input type="text" id="location" name="location" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>
            <div class="mb-4 text-left">
                <label for="capacity" class="block text-gray-700 text-sm font-bold mb-2">Capacidad (número, -1 para ilimitado)</label>
                <input type="number" id="capacity" name="capacity" min="-1" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>
            <div class="mb-6 text-left">
                <label for="imageUrl" class="block text-gray-700 text-sm font-bold mb-2">URL de la Imagen (opcional)</label>
                <input type="url" id="imageUrl" name="imageUrl" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div id="edit-event-message" class="mt-4 text-red-500 text-center"></div>
            <div class="flex items-center justify-between mt-6">
                <button type="button" id="cancel-button" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancelar
                </button>
                <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Actualizar Evento
                </button>
            </div>
        </form>
    `;

    const editEventForm = container.querySelector('#edit-event-form');
    const editEventMessage = container.querySelector('#edit-event-message');
    const cancelButton = container.querySelector('#cancel-button');

    // Extraer el ID del evento de la URL
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const eventId = urlParams.get('id');

    // Si no hay ID de evento, redirigir
    if (!eventId) {
        editEventMessage.textContent = 'ID de evento no proporcionado.';
        window.location.hash = '#/dashboard';
        return container;
    }

    // Funcion para cargar los datos del evento en el formulario
    const loadEventData = async () => {
        const event = await EventService.getEventById(eventId);
        if (event) {
            editEventForm.title.value = event.title || '';
            editEventForm.description.value = event.description || '';
            editEventForm.date.value = event.date || '';
            editEventForm.time.value = event.time || '';
            editEventForm.location.value = event.location || '';
            editEventForm.capacity.value = event.capacity !== undefined ? event.capacity : -1;
            editEventForm.imageUrl.value = event.imageUrl || '';
        } else {
            editEventMessage.textContent = 'Evento no encontrado.';
            setTimeout(() => { window.location.hash = '#/dashboard'; }, 2000);
        }
    };

    loadEventData();

    if (editEventForm) {
        editEventForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedEventData = {
                title: editEventForm.title.value,
                description: editEventForm.description.value,
                date: editEventForm.date.value,
                time: editEventForm.time.value,
                location: editEventForm.location.value,
                capacity: parseInt(editEventForm.capacity.value, 10),
                imageUrl: editEventForm.imageUrl.value,
            };

            
            if (!updatedEventData.title || !updatedEventData.description || !updatedEventData.date || !updatedEventData.time || !updatedEventData.location) {
                editEventMessage.textContent = 'Por favor, completa todos los campos requeridos.';
                return;
            }
            if (isNaN(updatedEventData.capacity)) {
                editEventMessage.textContent = 'La capacidad debe ser un número válido.';
                return;
            }

            const result = await EventService.updateEvent(eventId, updatedEventData);

            if (result.success) {
                alert('¡Evento actualizado exitosamente!');
                window.location.hash = '#/dashboard'; // Redirige al dashboard
            } else {
                editEventMessage.textContent = result.message || 'Error al actualizar el evento.';
            }
        });
    }

    // boton de cancelar
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            window.location.hash = '#/dashboard'; // Vuelve al dashboard sin guardar
        });
    }

    return container;
}