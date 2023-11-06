# API Rest Hexagonal

Este proyecto implementa una API REST siguiendo los principios de la arquitectura hexagonal. Está diseñado para gestionar usuarios y estudiantes, proporcionando una clara separación entre la lógica central de la aplicación y los adaptadores que interactúan con elementos externos como la web y la base de datos.

## Características

- Autenticación y autorización de usuarios con JWT.
- Operaciones CRUD para entidades de estudiantes.
- Funcionalidad de carga de imágenes para perfiles de usuario.
- Middleware para control de acceso basado en roles.
- Integración de base de datos MySQL con pooling de conexiones.
- Configuración de pruebas unitarias con Jest.

## Primeros Pasos

Para poner en marcha el proyecto en tu máquina local para fines de desarrollo y pruebas, sigue estos pasos:

1. Clona el repositorio.
2. Instala las dependencias con `npm install`.
3. Configura tus variables de entorno, incluyendo `JWT_SECRET`.
4. Inicia el servidor con `npm start`.

## Pruebas

El proyecto utiliza Jest para las pruebas unitarias. Para ejecutar las pruebas, utiliza los siguientes comandos:

- Para ejecutar todas las pruebas: `npm test`
- Para ejecutar una prueba específica: `npm test <nombre-del-archivo-de-prueba>`

## Endpoints

La API proporciona los siguientes endpoints:

### Endpoints de Usuarios

- `POST /users/login`: Autenticar un usuario y devolver un JWT.
- `POST /users/register`: Registrar un nuevo usuario con carga de imagen opcional.
- `POST /users/update-image/:username`: Actualizar la imagen de perfil del usuario.

### Endpoints de Estudiantes

- `GET /students`: Recuperar todos los estudiantes.
- `GET /students/:id`: Recuperar un estudiante por ID.
- `POST /students`: Crear un nuevo estudiante (solo Admin).
- `PUT /students/:id`: Actualizar los detalles de un estudiante (solo Admin).
- `DELETE /students/:id`: Eliminar un estudiante (solo Admin).

## Configuración del Entorno

La aplicación requiere la siguiente configuración de entorno:

```javascript
export default {
  dbConfig: {
    host: 'localhost',
    user: 'root',
    password: 'tucontraseña',
    database: 'nodedb',
    port: 3306 
  }
}
```

Reemplaza los valores con la configuración de tu base de datos.


## Licencia

Este proyecto está licenciado bajo la Licencia MIT 

## Autor
- Miguel Angel Ramos


