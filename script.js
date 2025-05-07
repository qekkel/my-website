document.addEventListener('DOMContentLoaded', function() {
  // Получаем контейнер для галереи
  const grid = document.querySelector('.gallery-container');

  if (!grid) {
    console.error('Галерея не найдена!');
    return;
  }

  // Инициализируем Masonry
  const masonry = new Masonry(grid, {
    itemSelector: '.gallery-item',
    columnWidth: '.gallery-item', // Укажите фиксированную ширину для колонок
    percentPosition: true,
    gutter: 20  // Вы можете также уменьшить gutter, если нужно
  });

  // Проверяем, загружена ли библиотека imagesLoaded
  if (typeof imagesLoaded === 'undefined') {
    console.error('Библиотека imagesLoaded не загружена!');
    return;
  }

  // Ждем загрузки всех изображений в контейнере
  imagesLoaded(grid, function() {
    // После загрузки всех изображений выполняем layout
    masonry.layout();
  });

  // Перерасчет layout при изменении размера окна
  window.addEventListener('resize', function () {
    masonry.layout();
  });
});

// Корзина (можно вынести в отдельный файл cart.js)
const cart = {
  items: [],
  add(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    existingItem ? existingItem.quantity++ : this.items.push({...product, quantity: 1});
    this.save();
  },
  remove(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
  },
  clear() {
    this.items = [];
    this.save();
  },
  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  },
  load() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    return this.items;
  }
};

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  cart.load();
  updateCartIcon(); // Обновляем иконку корзины
});

// Обновление счетчика товаров в шапке
function updateCartIcon() {
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}
document.addEventListener('DOMContentLoaded', () => {
  // Если Snipcart не загрузился через 3 секунды, покажем fallback
  setTimeout(() => {
    if (!window.Snipcart) {
      document.getElementById('fallback-cart').style.display = 'block';
    }
  }, 3000);
});