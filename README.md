# Gestión de Eventos SPA

Este es un proyecto de Single Page Application (SPA) para la gestión de eventos de Riwi.

## Coder Info
- **Nombre:** Ricardo Carmona Montaño
- **Clan:** Bernes lee
- **Correo:** ricardo225.x@gmail.com
- **Documento de Identidad:** 1001250466

## Descripción del Proyecto
Esta aplicación permite a los usuarios (administradores y visitantes) gestionar y visualizar eventos. Incluye un sistema de autenticación, rutas protegidas, persistencia de sesión con Local Storage y simulación de base de datos con `json-server`.

## Funcionalidades
- Registro de usuarios con roles de `administrador` y `visitante`.
- Inicio de sesión.
- Protección de rutas:
    - Redirección a `/not-found` si se intenta acceder a rutas protegidas sin autenticación o con rol incorrecto.
    - Redirección a `/dashboard` si un usuario autenticado intenta acceder a `/login` o `/register`.
- Persistencia de sesión usando `localStorage`.
- Gestión de eventos (CRUD) a través de `json-server`.
    - Administradores pueden crear, leer, actualizar y eliminar eventos.
    - Visitantes pueden ver eventos, registrarse en ellos y ver sus eventos registrados.

## Cómo Levantar y Usar la Solución

### Requisitos
- Node.js (versión 18 o superior recomendada)
- npm (Node Package Manager)

### Pasos
1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Richi1146/SPA.git
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Iniciar el servidor de la API simulada (`json-server`):**
    ```bash
    npm start
    ```
    Esto iniciará `json-server` en `http://localhost:3000`.
4.  **Abrir la aplicación en el navegador:**
    Simplemente abre el archivo `index.html` en tu navegador web o ejecutalo con Live Server

## Colección Postman
- https://richi-2553937.postman.co/workspace/Richi's-Workspace~924d9f39-af65-4c1c-8931-77ec15c0eb4d/folder/46756072-e370ef7f-099e-4848-9eea-a6c6a2c6cf0d?action=share&creator=46756072&ctx=documentation

