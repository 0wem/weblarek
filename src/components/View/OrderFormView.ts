import { FormView } from './FormView';
import { EventEmitter } from '../base/Events';

export class OrderFormView extends FormView {
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container, eventEmitter);
     
    // Находим элементы в конструкторе и сохраняем в полях класса
    this.paymentButtons = this.form?.querySelectorAll('.order__buttons button') as NodeListOf<HTMLButtonElement>;
    this.addressInput = this.form?.querySelector('[name="address"]') as HTMLInputElement;
    
    
    // Устанавливаем слушатели событий один раз в конструкторе
    if (this.paymentButtons) {
      this.paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
          this.selectPaymentMethod(button);
          this.eventEmitter.emit('order:change', { value: button.name, key: 'payment' });
        });
      });
    }

    // Отправка данных адреса в модель
    this.addressInput?.addEventListener('input', () => {
      this.eventEmitter.emit('order:change', { value: this.addressInput.value, key: 'address' });
    });
  }

  protected handleSubmit(): void {
    const formData = this.getFormData();
    this.eventEmitter.emit('order:submit', formData);
  }

  private selectPaymentMethod(selectedButton: HTMLButtonElement): void {
    // Убираем активный класс со всех кнопок
    if (this.paymentButtons) {
      this.paymentButtons.forEach(button => {
        button.classList.remove('button_alt-active');
        button.classList.add('button_alt');
      });
    }
    
    // Добавляем активный класс к выбранной кнопке
    selectedButton.classList.remove('button_alt');
    selectedButton.classList.add('button_alt-active');
  }

  validate(errors: { payment: boolean; email: boolean; phone: boolean; address: boolean }): void {
    const isValid = errors.payment && errors.address;
    this.setSubmitButtonEnabled(isValid);
    
    if (!isValid) {
      if (!errors.payment) {
        this.showErrors(['Необходимо выбрать способ оплаты']);
      } else if (!errors.address) {
        this.showErrors(['Необходимо указать адрес']);
      }
    } else {
      this.clearErrors();
    }
  }



  public resetForm(): void {
    super.resetForm();
    
    // Сбрасываем кнопки оплаты к исходному состоянию
    if (this.paymentButtons) {
      this.paymentButtons.forEach(button => {
        button.classList.remove('button_alt-active');
        button.classList.add('button_alt');
      });
    }
  }
}
