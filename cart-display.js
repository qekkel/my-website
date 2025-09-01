// cart-display.js

// Функция воспроизведения звука лягушки
function playFrogSound() {
    const audio = new Audio('/sounds/frog-sound.mp3');
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