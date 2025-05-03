document.addEventListener("DOMContentLoaded", function() {
    // Проверяем, загружена ли библиотека imagesLoaded
    if (typeof imagesLoaded === 'undefined') {
        console.error('Библиотека imagesLoaded не найдена');
        return;
    }

    // Инициализация Masonry для галереи
    let galleryContainer = document.querySelector(".gallery-container");
    if (galleryContainer) {
        let masonry = new Masonry(galleryContainer, {
            itemSelector: ".gallery-item",
            columnWidth: ".gallery-item",
            percentPosition: true,
            gutter: 20
        });
    
        imagesLoaded(galleryContainer, function() {
            masonry.layout();
            galleryContainer.style.opacity = '1';
            console.log('Masonry initialized and images loaded'); // Для отладки
        });
    }

    // Обработка кликов по изображениям для открытия модального окна
    let galleryImages = document.querySelectorAll(".gallery-item img");
    let modal = document.getElementById("modal");
    let modalImage = document.getElementById("modal-image");
    let caption = document.getElementById("caption");
    let closeModal = document.querySelector(".close");

    function openModal(event) {
        modal.style.display = "block";
        modalImage.src = event.target.src;
        caption.innerHTML = event.target.parentElement.getAttribute("data-title");
    }

    galleryImages.forEach(image => {
        image.addEventListener("click", openModal);
    });

    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // Обработка корзины
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let cartIcon = document.getElementById("cart-icon");
    let cartCount = document.getElementById("cart-count");
    let cartTotalPrice = document.getElementById("cart-total-price");
    let cartItemsList = document.getElementById("cart-items");
    let cartCountSummary = document.getElementById("cart-count-summary");
    let cartTotalPriceSummary = document.getElementById("cart-total-price-summary");
    let clearCartBtn = document.getElementById("clear-cart-btn");

    function updateCart() {
        if (!cartCount || !cartTotalPrice) return;
    
        let totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
        let totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    
        cartCount.textContent = totalQuantity;
        cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
    
        if (cartCountSummary) {
            cartCountSummary.textContent = totalQuantity;
        }
    
        if (cartTotalPriceSummary) {
            cartTotalPriceSummary.textContent = `$${totalPrice.toFixed(2)}`;
        }
    
        if (cartItemsList) {
            cartItemsList.innerHTML = cartItems.map(item => `
                <li>
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-from-cart" data-name="${item.name}">Remove</button>
                </li>
            `).join("");
        }
    
        if (cartIcon) {
            cartIcon.classList.toggle("show", totalQuantity > 0);
            // Анимация
            cartIcon.classList.add('pulse');
            setTimeout(() => cartIcon.classList.remove('pulse'), 500);
        }
    
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function() {
            let productName = this.getAttribute("data-name");
            let productPrice = parseFloat(this.getAttribute("data-price"));

            if (!productName || isNaN(productPrice)) {
                console.error(`Invalid product data: name="${productName}", price="${productPrice}"`);
                return;
            }

            let existingItem = cartItems.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push({ name: productName, price: productPrice, quantity: 1 });
            }

            updateCart();
        });
    });

    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", function() {
            cartItems = [];
            updateCart();
        });
    }

    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("remove-from-cart")) {
            let productName = event.target.getAttribute("data-name");
            if (!productName) {
                console.error("Missing data-name attribute on remove button");
                return;
            }

            cartItems = cartItems.filter(item => item.name !== productName);
            updateCart();
        }
    });

    updateCart();

    // Обработка переключения изображений в карусели
    let mainImage = document.getElementById("main-image");
    if (mainImage) {
        document.querySelectorAll(".thumbnail").forEach(thumbnail => {
            thumbnail.addEventListener("click", function() {
                mainImage.src = this.src;
                mainImage.alt = this.alt;
                document.querySelectorAll(".thumbnail").forEach(thumb => thumb.classList.remove("active"));
                this.classList.add("active");
            });
        });
    }
});