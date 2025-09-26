import { CardView } from './CardView';

export class CardCatalogView extends CardView {
  private categoryEl: HTMLElement;
  private titleEl: HTMLElement;
  private imageEl: HTMLImageElement;
  private priceEl: HTMLElement;

  constructor(container: HTMLElement, eventEmitter: any) {
    super(container, eventEmitter);
    
    // Создаем разметку карточки каталога точно как в макете
    this.container.innerHTML = `
      <span class="card__category"></span>
      <h2 class="card__title"></h2>
      <img class="card__image" src="" alt="" />
      <span class="card__price"></span>
    `;
    
    // Находим элементы в конструкторе и сохраняем в полях класса
    this.categoryEl = this.container.querySelector('.card__category') as HTMLElement;
    this.titleEl = this.container.querySelector('.card__title') as HTMLElement;
    this.imageEl = this.container.querySelector('.card__image') as HTMLImageElement;
    this.priceEl = this.container.querySelector('.card__price') as HTMLElement;
    
    // Устанавливаем слушатели событий один раз в конструкторе
    this.container.addEventListener('click', () => {
      if (this.data) {
        this.eventEmitter.emit('card:select', { product: this.data });
      }
    });
  }

  protected updateContent(): void {
    if (!this.data) return;

    // Обновляем содержимое элементов
    this.categoryEl.textContent = this.data.category;
    this.categoryEl.className = `card__category ${this.getCategoryClass(this.data.category)}`;
    
    this.titleEl.textContent = this.data.title;
    
    this.setImage(this.imageEl, this.data.image, this.data.title);
    
    this.priceEl.textContent = this.formatPrice(this.data.price);
  }
}
