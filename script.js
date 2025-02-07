document.addEventListener('DOMContentLoaded', function () {
    // Инициализация Masonry и ImagesLoaded
    const grid = document.querySelector('.gallery-container');
    if (grid) {
        const masonry = new Masonry(grid, {
            itemSelector: '.gallery-item',
            columnWidth: '.gallery-item',
            percentPosition: true,
            gutter: 20
        });
        imagesLoaded(grid, function () {
            masonry.layout();
        });
    }

    // Обработчики для модального окна
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close');

    function openModal(event) {
        modal.style.display = 'block';
        modalImage.src = event.target.src;
        captionText.innerHTML = event.target.parentElement.getAttribute('data-title');
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

   // Инициализация корзины
   let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
   let cartCount = document.getElementById('cart-count');
   let cartTotalPrice = document.getElementById('cart-total-price');
   let cartIcon = document.getElementById('cart-icon');
   let cartList = document.getElementById('cart-items');
   let cartCountSummary = document.getElementById('cart-count-summary');
   let cartTotalPriceSummary = document.getElementById('cart-total-price-summary');
   let clearCartBtn = document.getElementById('clear-cart-btn');
   let checkoutBtn = document.getElementById('checkout-btn');
   let checkoutBtnContainer = document.getElementById('checkout-btn-container');

   function updateCart() {
       cartCount.textContent = cartItems.reduce((acc, item) => acc + item.quantity, 0);
       cartTotalPrice.textContent = `$${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}`;
       cartCountSummary.textContent = cartItems.reduce((acc, item) => acc + item.quantity, 0);
       cartTotalPriceSummary.textContent = `$${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}`;
       cartList.innerHTML = cartItems.map(item => `
           <li>
               <span class="cart-item-name">${item.name}</span>
               <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
               <button class="remove-from-cart" data-name="${item.name}">Remove</button>
           </li>
       `).join('');
       cartIcon.classList.toggle('show', cartItems.length > 0);
       cart.classList.toggle('show', cartItems.length > 0);
       checkoutBtnContainer.style.display = cartItems.length > 0 ? 'block' : 'none';

       // Сохраняем корзину в localStorage
       localStorage.setItem('cartItems', JSON.stringify(cartItems));
   }

   function addToCart(name, price) {
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({ name, price, quantity: 1 });
    }
    updateCart();
}

function removeFromCart(name) {
    cartItems = cartItems.filter(item => item.name !== name);
    updateCart();
}


document.querySelectorAll('.add-to-cart').forEach(button => {
    button.onclick = function() {
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        addToCart(name, price);
    };
});

document.getElementById('clear-cart-btn').onclick = function() {
    cartItems = [];
    updateCart();
};

document.getElementById('checkout-btn').onclick = function() {
    alert('Переход к оформлению заказа...');
    // Здесь можно добавить логику перехода к странице оформления заказа
};

    // Обработчик для удаления товара из корзины
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-from-cart')) {
            const name = event.target.getAttribute('data-name');
            removeFromCart(name);
        }
    });

    // Обновляем корзину при загрузке страницы
    updateCart();

    // Обновляем иконку корзины на всех страницах
    if (cartIcon) {
        cartIcon.classList.toggle('show', cartItems.length > 0);
    }

    // Обновляем кнопку оформления заказа на всех страницах
    if (checkoutBtnContainer) {
        checkoutBtnContainer.style.display = cartItems.length > 0 ? 'block' : 'none';
    }
    
});
