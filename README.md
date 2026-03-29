🚀 Spotify to Google Sheets: Tu Biblioteca en un Click
Este proyecto permite extraer toda tu biblioteca de álbumes guardados en Spotify y volcarla automáticamente en una hoja de Google Sheets. Ideal para melómanos, analistas de datos o curiosos que quieran tener su inventario musical bajo control.

🛠️ Requisitos Previos
Una cuenta de Spotify for Developers.

Una hoja de cálculo de Google.

🏁 Configuración Paso a Paso
1. En el Dashboard de Spotify
Entra a tu Dashboard y haz clic en Create App.

Ponle un nombre (ej: "Mis Datos de Spotify") y una descripción.

IMPORTANTE: En el campo Redirect URIs, agrega la siguiente URL temporalmente (luego la actualizaremos):
https://script.google.com/macros/s/SustituirDespues/exec

Guarda los cambios y copia tu Client ID y Client Secret.

2. En Google Sheets
Abre tu hoja de cálculo y ve a Extensiones > Apps Script.

Borra el código que aparezca y pega el contenido de Código.gs de este repositorio.

Pega tu Client ID y Client Secret en las variables al principio del archivo.

3. El "Apretón de Manos" (Autenticación)
Para que Google y Spotify se entiendan sin errores de "File not found":

Haz clic en Implementar > Nueva implementación.

Selecciona Aplicación web.

Ejecutar como: Yo.

Quién tiene acceso: Cualquiera.

Copia la URL de la aplicación web que termina en /exec.

Vuelve al Dashboard de Spotify, edita los Settings y reemplaza la Redirect URI por esta nueva URL de Google. Guarda los cambios.

En el script, pega esa misma URL en la variable REDIRECT_URI.

🚀 Cómo usarlo
En el editor de Apps Script, selecciona la función obtenerLink y dale a Ejecutar.

Abre el link que aparecerá en el registro (Log).

Logueate en Spotify y haz clic en Aceptar. Si ves el mensaje "¡ÉXITO TOTAL!", ya estás conectado.

Ahora selecciona la función volcarTodosMisAlbumes y dale a Ejecutar.

¡Mira cómo se llena tu hoja de cálculo!

📝 Notas del Autor
Este script fue creado por la necesidad de cruzar mi pasión por la música con la gestión de datos. Como líder en Customer Experience, creo firmemente que los datos deben ser accesibles y útiles.

Próximamente (V2):

Menú personalizado directamente en la Sheet.

Manejo de errores de token expirado.

Extracción de Playlists y Artistas seguidos.

📄 Licencia
Distribuido bajo la licencia MIT. ¡Siéntete libre de usarlo, mejorarlo y compartirlo!
