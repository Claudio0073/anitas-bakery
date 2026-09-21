// ================================================
// CATÁLOGO DE ANITA'S BAKERY
// Editá este archivo para agregar o modificar productos.
// Campos importantes: id, category, name, description, image, price, featured, active
// price puede ser un número (ej. 4500) o null para "Consultar".
// ================================================

const categories = [
  {
    id: 'prepizzas',
    name: 'Prepizzas',
    description: 'Clásicas, integrales, saborizadas y más.',
    image: 'assets/cat_prepizzas.jpg',
    icon: '🍕',
    active: true
  },
  {
    id: 'panes',
    name: 'Panes caseros',
    description: 'Pan tradicional, integral, saborizados y focaccia.',
    image: 'assets/cat_panes.jpg',
    icon: '🥖',
    active: true
  },
  {
    id: 'tortas',
    name: 'Tortas',
    description: 'Cumpleaños, personalizadas y para compartir.',
    image: 'assets/cat_tortas.jpg',
    icon: '🎂',
    active: true,
    comingSoon: true
  },
  {
    id: 'dulces',
    name: 'Dulces',
    description: 'Budines, cookies, alfajores y más delicias.',
    image: 'assets/cat_dulces.jpg',
    icon: '🧁',
    active: true,
    comingSoon: true
  },
  {
    id: 'combos',
    name: 'Combos',
    description: 'Opciones especiales para regalar o compartir.',
    image: 'assets/cat_combos.jpg',
    icon: '🎁',
    active: true,
    comingSoon: true
  }
];

const products = [
  {
    id: 'prepizza-clasica',
    category: 'prepizzas',
    name: 'Prepizza Clásica',
    description: 'Esponjosa y lista para tus ingredientes favoritos.',
    image: 'assets/prod_prepizza.jpg',
    price: null,
    unit: 'unidad',
    featured: true,
    active: true
  },
  {
    id: 'prepizza-oregano',
    category: 'prepizzas',
    name: 'Prepizza con Orégano',
    description: 'El toque clásico que no falla.',
    image: 'assets/prod_oregano.jpg',
    price: null,
    unit: 'unidad',
    featured: true,
    active: true
  },
  {
    id: 'pan-casero',
    category: 'panes',
    name: 'Pan Casero',
    description: 'Receta tradicional, suave y delicioso.',
    image: 'assets/prod_pan.jpg',
    price: null,
    unit: 'unidad',
    featured: true,
    active: true
  },
  {
    id: 'torta-chocolate',
    category: 'tortas',
    name: 'Torta de Chocolate',
    description: 'Una propuesta especial para cumpleaños y celebraciones.',
    image: 'assets/prod_torta.jpg',
    price: null,
    unit: 'consultar tamaño',
    featured: false,
    active: false
  },
  {
    id: 'cookies-artesanales',
    category: 'dulces',
    name: 'Cookies Artesanales',
    description: 'Crujientes por fuera, tiernas y sabrosas.',
    image: 'assets/prod_cookies.jpg',
    price: null,
    unit: 'unidad',
    featured: false,
    active: false
  }
];
