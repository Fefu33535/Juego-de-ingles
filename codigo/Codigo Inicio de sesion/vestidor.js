/**
 * ==============================================================================
 * CENTRALIZADOR DE RUTAS DE IMÁGENES DEL VESTIDOR
 * ==============================================================================
 */
const imagenesVestidor = {
    fondo: "ImgVestidor/FondoVestidor.jpg",
    armario: "ImgVestidor/Armario.png",
    
    prendas: {
        sombreroBase: "ImgVestidor/SombreroBase.png",
        chaquetaBase: "ImgVestidor/ChaquetaBase.png",
        pantalonBase: "ImgVestidor/PantalonBase.png",
        botasBase: "ImgVestidor/BotasBase.png",
        cowShoes: "ImgVestidor/CowShoes.png"
    },

    personajes: {
        base: "ImgVestidor/PersonajeBase.png",
        cowShoes: "ImgVestidor/PersonajeCowShoes.png" 
    },

    botones: {
        guardar: "ImgVestidor/BotonGuardar.png",
        resetear: "ImgVestidor/BotonResetear.png",
        salir: "ImgVestidor/BotonSalir.png"
    }
};

/**
 * ==============================================================================
 * SISTEMA DE PERSISTENCIA Y ESTADOS
 * ==============================================================================
 */
const CLAVE_STORAGE_COMPRAS = "criminal_logic_compras";
const CLAVE_STORAGE_EQUIPADO = "criminal_logic_equipado";

let vestuarioActual = {
    sombrero: "sombreroBase",
    abrigo: "chaquetaBase",
    pantalon: "pantalonBase",
    calzado: "botasBase"
};

document.addEventListener("DOMContentLoaded", () => {
    inicializarRecursosVestidor();
    verificarComprasTienda();
    cargarVestuarioGuardado();
    vincularNavegacionVestidor();
});

function inicializarRecursosVestidor() {
    const fondoEl = document.getElementById("vestidor-fondo");
    if (fondoEl && imagenesVestidor.fondo) {
        fondoEl.style.backgroundImage = `url('${imagenesVestidor.fondo}')`;
    }

    const armarioImgEl = document.getElementById("img-armario");
    if (armarioImgEl && imagenesVestidor.armario) {
        armarioImgEl.src = imagenesVestidor.armario;
    }

    document.querySelectorAll("img[data-item]").forEach(img => {
        const idItem = img.getAttribute("data-item");
        if (imagenesVestidor.prendas[idItem]) {
            img.src = imagenesVestidor.prendas[idItem];
        }
    });

    document.querySelectorAll("img[data-img]").forEach(img => {
        const tipo = img.getAttribute("data-img");
        if (imagenesVestidor.botones[tipo]) {
            img.src = imagenesVestidor.botones[tipo];
        }
    });

    actualizarImagenPersonaje();
}

function verificarComprasTienda() {
    let compras = localStorage.getItem(CLAVE_STORAGE_COMPRAS);
    let articulosComprados = compras ? JSON.parse(compras) : [];

    const slotCowShoes = document.getElementById("slot-cowShoes");
    if (slotCowShoes) {
        if (articulosComprados.includes("cowShoes")) {
            slotCowShoes.classList.add("desbloqueado");
        } else {
            slotCowShoes.classList.remove("desbloqueado");
        }
    }
}

function interactuarPrenda(idPrenda, categoria) {
    const slot = document.querySelector(`.item-slot[data-id="${idPrenda}"]`);
    if (!slot || !slot.classList.contains("desbloqueado")) return;

    let prendaBase = "botasBase";
    if (categoria === "sombrero") prendaBase = "sombreroBase";
    if (categoria === "abrigo") prendaBase = "chaquetaBase";
    if (categoria === "pantalon") prendaBase = "pantalonBase";

    if (vestuarioActual[categoria] === idPrenda && idPrenda !== prendaBase) {
        vestuarioActual[categoria] = prendaBase;
    } else {
        vestuarioActual[categoria] = idPrenda;
    }

    actualizarInterfazSeleccion(categoria);
    actualizarImagenPersonaje();
}

function actualizarInterfazSeleccion(categoria) {
    document.querySelectorAll(`.item-slot[data-categoria="${categoria}"]`).forEach(s => {
        s.classList.remove("seleccionado");
    });

    const prendaActiva = vestuarioActual[categoria];
    const slotActivo = document.querySelector(`.item-slot[data-id="${prendaActiva}"]`);
    if (slotActivo) {
        slotActivo.classList.add("seleccionado");
    }
}

function actualizarImagenPersonaje() {
    const pjEl = document.getElementById("img-personaje");
    if (!pjEl) return;

    if (vestuarioActual.calzado === "cowShoes") {
        pjEl.src = imagenesVestidor.personajes.cowShoes;
    } else {
        pjEl.src = imagenesVestidor.personajes.base;
    }
}

function guardarVestimenta() {
    localStorage.setItem(CLAVE_STORAGE_EQUIPADO, JSON.stringify(vestuarioActual));
    mostrarNotificacion("GUARDADO CORRECTAMENTE");
}

function cargarVestuarioGuardado() {
    let guardado = localStorage.getItem(CLAVE_STORAGE_EQUIPADO);
    if (guardado) {
        vestuarioActual = JSON.parse(guardado);

        Object.keys(vestuarioActual).forEach(categoria => {
            actualizarInterfazSeleccion(categoria);
        });

        actualizarImagenPersonaje();
    }
}

function resetearVestimenta() {
    vestuarioActual = {
        sombrero: "sombreroBase",
        abrigo: "chaquetaBase",
        pantalon: "pantalonBase",
        calzado: "botasBase"
    };

    Object.keys(vestuarioActual).forEach(categoria => {
        actualizarInterfazSeleccion(categoria);
    });

    actualizarImagenPersonaje();
    localStorage.removeItem(CLAVE_STORAGE_EQUIPADO);
}

function mostrarNotificacion(texto) {
    const toast = document.getElementById("toast-notificacion");
    if (!toast) return;

    toast.textContent = texto;
    toast.classList.add("toast-visible");
    setTimeout(() => {
        toast.classList.remove("toast-visible");
    }, 2500);
}

function vincularNavegacionVestidor() {
    const btnSalir = document.getElementById("btn-salir");
    if (btnSalir) {
        btnSalir.addEventListener("click", () => {
            window.location.href = "menu.html"; 
        });
    }
}