const { WebpayPlus, Options, Environment } = require("transbank-sdk");

const webpay = new WebpayPlus.Transaction(new Options(
    '597055555532',     // Código de comercio
    'Llave secreta',    // Llave privada
    Environment.Integration // Entorno de integración
));

async function iniciarTransaccion(amount, sessionId, buyOrder, returnUrl) {
    try {
        const response = await webpay.create(buyOrder, sessionId, amount, returnUrl);
        return response;
    } catch (error) {
        console.error("Error al iniciar la transacción:", error);
        throw error;
    }
}

async function confirmarTransaccion(token) {
    try {
        const response = await webpay.commit(token);
        return response;
    } catch (error) {
        console.error("Error al confirmar la transacción:", error);
        throw error;
    }
}

module.exports = { iniciarTransaccion, confirmarTransaccion };
