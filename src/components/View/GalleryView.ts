import { Component } from '../base/Component';

export class GalleryView extends Component<{ items: HTMLElement[] }> {
  constructor(container: HTMLElement) {
    super(container);
  }

  render(data?: Partial<{ items: HTMLElement[] }>): HTMLElement {
    if (data?.items !== undefined) {
      this.container.replaceChildren(...data.items);
    }
    return this.container;
  }

  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
