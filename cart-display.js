// cart-display.js

// Обновляем отображение счетчика корзины
function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const counter = document.getElementById('cart-count');
  const cartLink = document.querySelector('.cart-link');

  if (counter) {
    counter.textContent = totalItems;
    counter.classList.toggle('visible', totalItems > 0);
  }
  
  if (cartLink) {
    cartLink.classList.toggle('visible', totalItems > 0);
  }
}

// Универсальная функция добавления в корзину
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
  
  // Анимация
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.classList.add('bounce');
    setTimeout(() => cartCount.classList.remove('bounce'), 300);
  }
}

// Инициализация для страницы магазина (store.html)
function initStorePage() {
  document.querySelectorAll('.product-item').forEach(item => {
    const buyBtn = item.querySelector('.add-to-cart-btn') || document.createElement('button');
    buyBtn.className = 'add-to-cart-btn';
    buyBtn.textContent = 'Add to Cart';
    
    buyBtn.addEventListener('click', () => {
      const imgElement = item.querySelector('img');
      let imagePath = imgElement.src;
      
      // Преобразуем путь к изображению в относительный от корня сайта
      if (imagePath.includes('/store/')) {
        imagePath = '/store/' + imagePath.split('/store/').pop();
      } else if (imagePath.includes(window.location.origin)) {
        imagePath = imagePath.replace(window.location.origin, '');
      }
      
      const product = {
        id: item.querySelector('a').getAttribute('href').replace('product', '').replace('.html', ''),
        name: item.querySelector('h2').textContent,
        price: parseFloat(item.querySelector('.product-price').textContent.replace('$', '')),
        image: imagePath
      };
      
      addToCart(product);
    });

    if (!item.querySelector('.add-to-cart-btn')) {
      item.appendChild(buyBtn);
    }
  });
}

// Инициализация для страницы товара (product1.html и т.д.)
function initProductPage() {
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const productContainer = document.querySelector('.product-container') || document.querySelector('.product-item');
      const imgElement = productContainer.querySelector('img');
      let imagePath = imgElement.src;
      
      // Преобразуем путь к изображению
      if (imagePath.includes('/store/')) {
        imagePath = '/store/' + imagePath.split('/store/').pop();
      } else if (imagePath.includes(window.location.origin)) {
        imagePath = imagePath.replace(window.location.origin, '');
      }
      
      const product = {
        id: window.location.pathname.replace('/product', '').replace('.html', ''),
        name: document.querySelector('h1').textContent,
        price: parseFloat(document.querySelector('.product-price').textContent.replace('$', '')),
        image: imagePath
      };
      
      addToCart(product);
    });
  }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  updateCartDisplay();
  
  // Определяем тип страницы и инициализируем соответствующий функционал
  if (document.querySelector('.product-item')) {
    initStorePage(); // Страница магазина (store.html)
  } else if (document.querySelector('.product-container')) {
    initProductPage(); // Индивидуальная страница товара (product1.html)
  }
});

// Обновление при изменениях в других вкладках
window.addEventListener('storage', updateCartDisplay);