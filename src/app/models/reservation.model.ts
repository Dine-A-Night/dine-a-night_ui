import { Order } from './order.model';
import { Tables } from './table.model';

export class Reservation {
    _id?: string | null;
    userId: string; // uid
    tables: Tables;
    isCancelled: boolean;
    startDateTime: Date;
    endDateTime: Date;
    preOrder?: Order | null;
    specialRequests?: string;

    constructor(options: Reservation) {
        this._id = options._id ?? null;
        this.userId = options.userId;
        this.tables = options.tables;
        this.isCancelled = options.isCancelled;
        this.startDateTime = options.startDateTime;
        this.endDateTime = options.endDateTime;
        this.preOrder = this.preOrder ?? null;
        this.specialRequests = this.specialRequests ?? '';
    }
}
