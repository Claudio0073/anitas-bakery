const WHATSAPP_NUMBER = '543364338635';
const INSTAGRAM_URL = ''; // Pegá aquí el enlace real cuando lo tengan.
const FACEBOOK_URL = ''; // Pegá aquí el enlace real cuando lo tengan.
const CURRENCY = 'es-AR';
const CART_KEY = 'anitas_bakery_cart_v2';

const categoryGrid = document.getElementById('categoryGrid');
const productGrid = document.getElementById('productGrid');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const instagramLink = document.getElementById('instagramLink');
const facebookLink = document.getElementById('facebookLink');
const footerInstagramLink = document.getElementById('footerInstagramLink');
const footerFacebookLink = document.getElementById('footerFacebookLink');
const cartButtons = document.querySelectorAll('[data-open-cart]');
const cartCountEls = document.querySelectorAll('[data-cart-count]');
const cartDrawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartSummaryEl = document.getElementById('cartSummary');
const cartCheckout = document.getElementById('cartCheckout');
const cartClose = document.getElementById('cartClose');
const productModal = document.getElementById('productModal');
const productModalClose = document.getElementById('productModalClose');
const productModalContent = document.getElementById('productModalContent');
const productQuickAdd = document.getElementById('productQuickAdd');
const categoryPills = document.getElementById('categoryPills');

let cart = loadCart();
let activeFilter = 'all';
let selectedProductId = null;

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(parsed) ? parsed.filter(item => item && item.id && item.qty > 0) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function formatPrice(price) {
  if (price == null) return 'Consultar';
  return new Intl.NumberFormat(CURRENCY, { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
}

function getProduct(id) {
  return products.find(product => product.id === id);
}

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function cartItemCount() {
  return cart.reduce((total, item) => total + item.qty, 0);
}

function updateCartCount() {
  const count = cartItemCount();
  cartCountEls.forEach(el => {
    el.textContent = count;
    el.classList.toggle('is-empty', count === 0);
  });
}

function renderCategories() {
  const visibleCategories = categories.filter(category => category.active);
  categoryGrid.innerHTML = visibleCategories.map(category => `
    <article class="category-card ${category.comingSoon ? 'is-soon' : ''}">
      <div class="category-image-wrap">
        <img src="${category.image}" alt="${category.name}" loading="lazy" />
        <div class="category-icon">${category.icon}</div>
        ${category.comingSoon ? '<span class="soon-badge">Próximamente</span>' : ''}
      </div>
      <div class="category-body">
        <h3>${category.name}</h3>
        <p>${category.description}</p>
        <button class="category-link" type="button" data-category="${category.id}">Ver productos <span>→</span></button>
      </div>
    </article>
  `).join('');

  categoryPills.innerHTML = `
    <button class="filter-pill ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">Todos</button>
    ${visibleCategories.map(category => `
      <button class="filter-pill ${activeFilter === category.id ? 'active' : ''}" data-filter="${category.id}">${category.icon} ${category.name}</button>
    `).join('')}
  `;
}

function renderProducts(filter = activeFilter) {
  activeFilter = filter;
  const visibleProducts = products.filter(product => product.active && (filter === 'all' || product.category === filter));

  if (!visibleProducts.length) {
    productGrid.innerHTML = `
      <div class="empty-catalog">
        <span>♡</span>
        <h3>Muy pronto</h3>
        <p>Estamos preparando esta categoría. Consultanos por WhatsApp.</p>
        <a class="btn btn-green" href="${whatsappUrl('Hola Anita! Quisiera consultar por los productos disponibles.') }" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = visibleProducts.map(product => `
    <article class="product-card" id="catalog-${product.id}" data-product-id="${product.id}">
      <button class="product-image-button" type="button" data-product-modal="${product.id}" aria-label="Ver ${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="quick-view">Ver detalle</span>
      </button>
      <div class="product-body">
        <div class="product-tag">${getCategoryName(product.category)}</div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <div>
            <strong>${formatPrice(product.price)}</strong>
            <small>${product.price != null ? `por ${product.unit}` : 'Precio a confirmar'}</small>
          </div>
          <button class="product-order" type="button" data-add-cart="${product.id}">Agregar <span>+</span></button>
        </div>
      </div>
    </article>
  `).join('');
}

function getCategoryName(id) {
  return categories.find(category => category.id === id)?.name || id;
}

function addToCart(productId, qty = 1) {
  const product = getProduct(productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) existing.qty += qty;
  else cart.push({ id: productId, qty });
  saveCart();
  renderCart();
  flashCart();
}

function changeQty(productId, delta) {
  const item = cart.find(entry => entry.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(entry => entry.id !== productId);
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(entry => entry.id !== productId);
  saveCart();
  renderCart();
}

function cartTotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);
    return total + (product?.price || 0) * item.qty;
  }, 0);
}

function hasConsultProducts() {
  return cart.some(item => getProduct(item.id)?.price == null);
}

function buildOrderMessage() {
  if (!cart.length) return 'Hola Anita! Quisiera consultar por sus productos.';
  const lines = cart.map(item => {
    const product = getProduct(item.id);
    const price = product?.price != null ? ` — ${formatPrice(product.price * item.qty)}` : ' — precio a confirmar';
    return `• ${item.qty} x ${product?.name || item.id}${price}`;
  });

  const totalText = hasConsultProducts() ? 'Total: a confirmar' : `Total: ${formatPrice(cartTotal())}`;
  return `Hola Anita! Quisiera hacer este pedido:\n\n${lines.join('\n')}\n\n${totalText}\n\n¿Podemos coordinar disponibilidad y entrega/retiro?`;
}

function renderCart() {
  updateCartCount();
  const count = cartItemCount();
  cartEmptyEl.hidden = count > 0;
  cartSummaryEl.hidden = count === 0;
  cartCheckout.hidden = count === 0;

  if (!count) {
    cartItemsEl.innerHTML = '';
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => {
    const product = getProduct(item.id);
    if (!product) return '';
    return `
      <article class="cart-item">
        <img src="${product.image}" alt="${product.name}" />
        <div class="cart-item-info">
          <h4>${product.name}</h4>
          <span>${product.price == null ? 'Consultar precio' : formatPrice(product.price)}</span>
          <div class="qty-control" aria-label="Cantidad">
            <button type="button" data-qty="${product.id}" data-delta="-1">−</button>
            <strong>${item.qty}</strong>
            <button type="button" data-qty="${product.id}" data-delta="1">+</button>
          </div>
        </div>
        <button class="remove-item" type="button" data-remove="${product.id}" aria-label="Quitar ${product.name}">×</button>
      </article>
    `;
  }).join('');

  const total = cartTotal();
  cartSummaryEl.innerHTML = `
    <div><span>Productos</span><strong>${count}</strong></div>
    <div><span>Total</span><strong>${hasConsultProducts() ? 'A confirmar' : formatPrice(total)}</strong></div>
  `;
}

function openCart() {
  renderCart();
  cartDrawer.classList.add('open');
  cartBackdrop.classList.add('open');
  document.body.classList.add('no-scroll');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartBackdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

function openProductModal(productId) {
  const product = getProduct(productId);
  if (!product) return;
  selectedProductId = productId;
  productModalContent.innerHTML = `
    <div class="modal-product-image"><img src="${product.image}" alt="${product.name}" /></div>
    <div class="modal-product-copy">
      <div class="product-tag">${getCategoryName(product.category)}</div>
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <div class="modal-price">${formatPrice(product.price)} <small>${product.price != null ? `por ${product.unit}` : 'Precio a confirmar'}</small></div>
      <label class="quantity-label" for="modalQuantity">Cantidad</label>
      <div class="modal-quantity">
        <button type="button" id="modalQtyMinus">−</button>
        <input id="modalQuantity" type="number" min="1" value="1" />
        <button type="button" id="modalQtyPlus">+</button>
      </div>
      <button class="btn btn-green modal-add" type="button" id="modalAddButton">Agregar al pedido</button>
      <p class="modal-help">Podés revisar todo tu pedido antes de enviarlo por WhatsApp.</p>
    </div>
  `;

  productModal.classList.add('open');
  productModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');

  const quantityInput = document.getElementById('modalQuantity');
  document.getElementById('modalQtyMinus').addEventListener('click', () => {
    quantityInput.value = Math.max(1, Number(quantityInput.value) - 1);
  });
  document.getElementById('modalQtyPlus').addEventListener('click', () => {
    quantityInput.value = Number(quantityInput.value) + 1;
  });
  document.getElementById('modalAddButton').addEventListener('click', () => {
    const qty = Math.max(1, Number(quantityInput.value) || 1);
    addToCart(productId, qty);
    closeProductModal();
    openCart();
  });
}

function closeProductModal() {
  productModal.classList.remove('open');
  productModal.setAttribute('aria-hidden', 'true');
  if (!cartDrawer.classList.contains('open')) document.body.classList.remove('no-scroll');
}

function flashCart() {
  cartButtons.forEach(button => {
    button.classList.add('bump');
    setTimeout(() => button.classList.remove('bump'), 350);
  });
}

function scrollToCategory(id) {
  renderProducts(id);
  renderCategories();
  const section = document.getElementById('productos');
  section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => {
    const firstProduct = products.find(product => product.active && product.category === id);
    const target = firstProduct ? document.getElementById(`catalog-${firstProduct.id}`) : null;
    target?.classList.add('highlight');
    if (target) setTimeout(() => target.classList.remove('highlight'), 1100);
  }, 550);
}

categoryGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  const id = button.dataset.category;
  const category = categories.find(item => item.id === id);
  if (category?.comingSoon) {
    const message = `Hola Anita! Quisiera consultar por la categoría ${category.name}.`;
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
    return;
  }
  scrollToCategory(id);
});

categoryPills.addEventListener('click', event => {
  const pill = event.target.closest('[data-filter]');
  if (!pill) return;
  activeFilter = pill.dataset.filter;
  renderCategories();
  renderProducts(activeFilter);
});

productGrid.addEventListener('click', event => {
  const addButton = event.target.closest('[data-add-cart]');
  if (addButton) {
    addToCart(addButton.dataset.addCart, 1);
    return;
  }
  const imageButton = event.target.closest('[data-product-modal]');
  if (imageButton) openProductModal(imageButton.dataset.productModal);
});

cartItemsEl.addEventListener('click', event => {
  const qtyButton = event.target.closest('[data-qty]');
  if (qtyButton) {
    changeQty(qtyButton.dataset.qty, Number(qtyButton.dataset.delta));
    return;
  }
  const removeButton = event.target.closest('[data-remove]');
  if (removeButton) removeFromCart(removeButton.dataset.remove);
});

cartButtons.forEach(button => button.addEventListener('click', openCart));
cartClose?.addEventListener('click', closeCart);
cartBackdrop?.addEventListener('click', closeCart);
productModalClose?.addEventListener('click', closeProductModal);

productQuickAdd?.addEventListener('click', () => {
  if (!selectedProductId) return;
  addToCart(selectedProductId, 1);
  closeProductModal();
  openCart();
});

cartCheckout?.addEventListener('click', () => {
  window.open(whatsappUrl(buildOrderMessage()), '_blank', 'noopener,noreferrer');
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeCart();
    closeProductModal();
  }
});

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

function setupSocialLink(link, url, networkName) {
  if (!link) return;
  if (url) {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return;
  }
  link.href = '#';
  link.addEventListener('click', event => {
    event.preventDefault();
    alert(`Agregá el enlace de ${networkName} de Anita en script.js`);
  });
}

setupSocialLink(instagramLink, INSTAGRAM_URL, 'Instagram');
setupSocialLink(footerInstagramLink, INSTAGRAM_URL, 'Instagram');
setupSocialLink(facebookLink, FACEBOOK_URL, 'Facebook');
setupSocialLink(footerFacebookLink, FACEBOOK_URL, 'Facebook');

// Enlaces generales a WhatsApp.
document.querySelectorAll('[data-whatsapp="general"]').forEach(link => {
  link.href = whatsappUrl('Hola Anita! Quisiera consultar por sus productos y hacer un pedido.');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

renderCategories();
renderProducts('all');
renderCart();
