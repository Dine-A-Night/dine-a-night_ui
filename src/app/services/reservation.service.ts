import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Reservation, Reservations } from '../models/reservation.model';
import { TableType, Tables } from '../models/table.model';
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

    getRestaurantReservations(restaurantId: string): Observable<Reservations> {
        const url = `${this.API_URL}/restaurants/${restaurantId}/reservations`;

        // Sample tables data
        const tables: Tables = [
            {
                _id: '65fa097caee675a6f0c39f05',
                restaurantId: '65cc16abe290be362c1130d7',
                position: { xCoord: 5, yCoord: 0 },
                tableType: {
                    _id: '65e67a2a9f7650f0b83c381f',
                    name: 'Double',
                    description: 'A Table meant for two people.',
                    svgHtml: '',
                    capacity: 2,
                    evalue: 3,
                },
            },
        ];

        // Create sample reservations
        const sampleReservations: Reservations = [
            new Reservation({
                userId: 'user1',
                tables: tables,
                isCancelled: false,
                startDateTime: new Date('2024-03-20T18:00:00'),
                endDateTime: new Date('2024-03-20T20:00:00'),
                specialRequests: 'Window seat preferred',
            }),
            new Reservation({
                userId: 'user2',
                tables: tables,
                isCancelled: false,
                startDateTime: new Date('2024-03-21T19:00:00'),
                endDateTime: new Date('2024-03-21T21:00:00'),
                specialRequests: 'Vegetarian options needed',
            }),
            new Reservation({
                userId: 'user3',
                tables: tables,
                isCancelled: false,
                startDateTime: new Date('2024-03-22T20:00:00'),
                endDateTime: new Date('2024-03-22T22:00:00'),
                specialRequests: 'Quiet corner preferred',
            }),
        ];
        return of(sampleReservations);
        // Wait until api is done
        return this.http
            .get(url)
            .pipe(map((res) => res['reservations'] as Reservations));
    }

    createReservation(restaurantId: string, reservation: Reservation) {
        const url = `${this.API_URL}/restaurants/${restaurantId}/reservations`;
        const headers = this.authService.getAuthHeaders();

        return this.http
            .post(url, reservation, { headers })
            .pipe(map((res) => res['reservation']));
    }
}
