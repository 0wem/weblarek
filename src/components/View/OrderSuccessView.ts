import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { IOrderSuccessData } from '../../types';

export class OrderSuccessView extends Component<IOrderSuccessData> {
  private eventEmitter: EventEmitter;
  private description: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
    
    // Находим элементы в конструкторе и сохраняем в полях класса
    this.description = this.container.querySelector('.order-success__description') as HTMLElement;
    this.closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;
    
    // Устанавливаем слушатели событий один раз в конструкторе
    this.closeButton?.addEventListener('click', () => {
      this.eventEmitter.emit('order-success:close');
    });
  }

  render(data?: Partial<IOrderSuccessData>): HTMLElement {
    if (data?.totalPrice !== undefined) {
      this.updateContent(data.totalPrice);
    }
    return this.container;
  }

  private updateContent(totalPrice: number): void {
    if (this.description) {
      this.description.textContent = `Списано ${totalPrice} синапсов`;
    }
  }
}
