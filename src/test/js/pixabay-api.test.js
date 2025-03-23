// Імпорт функцій для рендерингу елементів з модуля render-functions.js
import {
  clearGallery,
  showLoadingIndicator,
  hideLoadingIndicator,
  toggleLoadMoreButton,
} from '../../main/webapp/js/render-functions.js';

// Імпорт бібліотеки axios для виконання HTTP запитів
import axios from 'axios';

// Імпорт функцій для роботи з API Pixabay з модуля pixabay-api.js
import {
  fetchImages,
  resetPage,
  getCurrentPage,
} from '../../main/webapp/js/pixabay-api.js';

// Мокання axios для заміни реальних HTTP запитів під час тестування
jest.mock('axios');

// Опис набору тестів для функцій API Pixabay
describe('Pixabay API Functions', () => {
  // Виконання очищення моків перед кожним тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Тестування функції fetchImages на коректне повернення даних при успішному запиті до API
  test('fetchImages should return data on successful API call with status 200', async () => {
    // Мокання даних для тесту
    const mockData = {
      data: {
        hits: [
          {
            largeImageURL: 'test-url',
            webformatURL: 'test-thumb',
            tags: 'test',
          },
        ],
        totalHits: 100,
      },
      status: 200, // Статус 200 для успішного запиту
    };

    // Мокання виклику axios, щоб він повернув mockData
    axios.get.mockResolvedValue(mockData);

    // Виклик функції fetchImages та перевірка результату
    const result = await fetchImages('test', 1);
    // Перевірка відповідності результату мокованим даним
    expect(result).toEqual(mockData.data);
    // Перевірка кількості викликів axios.get
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  // Тестування функції fetchImages на обробку випадку відсутності зображень
  test('fetchImages should throw an error if no images are found', async () => {
    // Мокання даних, де немає зображень
    axios.get.mockResolvedValue({ data: { hits: [] } });

    // Перевірка, що функція викидає помилку з відповідним повідомленням
    await expect(fetchImages('noresults', 1)).rejects.toThrowError(
      'No images found'
    );
  });

  // Тестування функції fetchImages на обробку помилок API
  test('fetchImages should throw an error if API is down or inaccessible', async () => {
    // Мокання помилки при запиті до API (наприклад, 500)
    axios.get.mockRejectedValue(new Error('Network Error'));
    await expect(fetchImages('test', 1)).rejects.toThrowError('Network Error');
  });

  // Тестування функції resetPage для скидання поточної сторінки до 1
  test('resetPage should set currentPage to 1', () => {
    resetPage();
    expect(getCurrentPage()).toBe(1);
  });
});

// Опис набору тестів для функцій рендерингу
describe('Render Functions', () => {
  let gallery;

  // Налаштування тестової HTML структури перед кожним тестом
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="gallery"></div>
      <button class="load-more" style="display: none"></button>
      <div class="loading" style="display: none"></div>`;
    gallery = document.querySelector('.gallery');
  });

  // Тестування функції clearGallery на очищення галереї
  test('clearGallery should empty the gallery', () => {
    gallery.innerHTML = '<p>Test Image</p>';
    clearGallery();
    expect(gallery.innerHTML).toBe('');
  });

  // Тестування функції toggleLoadMoreButton на показ або приховування кнопки
  test('toggleLoadMoreButton should show and hide the button', () => {
    const button = document.querySelector('.load-more');
    toggleLoadMoreButton(true); // Виклик для показу кнопки
    expect(button.style.display).toBe('block');
    toggleLoadMoreButton(false); // Виклик для приховування кнопки
    expect(button.style.display).toBe('none');
  });

  // Тестування функцій showLoadingIndicator та hideLoadingIndicator
  test('showLoadingIndicator should display and hide the loading element', () => {
    showLoadingIndicator();
    expect(document.querySelector('.loading').style.display).toBe('block');
    hideLoadingIndicator();
    expect(document.querySelector('.loading').style.display).toBe('none');
  });
});
