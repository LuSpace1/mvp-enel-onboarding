# Arquitectura y Requisitos del Backend: MVP Onboarding Enel

## 1. Entorno de Desarrollo
*   **Gestor de Entorno y Paquetes:** `uv`.
*   **Linter y Formateador:** `Ruff`.

## 2. Stack Principal
*   **Framework Core:** `Django` (v5.0+). Principal panel de administración nativo para Recursos Humanos.
*   **Framework API:** `djangorestframework` (DRF). Para estructurar las respuestas en formato JSON.
*   **Autenticación:** `djangorestframework-simplejwt` (Sesiones mediante tokens JWT).
*   **CORS:** `django-cors-headers` (Configuracion para Django/React).

## 3. Base de Datos
*   **Motor:** `SQLite` (Pruebas fase MVP). 

## 4. Estructura de Modelos (App: `users`)
Se extenderá el modelo `AbstractUser` de Django para incluir la lógica de negocio y personalización.

**Modelo: `CustomUser`**
*   `username` (CharField): RUT del usuario (Ej: 12345678-9). Actuará como identificador único.
*   `first_name` (CharField): Nombre del colaborador.
*   `last_name` (CharField): Apellido paterno.
*    `second_last_name` (CharField): Apellido materno. (Nuevo)
*   `is_hr` (BooleanField): Define si el usuario tiene acceso al dashboard de creación de cuentas.
*   `is_new_hire` (BooleanField): Define si el usuario es un nuevo ingreso en proceso de onboarding.
*   `subgerencia` (CharField/Choices): Área a la que pertenece el usuario (ej. HSEQ, RCO, COM, ND, Finanzas, Legal). Permite personalizar la experiencia y resaltar el video de su subgerente en el organigrama.
*   `is_active` (BooleanField): Control para habilitar/deshabilitar accesos.

## 5. Estructura de la API (Endpoints)
*   **Autenticación:**
    *   `POST /api/auth/login/`: Recibe RUT y contraseña temporal, devuelve el Access Token (JWT).
*   **Recursos Humanos (Protegido solo para `is_hr=True`):**
    *   `POST /api/hr/users/`: Endpoint para crear un nuevo `CustomUser` y generar su contraseña temporal.
    *   `GET /api/hr/users/`: Lista los usuarios creados para el panel de gestión.