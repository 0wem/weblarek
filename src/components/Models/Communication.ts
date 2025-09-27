import { Api } from '../base/Api';
import { IProduct, IOrder } from '../../types/index';
import { API_URL } from '../../utils/constants'; 

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
      // Ошибка при получении товаров - возвращаем пустой массив
      return [];
    }
  }

  async sendOrder(order: IOrder): Promise<object> {
    try {
      return await this.api.post(`${API_URL}/order/`, order);
    } catch (error) {
      // Ошибка при отправке заказа - возвращаем пустой объект
      return {};
    }
  }
}