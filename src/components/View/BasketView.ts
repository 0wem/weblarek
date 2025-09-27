import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { IBasketData } from '../../types';

export class BasketView extends Component<IBasketData> {
  private eventEmitter: EventEmitter;
  private basketList: HTMLUListElement;
  private basketButton: HTMLButtonElement;
  private basketPrice: HTMLElement;
  private emptyMessage: HTMLElement;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
    
    // Находим элементы в конструкторе и сохраняем в полях класса
    this.basketList = this.container.querySelector('.basket__list') as HTMLUListElement;
    this.basketButton = this.container.querySelector('.basket__button') as HTMLButtonElement;
    this.basketPrice = this.container.querySelector('.basket__price') as HTMLElement;
    this.emptyMessage = this.container.querySelector('.basket__empty') as HTMLElement;
    
    // Устанавливаем слушатели событий один раз в конструкторе
    this.basketButton?.addEventListener('click', () => {
      this.eventEmitter.emit('basket:order');
    });
  }

  render(data?: Partial<IBasketData>): HTMLElement {
    if (data?.totalPrice !== undefined) {
      this.updateTotalPrice(data.totalPrice);
    }
    
    return this.container;
  }

  set items(items: HTMLElement[]) {
    if (!this.basketList) return;
    
    this.basketList.replaceChildren(...items);
    
    if (items.length === 0) {
      this.showEmptyMessage();
      this.setButtonState(false);
    } else {
      this.hideEmptyMessage();
      this.setButtonState(true);
    }
  }

  private updateTotalPrice(totalPrice: number): void {
    if (this.basketPrice) {
      this.basketPrice.textContent = `${totalPrice} синапсов`;
    }
  }

  private showEmptyMessage(): void {
    if (this.emptyMessage) {
      this.emptyMessage.style.display = 'block';
    }
  }

  private hideEmptyMessage(): void {
    if (this.emptyMessage) {
      this.emptyMessage.style.display = 'none';
    }
  }

  private setButtonState(enabled: boolean): void {
    if (this.basketButton) {
      this.basketButton.disabled = !enabled;
      if (enabled) {
        this.basketButton.classList.remove('button_alt');
      } else {
        this.basketButton.classList.add('button_alt');
      }
    }
  }
}
