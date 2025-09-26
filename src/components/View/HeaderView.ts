import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class HeaderView extends Component<{ count: number }> {
  private eventEmitter: EventEmitter;
  private basketButton: HTMLButtonElement;
  private basketCounter: HTMLSpanElement;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
    
    // Находим элементы в конструкторе и сохраняем в полях класса
    this.basketButton = this.container.querySelector('.header__basket') as HTMLButtonElement;
    this.basketCounter = this.container.querySelector('.header__basket-counter') as HTMLSpanElement;
    
    // Устанавливаем слушатели событий один раз в конструкторе
    this.basketButton?.addEventListener('click', () => {
      this.eventEmitter.emit('basket:open');
    });
  }

  render(data?: Partial<{ count: number }>): HTMLElement {
    if (data?.count !== undefined) {
      this.basketCounter.textContent = data.count.toString();
    }
    return this.container;
  }
}
