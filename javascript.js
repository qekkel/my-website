document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.gallery-container');
    const masonry = new Masonry(grid, {
        itemSelector: '.gallery-item',
          columnWidth: 300,  // Укажите фиксированную ширину для колонок
          percentPosition: true,
          gutter: 20  // Вы можете также уменьшить gutter, если нужно
    });
  
    imagesLoaded(grid, function() {
      masonry.layout();
    });
  });