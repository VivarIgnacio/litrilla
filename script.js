const spreadsheetId = "16XFGaeaCx2rkj567cbDbPZXqfFVyLYXUnYuoB1Jcto8";
const apiKey = "AIzaSyBegma_x4gH7OQWWw8KWhaIp0Oiba0UBSI";  // Clave API de Google Sheets

// Scroll suave para el menú
document.querySelectorAll('.menu-items a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Mensaje de clic
function mostrarMensaje() {
    const mensaje = document.getElementById("mensaje");
    mensaje.textContent = "¡Hola! Has hecho clic en el botón.";
    mensaje.style.color = "green";
}


// Productos con nombre e imagen fijos (sin precio inicial)
let productos = [
    { id: 1, nombre: "Lana Verde Petroleo", imagen: "lana-verde-petroleo.jpg" },
    { id: 11, nombre: "Lana Verde Pistacho", imagen: "lana-verde-pistacho.jpg" },
    { id: 21, nombre: "Lana Gris", imagen: "lana-gris.jpg" },
    { id: 31, nombre: "Lana Calipso", imagen: "lana-calipso.jpg" },
    { id: 41, nombre: "Lana Verde", imagen: "lana-verde.jpg" },
    { id: 51, nombre: "Lana Blanca", imagen: "lana-blanca.jpg" },
    { id: 60, nombre: "Lana Roja", imagen: "lana-roja.jpg" },
    { id: 70, nombre: "Lana Morada", imagen: "lana-morada.jpg" },
    { id: 80, nombre: "Lana Naranja", imagen: "lana-naranja.jpg" },
    { id: 90, nombre: "Lana Rosada", imagen: "lana-rosada.jpg" }
];

let carrito = [];

// Guardar el stock y precio en Local Storage
function guardarStockLocal() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Cargar el stock desde Local Storage
function cargarStockLocal() {
    const almacenados = localStorage.getItem("productos");
    if (almacenados) {
        productos = JSON.parse(almacenados);
    }
}

// Hacer pedido por WhatsApp
function hacerPedido() {
    const numero = "56957361278";
    const mensaje = encodeURIComponent(generarMensajePedido());
    const url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, "_blank");
}

// Generar el mensaje de pedido para WhatsApp
function generarMensajePedido() {
    let mensaje = "¡Hola! Quiero hacer un pedido:\n";
    carrito.forEach((producto) => {
        mensaje += `- ${producto.nombre} x ${producto.cantidad} (Total: $${producto.cantidad * producto.precio})\n`;
    });
    return mensaje;
}

// Obtener el stock y precio inicial desde Google Sheets
async function obtenerDatosSheet() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Detalle!J2:K?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error("Error al obtener los datos desde Sheets:", error);
        return [];
    }
}

// Actualizar el stock y precio visual
function actualizarStockVisual(producto) {
    const stockElement = document.getElementById(`stock-${producto.id}`);
    const precioElement = document.getElementById(`precio-${producto.id}`);
    if (producto.stock > 0) {
        stockElement.textContent = `Stock: ${producto.stock}`;
        stockElement.style.color = "black";
    } else {
        stockElement.textContent = "Sin stock";
        stockElement.style.color = "red";
    }
    precioElement.textContent = `Precio: $${producto.precio}`;
}

// Cargar el stock y precio desde Google Sheets
async function cargarDatosDesdeSheets() {
    const datos = await obtenerDatosSheet();
    if (!datos) return;

    datos.forEach(async (fila, index) => {
        const [detalle, stock] = fila;
        const urlPrecio = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Detalle!F${index + 2}?key=${apiKey}`;
        try {
            const response = await fetch(urlPrecio);
            const data = await response.json();
            const precio = parseInt(data.values[0][0].replace(/[^0-9]/g, "")) || 0;

            const producto = productos.find((p) => p.nombre.trim().toLowerCase() === detalle.trim().toLowerCase());
            if (producto) {
                producto.stock = parseInt(stock) || 0;
                if (!producto.precio) {
                    producto.precio = precio;
                }
                actualizarStockVisual(producto);
            }
        } catch (error) {
            console.error("Error al obtener el precio desde Sheets:", error);
        }
    });

    guardarStockLocal();
}

// Agregar al carrito y actualizar stock
function agregarAlCarrito(producto) {
    const item = carrito.find((p) => p.id === producto.id);

    if (producto.stock > 0) {
        if (item) {
            item.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        producto.stock--;
        actualizarStockVisual(producto);
        actualizarCarrito();
        guardarStockLocal();
    } else {
        alert("¡Stock agotado!");
    }
}

// Eliminar del carrito y devolver stock
function eliminarDelCarrito(producto) {
    const item = carrito.find((p) => p.id === producto.id);

    if (item && item.cantidad > 0) {
        item.cantidad--;
        producto.stock++;

        if (item.cantidad === 0) {
            carrito = carrito.filter((p) => p.id !== producto.id);
        }

        actualizarStockVisual(producto);
        actualizarCarrito();
        guardarStockLocal();
    }
}

// Actualizar el carrito visualmente
function actualizarCarrito() {
    const carritoDiv = document.getElementById("carrito");
    carritoDiv.innerHTML = "";
    carrito.forEach((producto) => {
        carritoDiv.innerHTML += `
            <div class="carrito-item">
                ${producto.nombre} - 
                <button onclick='eliminarDelCarrito(${JSON.stringify(producto)})'>-</button>
                Cantidad: ${producto.cantidad} 
                <button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>+</button> 
                - Total: $${producto.cantidad * producto.precio}
            </div>
        `;
    });
}

// Cargar el catálogo visualmente
function cargarCatalogo() {
    const catalogo = document.getElementById("catalogo");
    catalogo.innerHTML = "";
    productos.forEach((producto) => {
        catalogo.innerHTML += `
            <div class="producto">
                <img src="images/${producto.imagen}" alt="${producto.nombre}">
                <h4>${producto.nombre}</h4>
                <p id="precio-${producto.id}">Precio: Cargando...</p>
                <p id="stock-${producto.id}">Stock: Cargando...</p>
                <button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Agregar al carrito</button>
            </div>
        `;
    });
}

cargarStockLocal();
cargarCatalogo();
cargarDatosDesdeSheets();
function generarBotonPago(total) {
    return `
        <button onclick='pagar(${total})'>Pagar con Webpay</button>
    `;
}

// Iniciar el proceso de pago
async function pagar(total) {
    try {
        const response = await fetch("/pagar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: total, buyOrder: "ORD123" })
        });
        const data = await response.json();
        if (data.url && data.token) {
            window.location.href = `${data.url}?token_ws=${data.token}`;
        } else {
            alert("Error al iniciar el pago");
        }
    } catch (error) {
        console.error("Error al realizar el pago:", error);
    }
}

// Actualizar el carrito para incluir el botón de pago
function actualizarCarrito() {
    const carritoDiv = document.getElementById("carrito");
    carritoDiv.innerHTML = "";
    let total = 0;
    carrito.forEach((producto) => {
        const subtotal = producto.cantidad * producto.precio;
        total += subtotal;
        carritoDiv.innerHTML += `
            <div class="carrito-item">
                ${producto.nombre} - 
                <button onclick='eliminarDelCarrito(${JSON.stringify(producto)})'>-</button>
                Cantidad: ${producto.cantidad} 
                <button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>+</button> 
                - Total: $${subtotal}
            </div>
        `;
    });
    carritoDiv.innerHTML += `<div>Total: $${total}</div>`;
    carritoDiv.innerHTML += generarBotonPago(total);
}
