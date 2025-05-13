function mostrarMensaje() {
    const mensaje = document.getElementById("mensaje");
    mensaje.textContent = "¡Hola! Has hecho clic en el botón.";
    mensaje.style.color = "green";
}

function hacerPedido() {
    const numero = "56957361278"; // Reemplaza con tu número de WhatsApp
    const mensaje = encodeURIComponent("¡Hola! Quiero hacer un pedido.");
    const url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, "_blank");
}

const productos = [
    { id: 1, nombre: "Lana Verde Petroleo", imagen: "lana-verde-petroleo.jpg", precio: 1000 },
    { id: 11, nombre: "Lana Verde Pistacho", imagen: "lana-verde-pistacho.jpg", precio: 1000 },
    { id: 21, nombre: "Lana Gris", imagen: "lana-gris.jpg", precio: 1000 },
    { id: 31, nombre: "Lana Calipso", imagen: "lana-calipso.jpg", precio: 1000 },
    { id: 41, nombre: "Lana Verde", imagen: "lana-verde.jpg", precio: 1000 },
    { id: 51, nombre: "Lana Blanca", imagen: "lana-blanca.jpg", precio: 1000 },
    { id: 60, nombre: "Lana Roja", imagen: "lana-roja.jpg", precio: 1000 },
    { id: 70, nombre: "Lana Morada", imagen: "lana-morada.jpg", precio: 1000 },
    { id: 80, nombre: "Lana Naranja", imagen: "lana-naranja.jpg", precio: 1000 },
    { id: 90, nombre: "Lana Rosada", imagen: "lana-rosada.jpg", precio: 1000 }
];

let carrito = [];

function mostrarMensaje() {
    const mensaje = document.getElementById("mensaje");
    mensaje.textContent = "¡Hola! Has hecho clic en el botón.";
    mensaje.style.color = "green";
}

function hacerPedido() {
    const numero = "521234567890"; // Cambia por tu número de WhatsApp
    const mensaje = encodeURIComponent("¡Hola! Quiero hacer un pedido.");
    const url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, "_blank");
}

function agregarAlCarrito(producto) {
    const item = carrito.find((p) => p.id === producto.id);
    if (item) {
        item.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarrito();
}

function actualizarCarrito() {
    const carritoDiv = document.getElementById("carrito");
    carritoDiv.innerHTML = "";
    carrito.forEach((producto) => {
        carritoDiv.innerHTML += `
            <div class="carrito-item">
                ${producto.nombre} - Cantidad: ${producto.cantidad} - Total: $${producto.cantidad * producto.precio}
            </div>
        `;
    });
}

function cargarCatalogo() {
    const catalogo = document.getElementById("catalogo");
    productos.forEach((producto) => {
        catalogo.innerHTML += `
            <div class="producto">
                <img src="images/${producto.imagen}" alt="${producto.nombre}">
                <h4>${producto.nombre}</h4>
                <p>Precio: $${producto.precio}</p>
                <button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Agregar al carrito</button>
            </div>
        `;
    });
}

cargarCatalogo();
