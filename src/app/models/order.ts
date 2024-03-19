import { MenuItem } from './menu-item';

export class Order {
    _id?: string;
    orderLines: OrderLines;
    reservationId?: string;
    totalPrice?: number;

    constructor(options: Partial<Order>) {
        this._id = options._id;
        this.reservationId = options.reservationId;
        this.totalPrice = options.totalPrice;
        this.orderLines = options.orderLines ?? [];
    }
}

interface OrderLine {
    item: MenuItem;
    quantity: number;
}

type OrderLines = OrderLine[];
