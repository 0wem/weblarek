import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { Communication } from './components/Models/Communication';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
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
import { CardCatalogView } from './components/View/CardCatalogView';
import { CardBasketView } from './components/View/CardBasketView';
import { IProduct, ICardData, IFormData, IBuyer } from './types';

// Инициализация приложения

const eventEmitter = new EventEmitter();
const productCatalog = new ProductCatalog([], eventEmitter);
const cart = new Cart([], eventEmitter);
const buyer = new Buyer(eventEmitter);

const api = new Api(API_URL);
const communication = new Communication(api);

const pageElement = document.querySelector('.page') as HTMLElement;
const headerElement = document.querySelector('.header') as HTMLElement;
const galleryElement = document.querySelector('.gallery') as HTMLElement;
const modalElement = document.querySelector('.modal') as HTMLElement;

const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;

if (!pageElement || !headerElement || !galleryElement || !modalElement) {
  throw new Error('Не все элементы DOM найдены');
}

const pageView = new PageView(pageElement, eventEmitter);
const headerView = new HeaderView(headerElement, eventEmitter);
const galleryView = new GalleryView(galleryElement);
const modalView = new ModalView(modalElement, eventEmitter);

const basketView = new BasketView((basketTemplate.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLElement, eventEmitter);
const orderFormView = new OrderFormView((orderTemplate.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLElement, eventEmitter);
const contactsFormView = new ContactsFormView((contactsTemplate.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLElement, eventEmitter);
const orderSuccessView = new OrderSuccessView((successTemplate.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLElement, eventEmitter);

let currentPreviewView: CardPreviewView | null = null;

function initApp() {
  setupEventHandlers();
  loadProducts();
}

function setupEventHandlers() {
  eventEmitter.on('products:changed', handleProductsChanged);
  eventEmitter.on('product:selected', (data: { product: IProduct | null }) => handleProductSelected(data.product));
  eventEmitter.on('cart:item-added', handleCartItemAdded);
  eventEmitter.on('cart:item-removed', handleCartItemRemoved);
  eventEmitter.on('cart:cleared', handleCartCleared);
  eventEmitter.on('buyer:cleared', handleBuyerCleared);
  eventEmitter.on('basket:change', handleBasketChange);

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

  eventEmitter.on('order:change', (data: { value: string; key: string }) => handleOrderChange(data.key, data.value));
  eventEmitter.on('form:validate', handleFormValidate);
}

async function loadProducts() {
  try {
    const products = await communication.getProductList();

    if (products && products.length > 0) {
      productCatalog.setProducts(products);
    } else {
      throw new Error('Сервер вернул пустой массив товаров');
    }
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
  }
}

function handleProductsChanged(data: { products: IProduct[] }) {
  // Создаем готовые элементы карточек для галереи
  const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
  
  const cardElements: (HTMLElement | null)[] = data.products.map(product => {
    if (!cardTemplate) {
      throw new Error('Шаблон карточки каталога не найден');
    }
    
    // Создаем новый элемент из шаблона более простым способом
    const element = cardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!element) {
      throw new Error(`Не удалось создать элемент для товара: ${product.title}`);
    }
    const card = new CardCatalogView(element, eventEmitter);
    const cardData: ICardData = {
      id: product.id,
      title: product.title,
      description: product.description,
      image: product.image.startsWith('http') ? product.image : CDN_URL + product.image,
      category: product.category,
      price: product.price
    };
    
    card.render(cardData);
    return element;
  });

  const validCardElements = cardElements.filter(element => element !== null) as HTMLElement[];
  galleryView.render({ items: validCardElements });
}

function handleProductSelected(product: IProduct | null) {
  if (product) {
    const previewElement = (cardPreviewTemplate.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLElement;
    const previewView = new CardPreviewView(previewElement, eventEmitter);

    currentPreviewView = previewView;

    const cardData: ICardData = {
      id: product.id,
      title: product.title,
      description: product.description,
      image: product.image.startsWith('http') ? product.image : CDN_URL + product.image,
      category: product.category,
      price: product.price
    };

    const isInCart = cart.hasItem(product.id);

    modalView.setContent(previewView.render(cardData));
    previewView.updateButtonState(isInCart);
    modalView.open();
  }
}

function handleCartItemAdded(data: { item: IProduct; items: IProduct[] }) {
  if (currentPreviewView && currentPreviewView.getProductId() === data.item.id) {
    currentPreviewView.updateButtonState(true);
  }
}

function handleCartItemRemoved(data: { item: IProduct | undefined; items: IProduct[] }) {
  if (currentPreviewView && data.item && currentPreviewView.getProductId() === data.item.id) {
    currentPreviewView.updateButtonState(false);
  }
}

function handleCartCleared() {
  if (currentPreviewView) {
    currentPreviewView.updateButtonState(false);
  }
}

function handleBasketChange(data: { items: IProduct[] }) {
  headerView.render({ count: data.items.length });

  if (modalView.isOpen() && modalView.getContent()?.classList.contains('basket')) {
    // Получаем общую стоимость один раз
    const cartTotal = cart.getTotalPrice();
    
    // Создаем готовые элементы товаров в корзине
    const basketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
    const basketItemsHtml: HTMLElement[] = data.items.map((item, index) => {
      if (!basketTemplate) {
        throw new Error('Шаблон карточки корзины не найден');
      }
      
      const element = (basketTemplate.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLElement;
      const card = new CardBasketView(element, eventEmitter, index + 1);
      const cardData: ICardData = {
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image.startsWith('http') ? item.image : CDN_URL + item.image,
        category: item.category,
        price: item.price
      };
      
      card.render(cardData);
      return element;
    });

    basketView.items = basketItemsHtml;
    basketView.render({
      totalPrice: cartTotal
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
  // Получаем данные корзины один раз
  const cartItems = cart.getItems();
  const cartTotal = cart.getTotalPrice();
  
  // Создаем готовые элементы товаров в корзине
  const basketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
  const basketItemsHtml: HTMLElement[] = cartItems.map((item, index) => {
    if (!basketTemplate) {
      throw new Error('Шаблон карточки корзины не найден');
    }
    
    const element = basketTemplate.content.cloneNode(true) as HTMLElement;
    const card = new CardBasketView(element, eventEmitter, index + 1);
    const cardData: ICardData = {
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image.startsWith('http') ? item.image : CDN_URL + item.image,
      category: item.category,
      price: item.price
    };
    
    card.render(cardData);
    return element;
  });

  basketView.items = basketItemsHtml;
  modalView.setContent(basketView.render({
    totalPrice: cartTotal
  }));
  modalView.open();
}

function handleBasketOrder() {
  modalView.setContent(orderFormView.render());
}

function handleOrderSubmit(data: IFormData) {
  buyer.setData({
    payment: data.payment as IBuyer['payment'],
    address: data.address as string
  });
  
  modalView.setContent(contactsFormView.render());
}

async function handleContactsSubmit(data: IFormData) {
  buyer.setData({
    email: data.email as string,
    phone: data.phone as string
  });

  try {
    // Получаем данные один раз для переиспользования
    const buyerData = buyer.getData();
    const cartTotal = cart.getTotal();
    const cartItems = cart.getItems();
    
    const order = {
      ...buyerData, // распаковываем данные покупателя
      total: cartTotal,
      items: cartItems
    };

    await communication.sendOrder(order);

    modalView.setContent(orderSuccessView.render({ totalPrice: cartTotal }));
    
    // Полная очистка состояния после успешного заказа
    cart.clear();
    buyer.clear();
  } catch (error) {
    console.error('Ошибка отправки заказа:', error);
  }
}

function handleOrderSuccessClose() {
  modalView.close();
}

function handleBuyerCleared() {
  // Сбрасываем все формы к исходному состоянию
  orderFormView.resetForm();
  contactsFormView.resetForm();
}

function handleModalOpen() {
  pageView.lockScroll();
}

function handleModalClose() {
  pageView.unlockScroll();
  currentPreviewView = null;
}

function handleOrderChange(key: string, value: string) {
  buyer.change(key as keyof IBuyer, value);
}

function handleFormValidate(errors: { payment: boolean; email: boolean; phone: boolean; address: boolean }) {
  if (modalView.getContent()?.classList.contains('form')) {
    const formName = modalView.getContent()?.querySelector('form')?.name;
    if (formName === 'order') {
      orderFormView.validate(errors);
    } else if (formName === 'contacts') {
      contactsFormView.validate(errors);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}