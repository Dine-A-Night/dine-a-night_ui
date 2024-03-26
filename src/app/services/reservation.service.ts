import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Reservation, Reservations } from '../models/reservation.model';
import { TableType } from '../models/table.model';
import { ReservationViewModel } from '../view-models/reservation-view.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class ReservationService {
    API_URL = environment.apiUrl;

    authService = inject(AuthService);
    http = inject(HttpClient);

    static PRICE_PER_MINUTE = 10; // Cents

    getTableTypes(): Observable<TableType[]> {
        const url = `${this.API_URL}/tabletypes`;

        return this.http.get(url).pipe(map((res) => res['tableTypes']));
    }

    getRestaurantReservations(
        restaurantId: string,
        getHistorical: boolean = false,
    ): Observable<Reservations> {
        const url = new URL(
            `${this.API_URL}/restaurants/${restaurantId}/reservations`,
        );
        const headers = this.authService.getAuthHeaders();

        const params = new URLSearchParams();
        params.append('historical', String(getHistorical));

        url.search = params.toString();

        return this.http.get(url.toString(), { headers }).pipe(
            map((res) => res['reservations'] as Reservations),
            map((reservations) =>
                reservations.map((reservation) => {
                    reservation = new Reservation({
                        ...reservation,
                        startDateTime: reservation.startDateTime
                            ? new Date(reservation.startDateTime)
                            : null,
                        endDateTime: reservation.endDateTime
                            ? new Date(reservation.endDateTime)
                            : null,
                    });

                    // TODO: Remove after API implements this
                    reservation.totalPrice = reservation.getTotalPrice();

                    return reservation;
                }),
            ),
        );
    }

    getUserReservations(
        userId: string,
        getHistorical: boolean = false,
    ): Observable<ReservationViewModel[]> {
        const url = new URL(`${this.API_URL}/users/${userId}/reservations`);
        const headers = this.authService.getAuthHeaders();

        const params = new URLSearchParams();
        params.append('historical', String(getHistorical));

        url.search = params.toString();

        return this.http.get(url.toString(), { headers }).pipe(
            map((res) => res['reservations'] as ReservationViewModel[]),
            map((reservations) =>
                reservations.map((reservation) => {
                    reservation = new ReservationViewModel({
                        ...reservation,
                        startDateTime: reservation.startDateTime
                            ? new Date(reservation.startDateTime)
                            : null,
                        endDateTime: reservation.endDateTime
                            ? new Date(reservation.endDateTime)
                            : null,
                    });

                    // TODO: Remove after API implements this
                    reservation.totalPrice = reservation.getTotalPrice();

                    return reservation;
                }),
            ),
        );
    }

    createReservation(restaurantId: string, reservation: Reservation) {
        const url = `${this.API_URL}/restaurants/${restaurantId}/reservations`;
        const headers = this.authService.getAuthHeaders();

        return this.http
            .post(url, reservation, { headers })
            .pipe(map((res) => res['reservation']));
    }
}
