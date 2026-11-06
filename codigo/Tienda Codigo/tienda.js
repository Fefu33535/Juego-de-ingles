/**
 * ==============================================================================
 * CENTRALIZADOR DE RUTAS DE IMÁGENES
 * ==============================================================================
 */
const imagenesTienda = {
    fondo: "ImgTienda/FondoTienda.jpg",

    articulos: {
        zapatosPayaso: "ImgTienda/ZapatosPayaso.png",
        cowShoes: "ImgTienda/CowShoes.png",
        gorraHelices: "ImgTienda/GorraConHelices.png"
    },

    recompensas: {
        actividadExamen: "ImgTienda/Recompensa1.png",
        seleccionarTema: "ImgTienda/Recompensa2.png",
        puntoCalificacion: "ImgTienda/Recompensa3.png"
    },

    botones: {
        salir: "ImgTienda/BotonSalir.png",
        vestidor: "ImgTienda/BotonVestidor.png",
        comprar: "ImgTienda/BotonComprar.png",
        comprado: "ImgTienda/BotonComprado.png"
    },

    moneda: "ImgTienda/LupaPoint.png"
};

/**
 * ==============================================================================
 * SISTEMA DE DATOS Y PERSISTENCIA (PUNTOS Y COMPRAS)
 * ==============================================================================
 */
const CLAVE_STORAGE_PUNTOS = "criminal_logic_lupapoints";
const CLAVE_STORAGE_COMPRAS = "criminal_logic_compras";

function obtenerPuntosJugador() {
    let puntos = localStorage.getItem(CLAVE_STORAGE_PUNTOS);
    if (puntos === null) {
        puntos = 1200; 
        localStorage.setItem(CLAVE_STORAGE_PUNTOS, puntos);
    }
    return parseInt(puntos, 10);
}

function guardarPuntosJugador(nuevoSaldo) {
    localStorage.setItem(CLAVE_STORAGE_PUNTOS, nuevoSaldo);
    actualizarVistaSaldo();
}

function obtenerArticulosComprados() {
    let compras = localStorage.getItem(CLAVE_STORAGE_COMPRAS);
    return compras ? JSON.parse(compras) : [];
}

function registrarCompraArticulo(idArticulo) {
    let compras = obtenerArticulosComprados();
    if (!compras.includes(idArticulo)) {
        compras.push(idArticulo);
        localStorage.setItem(CLAVE_STORAGE_COMPRAS, JSON.stringify(compras));
    }
}

/**
 * ==============================================================================
 * INICIALIZACIÓN Y CARGA DINÁMICA DE IMÁGENES
 * ==============================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
    inicializarImagenes();
    actualizarVistaSaldo();
    sincronizarEstadoBotonesCompra();
    vincularNavegacion();
});

function inicializarImagenes() {
    const fondoEl = document.getElementById("tienda-fondo");
    if (fondoEl && imagenesTienda.fondo) {
        fondoEl.style.backgroundImage = `url('${imagenesTienda.fondo}')`;
    }

    document.querySelectorAll("img[data-img]").forEach(img => {
        const clave = img.getAttribute("data-img");
        let ruta = "";

        if (imagenesTienda.articulos[clave]) {
            ruta = imagenesTienda.articulos[clave];
        } else if (imagenesTienda.recompensas[clave]) {
            ruta = imagenesTienda.recompensas[clave];
        } else if (imagenesTienda.botones[clave]) {
            ruta = imagenesTienda.botones[clave];
        } else if (clave === "moneda") {
            ruta = imagenesTienda.moneda;
        }

        if (ruta) {
            img.src = ruta;
            img.onerror = function() {
                this.style.display = "none";
            };
        } else {
            img.style.display = "none";
        }
    });
}

function actualizarVistaSaldo() {
    const saldoEl = document.getElementById("saldo-lupapoints");
    if (saldoEl) {
        saldoEl.textContent = obtenerPuntosJugador();
    }
}

/**
 * ==============================================================================
 * LÓGICA DE COMPRA
 * ==============================================================================
 */
function comprarArticulo(idArticulo) {
    const comprasRealizadas = obtenerArticulosComprados();

    if (comprasRealizadas.includes(idArticulo)) return;

    const tarjeta = document.querySelector(`.card-producto[data-id="${idArticulo}"]`);
    if (!tarjeta) return;

    const precio = parseInt(tarjeta.getAttribute("data-precio"), 10);
    const saldoActual = obtenerPuntosJugador();

    if (saldoActual >= precio) {
        guardarPuntosJugador(saldoActual - precio);
        registrarCompraArticulo(idArticulo);
        marcarArticuloComoComprado(tarjeta);
    } else {
        mostrarNotificacionInsuficiente();
    }
}

function marcarArticuloComoComprado(tarjeta) {
    const boton = tarjeta.querySelector(".btn-comprar");
    if (boton) {
        boton.classList.add("btn-comprado");
        boton.innerHTML = `<span class="btn-comprar-texto">COMPRADO</span>`;
        boton.removeAttribute("onclick");
    }
}

function sincronizarEstadoBotonesCompra() {
    const comprasRealizadas = obtenerArticulosComprados();
    comprasRealizadas.forEach(idArticulo => {
        const tarjeta = document.querySelector(`.card-producto[data-id="${idArticulo}"]`);
        if (tarjeta) {
            marcarArticuloComoComprado(tarjeta);
        }
    });
}

function mostrarNotificacionInsuficiente() {
    const toast = document.getElementById("toast-notificacion");
    if (!toast) return;

    toast.classList.add("toast-visible");
    setTimeout(() => {
        toast.classList.remove("toast-visible");
    }, 2500);
}

/**
 * ==============================================================================
 * NAVEGACIÓN
 * ==============================================================================
 */
function vincularNavegacion() {
    const btnSalir = document.getElementById("btn-salir");
    if (btnSalir) {
        btnSalir.addEventListener("click", () => {
            window.location.href = "menu.html"; 
        });
    }

    const btnVestidor = document.getElementById("btn-vestidor");
    if (btnVestidor) {
        btnVestidor.addEventListener("click", () => {
            window.location.href = "vestidor.html"; 
        });
    }
}