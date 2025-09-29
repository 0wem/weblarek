import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { IFormData } from '../../types';

export abstract class FormView extends Component<IFormData> {
  protected eventEmitter: EventEmitter;
  protected form: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
    
    // Находим элементы в конструкторе и сохраняем в полях класса
    // Если контейнер сам является формой, то это и есть форма
    this.form = (container.tagName === 'FORM' ? container : this.container.querySelector('form')) as HTMLFormElement;
    this.submitButton = this.form?.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsElement = this.form?.querySelector('.form__errors') as HTMLElement;
    
    // Устанавливаем слушатели событий один раз в конструкторе
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  render(data?: Partial<IFormData>): HTMLElement {
    if (data) {
      this.updateForm(data);
    }
    return this.container;
  }

  protected abstract handleSubmit(): void;

  protected updateForm(data: Partial<IFormData>): void {
    Object.keys(data).forEach(key => {
      const input = this.form?.querySelector(`[name="${key}"]`) as HTMLInputElement;
      if (input && data[key] !== undefined) {
        if (input.type === 'checkbox') {
          input.checked = Boolean(data[key]);
        } else {
          input.value = String(data[key]);
        }
      }
    });
  }

  protected getFormData(): IFormData {
    const formData: IFormData = {};
    const inputs = this.form?.querySelectorAll('input, select, textarea') as NodeListOf<HTMLInputElement>;
    
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        formData[input.name] = input.checked;
      } else {
        formData[input.name] = input.value;
      }
    });
    
    return formData;
  }

  protected showErrors(errors: string[]): void {
    if (this.errorsElement) {
      this.errorsElement.textContent = errors.join(', ');
    }
  }

  protected clearErrors(): void {
    if (this.errorsElement) {
      this.errorsElement.textContent = '';
    }
  }

  protected setSubmitButtonEnabled(enabled: boolean): void {
    if (this.submitButton) {
      this.submitButton.disabled = !enabled;
    }
  }

  public resetForm(): void {
    if (this.form) {
      this.form.reset();
    }
    this.clearErrors();
    this.setSubmitButtonEnabled(false);
  }
}
