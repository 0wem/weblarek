
import { IBuyer } from "../../types";

export class Buyer {
  private payment: IBuyer["payment"]; 
  private email: string;              
  private phone: string;             
  private address: string;            

  constructor(data?: IBuyer) {
    this.payment = data?.payment || "card"; 
    this.email = data?.email || "";
    this.phone = data?.phone || "";
    this.address = data?.address || "";
  }

  setData(data: Partial<IBuyer>): void {
    this.payment = data.payment ?? this.payment;
    this.email = data.email ?? this.email;
    this.phone = data.phone ?? this.phone;
    this.address = data.address ?? this.address;
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
    this.payment = "card";
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  validate(): { payment: boolean; email: boolean; phone: boolean; address: boolean } {
    return {
      payment: this.payment !== undefined,
      email: this.email.includes("@"),
      phone: this.phone.length >= 10,
      address: this.address.length > 5,
    };
  }

  isValid(): boolean {
    const v = this.validate();
    return v.payment && v.email && v.phone && v.address;
  }
}