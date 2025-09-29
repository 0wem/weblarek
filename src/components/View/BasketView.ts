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
      const currentItems = this.basketList.children.length;
      if (currentItems > 0) {
        this.eventEmitter.emit('basket:order');
      }
    });
  }

  render(data?: Partial<IBasketData>): HTMLElement {
    if (data?.items !== undefined) {
      this.updateItems(data.items);
    }
    
    if (data?.totalPrice !== undefined) {
      this.updateTotalPrice(data.totalPrice);
    }
    
    return this.container;
  }

  set items(items: HTMLElement[]) {
    this.basketList.replaceChildren(...items);
  }

  private updateItems(items: IBasketData['items']): void {
    if (!this.basketList) return;
    
    this.basketList.innerHTML = '';
    
    if (items.length === 0) {
      // Показываем сообщение о пустой корзине
      this.showEmptyMessage();
      this.setButtonState(false);
    } else {
      // Скрываем сообщение о пустой корзине
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
    } else {
      // Создаем сообщение о пустой корзине, если его нет
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'basket__empty';
      emptyDiv.textContent = 'Корзина пуста';
      emptyDiv.style.textAlign = 'center';
      emptyDiv.style.color = '#999';
      emptyDiv.style.padding = '2rem';
      
      // Вставляем после списка товаров
      this.basketList.parentNode?.insertBefore(emptyDiv, this.basketList.nextSibling);
      this.emptyMessage = emptyDiv;
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
