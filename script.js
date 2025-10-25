



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
      const cartItemsEl = document.getElementById('cart-items-container');
      const cartTotalEl = document.getElementById('cart-total-price');
      const emptyMsg = document.getElementById('cart-empty-message');
      
      if (cartItemsEl) {
        cartItemsEl.innerHTML = '';
        
        if (this.items.length === 0) {
          if (emptyMsg) emptyMsg.style.display = 'block';
          return;
        }
        
        if (emptyMsg) emptyMsg.style.display = 'none';
        let total = 0;
        
        this.items.forEach(item => {
          total += item.price * item.quantity;
          const itemEl = document.createElement('div');
          itemEl.className = 'cart-item';
          itemEl.innerHTML = `
            <div class="item-info">
              <div class="item-name">${item.name}</div>
              <div class="item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-item" data-id="${item.id}" aria-label="Remove item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          `;
          cartItemsEl.appendChild(itemEl);
        });
        
        if (cartTotalEl) {
          cartTotalEl.textContent = `$${total.toFixed(2)}`;
        }
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
      
      if (totalItems > 0) {
        const audio = new Audio('notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => console.log("Audio error:", e));
      }
    }
  };

  // ===== Contact Method Handler =====
  function setupContactMethod() {
    const contactMethod = document.querySelector('[name="contact_method"]');
    const contactField = document.getElementById('contact-field');
    const contactLabel = document.getElementById('contact-label');

    if (contactMethod && contactField && contactLabel) {
      contactMethod.addEventListener('change', function() {
        if (!this.value) {
          contactField.style.display = 'none';
          return;
        }

        contactField.style.display = 'block';
        
        switch(this.value) {
          case 'telegram':
            contactLabel.textContent = 'Telegram username';
            document.querySelector('[name="contact_info"]').placeholder = '@username';
            break;
          case 'whatsapp':
            contactLabel.textContent = 'WhatsApp number';
            document.querySelector('[name="contact_info"]').placeholder = '+1234567890';
            break;
          case 'phone':
            contactLabel.textContent = 'Phone number';
            document.querySelector('[name="contact_info"]').placeholder = '+1234567890';
            break;
          default:
            contactField.style.display = 'none';
        }
      });
    }
  }

  // ===== Form Submission Handler =====
  function setupFormSubmission() {
    const orderForm = document.getElementById('order-form');
    if (!orderForm) return;

    orderForm.addEventListener('submit', function(e) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      if (cart.length === 0) {
        e.preventDefault();
        alert('Your cart is empty!');
        return;
      }
      
      const contactMethod = document.querySelector('[name="contact_method"]')?.value;
      const contactInfo = document.querySelector('[name="contact_info"]')?.value;
      
      if (contactMethod === 'telegram' && contactInfo && !contactInfo.match(/^@?[a-zA-Z0-9_]{5,}$/)) {
        e.preventDefault();
        alert('Please enter valid Telegram username (e.g. @username)');
        return;
      }
      
      let cartText = "Order Details:\n\n";
      console.log("Данные корзины:", cart);
      cart.forEach(item => {
        cartText += `- ${item.quantity} × ${item.name} ($${item.price.toFixed(2)} each)\n`;
      });
      
      if (contactMethod && contactInfo) {
        cartText += `\nContact: ${contactMethod} (${contactInfo})`;
      }
      
      let cartDataField = document.getElementById('cart-data');
      if (!cartDataField) {
        cartDataField = document.createElement('input');
        cartDataField.type = 'hidden';
        cartDataField.name = 'cart';
        cartDataField.id = 'cart-data';
        orderForm.appendChild(cartDataField);
      }
      cartDataField.value = cartText;
    });
  }

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
      button.textContent = '✓ Added!';
      button.classList.add('added-to-cart');
      setTimeout(() => {
        button.textContent = button.dataset.originalText || 'Add to Cart';
        button.classList.remove('added-to-cart');
      }, 1000);
    }
  }

  function handleRemoveItem(e) {
    if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
      const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
      const itemEl = button.closest('.cart-item');
      
      if (itemEl) {
        itemEl.classList.add('removing');
        setTimeout(() => {
          cart.remove(button.dataset.id);
        }, 300);
      }
    }
  }

  // ===== Initialization =====
  function initialize() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.dataset.originalText = button.textContent;
      button.addEventListener('click', handleAddToCart);
    });

    document.getElementById('cart-items-container')?.addEventListener('click', handleRemoveItem);
    cart.updateUI();
    cart.updateCounter();
    setupContactMethod();
    setupFormSubmission();

    document.getElementById('checkout-btn')?.addEventListener('click', () => {
      document.getElementById('checkout-modal').style.display = 'flex';
      document.getElementById('cart-data').value = JSON.stringify(cart.items);
    });

    document.getElementById('checkout-modal')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('checkout-modal')) {
        e.target.style.display = 'none';
      }
    });
  }

  initialize();
});

// Функции для модальных окон
function openProductModal(productId) {
    const modal = document.getElementById(`product-modal-${productId}`);
    modal.style.display = 'flex';
}

function closeProductModal(productId) {
    const modal = document.getElementById(`product-modal-${productId}`);
    modal.style.display = 'none';
}

// Закрытие по клику вне модалки
window.onclick = function(event) {
    if (event.target.classList.contains('product-modal')) {
        event.target.style.display = 'none';
    }
}

// Управление количеством
document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const input = this.parentElement.querySelector('.quantity-input');
        let value = parseInt(input.value);
        
        if (this.classList.contains('plus')) {
            input.value = value + 1;
        } else if (this.classList.contains('minus') && value > 1) {
            input.value = value - 1;
        }
    });
});

// Закрытие по кнопке
document.querySelectorAll('.close-modal').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.product-modal').style.display = 'none';
    });
});


function filterGallery(category) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryContainer = document.querySelector('.gallery-container');
    const filterTitle = document.querySelector('.filter-title');
    
    // Обновляем заголовок
    filterTitle.textContent = category.toUpperCase();
    
    // Сначала скрываем все
    galleryItems.forEach(item => {
        item.style.display = 'none';
    });
    
    // Показываем только нужные и перестраиваем сетку
    const visibleItems = [];
    galleryItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            visibleItems.push(item);
        }
    });
    
    // Перестраиваем контейнер для устранения пробелов
    galleryContainer.style.display = 'grid';
    galleryContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    galleryContainer.style.gap = '20px';
    
    // Обновляем активную кнопку
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().replace(' ', '-') === category) {
            btn.classList.add('active');
        }
    });
    
    // Принудительный reflow для анимации
    galleryContainer.offsetHeight;
}