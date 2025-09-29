
import { IBuyer, TPayment } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
  private payment: IBuyer["payment"]; 
  private email: string;              
  private phone: string;             
  private address: string;
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter, data?: IBuyer) {
    this.payment = data?.payment || "card"; 
    this.email = data?.email || "";
    this.phone = data?.phone || "";
    this.address = data?.address || "";
    this.eventEmitter = eventEmitter;
  }

  setData(data: Partial<IBuyer>): void {
    const oldData = this.getData();
    this.payment = data.payment ?? this.payment;
    this.email = data.email ?? this.email;
    this.phone = data.phone ?? this.phone;
    this.address = data.address ?? this.address;

    this.eventEmitter.emit('buyer:data-changed', {
      oldData,
      newData: this.getData()
    });
  }

  change(key: keyof IBuyer, value: string): void {
    const oldData = this.getData();
    if(key === 'payment') {
      this.payment = value as TPayment;
    } else if (key === 'email') {
      this.email = value;
    } else if (key === 'phone') {
      this.phone = value;
    } else if (key === 'address') {
      this.address = value;
    }
    this.validate();
    this.eventEmitter.emit('buyer:data-changed', {
      oldData,
      newData: this.getData()
    });
  }

  validate(): { payment: boolean; email: boolean; phone: boolean; address: boolean } {
    const errors = {
      payment: this.payment !== undefined,
      email: this.email.includes("@"),
      phone: this.phone.length >= 10,
      address: this.address.length > 5,
    };
    
    this.eventEmitter.emit('form:validate', errors);
    return errors;
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    const oldData = this.getData();
    this.payment = "card";
    this.email = "";
    this.phone = "";
    this.address = "";
    
    this.eventEmitter.emit('buyer:cleared', { 
      oldData, 
      newData: this.getData() 
    });
  }


  isValid(): boolean {
    const v = this.validate();
    return v.payment && v.email && v.phone && v.address;
  }
}