import { EventService } from '../events.js'; 
import { getCurrentUser } from '../auth.js'; 
import { router } from '../../index.js'; 

/**
 * Renderiza el formulario de creación de eventos y maneja el envio.
 * Solo accesible por Admin.
 */
export function createEventView() {
    const user = getCurrentUser();
    // Esta verificacion es un seguro, el router ya deberia haber redirigido
    if (!user || user.role !== 'admin') {
        window.location.hash = '#/public'; // O a notFound, segun la preferencia
        return document.createElement('div');
    }

    const container = document.createElement('div');
    container.className = "bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto";
    container.innerHTML = `
        <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Crear Nuevo Evento</h1>
        <form id="create-event-form">
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
                <label for="capacity" class="block text-gray-700 text-sm font-bold mb-2">Capacidad (-1 para ilimitado)</label>
                <input type="number" id="capacity" name="capacity" min="-1" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="-1" required>
            </div>
            <div class="mb-6 text-left">
                <label for="imageUrl" class="block text-gray-700 text-sm font-bold mb-2">URL de la Imagen (opcional)</label>
                <input type="url" id="imageUrl" name="imageUrl" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div id="create-event-message" class="mt-4 text-red-500 text-center"></div>
            <div class="flex items-center justify-between mt-6">
                <button type="button" id="cancel-button" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancelar
                </button>
                <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Guardar Evento
                </button>
            </div>
        </form>
    `;

    const createEventForm = container.querySelector('#create-event-form');
    const createEventMessage = container.querySelector('#create-event-message');
    const cancelButton = container.querySelector('#cancel-button');

    // Manejo envio del formulario
    if (createEventForm) {
        createEventForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const eventData = {
                title: createEventForm.title.value,
                description: createEventForm.description.value,
                date: createEventForm.date.value,
                time: createEventForm.time.value,
                location: createEventForm.location.value,
                capacity: parseInt(createEventForm.capacity.value, 10),
                imageUrl: createEventForm.imageUrl.value || 'https://via.placeholder.com/400x200?text=Event', 
            };

            // Validacion basica de campos
            if (!eventData.title || !eventData.description || !eventData.date || !eventData.time || !eventData.location) {
                createEventMessage.textContent = 'Por favor, completa todos los campos requeridos.';
                return;
            }
            if (isNaN(eventData.capacity)) {
                createEventMessage.textContent = 'La capacidad debe ser un número válido.';
                return;
            }

            const result = await EventService.createEvent(eventData);

            if (result.success) {
                alert('¡Evento creado exitosamente!');
                window.location.hash = '#/dashboard'; // Redirige al dashboard
            } else {
                createEventMessage.textContent = result.message || 'Error al crear el evento.';
            }
        });
    }

    // Manejar botón de cancelar
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            window.location.hash = '#/dashboard'; // Vuelve al dashboard sin guardar
        });
    }

    return container;
}