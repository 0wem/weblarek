import { CardView } from './CardView';
import { EventEmitter } from '../base/Events';

export class CardPreviewView extends CardView {
  private imageEl: HTMLImageElement;
  private categoryEl: HTMLElement;
  private titleEl: HTMLElement;
  private textEl: HTMLElement;
  private priceEl: HTMLElement;
  private addToCartButton: HTMLButtonElement;
  private isInCart: boolean = false;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container, eventEmitter);
    
    // Находим элементы в конструкторе и сохраняем в полях класса
    this.imageEl = this.container.querySelector('.card__image') as HTMLImageElement;
    this.categoryEl = this.container.querySelector('.card__category') as HTMLElement;
    this.titleEl = this.container.querySelector('.card__title') as HTMLElement;
    this.textEl = this.container.querySelector('.card__text') as HTMLElement;
    this.priceEl = this.container.querySelector('.card__price') as HTMLElement;
    this.addToCartButton = this.container.querySelector('.card__button') as HTMLButtonElement;
    
    // Устанавливаем слушатели событий один раз в конструкторе
    this.addToCartButton?.addEventListener('click', () => {
      if (this.data && this.data.price !== null) {
        if (this.isInCart) {
          this.eventEmitter.emit('card:remove', { product: this.data });
        } else {
          this.eventEmitter.emit('card:add', { product: this.data });
        }
      }
    });
  }

  protected updateContent(): void {
    if (!this.data) return;

    // Обновляем содержимое элементов
    this.setImage(this.imageEl, this.data.image, this.data.title);
    
    this.categoryEl.textContent = this.data.category;
    this.categoryEl.className = `card__category ${this.getCategoryClass(this.data.category)}`;
    
    this.titleEl.textContent = this.data.title;
    
    this.textEl.textContent = this.data.description || '';
    
    this.priceEl.textContent = this.formatPrice(this.data.price);
    
    // Обновляем состояние кнопки
    this.updateButtonState();
  }

  // Метод для обновления состояния кнопки
  updateButtonState(isInCart: boolean = this.isInCart): void {
    this.isInCart = isInCart;
    
    if (this.addToCartButton) {
      // Проверяем, есть ли цена у товара
      const hasPrice = this.data && this.data.price !== null;
      
      if (!hasPrice) {
        // Товар без цены - кнопка неактивна
        this.addToCartButton.textContent = 'Недоступно';
        this.addToCartButton.disabled = true;
        this.addToCartButton.classList.add('button_alt');
      } else if (this.isInCart) {
        // Товар в корзине - можно удалить
        this.addToCartButton.textContent = 'Удалить из корзины';
        this.addToCartButton.disabled = false;
        this.addToCartButton.classList.remove('button_alt');
      } else {
        // Товар не в корзине - можно добавить
        this.addToCartButton.textContent = 'Купить';
        this.addToCartButton.disabled = false;
        this.addToCartButton.classList.remove('button_alt');
      }
    }
  }

  // Публичный метод для получения ID товара
  getProductId(): string | null {
    return this.data?.id || null;
  }
}
