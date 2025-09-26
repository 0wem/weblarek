# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

**Model** - слой данных, отвечает за хранение и изменение данных.  
**View** - слой представления, отвечает за отображение данных на странице.  
**Presenter** - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

**Конструктор:**  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

**Поля класса:**  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

**Методы класса:**  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api
Содержит в себе базовую логику отправки запросов.

**Конструктор:**  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

**Поля класса:**  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

**Методы:**  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

**Конструктор класса** не принимает параметров.

**Поля класса:**  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

**Методы класса:**  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

### Интерфейсы данных

#### Товар IProduct
**Назначение:** IProduct — описывает структуру объекта товара, который хранится в каталоге и корзине. Содержит информацию о названии, цене, изображении, категории и описании товара.

```typescript
interface IProduct {
  id: string;       // уникальный идентификатор товара
  title: string;    // название товара
  description: string; // описание товара
  image: string;    // ссылка на изображение товара
  category: string; // категория, к которой относится товар
  price: number | null; // цена товара (null, если цена не указана)
}
```

#### Покупатель IBuyer
**Назначение:** IBuyer — описывает данные покупателя, необходимые для оформления заказа (контактные данные и способ оплаты).

```typescript
interface IBuyer {
  payment: TPayment; // выбранный способ оплаты
  email: string;     // email покупателя
  phone: string;     // телефон покупателя
  address: string;   // адрес доставки
}
```

#### Заказ IOrder
**Назначение:** IOrder — описывает структуру заказа, содержащего данные покупателя и список товаров.

```typescript
interface IOrder {
  buyer: IBuyer;     // данные покупателя
  items: IProduct[]; // список выбранных товаров
}
```

#### Тип оплаты TPayment
**Назначение:** TPayment — определяет возможные способы оплаты.

```typescript
type TPayment = 'card' | 'cash' | null;
```

### Модели данных

#### Класс ProductCatalog
Класс ProductCatalog - хранит полный каталог товаров, доступных для покупки, а также товар, выбранный для подробного просмотра. Отвечает за сохранение, получение и выбор конкретного товара.

**Конструктор:**
`constructor(products: IProduct[] = [], eventEmitter: EventEmitter)`

Принимает необязательный массив товаров, по умолчанию пустой, и EventEmitter для генерации событий.

**Поля класса:**
- `products: IProduct[]` — массив товаров.
- `selectedProduct: IProduct | null` — выбранный товар (по умолчанию null).
- `eventEmitter: EventEmitter` — брокер событий.

**Методы:**
- `setProducts(products: IProduct[]): void` — обновляет список товаров и генерирует событие `products:changed`.
- `getProducts(): IProduct[]` — возвращает список товаров.
- `getProductById(id: string): IProduct | undefined` — возвращает товар по id.
- `setSelectedProduct(product: IProduct | null): void` — устанавливает выбранный товар и генерирует событие `product:selected`.
- `getSelectedProduct(): IProduct | null` — возвращает выбранный товар.

#### Класс Cart
Класс Cart - управляет товарами в корзине.

**Конструктор:** 
`constructor(items: IProduct[] = [], eventEmitter: EventEmitter)`

Принимает необязательный массив товаров, по умолчанию пустой, и EventEmitter для генерации событий.

**Поля класса:**
- `items: IProduct[]` — товары в корзине.
- `eventEmitter: EventEmitter` — брокер событий.

**Методы:**
- `getItems(): IProduct[]` — возвращает товары из корзины.
- `addItem(item: IProduct): void` — добавляет товар в корзину и генерирует событие `cart:item-added`.
- `removeItem(id: string): void` — удаляет товар из корзины и генерирует событие `cart:item-removed`.
- `clear(): void` — очищает корзину и генерирует событие `cart:cleared`.
- `getTotalPrice(): number` — вычисляет суммарную стоимость всех товаров.
- `getCount(): number` — возвращает количество товаров в корзине.
- `hasItem(id: string): boolean` — проверяет, есть ли товар в корзине по id.

#### Класс Buyer
Класс Buyer - хранит и управляет данными покупателя.

**Конструктор:** 
`constructor(eventEmitter: EventEmitter, data?: IBuyer)`

Принимает EventEmitter для генерации событий и необязательный объект с данными покупателя.

**Поля класса:**
- `payment: TPayment` — выбранный способ оплаты.
- `email: string` — электронная почта покупателя.
- `phone: string` — телефон покупателя.
- `address: string` — адрес покупателя.
- `eventEmitter: EventEmitter` — брокер событий.

**Методы:**
- `setData(data: Partial<IBuyer>): void` — обновляет данные покупателя и генерирует событие `buyer:data-changed`.
- `getData(): IBuyer` — возвращает текущие данные покупателя.
- `clear(): void` — очищает данные и генерирует событие `buyer:cleared`.
- `validate(): { payment: boolean; email: boolean; phone: boolean; address: boolean }` — проверяет корректность введённых данных.
- `isValid(): boolean` — возвращает true, если все данные корректны.

### Слой коммуникации

#### Класс Communication
Класс Communication - отвечает за взаимодействие с сервером

**Конструктор:**
`constructor(api: Api)`

**Поля класса:**
- `api: Api` — объект для взаимодействия с сервером

**Методы:**
- `getProductList(): Promise<IProduct[]>` — отправляет запрос на сервер и возвращает список товаров
- `sendOrder(order: IOrder): Promise<object>` — отправляет заказ на сервер и возвращает ответ

## Слой View (Представления)

Слой View отвечает за отображение данных на странице и взаимодействие с пользователем. Все классы представления наследуются от базового класса `Component<T>` и следуют принципам MVP архитектуры.

### Типы данных для View слоя

#### ICardData
**Интерфейс данных карточки товара**

```typescript
export interface ICardData {
  id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  price: number | null;
}
```

**Описание:** Определяет структуру данных для отображения в карточках товаров

#### IFormData
**Интерфейс данных формы**

```typescript
export interface IFormData {
  [key: string]: string | boolean;
}
```

**Описание:** Определяет структуру данных для форм с динамическими полями

#### IBasketData
**Интерфейс данных корзины**

```typescript
export interface IBasketData {
  items: ICardData[];
  totalPrice: number;
}
```

**Описание:** Определяет структуру данных для отображения корзины

#### IOrderSuccessData
**Интерфейс данных успешного заказа**

```typescript
export interface IOrderSuccessData {
  totalPrice: number;
}
```

**Описание:** Определяет структуру данных для отображения сообщения об успешном заказе

### Основные компоненты страницы

#### PageView
**Компонент главной страницы**

```typescript
export class PageView extends Component<{}> {
    constructor(container: HTMLElement, eventEmitter: EventEmitter)
    render(): HTMLElement
    lockScroll(): void
    unlockScroll(): void
}
```

**Ответственность:** Управление общей структурой страницы  
**Разметка:** `.page__wrapper`  
**Функциональность:**
- Управление блокировкой прокрутки страницы
- Координация работы всех дочерних компонентов

#### HeaderView  
**Компонент шапки сайта**

```typescript
export class HeaderView extends Component<{ count: number }> {
    constructor(container: HTMLElement, eventEmitter: EventEmitter)
    render(data?: Partial<{ count: number }>): HTMLElement
}
```

**Ответственность:** Отображение логотипа и корзины  
**Разметка:** `.header`  
**Функциональность:**
- Отображение логотипа сайта
- Отображение счетчика товаров в корзине
- Обработка клика по корзине

**События:**
- `basket:open` - генерируется при клике по корзине

#### GalleryView
**Компонент галереи товаров**

```typescript
export class GalleryView extends Component<{ items: ICardData[] }> {
    constructor(container: HTMLElement, eventEmitter: EventEmitter)
    render(data?: Partial<{ items: ICardData[] }>): HTMLElement
    private updateItems(): void
}
```

**Ответственность:** Отображение каталога товаров  
**Разметка:** `.gallery`  
**Функциональность:**
- Отображение сетки товаров
- Обработка кликов по товарам для открытия превью

### Иерархия классов карточек товаров

#### CardView (Родительский класс)
**Базовый класс для всех типов карточек**

```typescript
export abstract class CardView extends Component<ICardData> {
    constructor(container: HTMLElement, eventEmitter: EventEmitter)
    render(data?: Partial<ICardData>): HTMLElement
    protected abstract updateContent(): void
    protected formatPrice(price: number | null): string
    protected getCategoryClass(category: string): string
}
```

**Ответственность:** Общая функциональность для всех карточек  
**Общая функциональность:**
- Отображение изображения товара
- Отображение названия товара
- Отображение цены товара
- Отображение категории товара
- Обработка кликов

#### CardCatalogView extends CardView
**Карточка товара в каталоге**

```typescript
export class CardCatalogView extends CardView {
    constructor(container: HTMLElement, eventEmitter: EventEmitter)
    protected updateContent(): void
}
```

**Ответственность:** Отображение товара в галерее каталога  
**Разметка:** `.gallery__item.card`  
**Особенности:**
- Компактное отображение
- Кнопка для открытия превью товара
- Вертикальная компоновка элементов

**События:**
- `card:select` - генерируется при клике по карточке для открытия превью

#### CardPreviewView extends CardView  
**Карточка товара в превью**

```typescript
export class CardPreviewView extends CardView {
    constructor(container: HTMLElement, eventEmitter: EventEmitter)
    protected updateContent(): void
    updateButtonState(isInCart: boolean): void
    getProductId(): string | null
}
```

**Ответственность:** Детальное отображение товара в модальном окне  
**Разметка:** `.card.card_full`  
**Особенности:**
- Расширенное отображение с описанием
- Горизонтальная компоновка
- Кнопка "Купить"/"Удалить из корзины"
- Полная информация о товаре

**События:**
- `card:add` - генерируется при клике по кнопке "Купить"
- `card:remove` - генерируется при клике по кнопке "Удалить из корзины"

#### CardBasketView extends CardView
**Карточка товара в корзине**

```typescript
export class CardBasketView extends CardView {
    constructor(container: HTMLElement, eventEmitter: EventEmitter, index: number = 0)
    render(data?: Partial<ICardData>): HTMLElement
    protected updateContent(): void
    setIndex(index: number): void
}
```

**Ответственность:** Отображение товара в списке корзины  
**Разметка:** `.basket__item.card.card_compact`  
**Особенности:**
- Компактное горизонтальное отображение
- Номер позиции в корзине
- Кнопка удаления товара
- Минимальная информация

**События:**
- `card:remove` - генерируется при клике по кнопке удаления

### Иерархия классов форм

#### FormView (Родительский класс)
**Базовый класс для всех форм**

```typescript
export abstract class FormView extends Component<IFormData> {
    constructor(container: HTMLElement, eventEmitter: EventEmitter)
    render(data?: Partial<IFormData>): HTMLElement
    protected abstract handleSubmit(): void
    protected updateForm(data: Partial<IFormData>): void
    protected getFormData(): IFormData
    protected showErrors(errors: string[]): void
    protected clearErrors(): void
    protected setSubmitButtonEnabled(enabled: boolean): void
}
```

**Ответственность:** Общая функциональность для всех форм  
**Общая функциональность:**
- Валидация полей формы
- Отображение ошибок валидации
- Управление состоянием кнопки отправки
- Обработка отправки формы

#### OrderFormView extends FormView
**Форма оформления заказа**

```typescript
export class OrderFormView extends FormView {
    constructor(container: HTMLElement, eventEmitter: EventEmitter)
    protected handleSubmit(): void
    private selectPaymentMethod(selectedButton: HTMLButtonElement): void
    private validateForm(): void
    private getSelectedPayment(): string | null
}
```

**Ответственность:** Сбор данных о способе оплаты и адресе доставки  
**Разметка:** `.form[name="order"]`  
**Поля:**
- Способ оплаты (онлайн/при получении)
- Адрес доставки

**Особенности:**
- Переключатели способа оплаты
- Валидация адреса

**События:**
- `order:submit` - генерируется при отправке формы заказа

#### ContactsFormView extends FormView
**Форма контактных данных**

```typescript
export class ContactsFormView extends FormView {
    constructor(container: HTMLElement, eventEmitter: EventEmitter)
    protected handleSubmit(): void
    private validateForm(): void
    private isValidEmail(email: string): boolean
    private isValidPhone(phone: string): boolean
    private formatPhoneNumber(input: HTMLInputElement): void
}
```

**Ответственность:** Сбор контактной информации покупателя  
**Разметка:** `.form[name="contacts"]`  
**Поля:**
- Email
- Телефон

**Особенности:**
- Валидация email
- Форматирование номера телефона

**События:**
- `contacts:submit` - генерируется при отправке формы контактов

### Модальные окна и независимые компоненты

#### ModalView
**Компонент модального окна**

```typescript
export class ModalView extends Component<{ content: HTMLElement }> {
    constructor(container: HTMLElement, eventEmitter: EventEmitter)
    render(data?: Partial<{ content: HTMLElement }>): HTMLElement
    open(): void
    close(): void
    isOpen(): boolean
    setContent(content: HTMLElement): void
}
```

**Ответственность:** Управление отображением модальных окон  
**Разметка:** `.modal`  
**Функциональность:**
- Показ/скрытие модального окна
- Обработка клика по кнопке закрытия
- Блокировка прокрутки фона
- Управление содержимым модального окна

**События:**
- `modal:open` - генерируется при открытии модального окна
- `modal:close` - генерируется при закрытии модального окна

**Важно:** Модальное окно не может иметь дочерние классы и не наследуется другими компонентами.

#### BasketView
**Компонент корзины (независимый)**

```typescript
export class BasketView extends Component<IBasketData> {
    constructor(container: HTMLElement, eventEmitter: EventEmitter)
    render(data?: Partial<IBasketData>): HTMLElement
    private updateItems(): void
    private updateTotalPrice(totalPrice: number): void
}
```

**Ответственность:** Отображение списка товаров в корзине  
**Разметка:** `.basket`  
**Функциональность:**
- Отображение списка товаров
- Подсчет общей суммы
- Кнопка оформления заказа
- Может отображаться в модальном окне

**События:**
- `basket:order` - генерируется при клике по кнопке "Оформить"

#### OrderSuccessView
**Компонент успешного заказа (независимый)**

```typescript
export class OrderSuccessView extends Component<IOrderSuccessData> {
    constructor(container: HTMLElement, eventEmitter: EventEmitter)
    render(data?: Partial<IOrderSuccessData>): HTMLElement
    private updateContent(totalPrice: number): void
}
```

**Ответственность:** Отображение сообщения об успешном оформлении заказа  
**Разметка:** `.order-success`  
**Функциональность:**
- Отображение сообщения об успехе
- Показ суммы списания
- Кнопка возврата к покупкам
- Может отображаться в модальном окне

**События:**
- `order-success:close` - генерируется при клике по кнопке "За новыми покупками!"

#### ButtonView
**Компонент кнопки**

```typescript
export class ButtonView extends Component<{ text: string; disabled?: boolean }> {
    constructor(container: HTMLElement, eventEmitter: EventEmitter)
    render(data?: Partial<{ text: string; disabled?: boolean }>): HTMLElement
}
```

**Ответственность:** Отображение интерактивных кнопок  
**Разметка:** `.button`  
**Варианты:**
- `.button` - основная кнопка
- `.button_alt` - альтернативная кнопка
- `.button_alt-active` - активная альтернативная кнопка

**События:**
- `button:click` - генерируется при клике по кнопке

## Презентер

Презентер является центральным компонентом архитектуры MVP, который координирует взаимодействие между Model и View слоями. В данном приложении презентер реализован в основном файле `main.ts` без выделения в отдельный класс, что упрощает структуру для одностраничного приложения.

### Принципы работы презентера

1. **Обработка событий** - презентер подписывается на события от моделей данных и представлений
2. **Координация логики** - определяет последовательность действий при изменении состояния
3. **Обновление представлений** - вызывает методы рендеринга компонентов View
4. **Работа с данными** - использует методы моделей для получения и изменения данных
5. **Отсутствие генерации событий** - презентер только обрабатывает события, не генерирует их

### Архитектурные решения

**Выбранный подход:** Презентер реализован в `main.ts` без выделения в отдельный класс.

**Обоснование:**
- Приложение имеет только одну страницу с относительно простой логикой
- Упрощает структуру проекта и уменьшает связанность компонентов
- Позволяет быстро итерировать и тестировать логику
- Соответствует принципам MVP без излишнего усложнения

**Альтернативный подход:** При необходимости можно выделить презентер в отдельный класс `AppPresenter`, который будет:
- Использовать инверсию зависимостей через конструктор
- Иметь четко определенные методы для обработки событий
- Легко тестироваться и расширяться

### События, обрабатываемые презентером

#### События моделей данных:
- `products:changed` - обновление каталога товаров
- `product:selected` - выбор товара для просмотра
- `cart:item-added` - добавление товара в корзину
- `cart:item-removed` - удаление товара из корзины
- `cart:cleared` - очистка корзины
- `buyer:data-changed` - изменение данных покупателя
- `buyer:cleared` - очистка данных покупателя

#### События представлений:
- `card:select` - выбор карточки для просмотра
- `card:add` - добавление товара в корзину
- `card:remove` - удаление товара из корзины
- `basket:open` - открытие корзины
- `basket:order` - оформление заказа
- `order:submit` - отправка формы заказа
- `contacts:submit` - отправка формы контактов
- `order-success:close` - закрытие сообщения об успешном заказе
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна

### Логика обновления представлений

Представления обновляются только в двух случаях:
1. **При обработке события от модели данных** - когда данные изменились
2. **При открытии модального окна** - для отображения актуального содержимого

Это обеспечивает эффективность рендеринга и избегает лишних обновлений UI.

## События приложения

Все компоненты View слоя генерируют события при взаимодействии пользователя. Ниже приведен полный список событий с описанием и данными, которые передаются:

### События карточек товаров

#### `card:select`
**Описание:** Выбор товара для просмотра превью  
**Компонент:** `CardCatalogView`  
**Данные:** `{ product: ICardData }`  
**Триггер:** Клик по карточке товара в каталоге

#### `card:add`
**Описание:** Добавление товара в корзину  
**Компонент:** `CardPreviewView`  
**Данные:** `{ product: ICardData }`  
**Триггер:** Клик по кнопке "Купить" в превью товара

#### `card:remove`
**Описание:** Удаление товара из корзины  
**Компонент:** `CardBasketView`, `CardPreviewView`  
**Данные:** `{ product: ICardData }`  
**Триггер:** Клик по кнопке удаления в корзине или превью

### События форм

#### `order:submit`
**Описание:** Отправка формы заказа  
**Компонент:** `OrderFormView`  
**Данные:** `IFormData` (данные формы с полями address, payment)  
**Триггер:** Отправка формы заказа

#### `contacts:submit`
**Описание:** Отправка формы контактов  
**Компонент:** `ContactsFormView`  
**Данные:** `IFormData` (данные формы с полями email, phone)  
**Триггер:** Отправка формы контактов

### События модальных окон

#### `modal:open`
**Описание:** Открытие модального окна  
**Компонент:** `ModalView`  
**Данные:** `undefined`  
**Триггер:** Вызов метода `open()` модального окна

#### `modal:close`
**Описание:** Закрытие модального окна  
**Компонент:** `ModalView`  
**Данные:** `undefined`  
**Триггер:** Клик по кнопке закрытия, клик по фону или нажатие Escape

### События корзины и заказов

#### `basket:open`
**Описание:** Открытие корзины  
**Компонент:** `HeaderView`  
**Данные:** `undefined`  
**Триггер:** Клик по кнопке корзины в шапке

#### `basket:order`
**Описание:** Оформление заказа  
**Компонент:** `BasketView`  
**Данные:** `undefined`  
**Триггер:** Клик по кнопке "Оформить" в корзине

#### `order-success:close`
**Описание:** Закрытие сообщения об успешном заказе  
**Компонент:** `OrderSuccessView`  
**Данные:** `undefined`  
**Триггер:** Клик по кнопке "За новыми покупками!"

### События кнопок

#### `button:click`
**Описание:** Клик по кнопке  
**Компонент:** `ButtonView`  
**Данные:** `{ button: HTMLButtonElement }`  
**Триггер:** Клик по любой кнопке, использующей компонент ButtonView

## События моделей данных

Все модели данных генерируют события при изменении состояния. Это обеспечивает реактивность приложения и позволяет другим компонентам реагировать на изменения данных.

### События ProductCatalog

#### `products:changed`
**Описание:** Изменение списка товаров в каталоге  
**Модель:** `ProductCatalog`  
**Данные:** `{ products: IProduct[] }`  
**Триггер:** Вызов метода `setProducts()`

#### `product:selected`
**Описание:** Выбор товара для просмотра  
**Модель:** `ProductCatalog`  
**Данные:** `{ product: IProduct | null }`  
**Триггер:** Вызов метода `setSelectedProduct()`

### События Cart

#### `cart:item-added`
**Описание:** Добавление товара в корзину  
**Модель:** `Cart`  
**Данные:** `{ item: IProduct, items: IProduct[] }`  
**Триггер:** Вызов метода `addItem()`

#### `cart:item-removed`
**Описание:** Удаление товара из корзины  
**Модель:** `Cart`  
**Данные:** `{ item: IProduct | undefined, items: IProduct[] }`  
**Триггер:** Вызов метода `removeItem()`

#### `cart:cleared`
**Описание:** Очистка корзины  
**Модель:** `Cart`  
**Данные:** `{ items: IProduct[] }` (пустой массив)  
**Триггер:** Вызов метода `clear()`

### События Buyer

#### `buyer:data-changed`
**Описание:** Изменение данных покупателя  
**Модель:** `Buyer`  
**Данные:** `{ oldData: IBuyer, newData: IBuyer }`  
**Триггер:** Вызов метода `setData()`

#### `buyer:cleared`
**Описание:** Очистка данных покупателя  
**Модель:** `Buyer`  
**Данные:** `{ oldData: IBuyer, newData: IBuyer }`  
**Триггер:** Вызов метода `clear()`

### Примеры использования событий

```typescript
import { EventEmitter } from './components/base/Events';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

// Создаем EventEmitter
const eventEmitter = new EventEmitter();

// Создаем модели с EventEmitter
const productCatalog = new ProductCatalog([], eventEmitter);
const cart = new Cart([], eventEmitter);
const buyer = new Buyer(eventEmitter);

// Подписка на события каталога
eventEmitter.on('products:changed', (data) => {
  console.log('Каталог обновлен:', data.products);
  // Обновить UI галереи
});

eventEmitter.on('product:selected', (data) => {
  console.log('Выбран товар:', data.product);
  // Показать превью товара
});

// Подписка на события корзины
eventEmitter.on('cart:item-added', (data) => {
  console.log('Товар добавлен в корзину:', data.item);
  // Обновить счетчик корзины
});

eventEmitter.on('cart:item-removed', (data) => {
  console.log('Товар удален из корзины:', data.item);
  // Обновить список товаров в корзине
});

eventEmitter.on('cart:cleared', (data) => {
  console.log('Корзина очищена');
  // Очистить UI корзины
});

// Подписка на события покупателя
eventEmitter.on('buyer:data-changed', (data) => {
  console.log('Данные покупателя изменены:', data.newData);
  // Обновить форму заказа
});

eventEmitter.on('buyer:cleared', (data) => {
  console.log('Данные покупателя очищены');
  // Сбросить форму
});
```