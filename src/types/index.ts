export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}


export interface IProduct {
  id: string;           // Уникальный идентификатор товара
  description: string;  // Описание товара
  image: string;        // URL изображения товара
  title: string;        // Название товара
  category: string;     // Категория товара
  price: number | null; // Цена товара (может быть null, если цена не указана)
}

export interface IBuyer {
  payment: TPayment; // выбранный способ оплаты
  email: string;     // email покупателя
  phone: string;     // телефон покупателя
  address: string;   // адрес доставки
}

export interface IOrder {
  buyer: IBuyer;     // данные покупателя
  items: IProduct[]; // список выбранных товаров
}

export type TPayment = 'card' | 'cash' | null;

export interface ICardData {
  id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  price: number | null;
}

export interface IFormData {
  [key: string]: string | boolean;
}

export interface IBasketData {
  items: ICardData[];
  totalPrice: number;
}

export interface IOrderSuccessData {
  totalPrice: number;
}