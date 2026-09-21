# Botánica PAD

Página web de un marketplace de plantas y productos de jardinería de la Región del Biobío.
Está hecha solo con **HTML** y **Bootstrap 5**, más un archivo CSS muy corto. No usa JavaScript propio.

## Cómo abrirla

- Abre la carpeta en VS Code y usa **Live Server** sobre `home.html`.
- También sirve hacer doble clic en `home.html`.
- Bootstrap se carga desde internet, así que necesitas conexión para que se vea bien.

## Qué hay en cada carpeta

```
botanica-pad/
├── index.html               solo redirige a home.html
├── home.html                portada
├── catalogo.html            lista de productos con filtros
├── detalle-producto.html    un producto en detalle
├── categorias.html          lista de categorías
├── contacto.html            formulario de contacto
├── login.html               formulario para ingresar
├── registro.html            formulario para crear cuenta
├── cliente/                 panel del comprador (panel, pedidos, carrito)
├── admin/                   panel del administrador (panel, usuarios, publicaciones)
├── css/estilos.css          estilos propios (muy pocos)
└── img/                     logo e ilustraciones de ejemplo (SVG)
```

## Etiquetas de HTML que se usaron y para qué

| Etiqueta | Para qué se usó |
|---|---|
| `header` | La parte de arriba de la página (logo y menú) |
| `nav` | Menús y grupos de enlaces (menú principal, migas de pan, paginación) |
| `main` | Lo principal de la página. Solo hay uno por página |
| `section` | Un bloque de la página con su propio título |
| `article` | Un contenido que se entiende solo (una tarjeta de producto, una opinión) |
| `aside` | Contenido extra que acompaña (filtros, datos del vendedor) |
| `footer` | La parte de abajo de la página |
| `figure` y `figcaption` | Una imagen con su descripción escrita |
| `address` | Datos de contacto |
| `form`, `label`, `fieldset`, `legend` | Formularios: los campos, sus textos y los grupos de campos |
| `select` y `optgroup` | Listas para elegir una opción (las comunas están agrupadas por provincia) |
| `details` y `summary` | Preguntas frecuentes que se abren y se cierran |
| `dl`, `dt`, `dd` | Listas de "nombre y descripción" (ficha técnica, resumen del carrito) |
| `ol` y `ul` | Listas con orden (pasos) y sin orden (menús, categorías) |
| `table`, `caption`, `thead`, `th` | Tablas de datos (pedidos, carrito, usuarios, publicaciones) |
| `time` | Fechas |

En cada página hay un solo `h1` y los títulos siguen el orden (h1, h2, h3).

## Cosas para tener en cuenta

- Los nombres de tiendas, usuarios, precios, pedidos y números son inventados, solo de ejemplo.
- `botanicapad.example` es un correo de mentira. Cámbialo por el real cuando lo tengas.
- Los formularios todavía no envían nada a ningún lado. Solo revisan que los campos estén bien escritos
  (por ejemplo, que el correo parezca un correo).
- En el menú "Mi cuenta" y en la página de login hay enlaces "demo" para poder ver los paneles de cliente y de
  administrador sin iniciar sesión.
- Las opciones que dicen "próximamente" en los menús laterales todavía no existen.
