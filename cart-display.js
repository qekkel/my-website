// cart-display.js

// Функция воспроизведения звука лягушки
function playFrogSound() {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => {
        console.log("Audio error:", e);
    });
}

// Обновляем счетчик корзины
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const counter = document.getElementById('cart-count');
    
    if (counter) {
        counter.textContent = totalItems;
        counter.classList.toggle('visible', totalItems > 0);
    }
}

// Добавление товара в корзину
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        product.quantity = 1;
        if (!product.image.includes('/store/') && !product.image.startsWith('http')) {
            product.image = '/store/' + product.image.split('/').pop();
        }
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    playFrogSound();
    
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.classList.add('bounce');
        setTimeout(() => cartCount.classList.remove('bounce'), 300);
    }
}

// Инициализация только для страниц товаров
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    
    if (document.querySelector('.product-container')) {
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const productContainer = document.querySelector('.product-container');
                const imgElement = productContainer.querySelector('img');
                
                const product = {
                    id: window.location.pathname.split('/').pop().replace('.html', ''),
                    name: document.querySelector('h1').textContent,
                    price: parseFloat(document.querySelector('.product-price').textContent.replace('$', '')),
                    image: imgElement.src
                };
                
                addToCart(product);
                
                addToCartBtn.textContent = '✓ Added!';
                setTimeout(() => {
                    addToCartBtn.textContent = 'Add to Cart';
                }, 1000);
            });
        }
    }
});

// Синхронизация между вкладками
window.addEventListener('storage', updateCartDisplay);

// JavaScript для модальных окон
function openProductModal(productId) {
    const modal = document.getElementById(`product-modal-${productId}`);
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Закрытие модалок
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('product-modal') || 
        event.target.classList.contains('close-modal')) {
        document.querySelectorAll('.product-modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});


// Добавь этот код в конец cart-display.js

// Обработка добавления в корзину из модальных окон
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-add-to-cart')) {
        const button = event.target;
        const modal = button.closest('.product-modal');
        const productId = button.getAttribute('data-product');
        const quantityInput = modal.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput.value) || 1;
        
        // Создаем объект товара
        const product = {
            id: `product-${productId}`,
            name: modal.querySelector('h2').textContent,
            price: parseFloat(modal.querySelector('.modal-price').textContent.replace('$', '')),
            image: modal.querySelector('.modal-image img').src,
            quantity: quantity
        };
        
        // Добавляем в корзину
        addToCart(product);
        
        // Показываем подтверждение
        button.textContent = '✓ Added to Cart!';
        button.style.background = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.background = '';
            
            // Закрываем модалку через 1 секунду
            modal.style.display = 'none';
        }, 1000);
    }
});

// Управление количеством в модалках
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('quantity-btn')) {
        const input = event.target.parentElement.querySelector('.quantity-input');
        let value = parseInt(input.value) || 1;
        
        if (event.target.classList.contains('plus')) {
            input.value = value + 1;
        } else if (event.target.classList.contains('minus') && value > 1) {
            input.value = value - 1;
        }
    }
});

// Закрытие модалки по ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.product-modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});


// Показ детальной страницы товара
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация корзины
    updateCartDisplay();
    
    // Обработчики для товаров
    document.querySelectorAll('.product-item').forEach(item => {
        item.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            showProductDetail(productId);
        });
    });

    // Кнопка "Назад"
    const backButton = document.querySelector('.back-to-gallery');
    if (backButton) {
        backButton.addEventListener('click', function() {
            const gallery = document.getElementById('product-grid');
            const detailView = document.getElementById('product-detail');
            
            if (gallery && detailView) {
                gallery.classList.add('active-view');
                detailView.classList.remove('active');
            }
        });
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

    // Добавление в корзину из детальной страницы
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn && !addToCartBtn.classList.contains('modal-add-to-cart')) {
        addToCartBtn.addEventListener('click', function() {
            const productTitle = document.getElementById('detail-title').textContent;
            const productPrice = document.getElementById('detail-price').textContent;
            const productImage = document.getElementById('detail-image').src;
            const quantity = parseInt(document.querySelector('.quantity-input').value) || 1;
            
            const product = {
                id: `detail-${Date.now()}`,
                name: productTitle,
                price: parseFloat(productPrice.replace('$', '')),
                image: productImage,
                quantity: quantity
            };
            
            addToCart(product);
            
            // Показываем подтверждение
            this.textContent = '✓ Added to Cart!';
            this.style.background = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.background = '';
            }, 1000);
        });
    }
});

// Функция показа деталей товара
function showProductDetail(productId) {
    const product = products[productId];
    const gallery = document.getElementById('product-grid');
    const detailView = document.getElementById('product-detail');
    
    if (!product || !gallery || !detailView) return;
    
    // Заполняем данные
    document.getElementById('detail-image').src = product.image;
    document.getElementById('detail-title').textContent = product.title;
    document.getElementById('detail-price').textContent = product.price;
    document.getElementById('detail-description').textContent = product.description;
    
    // Переключаем виды
    gallery.classList.remove('active-view');
    detailView.classList.add('active');
}

// Функция показа оверлея товара
function showProductOverlay(productId) {
    const product = products[productId];
    const overlay = document.getElementById('product-overlay');
    
    if (!product || !overlay) return;
    
    // Заполняем данные
    document.getElementById('overlay-image').src = product.image;
    document.getElementById('overlay-title').textContent = product.title;
    document.getElementById('overlay-price').textContent = product.price;
    document.getElementById('overlay-description').textContent = product.description;
    
    // Показываем оверлей
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
}

// Функция закрытия оверлея
function closeProductOverlay() {
    const overlay = document.getElementById('product-overlay');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Разблокируем скролл
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация корзины
    updateCartDisplay();
    
    // Обработчики для товаров - открытие оверлея
    document.querySelectorAll('.product-item').forEach(item => {
        item.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            showProductOverlay(productId);
        });
    });

    // Закрытие оверлея
    const closeBtn = document.querySelector('.close-overlay');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProductOverlay);
    }

    // Закрытие оверлея по клику на фон
    const overlay = document.getElementById('product-overlay');
    if (overlay) {
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) {
                closeProductOverlay();
            }
        });
    }

    // Закрытие оверлея по ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeProductOverlay();
        }
    });

    // Управление количеством в оверлее
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

    // Добавление в корзину из оверлея
    const overlayAddToCart = document.querySelector('.overlay-add-to-cart');
    if (overlayAddToCart) {
        overlayAddToCart.addEventListener('click', function() {
            const productTitle = document.getElementById('overlay-title').textContent;
            const productPrice = document.getElementById('overlay-price').textContent;
            const productImage = document.getElementById('overlay-image').src;
            const quantity = parseInt(document.querySelector('.quantity-input').value) || 1;
            
            const product = {
                id: `overlay-${Date.now()}`,
                name: productTitle,
                price: parseFloat(productPrice.replace('$', '')),
                image: productImage,
                quantity: quantity
            };
            
            addToCart(product);
            
            // Показываем подтверждение
            this.textContent = '✓ Added to Cart!';
            this.style.background = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.background = '';
                closeProductOverlay(); // Закрываем оверлей после добавления
            }, 1000);
        });
    }
});

setTimeout(() => {
    if (!window.Snipcart) {
        const fallbackCart = document.getElementById('fallback-cart');
        if (fallbackCart) { // ← ДОБАВЬ ЭТУ ПРОВЕРКУ
            fallbackCart.style.display = 'block';
        }
    }
}, 3000);