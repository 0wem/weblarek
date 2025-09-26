import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { Communication } from './components/Models/Communication';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { 
  PageView,
  HeaderView,
  GalleryView,
  ModalView,
  BasketView,
  OrderFormView,
  ContactsFormView,
  OrderSuccessView,
  CardPreviewView
} from './components/View';
import { IProduct, ICardData, IFormData, IBuyer } from './types';

let eventEmitter: EventEmitter;
let productCatalog: ProductCatalog;
let cart: Cart;
let buyer: Buyer;
let pageView: PageView;
let headerView: HeaderView;
let galleryView: GalleryView;
let modalView: ModalView;
let currentPreviewView: CardPreviewView | null = null;
let currentBasketView: BasketView | null = null;

function initApp() {
  eventEmitter = new EventEmitter();
  
  productCatalog = new ProductCatalog([], eventEmitter);
  cart = new Cart([], eventEmitter);
  buyer = new Buyer(eventEmitter);
  
  const pageElement = document.querySelector('.page') as HTMLElement;
  const headerElement = document.querySelector('.header') as HTMLElement;
  const galleryElement = document.querySelector('.gallery') as HTMLElement;
  const modalElement = document.querySelector('.modal') as HTMLElement;
  
  if (!pageElement || !headerElement || !galleryElement || !modalElement) {
    return;
  }
  
  pageView = new PageView(pageElement, eventEmitter);
  headerView = new HeaderView(headerElement, eventEmitter);
  galleryView = new GalleryView(galleryElement, eventEmitter);
  modalView = new ModalView(modalElement, eventEmitter);
  
  setupEventHandlers();
  
  loadProducts();
}

function setupEventHandlers() {
  eventEmitter.on('products:changed', handleProductsChanged);
  eventEmitter.on('product:selected', handleProductSelected);
  eventEmitter.on('cart:item-added', handleCartItemAdded);
  eventEmitter.on('cart:item-removed', handleCartItemRemoved);
  eventEmitter.on('cart:cleared', handleCartCleared);
  
  eventEmitter.on('card:select', handleCardSelect);
  eventEmitter.on('card:add', handleCardAdd);
  eventEmitter.on('card:remove', handleCardRemove);
  eventEmitter.on('basket:open', handleBasketOpen);
  eventEmitter.on('basket:order', handleBasketOrder);
  eventEmitter.on('order:submit', handleOrderSubmit);
  eventEmitter.on('contacts:submit', handleContactsSubmit);
  eventEmitter.on('order-success:close', handleOrderSuccessClose);
  eventEmitter.on('modal:open', handleModalOpen);
  eventEmitter.on('modal:close', handleModalClose);
}

async function loadProducts() {
  const testProducts: IProduct[] = [
    {
      id: '1',
      title: '+1 час в сутках',
      description: 'Продлите свой день на час и получите больше времени для важных дел',
      image: './src/images/Subtract.svg',
      category: 'софт-скил',
      price: 750
    },
    {
      id: '2', 
      title: 'Бэкенд-антистресс',
      description: 'Если планируете решать задачи в тренажёре, берите два',
      image: './src/images/Subtract.svg',
      category: 'хард-скил',
      price: 1000
    },
    {
      id: '3',
      title: 'Фреймворк куки судьбы',
      description: 'Магический фреймворк для создания идеальных куки',
      image: './src/images/Subtract.svg',
      category: 'другое',
      price: 2500
    },
    {
      id: '4',
      title: 'Бесплатный курс',
      description: 'Изучите основы программирования совершенно бесплатно',
      image: './src/images/Subtract.svg',
      category: 'дополнительное',
      price: null
    },
    {
      id: '5',
      title: 'Кнопка "Не нажимать"',
      description: 'Самая опасная кнопка в интернете. Используйте на свой страх и риск',
      image: './src/images/Subtract.svg',
      category: 'кнопка',
      price: 500
    },
    {
      id: '6',
      title: 'Мастер-класс по React',
      description: 'Изучите современный React с нуля до профи',
      image: './src/images/Subtract.svg',
      category: 'софт-скил',
      price: 1500
    },
    {
      id: '7',
      title: 'TypeScript для профи',
      description: 'Продвинутые техники TypeScript для опытных разработчиков',
      image: './src/images/Subtract.svg',
      category: 'хард-скил',
      price: 2000
    },
    {
      id: '8',
      title: 'Дизайн-система',
      description: 'Создание масштабируемых дизайн-систем для больших проектов',
      image: './src/images/Subtract.svg',
      category: 'другое',
      price: 1800
    },
    {
      id: '9',
      title: 'DevOps практики',
      description: 'Автоматизация развертывания и мониторинг приложений',
      image: './src/images/Subtract.svg',
      category: 'дополнительное',
      price: 2200
    },
    {
      id: '10',
      title: 'Кнопка "Счастье"',
      description: 'Нажмите и получите порцию счастья на весь день',
      image: './src/images/Subtract.svg',
      category: 'кнопка',
      price: 999
    }
  ];
  
  try {
    const api = new Api(API_URL);
    const communication = new Communication(api);
    const products = await communication.getProductList();
    
    if (products && products.length > 0) {
    productCatalog.setProducts(products);
    } else {
      throw new Error('Сервер вернул пустой массив товаров');
    }
  } catch (error) {
    productCatalog.setProducts(testProducts);
  }
}

function handleProductsChanged(data: { products: IProduct[] }) {
  const cardData: ICardData[] = data.products.map(product => ({
    id: product.id,
    title: product.title,
    description: product.description,
    image: product.image,
    category: product.category,
    price: product.price
  }));
  
  galleryView.render({ items: cardData });
}

function handleProductSelected(data: { product: IProduct | null }) {
  if (data.product) {
    const previewElement = document.createElement('div');
    previewElement.className = 'card card_full';
    const previewView = new CardPreviewView(previewElement, eventEmitter);
    
    currentPreviewView = previewView;
    
    const cardData: ICardData = {
      id: data.product.id,
      title: data.product.title,
      description: data.product.description,
      image: data.product.image,
      category: data.product.category,
      price: data.product.price
    };
    
    const isInCart = cart.hasItem(data.product.id);
    
    modalView.setContent(previewView.render(cardData));
    
    previewView.updateButtonState(isInCart);
    
    modalView.open();
  }
}

function handleCartItemAdded(data: { item: IProduct; items: IProduct[] }) {
  headerView.render({ count: data.items.length });
  
  if (currentPreviewView && currentPreviewView.getProductId() === data.item.id) {
    currentPreviewView.updateButtonState(true);
  }
}

function handleCartItemRemoved(data: { item: IProduct | undefined; items: IProduct[] }) {
  headerView.render({ count: data.items.length });
  
  if (currentPreviewView && data.item && currentPreviewView.getProductId() === data.item.id) {
    currentPreviewView.updateButtonState(false);
  }
  
  if (currentBasketView) {
    const basketItems: ICardData[] = data.items.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      category: item.category,
      price: item.price
    }));
    
    currentBasketView.render({ 
      items: basketItems, 
      totalPrice: cart.getTotalPrice() 
    });
  }
}

function handleCartCleared(data: { items: IProduct[] }) {
  headerView.render({ count: data.items.length });
  
  if (currentPreviewView) {
    currentPreviewView.updateButtonState(false);
  }
  
  if (currentBasketView) {
    currentBasketView.render({ 
      items: [], 
      totalPrice: 0 
    });
  }
}

function handleCardSelect(data: { product: ICardData }) {
  const product = productCatalog.getProductById(data.product.id);
  if (product) {
    productCatalog.setSelectedProduct(product);
  }
}

function handleCardAdd(data: { product: ICardData }) {
  const product = productCatalog.getProductById(data.product.id);
  if (product) {
    cart.addItem(product);
  }
}

function handleCardRemove(data: { product: ICardData }) {
  cart.removeItem(data.product.id);
}

function handleBasketOpen() {
  const basketElement = document.createElement('div');
  basketElement.className = 'basket';
  basketElement.innerHTML = `
    <h2 class="modal__title">Корзина</h2>
    <ul class="basket__list"></ul>
    <div class="basket__empty" style="display: none;">Корзина пуста</div>
    <div class="modal__actions">
      <button class="button basket__button">Оформить</button>
      <span class="basket__price">0 синапсов</span>
    </div>
  `;
  
  const basketView = new BasketView(basketElement, eventEmitter);
  
  currentBasketView = basketView;
  
  const basketItems: ICardData[] = cart.getItems().map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.image,
    category: item.category,
    price: item.price
  }));
  
  modalView.setContent(basketView.render({ 
    items: basketItems, 
    totalPrice: cart.getTotalPrice() 
  }));
  modalView.open();
}

function handleBasketOrder() {
  const orderFormElement = document.createElement('div');
  orderFormElement.innerHTML = `
    <form class="form" name="order">
      <div class="order">
        <div class="order__field">
          <h2 class="modal__title">Способ оплаты</h2>
          <div class="order__buttons">
            <button name="card" type="button" class="button button_alt">Онлайн</button>
            <button name="cash" type="button" class="button button_alt">При получении</button>
          </div>
        </div>
        <label class="order__field">
          <span class="form__label modal__title">Адрес доставки</span>
          <input name="address" class="form__input" type="text" placeholder="Введите адрес" />
        </label>
      </div>
      <div class="modal__actions">
        <button type="submit" disabled class="button order__button">Далее</button>
        <span class="form__errors"></span>
      </div>
    </form>
  `;
  
  const orderFormView = new OrderFormView(orderFormElement, eventEmitter);
  modalView.setContent(orderFormView.render());
}

function handleOrderSubmit(data: IFormData) {
  buyer.setData({
    payment: data.payment as IBuyer['payment'],
    address: data.address as string
  });
  
  const contactsFormElement = document.createElement('div');
  contactsFormElement.innerHTML = `
    <form class="form" name="contacts">
      <div class="order">
        <label class="order__field">
          <span class="form__label modal__title">Email</span>
          <input name="email" class="form__input" type="text" placeholder="Введите Email" />
        </label>
        <label class="order__field">
          <span class="form__label modal__title">Телефон</span>
          <input name="phone" class="form__input" type="text" placeholder="+7 (9" />
        </label>
      </div>
      <div class="modal__actions">
        <button type="submit" disabled class="button">Оплатить</button>
        <span class="form__errors"></span>
      </div>
    </form>
  `;
  
  const contactsFormView = new ContactsFormView(contactsFormElement, eventEmitter);
  modalView.setContent(contactsFormView.render());
}

function handleContactsSubmit(data: IFormData) {
  buyer.setData({
    email: data.email as string,
    phone: data.phone as string
  });
  
  const successElement = document.createElement('div');
  successElement.className = 'order-success';
  successElement.innerHTML = `
    <h2 class="order-success__title">Заказ оформлен</h2>
    <p class="order-success__description">Списано 0 синапсов</p>
    <button class="button order-success__close">За новыми покупками!</button>
  `;
  
  const successView = new OrderSuccessView(successElement, eventEmitter);
  modalView.setContent(successView.render({ totalPrice: cart.getTotalPrice() }));
  
  cart.clear();
}

function handleOrderSuccessClose() {
  modalView.close();
}

function handleModalOpen() {
  pageView.lockScroll();
}

function handleModalClose() {
  pageView.unlockScroll();
  currentPreviewView = null;
  currentBasketView = null;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}