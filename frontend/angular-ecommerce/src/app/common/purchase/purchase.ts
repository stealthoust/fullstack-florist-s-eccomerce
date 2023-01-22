import {Customer} from "../customer/customer";
import {Order} from "../order/order";
import {OrderItem} from "../order-item/order-item";
import {Address} from "../address/address";

export class Purchase {
  customer!: Customer;
  shippingAddress!: Address;
  order!: Order;
  orderItems!: OrderItem[];
}
