import { AuthService } from '../auth.js'; 
import { router } from '../../index.js'; 

/**
 * Renderiza el formulario de login
 */
export function loginView() {
    const container = document.createElement('div');
    container.className = "bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center";
    container.innerHTML = `
        <h2 class="text-3xl font-bold mb-6 text-gray-800">Login</h2>
        <form id="login-form">
            <div class="mb-4 text-left">
                <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" id="email" name="email" placeholder="email@gmail.com" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>
            <div class="mb-6 text-left">
                <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input type="password" id="password" name="password" placeholder="********" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>
            <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                Log in
            </button>
        </form>
        <p class="mt-4 text-gray-600">¿No tienes cuenta? <a href="#/register" class="text-purple-600 hover:underline">Regístrate aquí</a></p>
        <p class="mt-4 text-black-600">Cuenta de Prueba:</p>
        <p class="mt-4 text-gray-600">Email: admin@gmail.com</p>
        <p class="mt-4 text-gray-600">Password: admin123</p>
        <div id="login-message" class="mt-4 text-red-500"></div>
    `;


    const loginForm = container.querySelector('#login-form');
    const loginMessage = container.querySelector('#login-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            const result = await AuthService.login(email, password); // Llama al objeto
            if (result.success) {
                window.location.hash = '#/dashboard'; // Navega usando hash
            } else {
                loginMessage.textContent = result.message;
            }
        });
    }

    return container; 
}