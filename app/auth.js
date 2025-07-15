// app/auth.js
const API_BASE_URL = 'http://localhost:3000';

/**
 * Objeto para manejar toda la logica de autenticación y sesion del usuario.
 */
const AuthService = {

    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/users?email=${email}&password=${password}`);
            const users = await response.json();

            if (users.length > 0) {
                const user = users[0];
                localStorage.setItem('user', JSON.stringify(user));
                return { success: true, user: user };
            } else {
                return { success: false, message: 'Credenciales inválidas. Por favor, verifica tu email y contraseña.' };
            }
        } catch (error) {
            console.error('Error durante el login:', error);
            return { success: false, message: 'Error de conexión con el servidor. Intenta de nuevo más tarde.' };
        }
    },

    async register(fullName, email, password, role = 'visitor') {
        try {
            const checkEmailResponse = await fetch(`${API_BASE_URL}/users?email=${email}`);
            const existingUsers = await checkEmailResponse.json();

            if (existingUsers.length > 0) {
                return { success: false, message: 'El correo electrónico ya está registrado. Por favor, usa otro.' };
            }

            const newUser = {
                id: crypto.randomUUID(),
                fullName,
                email,
                password,
                role: role
            };

            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                const user = await response.json();
                localStorage.setItem('user', JSON.stringify(user));
                return { success: true, user: user };
            } else {
                const errorData = await response.json();
                return { success: false, message: errorData.message || 'Error en el registro del usuario.' };
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            return { success: false, message: 'Error de conexión con el servidor. Intenta de nuevo más tarde.' };
        }
    },

    /**
     * Cierra la sesion del usuario eliminando la información del Local Storage.
     */
    logout() {
        localStorage.removeItem('user');
    },


    isLoggedIn() {
        return localStorage.getItem('user') !== null;
    },


    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Obtiene el rol del usuario que se loguea 
     */
    getUserRole() {
        const user = AuthService.getUser(); 
        return user ? user.role : null;
    }
};


export { AuthService };


export const isAuthenticated = () => AuthService.isLoggedIn();
export const getCurrentUser = () => AuthService.getUser();