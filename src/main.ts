import './scss/styles.scss';
import { apiProducts } from "./utils/data";
import { Buyer } from "./components/Models/Buyer";
import { ProductCatalog } from "./components/Models/ProductCatalog";
import { Cart } from "./components/Models/Cart";
import { Communication } from './components/Models/Communication';
import { Api } from './components/base/Api';
import { API_URL } from "./utils/constants";

function testModels() {
  console.log("=== Тестирование моделей данных с локальными данными ===");

  // --- Тестируем ProductCatalog ---
  const productCatalog = new ProductCatalog();
  productCatalog.setProducts(apiProducts.items);
  console.log("Массив товаров из каталога:", productCatalog.getProducts());

  // Проверим выбор товара по id
  const testId = apiProducts.items[0].id;
  const productById = productCatalog.getProductById(testId);
  console.log(`Товар с id=${testId}:`, productById);
  
  // Установим выбранный товар
  productCatalog.setSelectedProduct(productById ?? null);
  console.log("Выбранный товар:", productCatalog.getSelectedProduct());

  // --- Тестируем Cart ---
  const cart = new Cart();
  console.log("Корзина изначально пустая:", cart.getItems());

  // Добавим товар в корзину
  if (productById) {
    cart.addItem(productById);
  }
  console.log("Корзина после добавления товара:", cart.getItems());

  // Проверим подсчёт суммы
  console.log("Общая сумма в корзине:", cart.getTotalPrice());

  // Проверим удаление товара
  if (productById) {
    cart.removeItem(productById.id);
  }
  console.log("Корзина после удаления товара:", cart.getItems());

  // --- Тестируем Buyer ---
  const buyer = new Buyer();
  console.log("Данные покупателя по умолчанию:", buyer.getData());

  // Установим данные покупателя
  buyer.setData({
    payment: "card",
    email: "test@example.com",
    phone: "+79996330385",
    address: "г. Екатеринбург, ул. Практикума, д. 10",
  });
  console.log("Данные покупателя после установки:", buyer.getData());

  // Проверим валидацию
  console.log("Валидация полей покупателя:", buyer.validate());
  console.log("Покупатель валиден?", buyer.isValid());

  // Очистим данные
  buyer.clear();
  console.log("Данные покупателя после очистки:", buyer.getData());
}

// Запускаем тест моделей с локальными данными
testModels();

// Получение каталога с сервера, сохранение и тестирование моделей на реальных данных ---

async function fetchAndTestProductsFromServer() {
  console.log("=== Получение каталога с сервера и тестирование моделей ===");

  const api = new Api(API_URL);
  const communication = new Communication(api);
  const productCatalog = new ProductCatalog();
  const cart = new Cart();
  const buyer = new Buyer();

  try {
    // Получаем товары с сервера
    const products = await communication.getProductList();
    productCatalog.setProducts(products);

    console.log("Каталог товаров, полученный с сервера:", productCatalog.getProducts());

    // Проверяем выбор товара по id (берём первый товар)
    const firstProduct = productCatalog.getProducts()[0];
    if (!firstProduct) {
      console.warn("Каталог пуст, нет товаров для теста");
      return;
    }
    console.log("Первый товар из каталога:", firstProduct);

    const productById = productCatalog.getProductById(firstProduct.id);
    console.log(`Товар, выбранный по id=${firstProduct.id}:`, productById);

    // Устанавливаем выбранный товар
    productCatalog.setSelectedProduct(productById ?? null);
    console.log("Выбранный товар:", productCatalog.getSelectedProduct());

    // Добавляем товар в корзину
    if (productById) {
      cart.addItem(productById);
    }
    console.log("Корзина после добавления товара:", cart.getItems());

    // Проверяем общую сумму в корзине
    console.log("Общая сумма в корзине:", cart.getTotalPrice());

    // Устанавливаем данные покупателя
    buyer.setData({
      payment: "card",
      email: "test@example.com",
      phone: "+79996330385",
      address: "г. Екатеринбург, ул. Практикума, д. 10",
    });
    console.log("Данные покупателя:", buyer.getData());

    // Проверяем валидацию покупателя
    console.log("Валидация данных покупателя:", buyer.validate());
    console.log("Покупатель валиден?", buyer.isValid());

  } catch (error) {
    console.error("Ошибка при получении товаров с сервера или тестировании:", error);
  }
}

// Запускаем асинхронный запрос и тестирование
fetchAndTestProductsFromServer();