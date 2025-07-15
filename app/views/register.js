import { AuthService } from '../auth.js'; 
import { router } from '../../index.js'; 

/**
 * Renderiza el formulario de registro.
 */
export function registerView() {
    const container = document.createElement('div');
    container.className = "bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center";
    container.innerHTML = `
        <h2 class="text-3xl font-bold mb-6 text-gray-800">Register</h2>
        <form id="register-form">
            <div class="mb-4 text-left">
                <label for="fullName" class="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                <input type="text" id="fullName" name="fullName" placeholder="Pepito alvarez" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>
            <div class="mb-4 text-left">
                <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" id="email" name="email" placeholder="email@gmail.com" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>
            <div class="mb-4 text-left">
                <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input type="password" id="password" name="password" placeholder="********" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>
            <div class="mb-6 text-left">
                <label for="confirmPassword" class="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="********" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>
             <div class="mb-6 text-left">
                <label for="role" class="block text-gray-700 text-sm font-bold mb-2">Role (default is Visitor)</label>
                <select id="role" name="role" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="visitor">Visitor</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                Register
            </button>
        </form>
        <p class="mt-4 text-gray-600">¿Ya tienes cuenta? <a href="#/login" class="text-purple-600 hover:underline">Inicia sesión aquí</a></p>
        <div id="register-message" class="mt-4 text-red-500"></div>
    `;

    const registerForm = container.querySelector('#register-form');
    const registerMessage = container.querySelector('#register-message');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = registerForm.fullName.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            const confirmPassword = registerForm.confirmPassword.value;
            const role = registerForm.role.value;

            if (password !== confirmPassword) {
                registerMessage.textContent = 'Las contraseñas no coinciden.';
                return;
            }

            const result = await AuthService.register(fullName, email, password, role); 
            if (result.success) {
                alert('Registro exitoso. ¡Bienvenido!');
                window.location.hash = '#/dashboard';
            } else {
                registerMessage.textContent = result.message;
            }
        });
    }

    return container;
}