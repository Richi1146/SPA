/**
 * pagina 404.

 */
export function notFoundView() {
    const container = document.createElement('div');
    container.className = "text-center p-8 bg-white rounded-lg shadow-md";
    container.innerHTML = `
        <h1 class="text-4xl font-bold text-red-600 mb-4">404 - Página No Encontrada</h1>
        <p class="text-lg text-gray-700 mb-6">Lo sentimos, la página que buscas no existe o no tienes permiso para acceder a ella.</p>
        <a href="#/public" class="text-blue-600 hover:underline bg-blue-100 px-4 py-2 rounded-lg inline-block">Volver a la Página Principal</a>
    `;
    return container;
}