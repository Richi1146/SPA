// app/events.js
const API_BASE_URL = 'http://localhost:3000';

/**
 * Objeto para manejar todas las operaciones relacionadas con eventos
 */
const EventService = {

    async getAllEvents() {
        try {
            const response = await fetch(`${API_BASE_URL}/events`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener todos los eventos:', error);
            return [];
        }
    },

    async getEventById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/events/${id}`);
            if (!response.ok) {
                if (response.status === 404) return null; // Evento no encontrado
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener evento con ID ${id}:`, error);
            return null;
        }
    },

    async createEvent(eventData) {
        try {
            const newEvent = {
                id: crypto.randomUUID(), // Genera un ID unico para el evento
                ...eventData,
                attendees: [] // Inicializa con un array vacio de asistentes
            };

            const response = await fetch(`${API_BASE_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEvent)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || 'Error al crear el evento.');
            }
            const createdEvent = await response.json();
            return { success: true, event: createdEvent, message: 'Evento creado exitosamente.' };
        } catch (error) {
            console.error('Error creando evento:', error);
            return { success: false, message: error.message || 'Hubo un error al crear el evento.' };
        }
    },

    /**
     * Actualiza un evento existente solo para administradores.
     */
    async updateEvent(id, updatedData) {
        try {
            const response = await fetch(`${API_BASE_URL}/events/${id}`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || 'Error al actualizar el evento.');
            }
            const updatedEvent = await response.json();
            return { success: true, event: updatedEvent, message: 'Evento actualizado exitosamente.' };
        } catch (error) {
            console.error(`Error actualizando evento con ID ${id}:`, error);
            return { success: false, message: error.message || 'Hubo un error al actualizar el evento.' };
        }
    },


    async deleteEvent(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/events/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || 'Error al eliminar el evento.');
            }
            return { success: true, message: 'Evento eliminado exitosamente.' };
        } catch (error) {
            console.error(`Error eliminando evento con ID ${id}:`, error);
            return { success: false, message: error.message || 'Hubo un error al eliminar el evento.' };
        }
    },


    async registerUserToEvent(eventId, user) {
        try {
            const event = await EventService.getEventById(eventId);
            if (!event) {
                return { success: false, message: 'Evento no encontrado.' };
            }


            const isAlreadyRegistered = event.attendees.some(attendee => attendee.userId === user.id);
            if (isAlreadyRegistered) {
                return { success: false, message: 'Ya estás registrado en este evento.' };
            }

            // Verificar la capacidad del evento
            if (event.capacity !== -1 && event.attendees.length >= event.capacity) {
                return { success: false, message: 'El evento ha alcanzado su capacidad máxima.' };
            }

            const updatedAttendees = [...event.attendees, { userId: user.id, fullName: user.fullName, registrationDate: new Date().toISOString() }];

            const result = await EventService.updateEvent(eventId, { attendees: updatedAttendees });

            if (result.success) {
                return { success: true, message: '¡Registro al evento exitoso!' };
            } else {
                return { success: false, message: result.message || 'Error al registrarte en el evento.' };
            }
        } catch (error) {
            console.error('Error al registrar usuario en evento:', error);
            return { success: false, message: 'Hubo un error al intentar registrarte en el evento.' };
        }
    },

    /**
     * Cancela el registro de un usuario de un evento.
     */
    async unregisterUserFromEvent(eventId, userId) {
        try {
            const event = await EventService.getEventById(eventId);
            if (!event) {
                return { success: false, message: 'Evento no encontrado.' };
            }

            const initialAttendeeCount = event.attendees.length;
            const updatedAttendees = event.attendees.filter(attendee => attendee.userId !== userId);

            if (updatedAttendees.length === initialAttendeeCount) {
                return { success: false, message: 'No estabas registrado en este evento.' };
            }

            const result = await EventService.updateEvent(eventId, { attendees: updatedAttendees });

            if (result.success) {
                return { success: true, message: 'Registro cancelado exitosamente.' };
            } else {
                return { success: false, message: result.message || 'Error al cancelar el registro del evento.' };
            }
        } catch (error) {
            console.error('Error al cancelar registro de usuario en evento:', error);
            return { success: false, message: 'Hubo un error al intentar cancelar tu registro en el evento.' };
        }
    },

    /**
     * Obtiene los eventos a los que el usario esta registrado.
     */
    async getEventsRegisteredByUser(userId) {
        try {
            const allEvents = await EventService.getAllEvents();
            const registeredEvents = allEvents.filter(event =>
                event.attendees && event.attendees.some(attendee => attendee.userId === userId)
            );
            return registeredEvents;
        } catch (error) {
            console.error('Error al obtener eventos registrados por el usuario:', error);
            return [];
        }
    }
};

export { EventService };