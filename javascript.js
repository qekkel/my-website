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

  // Проверяем, загружена ли библиотека imagesLoaded
  if (typeof imagesLoaded === 'undefined') {
    console.error('Библиотека imagesLoaded не загружена!');
    return;
  }

  // Ждем загрузки всех изображений в контейнере
  imagesLoaded(grid, function() {
    // После загрузки всех изображений выполняем layout
    masonry.layout();
  });

  // Перерасчет layout при изменении размера окна
  window.addEventListener('resize', function () {
    masonry.layout();
  });
});
