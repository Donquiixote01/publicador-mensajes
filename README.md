# Publicador de mensajes

Miniaplicación web que captura una publicación (título y contenido), valida los datos, los envía a
una API REST mediante `fetch` con el método `POST` y muestra la respuesta asíncrona en el DOM.

Trabajo práctico del curso de **Ingeniería Web** — JavaScript asíncrono, Fetch API y DOM.

## Tecnologías

| Tecnología | Uso                                                        |
| ---------- | ---------------------------------------------------------- |
| HTML5      | Estructura del formulario y contenedores de mensajes       |
| CSS3       | Presentación visual (archivo independiente)                |
| JavaScript | Eventos, validación, `fetch` asíncrono y actualización DOM |
| API REST   | `https://jsonplaceholder.typicode.com/posts`               |

## Estructura

```
publicador-mensajes/
├── index.html    # Formulario, áreas de mensaje y de resultado
├── styles.css    # Estilos
├── app.js        # Eventos, validación, petición POST y render
└── README.md
```

## Cómo ejecutar

Abrir `index.html` con la extensión **Live Server** de VS Code (clic derecho → *Open with Live
Server*), o directamente en el navegador.

## Flujo de la aplicación

1. `form.addEventListener('submit', handleSubmit)` captura el envío.
2. `event.preventDefault()` evita la recarga de la página.
3. `validate()` comprueba, con `trim()`, que ni el título ni el contenido estén vacíos.
4. `publishPost()` envía la petición `POST` con `Content-Type: application/json` y el cuerpo
   serializado con `JSON.stringify()`.
5. Se comprueba `response.ok` antes de dar la operación por satisfactoria y se interpreta el cuerpo
   con `response.json()`.
6. `renderResult()` muestra el ID, el título y el contenido devueltos usando `textContent`.
7. El bloque `finally` restablece el botón incluso si ocurre un error.

## Gestión de errores

| Tipo               | Cómo se detecta                      | Mensaje al usuario                    |
| ------------------ | ------------------------------------ | ------------------------------------- |
| Error de conexión  | `fetch` rechaza la promesa (`catch`) | No se pudo conectar con el servidor   |
| Error HTTP         | `!response.ok` (404, 500, …)         | El servidor respondió con el estado N |
| JSON inválido      | `response.json()` lanza error        | El cuerpo no es un JSON válido        |

## Nota sobre la persistencia

JSONPlaceholder es una API de prueba: responde `201` con un `id` simulado (normalmente `101`), pero
**no almacena** la publicación. Al consultar `GET /posts/101` el recurso no existe. Para una
persistencia real haría falta un backend propio con base de datos (por ejemplo Node + Express +
PostgreSQL) o un servicio como json-server, Supabase o Firebase.