document.addEventListener('DOMContentLoaded', function () {
    // Инициализация Masonry и ImagesLoaded
    const grid = document.querySelector('.gallery-container');
    const masonry = new Masonry(grid, {
        itemSelector: '.gallery-item',
        columnWidth: '.gallery-item',
        percentPosition: true,
        gutter: 20
    });
    imagesLoaded(grid, function () {
        masonry.layout();
    });

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
});