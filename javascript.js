document.addEventListener('DOMContentLoaded', function() {
  // Получаем контейнер для галереи
  const grid = document.querySelector('.gallery-container');

  if (!grid) {
    console.error('Галерея не найдена!');
    return;
  }

  // Инициализируем Masonry
  const masonry = new Masonry(grid, {
    itemSelector: '.gallery-item',
    columnWidth: '.gallery-item', // Укажите фиксированную ширину для колонок
    percentPosition: true,
    gutter: 20  // Вы можете также уменьшить gutter, если нужно
  });

  // После того как изображения загружены, вызываем layout для Masonry
  imagesLoaded(grid, function() {
    masonry.layout();
  });

  // Перерасчет layout при изменении размера окна
  window.addEventListener('resize', function () {
    masonry.layout();
  });

});
