import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class ModalView extends Component<{ content: HTMLElement }> {
  private eventEmitter: EventEmitter;
  private modalContainer: HTMLElement;
  private modalContent: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
    
    // Находим элементы в конструкторе и сохраняем в полях класса
    this.modalContainer = this.container;
    this.modalContent = this.container.querySelector('.modal__content') as HTMLElement;
    this.closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;
    
    // Устанавливаем слушатели событий один раз в конструкторе
    this.closeButton?.addEventListener('click', () => {
      this.close();
    });
    
    this.modalContainer.addEventListener('click', (e) => {
      if (e.target === this.modalContainer) {
        this.close();
      }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  render(data?: Partial<{ content: HTMLElement }>): HTMLElement {
    if (data?.content) {
      this.setContent(data.content);
    }
    return this.container;
  }

  open(): void {
    this.modalContainer.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
    this.eventEmitter.emit('modal:open');
  }

  close(): void {
    this.modalContainer.classList.remove('modal_active');
    document.body.style.overflow = '';
    this.eventEmitter.emit('modal:close');
  }

  isOpen(): boolean {
    return this.modalContainer.classList.contains('modal_active');
  }

  setContent(content: HTMLElement): void {
    this.modalContent.innerHTML = '';
    this.modalContent.appendChild(content);
  }
}
