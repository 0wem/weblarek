import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ICardData } from '../../types';

export abstract class CardView extends Component<ICardData> {
  protected eventEmitter: EventEmitter;
  protected data: ICardData | null = null;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
  }

  render(data?: Partial<ICardData>): HTMLElement {
    if (data) {
      this.data = { ...this.data, ...data } as ICardData;
      this.updateContent();
    }
    return this.container;
  }

  protected abstract updateContent(): void;

  protected formatPrice(price: number | null): string {
    if (price === null) return 'Бесценно';
    return `${price} синапсов`;
  }

  protected getCategoryClass(category: string): string {
    // Используем константы из utils/constants.ts
    const categoryMap: { [key: string]: string } = {
      'софт-скил': 'card__category_soft',
      'хард-скил': 'card__category_hard',
      'другое': 'card__category_other',
      'дополнительное': 'card__category_additional',
      'кнопка': 'card__category_button'
    };
    return categoryMap[category] || 'card__category_other';
  }
}
