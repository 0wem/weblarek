import { Api } from '../base/Api';
import { IProduct, IOrder } from '../../types/index';

interface IApiProductsResponse {
  items: IProduct[];
}

export class Communication {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getProductList(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<IApiProductsResponse>(`/product/`);
      
      return response.items || [];
    } catch (error) {
      console.error('Ошибка при получении товаров:', error);
      throw error;
    }
  }

  async sendOrder(order: IOrder): Promise<object> {
    try {
      return await this.api.post(`/order/`, order);
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
      return {};
    }
  }
}