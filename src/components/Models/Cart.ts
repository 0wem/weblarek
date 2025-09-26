import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Cart {
  private items: IProduct[];
  private eventEmitter: EventEmitter;

  constructor(items: IProduct[] = [], eventEmitter: EventEmitter) {
    this.items = items;
    this.eventEmitter = eventEmitter;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this.eventEmitter.emit('cart:item-added', { item, items: this.items });
  }

  removeItem(id: string): void {
    const removedItem = this.items.find(item => item.id === id);
    this.items = this.items.filter(item => item.id !== id);
    this.eventEmitter.emit('cart:item-removed', { item: removedItem, items: this.items });
  }

  clear(): void {
    this.items = [];
    this.eventEmitter.emit('cart:cleared', { items: this.items });
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}