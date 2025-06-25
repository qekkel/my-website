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
      
      // Звук при добавлении любого количества товаров
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
      
      // Проверка Telegram username
      const contactMethod = document.querySelector('[name="contact_method"]')?.value;
      const contactInfo = document.querySelector('[name="contact_info"]')?.value;
      
      if (contactMethod === 'telegram' && contactInfo && !contactInfo.match(/^@?[a-zA-Z0-9_]{5,}$/)) {
        e.preventDefault();
        alert('Please enter valid Telegram username (e.g. @username)');
        return;
      }
      
      // Формируем читаемое содержимое корзины
      let cartText = "Order Details:\n\n";
      cart.forEach(item => {
        cartText += `- ${item.quantity} × ${item.name} ($${item.price.toFixed(2)} each)\n`;
      });
      
      // Добавляем контактную информацию
      if (contactMethod && contactInfo) {
        cartText += `\nContact: ${contactMethod} (${contactInfo})`;
      }
      
      // Создаем скрытое поле для Formspree
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

    // Initialize contact method
    setupContactMethod();
    
    // Initialize form submission
    setupFormSubmission();

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
  }

  initialize();
});ы