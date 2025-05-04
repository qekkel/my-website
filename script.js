// Выносим тяжелые операции в отдельные функции
function initMasonryGallery() {
  return new Promise((resolve) => {
    const galleryContainer = document.querySelector(".gallery-container");
    if (!galleryContainer) return resolve();
    
    // Даем браузеру "передышку" перед инициализацией Masonry
    requestIdleCallback(() => {
      const masonry = new Masonry(galleryContainer, {
        itemSelector: ".gallery-item",
        columnWidth: ".gallery-item",
        percentPosition: true,
        gutter: 20,
        transitionDuration: 0 // Убираем анимацию для производительности
      });
      
      imagesLoaded(galleryContainer, function() {
        masonry.layout();
        galleryContainer.style.opacity = '1';
        resolve();
      });
    }, { timeout: 1000 }); // Максимальное время ожидания
  });
}

function setupModal() {
  const modal = document.getElementById("modal");
  if (!modal) return;
  
  const modalImage = document.getElementById("modal-image");
  const caption = document.getElementById("caption");
  
  document.querySelectorAll(".gallery-item img").forEach(image => {
    image.addEventListener("click", (event) => {
      modal.style.display = "block";
      modalImage.src = event.target.src;
      caption.innerHTML = event.target.parentElement.getAttribute("data-title");
    });
  });
  
  modal.querySelector(".close").addEventListener("click", () => {
    modal.style.display = "none";
  });
  
  window.addEventListener("click", (event) => {
    if (event.target == modal) modal.style.display = "none";
  });
}

function setupCart() {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  
  function updateCart() {
    const totalQuantity = cartItems.reduce((t, i) => t + i.quantity, 0);
    const totalPrice = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
    
    document.getElementById("cart-count").textContent = totalQuantity;
    document.getElementById("cart-total-price").textContent = `$${totalPrice.toFixed(2)}`;
    
    const cartIcon = document.getElementById("cart-icon");
    if (cartIcon) {
      cartIcon.classList.toggle("show", totalQuantity > 0);
      cartIcon.classList.add('pulse');
      setTimeout(() => cartIcon.classList.remove('pulse'), 500);
    }
    
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart")) {
      const productName = event.target.getAttribute("data-name");
      const productPrice = parseFloat(event.target.getAttribute("data-price"));
      
      if (!productName || isNaN(productPrice)) return;
      
      const existingItem = cartItems.find(item => item.name === productName);
      existingItem ? existingItem.quantity++ : cartItems.push({ 
        name: productName, 
        price: productPrice, 
        quantity: 1 
      });
      
      updateCart();
    }
    
    if (event.target.id === "clear-cart-btn") {
      cartItems = [];
      updateCart();
    }
    
    if (event.target.classList.contains("remove-from-cart")) {
      const productName = event.target.getAttribute("data-name");
      if (productName) {
        cartItems = cartItems.filter(item => item.name !== productName);
        updateCart();
      }
    }
  });
  
  updateCart();
}

// Основная функция инициализации
document.addEventListener("DOMContentLoaded", async () => {
  // Сразу показываем страницу
  document.body.style.opacity = 1;
  
  // Разбиваем инициализацию на этапы
  await initMasonryGallery();
  
  // Параллельно запускаем легкие задачи
  setupModal();
  setupCart();
  
  // Показываем футер после загрузки основного контента
  setTimeout(() => {
    document.querySelector('footer').classList.add('show');
  }, 300);
});
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    gtag('event', 'view_item', {
      'item_name': item.dataset.title
    });
  });
});