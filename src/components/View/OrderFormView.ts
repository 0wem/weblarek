import { FormView } from './FormView';

export class OrderFormView extends FormView {
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;

  constructor(container: HTMLElement, eventEmitter: any) {
    super(container, eventEmitter);
    
    // Находим элементы в конструкторе и сохраняем в полях класса
    this.paymentButtons = this.form?.querySelectorAll('.order__buttons button') as NodeListOf<HTMLButtonElement>;
    this.addressInput = this.form?.querySelector('[name="address"]') as HTMLInputElement;
    
    // Устанавливаем слушатели событий один раз в конструкторе
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.selectPaymentMethod(button);
      });
    });

    // Валидация адреса
    this.addressInput?.addEventListener('input', () => {
      this.validateForm();
    });
  }

  protected handleSubmit(): void {
    const formData = this.getFormData();
    this.eventEmitter.emit('order:submit', formData);
  }

  private selectPaymentMethod(selectedButton: HTMLButtonElement): void {
    // Убираем активный класс со всех кнопок
    this.paymentButtons.forEach(button => {
      button.classList.remove('button_alt-active');
      button.classList.add('button_alt');
    });
    
    // Добавляем активный класс к выбранной кнопке
    selectedButton.classList.remove('button_alt');
    selectedButton.classList.add('button_alt-active');
    
    this.validateForm();
  }

  private validateForm(): void {
    const formData = this.getFormData();
    const address = formData.address as string;
    const payment = this.getSelectedPayment();
    
    const isValid = address && address.length > 5 && payment;
    this.setSubmitButtonEnabled(Boolean(isValid));
    
    if (!isValid) {
      if (!payment) {
        this.showErrors(['Необходимо указать адрес']);
      } else if (!address || address.length <= 5) {
        this.showErrors(['Необходимо указать адрес']);
      } else {
        this.showErrors(['Необходимо указать адрес']);
      }
    } else {
      this.clearErrors();
    }
  }

  private getSelectedPayment(): string | null {
    const activeButton = this.form?.querySelector('.button_alt-active') as HTMLButtonElement;
    return activeButton?.name || null;
  }
}
