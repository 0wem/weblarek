import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class ButtonView extends Component<{ text: string; disabled?: boolean }> {
  private eventEmitter: EventEmitter;
  private button: HTMLButtonElement;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
    
    // Находим элементы в конструкторе и сохраняем в полях класса
    this.button = this.container as HTMLButtonElement;
    
    // Устанавливаем слушатели событий один раз в конструкторе
    this.button.addEventListener('click', () => {
      this.eventEmitter.emit('button:click', { button: this.button });
    });
  }

  render(data?: Partial<{ text: string; disabled?: boolean }>): HTMLElement {
    if (data?.text) {
      this.button.textContent = data.text;
    }
    
    if (data?.disabled !== undefined) {
      this.button.disabled = data.disabled;
    }
    
    return this.container;
  }
}
