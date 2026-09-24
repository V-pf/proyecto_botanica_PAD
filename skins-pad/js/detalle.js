/**
 * Skins PAD — página de detalle de producto.
 *
 * Lo unico medio "matematico" de este archivo es calcular en que
 * porcentaje de la barra va la marca del float. Como el float va de 0 a 1
 * y la barra es de 0% a 100%, simplemente hay que multiplicar por 100
 * (0.2461 de float = 24.61% de la barra). El resto es solo un contador de
 * cantidad con dos botones, +1 y -1.
 */
(function () {
  "use strict";
  const barra = document.querySelector("[data-barra-desgaste]");
  if (!barra) return; // esta pagina no siempre tiene barra (por si se reutiliza el script)

  const marca = barra.querySelector(".marca");
  const flt = Number(barra.dataset.float); // dataset.float llega como texto, hay que pasarlo a numero

  if (marca && !Number.isNaN(flt)) {
    // Math.min/Math.max aca es como una "abrazadera" para que el valor
    // nunca se pase de 100 ni baje de 0, por si algun dato viniera raro
    marca.style.left = `${Math.min(100, Math.max(0, flt * 100))}%`;
  }

  // Contador de unidades del boton "agregar al carrito". Ojo que esto NO
  // agrega nada de verdad al carrito, solo cambia el numerito de cantidad
  // en pantalla (el carrito real se va a hacer despues en TypeScript segun
  // lo que dice el sprint 4).
  const cantidad = document.getElementById("cantidad");
  const menos = document.querySelector("[data-cantidad-menos]");
  const mas = document.querySelector("[data-cantidad-mas]");
  if (cantidad && menos && mas) {
    menos.addEventListener("click", () => {
      cantidad.value = Math.max(1, Number(cantidad.value) - 1); // no deja bajar de 1
    });
    mas.addEventListener("click", () => {
      cantidad.value = Math.min(10, Number(cantidad.value) + 1); // tope de 10 por ahora, numero arbitrario
    });
  }
})();
