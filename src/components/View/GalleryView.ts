import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ICardData } from '../../types';
import { CardCatalogView } from './CardCatalogView';

export class GalleryView extends Component<{ items: ICardData[] }> {
  private eventEmitter: EventEmitter;
  private items: ICardData[] = [];

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
  }

  render(data?: Partial<{ items: ICardData[] }>): HTMLElement {
    if (data?.items) {
      this.items = data.items;
      this.updateItems();
    }
    return this.container;
  }

  private updateItems(): void {
    this.container.innerHTML = '';
    
    this.items.forEach((item) => {
      const cardElement = document.createElement('button');
      cardElement.className = 'gallery__item card';
      const card = new CardCatalogView(cardElement, this.eventEmitter);
      card.render(item);
      this.container.appendChild(cardElement);
    });
  }
}
