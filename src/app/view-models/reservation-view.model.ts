import { Order } from '../models/order.model';
import { Reservation } from '../models/reservation.model';
import { Cuisine, RestaurantLocation } from '../models/restaurant.model';
import { Tables } from '../models/table.model';
import { ProfileUser } from '../models/user.model';

export class ReservationViewModel {
    _id?: string | null;
    user: ProfileUser;
    tables: Tables;
    isCancelled: boolean;
    reservationDate: Date;
    startDateTime: Date | null;
    endDateTime: Date | null;
    preOrder?: Order | null;
    specialRequests: string;
    restaurant: ReservationRestaurant;
    totalPrice: number;

    constructor(options: any) {
        this._id = options._id ?? null;
        this.user = options.user;
        this.tables = options.tables;
        this.isCancelled = options.isCancelled;
        this.startDateTime = options.startDateTime;
        this.endDateTime = options.endDateTime;
        this.preOrder = options.preOrder ?? null;
        this.specialRequests = options.specialRequests ?? '';
        this.restaurant = options.restaurant ?? null;
        this.totalPrice = options.totalPrice ?? null;

        if (this.startDateTime) {
            const reservationDate = new Date(this.startDateTime);
            reservationDate.setHours(0);
            reservationDate.setMinutes(0);
            reservationDate.setSeconds(0);

            this.reservationDate = reservationDate;
        }
    }

    static PRICE_PER_MINUTE = 50; // Cents

    isHistorical() {
        return this.endDateTime && this.endDateTime < new Date(Date.now());
    }

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

class ReservationRestaurant {
    _id: string;
    name: string;
    location: RestaurantLocation;
    coverPhotoUri: string;
    cuisines: Cuisine[];
    reviewCount: number;
    rating?: number;

    constructor(data: any) {
        this._id = data?._id ?? null;
        this.name = data?.name ?? null;
        this.location = data?.location ?? null;
        this.coverPhotoUri = data?.coverPhotoUri ?? null;
        this.cuisines = data?.cuisines ?? [];
        this.reviewCount = data?.reviewCount ?? 0;
        this.rating = data?.rating ?? 0;
    }
}
