document.addEventListener('DOMContentLoaded', function() {
  // ===== Masonry Gallery =====
  const grid = document.querySelector('.gallery-container');
  if (grid) {
    const masonry = new Masonry(grid, {
      itemSelector: '.gallery-item',
      columnWidth: '.gallery-item',
      percentPosition: true,
      gutter: 20
    });

    if (typeof imagesLoaded !== 'undefined') {
      imagesLoaded(grid, function() {
        masonry.layout();
      });
    }

    window.addEventListener('resize', function() {
      masonry.layout();
    });
  }

  // ===== Snipcart Integration =====
  setTimeout(() => {
    if (!window.Snipcart) {
      document.getElementById('fallback-cart').style.display = 'block';
    }
  }, 3000);

  if (window.Snipcart) {
    Snipcart.store.subscribe(() => {
      const floatingCart = document.getElementById('floating-cart');
      floatingCart.classList.add('added');
      setTimeout(() => floatingCart.classList.remove('added'), 500);
      floatingCart.style.display = Snipcart.store.getState().cart.items.count > 0 ? 'block' : 'none';
    });
  }

  // ===== Custom Cart System =====
  const cart = {
    items: JSON.parse(localStorage.getItem('cart')) || [],
    
    add(product) {
      const existingItem = this.items.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= (product.maxQuantity || 10)) {
          alert(`Maximum ${product.maxQuantity} items allowed`);
          return false;
        }
        existingItem.quantity += 1;
      } else {
        this.items.push({...product, quantity: 1});
      }
      this.save();
      return true;
    },
    
    remove(id) {
      this.items = this.items.filter(item => item.id !== id);
      this.save();
    },
    
    clear() {
      this.items = [];
      this.save();
    },
    
    save() {
      localStorage.setItem('cart', JSON.stringify(this.items));
      this.updateUI();
      this.updateCounter();
    },
    
    updateUI() {
      const cartItemsEl = document.getElementById('cart-items');
      const cartTotalEl = document.getElementById('cart-total-price-summary');
      
      if (cartItemsEl) {
        cartItemsEl.innerHTML = '';
        this.items.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `
            ${item.name} × ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
            <button class="remove-item" data-id="${item.id}">×</button>
          `;
          cartItemsEl.appendChild(li);
        });
      }
      
      if (cartTotalEl) {
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalEl.textContent = `$${total.toFixed(2)}`;
      }
    },
    
    updateCounter() {
      const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
      const counter = document.getElementById('cart-count');
      const cartLink = document.querySelector('.cart-link');
      if (counter) {
        counter.textContent = totalItems;
        counter.classList.add('bounce');
        setTimeout(() => counter.classList.remove('bounce'), 300);
      }
        if (cartLink) {
      cartLink.classList.toggle('visible', totalItems > 0);
    }  
    if (totalItems === 1,2,3,4,5,6) { // Только при добавлении первого товара
  const audio = new Audio('notification.mp3');
  audio.volume = 0.3;
  audio.play();
}


    }
  };

  // ===== Event Handlers =====
  function handleAddToCart(e) {
    e.preventDefault();
    const button = e.currentTarget;
    
    const product = {
      id: button.dataset.id || Date.now().toString(),
      name: button.dataset.name || button.closest('.product-item')?.querySelector('h2')?.textContent || 'Product',
      price: parseFloat(button.dataset.price || 0),
      maxQuantity: parseInt(button.dataset.maxQuantity || 10)
    };

    if (cart.add(product)) {
      // Visual feedback
      button.textContent = '✓ Added!';
      button.classList.add('added-to-cart');
      setTimeout(() => {
        button.textContent = button.dataset.originalText || 'Add to Cart';
        button.classList.remove('added-to-cart');
      }, 1000);
    }
  }

  function handleRemoveItem(e) {
    if (e.target.classList.contains('remove-item')) {
      cart.remove(e.target.dataset.id);
    }
  }

  // ===== Initialization =====
  function initialize() {
    // Initialize buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.dataset.originalText = button.textContent;
      button.addEventListener('click', handleAddToCart);
    });

    // Initialize cart
    document.getElementById('cart-items')?.addEventListener('click', handleRemoveItem);
    cart.updateUI();
    cart.updateCounter();

    // Initialize checkout
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
      document.getElementById('checkout-modal').style.display = 'flex';
      document.getElementById('cart-data').value = JSON.stringify(cart.items);
    });

    document.getElementById('checkout-modal')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('checkout-modal')) {
        e.target.style.display = 'none';
      }
    });

    document.getElementById('order-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Order placed! Thank you!');
      cart.clear();
    });
  }

  initialize();
});

document.getElementById('order-form').addEventListener('submit', function(e) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    e.preventDefault();
    alert('Your cart is empty!');
    return;
  }
  
  // Заполняем скрытое поле
  document.getElementById('cart-data').value = JSON.stringify(cart);
});




// В самом конце script.js
if (document.getElementById('order-form')) {
  document.getElementById('order-form').addEventListener('submit', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-data').value = JSON.stringify(cart);
  });
}