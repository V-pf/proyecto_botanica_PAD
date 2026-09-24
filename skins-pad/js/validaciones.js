/**
 * Skins PAD — validaciones de formularios.
 *
 * Esto es javascript "vanilla" (sin librerias) porque el ramo pedia hacerlo
 * asi. La idea general es: cada input puede tener un atributo data-regla
 * que dice que funcion de validacion usar (las definidas mas abajo en el
 * objeto REGLAS), y si no tiene data-regla entonces se valida solo con lo
 * nativo de html (required, type="email", minlength, etc) usando el
 * checkValidity() que trae el navegador.
 *
 * Todo el archivo funciona escuchando eventos: cuando el usuario escribe
 * (input) o sale del campo (blur) se revisa ese campo, y cuando se manda
 * el formulario (submit) se revisan todos juntos. Nunca se llega a mandar
 * de verdad el formulario a un servidor, ocupo preventDefault() para
 * frenarlo siempre y solo mostrar si quedo todo bien o no.
 */
(function () {
  "use strict";

  // Aca van las reglas "custom" que no se pueden hacer solo con los
  // atributos normales de html. Cada una tiene una funcion test() que
  // devuelve true/false y un mensaje que se muestra si test() da false.
  // La mayoria son expresiones regulares, que las fui probando de a poco
  // hasta que aceptaran los casos buenos y rechazaran los malos.
  const REGLAS = {
    // Solo letras (con tildes/ñ) y espacios, 2 a 60 caracteres.
    nombre: {
      test: (v) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{2,60}$/.test(v.trim()),
      mensaje: "Usa solo letras y espacios (2 a 60 caracteres).",
    },
    // Usuario de Steam-like: letras, números, guion bajo, 3 a 20 caracteres.
    usuario: {
      test: (v) => /^[A-Za-z0-9_]{3,20}$/.test(v.trim()),
      mensaje: "Entre 3 y 20 caracteres: letras, números o guion bajo, sin espacios.",
    },
    // Código de intercambio de Steam: 8 a 10 caracteres alfanuméricos en mayúscula.
    codigo_steam: {
      test: (v) => /^[A-Z0-9]{8,10}$/.test(v.trim()),
      mensaje: "El código de intercambio tiene entre 8 y 10 letras y números en mayúscula.",
    },
    // Enlace a perfil o URL de intercambio de Steam.
    url_steam: {
      test: (v) => /^https:\/\/steamcommunity\.com\/(id|profiles|tradeoffer)\/.+/i.test(v.trim()),
      mensaje: "Debe ser un enlace de steamcommunity.com (perfil o de intercambio).",
    },
    // Teléfono chileno +56 9 XXXX XXXX (se aceptan espacios).
    telefono_cl: {
      test: (v) => /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/.test(v.trim()),
      mensaje: "Usa el formato +56 9 XXXX XXXX.",
    },
    precio: {
      test: (v) => Number(v) >= 100 && Number(v) <= 50000000,
      mensaje: "Ingresa un precio entre $100 y $50.000.000.",
    },
    float_desgaste: {
      test: (v) => Number(v) >= 0 && Number(v) <= 1,
      mensaje: "El float va de 0,0000 a 1,0000.",
    },
    entero_positivo: {
      test: (v) => /^\d+$/.test(v.trim()) && Number(v) >= 1,
      mensaje: "Ingresa un número entero de 1 o más.",
    },
    solo_numeros_tarjeta: {
      test: (v) => /^\d{13,19}$/.test(v.replace(/\s/g, "")),
      mensaje: "El número de tarjeta debe tener entre 13 y 19 dígitos, sin letras.",
    },
    cvv: {
      test: (v) => /^\d{3,4}$/.test(v.trim()),
      mensaje: "El CVV tiene 3 o 4 dígitos.",
    },
    vencimiento_tarjeta: {
      test: (v) => {
        const m = v.trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
        if (!m) return false;
        const hoy = new Date();
        const anio = 2000 + parseInt(m[2], 10);
        const mes = parseInt(m[1], 10);
        const venc = new Date(anio, mes, 0, 23, 59, 59);
        return venc >= hoy;
      },
      mensaje: "Usa el formato MM/AA con una fecha futura.",
    },
  };

  // Cuando el campo no tiene data-regla, se usa la validacion que ya trae
  // el navegador (campo.validity), pero esa validacion no muestra mensaje
  // en español, entonces esta funcion solo traduce el tipo de error a un
  // texto entendible. campo.validity es un objeto que da el navegador solo,
  // yo no lo armo, solo leo sus propiedades (valueMissing, tooShort, etc).
  function mensajeNativo(campo) {
    if (campo.validity.valueMissing) return "Este campo es obligatorio.";
    if (campo.validity.typeMismatch && campo.type === "email") return "Escribe un correo con formato válido, como nombre@dominio.com.";
    if (campo.validity.tooShort) return `Escribe al menos ${campo.minLength} caracteres.`;
    if (campo.validity.tooLong) return `Puedes escribir como máximo ${campo.maxLength} caracteres.`;
    if (campo.validity.rangeUnderflow) return `El valor mínimo es ${campo.min}.`;
    if (campo.validity.rangeOverflow) return `El valor máximo es ${campo.max}.`;
    if (campo.validity.patternMismatch) return campo.dataset.msgPatron || "El formato no es válido.";
    if (campo.validity.badInput) return "Ingresa un valor numérico válido.";
    return "Revisa este campo.";
  }

  // Esta es la funcion central: revisa UN campo y le agrega la clase
  // is-invalid o is-valid segun corresponda, ademas escribe el mensaje de
  // error en el div de al lado (el que tiene id="ese-campo-error").
  // La devuelvo como true/false porque despues en el submit necesito saber
  // si TODOS los campos pasaron o no.
  function validarCampo(campo) {
    const valor = campo.value;
    const errorEl = document.getElementById(campo.id + "-error");
    let esValido = true;
    let mensaje = "";

    if (campo.hasAttribute("required") && valor.trim() === "") {
      esValido = false;
      mensaje = mensajeNativo(campo);
    } else if (valor.trim() !== "" || campo.type === "checkbox") {
      const regla = campo.dataset.regla;
      if (regla && REGLAS[regla] && valor.trim() !== "") {
        if (!REGLAS[regla].test(valor)) {
          esValido = false;
          mensaje = REGLAS[regla].mensaje;
        }
      } else if (!campo.checkValidity()) {
        esValido = false;
        mensaje = mensajeNativo(campo);
      }
    }

    // esto es para los campos tipo "confirmar contraseña": si el input
    // tiene data-confirma-a="clave" entonces busco el campo "clave" y
    // comparo que sean iguales. Si no coinciden lo marco como invalido
    // aunque el formato este bien, porque lo que importa aca es que
    // coincida con el otro campo.
    if (esValido && campo.dataset.confirmaA) {
      const original = document.getElementById(campo.dataset.confirmaA);
      if (original && campo.value !== original.value) {
        esValido = false;
        mensaje = "No coincide con el campo anterior.";
      }
    }

    campo.classList.toggle("is-invalid", !esValido);
    campo.classList.toggle("is-valid", esValido && valor.trim() !== "");
    if (errorEl) errorEl.textContent = esValido ? "" : mensaje;
    return esValido;
  }

  // los radio button no se pueden validar campo por campo como los input
  // normales porque son varios inputs con el mismo "name" (por ejemplo
  // los de "como prefieres la entrega"). aca agrupo por nombre y reviso
  // si al menos uno quedo marcado.
  function validarGrupoRadio(nombre, formulario, requerido) {
    const marcados = formulario.querySelectorAll(`input[name="${nombre}"]:checked`);
    const errorEl = document.getElementById(nombre + "-error");
    const valido = !requerido || marcados.length > 0;
    if (errorEl) errorEl.textContent = valido ? "" : "Selecciona una opción.";
    if (errorEl) errorEl.classList.toggle("d-block", !valido);
    return valido;
  }

  // barrita de fuerza de la contraseña. Le voy sumando un punto por cada
  // cosa que cumple (largo, mayuscula, numero, simbolo) y con eso decido
  // el color y el ancho de la barra. No es un calculo super cientifico de
  // seguridad, es mas que nada visual para que el usuario vea que le
  // conviene una clave mas dificil.
  function medidorClave(input) {
    const contenedor = input.parentElement.querySelector(".medidor-clave");
    if (!contenedor) return;
    const barra = contenedor.querySelector("span");
    const v = input.value;
    let puntos = 0;
    if (v.length >= 8) puntos++;
    if (/[A-Z]/.test(v)) puntos++;
    if (/[0-9]/.test(v)) puntos++;
    if (/[^A-Za-z0-9]/.test(v)) puntos++;
    const pct = [0, 25, 50, 75, 100][puntos];
    const color = ["#e0616f", "#e0616f", "#e0b35f", "#a9c95f", "#5fbf8f"][puntos];
    barra.style.width = pct + "%";
    barra.style.background = color;
  }

  // Esta funcion "engancha" todos los eventos a un formulario especifico.
  // Se llama una vez por cada <form data-validar> que haya en la pagina
  // (puede haber mas de uno, como en login.html que tiene el form de
  // login y el modal de recuperar clave aparte).
  function inicializarFormulario(form) {
    const campos = Array.from(form.querySelectorAll("input, select, textarea")).filter(
      (c) => c.type !== "radio" && c.type !== "submit" && c.type !== "button"
    );
    const gruposRadio = new Set(
      Array.from(form.querySelectorAll('input[type="radio"]')).map((r) => r.name)
    );

    campos.forEach((campo) => {
      const evento = campo.tagName === "SELECT" || campo.type === "checkbox" ? "change" : "input";
      campo.addEventListener(evento, () => {
        validarCampo(campo);
        if (campo.dataset.contador) {
          const out = document.querySelector(campo.dataset.contador);
          if (out) out.textContent = `${campo.value.length}/${campo.maxLength}`;
        }
        if (campo.id === "clave" || campo.id === "clave-nueva") medidorClave(campo);
        // revalida el campo de confirmación asociado, si existe
        const dependiente = form.querySelector(`[data-confirma-a="${campo.id}"]`);
        if (dependiente && dependiente.value) validarCampo(dependiente);
      });
      campo.addEventListener("blur", () => validarCampo(campo));
    });

    gruposRadio.forEach((nombre) => {
      form.querySelectorAll(`input[name="${nombre}"]`).forEach((r) =>
        r.addEventListener("change", () => validarGrupoRadio(nombre, form, r.required))
      );
    });

    form.addEventListener("submit", (ev) => {
      ev.preventDefault(); // clave: esto evita que el navegador intente mandar el form de verdad
      let todoValido = true;
      campos.forEach((campo) => {
        if (!validarCampo(campo)) todoValido = false;
      });
      gruposRadio.forEach((nombre) => {
        const requerido = form.querySelector(`input[name="${nombre}"]`).required;
        if (!validarGrupoRadio(nombre, form, requerido)) todoValido = false;
      });

      const resumen = form.querySelector("[data-resumen-errores]");
      const exito = form.querySelector("[data-exito]");

      if (!todoValido) {
        if (resumen) {
          resumen.textContent = "Hay campos por corregir. Revisa los mensajes marcados en rojo.";
          resumen.classList.remove("d-none");
        }
        if (exito) exito.classList.add("d-none");
        const primerInvalido = form.querySelector(".is-invalid");
        if (primerInvalido) primerInvalido.focus();
      } else {
        if (resumen) resumen.classList.add("d-none");
        if (exito) exito.classList.remove("d-none");
        form.dispatchEvent(new CustomEvent("formulario-valido", { bubbles: true }));
      }
    });
  }

  // Punto de entrada: espero a que cargue todo el html (DOMContentLoaded)
  // y ahi recien busco los formularios, si no a veces el script corre
  // antes de que exista el form en la pagina y no encuentra nada.
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("form[data-validar]").forEach(inicializarFormulario);
  });
})();
