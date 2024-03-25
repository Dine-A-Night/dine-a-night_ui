import { Order } from './order.model';
import { Tables } from './table.model';

export class Reservation {
    _id?: string | null;
    userId: string; // uid
    tables: Tables;
    isCancelled: boolean;
    startDateTime: Date | null;
    endDateTime: Date | null;
    preOrder?: Order | null;
    specialRequests: string;

    constructor(options: any) {
        this._id = options._id ?? null;
        this.userId = options.userId;
        this.tables = options.tables;
        this.isCancelled = options.isCancelled;
        this.startDateTime = options.startDateTime;
        this.endDateTime = options.endDateTime;
        this.preOrder = options.preOrder ?? null;
        this.specialRequests = options.specialRequests ?? '';
    }

    static PRICE_PER_MINUTE = 50; // Cents

    getReservationPrice() {
        const startTime = this.startDateTime?.getTime() ?? 0;
        const endTime = this.endDateTime?.getTime() ?? 0;

        const duration = Math.abs(startTime - endTime) / (1000 * 60); // Minutes
        const cents = duration * Reservation.PRICE_PER_MINUTE;

        return cents / 100; // Dollar Amount
    }

    getSubtotal() {
        return this.getReservationPrice() + (this.preOrder?.getSubtotal() ?? 0);
    }

    getTaxPrice() {
        return this.getSubtotal() * (Order.TAX_PERCENTAGE / 100);
    }

    getTotalPrice() {
        return this.getSubtotal() + this.getTaxPrice();
    }
}

export type Reservations = Reservation[];
