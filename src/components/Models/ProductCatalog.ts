import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductCatalog {
  private products: IProduct[];
  private selectedProduct: IProduct | null;
  private eventEmitter: EventEmitter;

  constructor(products: IProduct[] = [], eventEmitter: EventEmitter) {
    this.products = products;
    this.selectedProduct = null;
    this.eventEmitter = eventEmitter;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.eventEmitter.emit('products:changed', { products: this.products });
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  setSelectedProduct(product: IProduct | null): void {
    this.selectedProduct = product;
    this.eventEmitter.emit('product:selected', { product: this.selectedProduct });
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}