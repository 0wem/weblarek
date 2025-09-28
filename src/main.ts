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
  CardPreviewView,
  CardCatalogView,
  CardBasketView
} from './components/View';
import { IProduct, ICardData, IFormData, IBuyer } from './types';

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
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

if (!pageElement || !headerElement || !galleryElement || !modalElement) {
  throw new Error('Не все элементы DOM найдены');
}

const pageView = new PageView(pageElement, eventEmitter);
const headerView = new HeaderView(headerElement, eventEmitter);
const galleryView = new GalleryView(galleryElement);
const modalView = new ModalView(modalElement, eventEmitter);

const basketView = new BasketView(basketTemplate.content.cloneNode(true) as HTMLElement, eventEmitter);
const orderFormView = new OrderFormView(orderTemplate.content.cloneNode(true) as HTMLElement, eventEmitter);
const contactsFormView = new ContactsFormView(contactsTemplate.content.cloneNode(true) as HTMLElement, eventEmitter);
const orderSuccessView = new OrderSuccessView(successTemplate.content.cloneNode(true) as HTMLElement, eventEmitter);

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
    // Ошибка загрузки товаров - приложение продолжит работу с пустым каталогом
  }
}

function handleProductsChanged(data: { products: IProduct[] }) {
  const cardElements = data.products.map(product => {
    const cardElement = cardCatalogTemplate.content.cloneNode(true) as HTMLElement;
    const card = new CardCatalogView(cardElement, eventEmitter);
    card.render({
      id: product.id,
      title: product.title,
      description: product.description,
      image: product.image,
      category: product.category,
      price: product.price
    });
    return cardElement;
  });

  galleryView.items = cardElements;
}

function handleProductSelected(product: IProduct | null) {
  if (product) {
    const previewElement = cardPreviewTemplate.content.cloneNode(true) as HTMLElement;
    const previewView = new CardPreviewView(previewElement, eventEmitter);

    currentPreviewView = previewView;

    const cardData: ICardData = {
      id: product.id,
      title: product.title,
      description: product.description,
      image: product.image,
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
    const basketItems = data.items.map((item, index) => {
      const basketElement = cardBasketTemplate.content.cloneNode(true) as HTMLElement;
      const card = new CardBasketView(basketElement, eventEmitter, index + 1);
      card.render({
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image,
        category: item.category,
        price: item.price
      });
      return basketElement;
    });

    basketView.items = basketItems;
    basketView.render({ totalPrice: cart.getTotalPrice() });
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
  const basketItems = cart.getItems().map((item, index) => {
    const basketElement = cardBasketTemplate.content.cloneNode(true) as HTMLElement;
    const card = new CardBasketView(basketElement, eventEmitter, index + 1);
    card.render({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      category: item.category,
      price: item.price
    });
    return basketElement;
  });

  basketView.items = basketItems;
  basketView.render({ totalPrice: cart.getTotalPrice() });
  modalView.setContent(basketView.render({ totalPrice: cart.getTotalPrice() }));
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
    const buyerData = buyer.getData();
    const order = {
      buyer: buyerData,
      items: cart.getItems(),
      total: cart.getTotalPrice(),
      payment: buyerData.payment,
      email: buyerData.email,
      phone: buyerData.phone,
      address: buyerData.address
    };

    await communication.sendOrder(order);

    modalView.setContent(orderSuccessView.render({ totalPrice: cart.getTotalPrice() }));
    cart.clear();
  } catch (error) {
    // Ошибка отправки заказа - пользователь увидит сообщение об ошибке
  }
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