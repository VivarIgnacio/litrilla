// Importación de módulos
const express = require("express");
const bodyParser = require("body-parser");
const { WebpayPlus, Options, Environment } = require("transbank-sdk");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Configuración de Webpay Plus
const webpay = new WebpayPlus.Transaction(new Options(
    process.env.COMMERCE_CODE,      // Código de Comercio
    process.env.API_KEY,            // API Key
    Environment.Integration         // Ambiente de integración
));

// Middleware
app.use(express.static("public"));  // Archivos frontend
app.use(bodyParser.json());

// Ruta para iniciar el pago
app.post("/pagar", async (req, res) => {
    const { amount, buyOrder } = req.body;
    const returnUrl = `http://localhost:${PORT}/confirmar`;

    try {
        // Crear transacción en Webpay
        const response = await webpay.create(buyOrder, "session12345", amount, returnUrl);
        res.json({ url: response.url, token: response.token });
    } catch (error) {
        console.error("Error al iniciar la transacción:", error);
        res.status(500).json({ error: "Error al iniciar el pago" });
    }
});

// Ruta para confirmar el pago
app.post("/confirmar", async (req, res) => {
    const { token_ws } = req.body;

    try {
        // Confirmar la transacción con el token
        const response = await webpay.commit(token_ws);
        if (response.response_code === 0) {
            res.send("Pago realizado con éxito");
        } else {
            res.send("Pago rechazado");
        }
    } catch (error) {
        console.error("Error al confirmar la transacción:", error);
        res.status(500).send("Error al confirmar el pago");
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
