# Skins PAD

Marketplace de skins de CS:GO con precios en pesos chilenos. Está hecho con HTML5 semántico y Bootstrap 5, más un archivo CSS propio y JavaScript propio para validaciones y filtros (sin frameworks ni build). No es un proyecto oficial ni tiene afiliación con Valve Corporation.

Referencias usadas para el diseño y las funciones: Skinport, CS.MONEY y el propio Mercado de la Comunidad de Steam (flujo de intercambio, exteriores/float, StatTrak™, grados de rareza).

## Cómo abrirla

- Abre la carpeta en VS Code y usa Live Server sobre `home.html`.
- También sirve hacer doble clic en `home.html`.
- Bootstrap y las tipografías se cargan desde internet (CDN), así que necesitas conexión para que se vea bien.

## Qué hay en cada carpeta

```
skins-pad/
├── index.html               solo redirige a home.html
├── home.html                portada
├── catalogo.html            catálogo con filtros, orden y búsqueda (JS)
├── detalle-producto.html    una skin en detalle, con barra de float y compra
├── categorias.html          categorías por tipo de arma y por grado de rareza
├── contacto.html            formulario de contacto + preguntas frecuentes
├── login.html               ingreso (con enlaces demo a los paneles)
├── registro.html            crear cuenta
├── cliente/                 panel del comprador (panel, pedidos, carrito, vender)
├── admin/                   panel del administrador (panel, usuarios, publicaciones)
├── css/estilos.css          estilos propios
├── js/validaciones.js       validación genérica de formularios (reutilizable)
├── js/catalogo.js           filtros, orden y búsqueda del catálogo
├── js/detalle.js            barra de desgaste/float y contador de cantidad
└── img/                     logo e ilustraciones de ejemplo (SVG, dibujadas a mano)
```

## Funciones agregadas respecto del ejemplo original de Botánica PAD

Estas son propias de un marketplace de ítems de videojuego y se agregaron porque tienen sentido en el rubro (inspiradas en Skinport / CS.MONEY / Steam):

- **Grado de rareza y exterior/float**: cada skin muestra su grado (consumidor a contrabando, más el grado especial ★ de cuchillos y guantes) y su float (0,0000 a 1,0000), con una barra visual que ubica el valor exacto.
- **StatTrak™**: insignia distintiva en tarjetas y detalle.
- **Filtros de catálogo en JavaScript**: por tipo de arma, grado, StatTrak™, precio máximo (con `<input type="range">`) y texto libre, más orden por precio o nombre — todo sin recargar la página.
- **Enlace de intercambio de Steam**: campo con su propia validación (formato `steamcommunity.com/tradeoffer/...`) tanto al vender una skin como al registrarse.
- **Código/URL de Steam y usuario tipo Steam**: reglas de validación dedicadas (`data-regla`) para nombres de usuario, códigos de intercambio y enlaces de perfil.
- **Medidor de fuerza de contraseña**: barra que cambia de color mientras se escribe la contraseña en el registro.
- **Panel de vendedor**: formulario "Vender una skin" con datos del ítem, precio sugerido, forma de entrega y aviso de comisión.
- **Panel de administración**: cola de publicaciones por revisar, gestión de usuarios (suspender/verificar) y rechazo de publicaciones con motivo — todo con formularios validados y modales de Bootstrap.
- **Aviso de retención de pago**: se explica en el detalle de producto y en el carrito cómo funciona la entrega (intercambio de Steam) y qué pasa si no llega a tiempo.

## Etiquetas de HTML que se usaron y para qué

| Etiqueta | Para qué se usó |
|---|---|
| `header` | La parte de arriba de la página (logo y menú) |
| `nav` | Menús y grupos de enlaces (menú principal, migas de pan, paginación) |
| `main` | Lo principal de la página. Solo hay uno por página |
| `section` | Un bloque de la página con su propio título |
| `article` | Un contenido que se entiende solo (una tarjeta de producto) |
| `aside` | Contenido extra que acompaña (filtros, menú del panel, datos del vendedor) |
| `footer` | La parte de abajo de la página |
| `figure` y `figcaption` | Una imagen con su descripción escrita |
| `address` | Datos de contacto y del vendedor |
| `form`, `label`, `fieldset`, `legend` | Formularios: los campos, sus textos y los grupos de campos |
| `select` y `option` | Listas para elegir una opción (tipo de arma, grado, motivo) |
| `details` y `summary` | Preguntas frecuentes y detalles de entrega que se abren y cierran |
| `dl`, `dt`, `dd` | Listas de "nombre y descripción" (ficha técnica, resumen de compra, estadísticas) |
| `ol` y `ul` | Listas con orden (pasos de compra) y sin orden (menús, tarjetas) |
| `table`, `caption`, `thead`, `th` | Tablas de datos (pedidos, carrito, usuarios, publicaciones) |
| `time` | Fechas |
| `output` | Valor en vivo del control de precio máximo |

En cada página hay un solo `h1` y los títulos siguen el orden (`h1`, `h2`, `h3`).

## Cosas para tener en cuenta

- Los nombres de vendedores, usuarios, precios, pedidos y números son inventados, solo de ejemplo.
- `skinspad.example` es un dominio de mentira. Cámbialo por el real cuando lo tengas.
- Los formularios validan en el navegador (JavaScript) pero **no envían nada a ningún servidor**: al enviar, si todo es válido, solo se muestra un mensaje de éxito en pantalla.
- En el menú "Mi cuenta" y en la página de login hay enlaces demo para ver los paneles de cliente y de administrador sin iniciar sesión.
- El carrito (`cliente/carrito.html`) es solo una vista de referencia: agregar y quitar ítems de verdad se construirá en TypeScript en una etapa posterior, según el alcance del sprint 4.
- Las opciones que dicen "próximamente" en los menús laterales todavía no existen.

## Validaciones incluidas (`js/validaciones.js`)

El script es genérico: cualquier `<form data-validar>` queda validado automáticamente, campo por campo, en tiempo real y al enviar. Reglas propias definidas para este proyecto:

- **nombre**: solo letras y espacios, 2 a 60 caracteres.
- **usuario**: 3 a 20 caracteres, letras/números/guion bajo.
- **codigo_steam**: 8 a 10 caracteres alfanuméricos en mayúscula.
- **url_steam**: debe empezar con `https://steamcommunity.com/...`.
- **telefono_cl**: formato `+56 9 XXXX XXXX`.
- **precio**: entre $100 y $50.000.000.
- **float_desgaste**: número entre 0 y 1.
- **entero_positivo**, **solo_numeros_tarjeta**, **cvv**, **vencimiento_tarjeta**: para futuros formularios de pago.

Además valida de forma nativa los campos `required`, `type="email"`, `minlength`/`maxlength` y confirma contraseñas/correos repetidos (`data-confirma-a`).
