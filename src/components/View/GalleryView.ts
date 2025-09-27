import { Component } from '../base/Component';
import { ICardData } from '../../types';

export class GalleryView extends Component<{ items: ICardData[] }> {
  constructor(container: HTMLElement) {
    super(container);
  }

  render(): HTMLElement {
    return this.container;
  }

  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
