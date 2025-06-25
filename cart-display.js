// cart-display.js
function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const counter = document.getElementById('cart-count');
  const cartLink = document.querySelector('.cart-link');

  if (counter) {
    counter.textContent = totalItems;
  }
  
  if (cartLink) {
    cartLink.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', updateCartDisplay);

// Обновление при изменениях (если нужно)
window.addEventListener('storage', updateCartDisplay);