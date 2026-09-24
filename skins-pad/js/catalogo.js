/**
 * Skins PAD — filtros del catálogo.
 *
 * Importante: este script NO trae productos de ningun lado, todos los
 * productos ya estan escritos en el html (los genera python al armar la
 * pagina). Lo unico que hace este archivo es esconder con d-none las
 * tarjetas que no cumplen el filtro, y reordenar las que quedan visibles.
 * Es como un filtro "del lado del cliente", no hay ninguna consulta a un
 * servidor de por medio.
 */
(function () {
  "use strict";

  const lista = document.querySelector("[data-lista-productos]");
  if (!lista) return; // si la pagina no tiene catalogo (ej. contacto.html) no hago nada

  const items = Array.from(lista.querySelectorAll("[data-producto]"));
  const form = document.querySelector("[data-form-filtros]");
  const contador = document.querySelector("[data-contador-resultados]");
  const vacio = document.querySelector("[data-sin-resultados]");
  const buscar = document.getElementById("buscar-catalogo");
  const orden = document.getElementById("orden-catalogo");

  // toLowerCase() en los dos lados para que de lo mismo buscar "ak-47" que
  // "AK-47", sino la busqueda seria sensible a mayusculas y quedaria feo
  function coincideTexto(item, texto) {
    if (!texto) return true;
    return item.dataset.nombre.toLowerCase().includes(texto.toLowerCase());
  }

  // devuelve un arreglo con los value de los checkbox marcados de un mismo
  // name, por ejemplo todos los "tipo" que el usuario tiene tildados
  function valoresMarcados(nombre) {
    const marcados = form.querySelectorAll(`input[name="${nombre}"]:checked`);
    return Array.from(marcados).map((c) => c.value);
  }

  // Esta es la funcion principal. Recorre TODAS las tarjetas (items) y por
  // cada una decide si se muestra o no, juntando todas las condiciones con
  // "&&" (todas tienen que cumplirse). Si algun filtro esta vacio (por
  // ejemplo no hay ningun tipo marcado) entonces ese filtro no descarta
  // nada, por eso el "tipos.length === 0 ||".
  function aplicarFiltros() {
    const tipos = valoresMarcados("tipo");
    const grados = valoresMarcados("grado");
    const soloStattrak = form.querySelector('[name="solo-stattrak"]')?.checked;
    const precioMax = Number(form.querySelector('[name="precio-max"]')?.value || 0);
    const texto = buscar ? buscar.value.trim() : "";

    let visibles = 0;
    items.forEach((item) => {
      const okTipo = tipos.length === 0 || tipos.includes(item.dataset.tipo);
      const okGrado = grados.length === 0 || grados.includes(item.dataset.grado);
      const okStattrak = !soloStattrak || item.dataset.stattrak === "1";
      const okPrecio = !precioMax || Number(item.dataset.precio) <= precioMax;
      const okTexto = coincideTexto(item, texto);
      const mostrar = okTipo && okGrado && okStattrak && okPrecio && okTexto;
      item.classList.toggle("d-none", !mostrar);
      if (mostrar) visibles++;
    });

    if (contador) contador.textContent = `${visibles} resultado${visibles === 1 ? "" : "s"}`;
    if (vacio) vacio.classList.toggle("d-none", visibles !== 0);
    ordenar();
  }

  // ordena solo las tarjetas que quedaron visibles despues del filtro.
  // uso appendChild al final para "mover" el elemento en el dom sin tener
  // que borrarlo y crearlo de nuevo, con eso el orden visual cambia solo.
  function ordenar() {
    if (!orden) return;
    const criterio = orden.value;
    const visibles = items.filter((i) => !i.classList.contains("d-none"));
    visibles.sort((a, b) => {
      if (criterio === "precio-asc") return Number(a.dataset.precio) - Number(b.dataset.precio);
      if (criterio === "precio-desc") return Number(b.dataset.precio) - Number(a.dataset.precio);
      if (criterio === "nombre") return a.dataset.nombre.localeCompare(b.dataset.nombre, "es");
      return Number(a.dataset.orden) - Number(b.dataset.orden);
    });
    visibles.forEach((i) => lista.appendChild(i));
  }

  if (form) form.addEventListener("change", aplicarFiltros);
  if (buscar) buscar.addEventListener("input", aplicarFiltros);
  if (orden) orden.addEventListener("change", ordenar);

  const limpiar = document.querySelector("[data-limpiar-filtros]");
  if (limpiar) {
    limpiar.addEventListener("click", () => {
      form.reset();
      if (buscar) buscar.value = "";
      aplicarFiltros();
    });
  }

  // esto es para cuando llegas al catalogo desde otra pagina con un link
  // tipo catalogo.html?tipo=rifle (como el que puse en la home en la
  // grilla de categorias). URLSearchParams lee lo que viene despues del
  // "?" en la url sin que yo tenga que hacer el parsing a mano.
  const params = new URLSearchParams(window.location.search);
  if (params.get("q") && buscar) buscar.value = params.get("q");
  if (params.get("tipo")) {
    const casilla = form.querySelector(`input[name="tipo"][value="${params.get("tipo")}"]`);
    if (casilla) casilla.checked = true;
  }

  aplicarFiltros();
})();
