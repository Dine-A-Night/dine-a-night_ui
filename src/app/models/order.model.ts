import { MenuItem } from './menu-item';

export class Order {
    _id?: string;
    orderLines: OrderLines;
    reservationId?: string;
    totalPrice?: number;

    static TAX_PERCENTAGE = 13;

    constructor(options: Partial<Order>) {
        this._id = options._id;
        this.reservationId = options.reservationId;
        this.totalPrice = options.totalPrice;
        this.orderLines = options.orderLines
            ? options.orderLines.map(
                  (orderline) =>
                      new OrderLine(orderline.item, orderline.quantity),
              )
            : [];
    }

    hasOrderLines(): boolean {
        return this.orderLines.length > 0;
    }

    addOrderLine(orderLine: OrderLine) {
        const existingOrderLine = this.orderLines.find(
            (line) => line.item._id === orderLine.item._id,
        );

        if (existingOrderLine) {
            if (orderLine.quantity === 0) {
                this.removeOrderLine(orderLine.item);
            } else {
                // Update with latest quantity
                existingOrderLine.quantity = orderLine.quantity;
            }
        } else {
            // Add a new order line
            this.orderLines.push(orderLine);
        }
    }

    removeOrderLine(item: MenuItem) {
        this.orderLines.splice(
            this.orderLines.findIndex((line) => line.item._id === item._id),
            1,
        );
    }

    getSubtotal() {
        return this.orderLines.reduce(
            (price, orderLine) => price + orderLine.getPrice(),
            0,
        );
    }

    getTaxPrice() {
        return (this.getSubtotal() * Order.TAX_PERCENTAGE) / 100;
    }

    getTotalPrice() {
        return this.getSubtotal() + this.getTaxPrice();
    }
}

export class OrderLine {
    item: MenuItem;
    quantity: number;

    constructor(item: MenuItem, quantity: number) {
        this.item = item;
        this.quantity = quantity;
    }

    getInvoiceDescription() {
        return `${this.quantity} X ${this.item.name}`;
    }

    getPrice() {
        return this.quantity * (this.item.unitPrice ?? 0);
    }
}

type OrderLines = OrderLine[];
