const { google } = require("googleapis");
const { readFile } = require("fs").promises;

// Cargar credenciales desde el archivo JSON
async function loadCredentials() {
    try {
        const content = await readFile("credentials.json");  // Cambia a la ruta de tu archivo
        return JSON.parse(content);
    } catch (err) {
        console.error("Error al cargar las credenciales:", err);
        return null;
    }
}

// Acceder a la hoja de cálculo
async function accessSpreadsheet() {
    const credentials = await loadCredentials();
    if (!credentials) return;

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "16XFGaeaCx2rkj567cbDbPZXqfFVyLYXUnYuoB1Jcto8";
    const range = "Detalle!A2:I152";

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        const rows = response.data.values;
        if (rows.length) {
            console.log("Datos obtenidos:");
            rows.forEach((row) => console.log(row));
        } else {
            console.log("No se encontraron datos.");
        }
    } catch (err) {
        console.error("Error al acceder a la hoja:", err.message);
    }
}

accessSpreadsheet();


