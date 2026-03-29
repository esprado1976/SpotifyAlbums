// --- CONFIGURACIÓN ---
const CLIENT_ID = 'TU CLIENTE ID AQUÍ'; 
const CLIENT_SECRET = 'TU SECRETO AQUÍ';
// Dejá esta vacía por un segundo, la llenamos ahora
const REDIRECT_URI = 'https://script.google.com/macros/s/EL_ID_DE_LA_APP_AQUÍ/exec'; 

function obtenerLink() {
  const scope = 'user-library-read';
  const url = 'https://accounts.spotify.com/authorize' +
    '?client_id=' + CLIENT_ID +
    '&response_type=code' +
    '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
    '&scope=' + encodeURIComponent(scope) +
    '&show_dialog=true';
  console.log('1. COPIÁ ESTE LINK:', url);
}

function doGet(e) {
  const code = e.parameter.code;
  if (code) {
    const data = canjearToken(code);
    PropertiesService.getUserProperties().setProperty('SPOTIFY_TOKEN', data.access_token);
    return HtmlService.createHtmlOutput('<h1>¡ÉXITO TOTAL!</h1><p>Ya podés cerrar esto.</p>');
  }
  return HtmlService.createHtmlOutput('<h1>Error de conexión</h1>');
}

function canjearToken(code) {
  const payload = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': REDIRECT_URI
  };
  const response = UrlFetchApp.fetch('https://accounts.spotify.com/api/token', {
    'method': 'post',
    'payload': payload
  });
  return JSON.parse(response.getContentText());
}

/**
 * Esta función trae tus álbumes guardados y los vuelca en la hoja activa
 */
function volcarMisAlbumes() {
  const token = PropertiesService.getUserProperties().getProperty('SPOTIFY_TOKEN');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  if (!token) {
    throw new Error("No hay token. Ejecutá el logueo de nuevo.");
  }

  // Pedimos los últimos 50 álbumes guardados
  const url = 'https://api.spotify.com/v1/me/albums?limit=50';
  const options = {
    'headers': { 'Authorization': 'Bearer ' + token },
    'muteHttpExceptions': true
  };

  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());

  if (data.items) {
    // Limpiamos la hoja y ponemos encabezados
    sheet.clear();
    sheet.appendRow(['Artista', 'Álbum', 'Fecha de Lanzamiento', 'Total Canciones']);

    data.items.forEach(item => {
      const album = item.album;
      sheet.appendRow([
        album.artists[0].name,
        album.name,
        album.release_date,
        album.total_tracks
      ]);
    });
    
    SpreadsheetApp.getUi().alert('¡Lista actualizada con éxito!');
  } else {
    Logger.log(response.getContentText());
  }
}

/**
 * Esta versión usa un bucle para recorrer TODA tu biblioteca
 */
function volcarTodosMisAlbumes() {
  const token = PropertiesService.getUserProperties().getProperty('SPOTIFY_TOKEN');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  if (!token) throw new Error("Falta token.");

  sheet.clear();
  sheet.appendRow(['Artista', 'Álbum', 'Fecha de Lanzamiento', 'Total Canciones']);

  let offset = 0;
  const limit = 50; // Es el máximo que permite Spotify por pedido
  let hayMas = true;

  while (hayMas) {
    const url = `https://api.spotify.com/v1/me/albums?limit=${limit}&offset=${offset}`;
    const options = {
      'headers': { 'Authorization': 'Bearer ' + token },
      'muteHttpExceptions': true
    };

    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());

    if (data.items && data.items.length > 0) {
      const filas = data.items.map(item => [
        item.album.artists[0].name,
        item.album.name,
        item.album.release_date,
        item.album.total_tracks
      ]);
      
      // Pegamos el bloque de 50 filas
      sheet.getRange(sheet.getLastRow() + 1, 1, filas.length, 4).setValues(filas);
      
      offset += limit; // Movemos el puntero para los próximos 50
      
      // Si el total que tiene Spotify es menor al próximo offset, paramos
      if (offset >= data.total) {
        hayMas = false;
      }
    } else {
      hayMas = false;
    }
    
    // Un pequeño respiro para no saturar la API
    Utilities.sleep(100); 
  }
  
  SpreadsheetApp.getUi().alert('¡Biblioteca completa descargada!');
}
