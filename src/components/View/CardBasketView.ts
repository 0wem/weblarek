import { CardView } from './CardView';
import { ICardData } from '../../types';

export class CardBasketView extends CardView {
  private index: number;
  private indexEl: HTMLElement;
  private titleEl: HTMLElement;
  private priceEl: HTMLElement;
  private deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, eventEmitter: any, index: number = 0) {
    super(container, eventEmitter);
    this.index = index;
    
    // Создаем разметку карточки корзины
    this.container.innerHTML = `
      <span class="basket__item-index">${this.index}</span>
      <span class="card__title"></span>
      <span class="card__price"></span>
      <button class="basket__item-delete card__button" aria-label="удалить"></button>
    `;
    
    // Находим элементы в конструкторе и сохраняем в полях класса
    this.indexEl = this.container.querySelector('.basket__item-index') as HTMLElement;
    this.titleEl = this.container.querySelector('.card__title') as HTMLElement;
    this.priceEl = this.container.querySelector('.card__price') as HTMLElement;
    this.deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;
    
    // Устанавливаем слушатели событий один раз в конструкторе
    this.deleteButton?.addEventListener('click', () => {
      if (this.data) {
        this.eventEmitter.emit('card:remove', { product: this.data });
      }
    });
  }

  render(data?: Partial<ICardData>): HTMLElement {
    if (data) {
      this.data = { ...this.data, ...data } as ICardData;
      this.updateContent();
    }
    return this.container;
  }

  protected updateContent(): void {
    if (!this.data) return;

    // Обновляем содержимое элементов
    this.indexEl.textContent = this.index.toString();
    this.titleEl.textContent = this.data.title;
    this.priceEl.textContent = this.formatPrice(this.data.price);
  }

  setIndex(index: number): void {
    this.index = index;
    this.indexEl.textContent = index.toString();
  }
}
