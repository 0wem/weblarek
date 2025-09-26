import { FormView } from './FormView';

export class ContactsFormView extends FormView {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, eventEmitter: any) {
    super(container, eventEmitter);
    
    // Находим элементы в конструкторе и сохраняем в полях класса
    this.emailInput = this.form?.querySelector('[name="email"]') as HTMLInputElement;
    this.phoneInput = this.form?.querySelector('[name="phone"]') as HTMLInputElement;
    
    // Устанавливаем слушатели событий один раз в конструкторе
    // Валидация email
    this.emailInput?.addEventListener('input', () => {
      this.validateForm();
    });

    // Валидация телефона
    this.phoneInput?.addEventListener('input', () => {
      this.formatPhoneNumber(this.phoneInput);
      this.validateForm();
    });
  }

  protected handleSubmit(): void {
    const formData = this.getFormData();
    this.eventEmitter.emit('contacts:submit', formData);
  }

  private validateForm(): void {
    const formData = this.getFormData();
    const email = formData.email as string;
    const phone = formData.phone as string;
    
    const emailValid = this.isValidEmail(email);
    const phoneValid = this.isValidPhone(phone);
    
    const isValid = emailValid && phoneValid;
    this.setSubmitButtonEnabled(Boolean(isValid));
    
    const errors: string[] = [];
    if (!emailValid) errors.push('Некорректный email');
    if (!phoneValid) errors.push('Некорректный телефон');
    
    if (errors.length > 0) {
      this.showErrors(errors);
    } else {
      this.clearErrors();
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    // Убираем все нецифровые символы для проверки
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  }

  private formatPhoneNumber(input: HTMLInputElement): void {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      if (value.length <= 3) {
        value = `+7 (${value}`;
      } else if (value.length <= 6) {
        value = `+7 (${value.slice(1, 4)}) ${value.slice(4)}`;
      } else if (value.length <= 8) {
        value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7)}`;
      } else {
        value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}`;
      }
    }
    
    input.value = value;
  }
}
