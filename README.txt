ANITA'S BAKERY — WEB
====================

Versión: 2.0

Esta versión incluye:
- Diseño responsive.
- Catálogo organizado por categorías.
- Filtros rápidos por categoría.
- Detalle de producto con selección de cantidad.
- Carrito/pedido guardado en el navegador (localStorage).
- Botón para enviar el pedido completo por WhatsApp.
- Estructura preparada para sumar tortas, dulces, combos y nuevos productos.
- Catálogo centralizado en products.js.

PARA EDITAR PRODUCTOS
---------------------
Abrí products.js y modificá:
- name: nombre del producto
- description: descripción
- image: ruta de la imagen
- price: precio numérico o null si se consulta
- active: true para mostrarlo / false para ocultarlo
- featured: reservado para futuras mejoras

PARA EDITAR WHATSAPP E INSTAGRAM
--------------------------------
Abrí script.js:
- WHATSAPP_NUMBER ya está configurado como 543364338635.
- INSTAGRAM_URL está vacío: reemplazalo por el enlace real de Instagram.

NOTA SOBRE LOS PRECIOS
----------------------
Los productos actualmente tienen price: null, por lo que se muestra “Consultar”.
Cuando definan precios, por ejemplo price: 4500, la web calcula subtotales y total automáticamente.

CÓMO PROBAR
-----------
1. Abrí esta carpeta en Visual Studio Code.
2. Recomendado: instalá la extensión “Live Server”.
3. Abrí index.html con “Open with Live Server”.
4. Probá agregar productos al pedido y enviarlo por WhatsApp.

PUBLICACIÓN
-----------
La web es estática (HTML/CSS/JS) y puede publicarse en servicios de hosting estático.
El carrito se guarda solo en el navegador de cada visitante. Los pedidos se envían por WhatsApp.
Para administración online real, pagos, stock y una base de datos se necesitaría agregar backend o un CMS.
