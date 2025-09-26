import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class PageView extends Component<{}> {
  constructor(container: HTMLElement, _eventEmitter: EventEmitter) {
    super(container);
  }

  render(): HTMLElement {
    return this.container;
  }

  // Блокировка прокрутки страницы при открытии модального окна
  lockScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  // Разблокировка прокрутки страницы
  unlockScroll(): void {
    document.body.style.overflow = '';
  }
}
