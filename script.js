const themeToggle = document.getElementById('themeToggle');
const ventaForm = document.getElementById('ventaForm');
const usuarioInput = document.getElementById('usuario');
const productoInput = document.getElementById('producto');
const detalleInput = document.getElementById('detalle');
const precioInput = document.getElementById('precio');
const btnRegistrar = document.getElementById('btnRegistrar');

const errorUsuario = document.getElementById('errorUsuario');
const errorProducto = document.getElementById('errorProducto');
const errorDetalle = document.getElementById('errorDetalle');
const errorPrecio = document.getElementById('errorPrecio');

const PALABRAS_PROHIBIDAS = ['mierda', 'puta', 'puto', 'pendejo', 'imbecil', 'estupido', 'cabron'];
const REGEX_BASURA = /(.)\1{3,}|(?:asd|dsa|qwe|ewq|zxc|cxz|asdf|fdsa|zxcv){2,}|[bcdfghjklmnpqrstvwxyz]{5,}/i;

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

function logEvent(tipo, mensaje) {
    const hora = new Date().toLocaleTimeString();
    const item = document.createElement('div');
    item.innerHTML = `[${hora}] <b>${tipo}</b>: ${mensaje}`;
    document.getElementById('logOutput').prepend(item);
}

function esTextoBasura(texto) {
    const textoNorm = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const contieneGroseria = PALABRAS_PROHIBIDAS.some(p => textoNorm.includes(p));
    const esPatronBasura = REGEX_BASURA.test(textoNorm);
    return contieneGroseria || esPatronBasura;
}

function validarUsuario() {
    const val = usuarioInput.value.trim();
    if (!val) {
        errorUsuario.textContent = 'Campo requerido';
        return false;
    }
    if (!val.startsWith('@')) {
        errorUsuario.textContent = "Debe iniciar con '@'";
        return false;
    }
    errorUsuario.textContent = '';
    return true;
}

function validarProducto() {
    const val = productoInput.value.trim();
    if (!val) {
        errorProducto.textContent = 'Campo requerido';
        return false;
    }
    if (esTextoBasura(val)) {
        errorProducto.textContent = 'Texto inválido o sin sentido';
        return false;
    }
    errorProducto.textContent = '';
    return true;
}

function validarDetalle() {
    const val = detalleInput.value.trim();
    if (!val) {
        errorDetalle.textContent = 'Campo requerido';
        return false;
    }
    if (esTextoBasura(val)) {
        errorDetalle.textContent = 'Texto inválido o sin sentido';
        return false;
    }
    errorDetalle.textContent = '';
    return true;
}

function validarPrecio() {
    const val = precioInput.value.trim();
    if (!val) {
        errorPrecio.textContent = 'Campo requerido';
        return false;
    }
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
        errorPrecio.textContent = 'Debe ser mayor a 0';
        return false;
    }
    errorPrecio.textContent = '';
    return true;
}

function verificarEstadoBoton() {
    const u = usuarioInput.value.trim();
    const pr = productoInput.value.trim();
    const d = detalleInput.value.trim();
    const p = precioInput.value.trim();

    const uValido = u && u.startsWith('@');
    const prValido = pr && !esTextoBasura(pr);
    const dValido = d && !esTextoBasura(d);
    const numP = parseFloat(p);
    const pValido = p && !isNaN(numP) && numP > 0;

    btnRegistrar.disabled = !(uValido && prValido && dValido && pValido);
}

usuarioInput.addEventListener('input', () => {
    validarUsuario();
    verificarEstadoBoton();
});

productoInput.addEventListener('input', () => {
    validarProducto();
    verificarEstadoBoton();
});

detalleInput.addEventListener('input', () => {
    validarDetalle();
    verificarEstadoBoton();
});

precioInput.addEventListener('input', () => {
    validarPrecio();
    verificarEstadoBoton();
});

ventaForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const uOk = validarUsuario();
    const prOk = validarProducto();
    const dOk = validarDetalle();
    const pOk = validarPrecio();
    verificarEstadoBoton();

    if (!uOk || !prOk || !dOk || !pOk) {
        return;
    }

    const usuario = usuarioInput.value.trim();
    const producto = productoInput.value.trim();
    const detalle = detalleInput.value.trim();
    const precio = precioInput.value.trim();

    logEvent('NUEVA VENTA', `Usuario ${usuario} compró ${producto} por ${precio} Bs.`);
    logEvent('DETALLE', detalle);

    ventaForm.reset();
    errorUsuario.textContent = '';
    errorProducto.textContent = '';
    errorDetalle.textContent = '';
    errorPrecio.textContent = '';
    btnRegistrar.disabled = true;
});

document.addEventListener('DOMContentLoaded', () => {
    btnRegistrar.disabled = true;
});