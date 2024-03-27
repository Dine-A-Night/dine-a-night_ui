import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Order } from '../models/order.model';
import { Reservation } from '../models/reservation.model';
import { TableType } from '../models/table.model';
import { ReservationViewModel } from './../view-models/reservation-view.model';
import { AuthService } from './auth.service';
import { ProfileUser, UserRole } from '../models/user.model';

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

    getReservatonById(reservationId: string) {
        const url = `${this.API_URL}/reservations/${reservationId}`;
        const headers = this.authService.getAuthHeaders();

        return of(
            new ReservationViewModel({
                _id: '6600eb35aca91e7ebad678e4',
                user: new ProfileUser({
                    uid: 'p7x8l3GOR0aUacfWrRVpOQ0e6wF2',
                    email: 'amnishsingh04@gmail.com',
                    displayName: 'Amnish Singh',
                    role: UserRole.CUSTOMER,
                    firstName: 'Amnish',
                    lastName: 'Singh Arora',
                    phone: '1234567891',
                    profilePictureUrl:
                        'https://firebasestorage.googleapis.com/v0/b/dine-a-night.appspot.com/o/images%2Fprofile%2Fp7x8l3GOR0aUacfWrRVpOQ0e6wF2?alt=media&token=4c2862ff-c2c2-4a51-8c4e-359a89d1301d',
                    createdAt: new Date('2024-02-05T01:22:07.369Z'),
                    updatedAt: new Date('2024-02-05T01:22:07.369Z'),
                }),
                tables: [
                    {
                        position: {
                            xCoord: 2,
                            yCoord: 2,
                        },
                        _id: '6600710adb71c93de7cdad10',
                        restaurantId: '65cc16abe290be362c1130d7',
                        tableTypeId: '65ee2004d08344f9d2ec9ebc',
                        __v: 0,
                    },
                ],
                isCancelled: false,
                startDateTime: '2024-03-26T04:00:00.507Z',
                endDateTime: '2024-03-26T09:00:00.507Z',
                preOrder: {
                    _id: '66033a27eb87e98ed17fdd46',
                    orderLines: [
                        {
                            item: {
                                restaurantId: '65cc16abe290be362c1130d7',
                                name: 'Chicken Tikka',
                                description:
                                    'A popular Indian dish renowned for its tantalizing flavors and aromatic spices. It consists of succulent pieces of boneless chicken marinated in a blend of yogurt and spices, typically including cumin, coriander, turmeric, ginger, garlic, and chili powder. The marinated chicken is skewered and traditionally cooked in a tandoor, a clay oven, resulting in a smoky and charred exterior with a tender and juicy interior.',
                                unitPrice: 15.99,
                                imageUri:
                                    'https://firebasestorage.googleapis.com/v0/b/dine-a-night.appspot.com/o/images%2FmenuItems%2F65e95c9f25fe2a5e513fa6b9?alt=media&token=f9c85edc-571f-45d5-a6b7-559ddc7a6fd8',
                            },
                            quantity: 2,
                            _id: '66033a27eb87e98ed17fdd47',
                        },
                    ],
                    totalPrice: 36.1374,
                    createdAt: '2024-03-26T21:12:07.061Z',
                    updatedAt: '2024-03-26T21:12:07.153Z',
                    __v: 0,
                    reservation: '66033a27eb87e98ed17fdd49',
                },
                specialRequests: 'Just Testing',
                restaurant: {
                    location: {
                        coordinates: {
                            type: 'Point',
                            coordinates: [
                                -79.78286890302728, 43.63539879282654,
                            ],
                            lat: 43.63539879282654,
                            lng: -79.78286890302728,
                        },
                        streetAddress: '85 Montpelier Street',
                        city: 'Brampton',
                        province: 'Ontario',
                        postal: 'L6Y 6H4',
                        country: 'Canada',
                    },
                    layout: {
                        length: 6,
                        width: 8,
                    },
                    _id: '65cc16abe290be362c1130d7',
                    ownerId: 'p7x8l3GOR0aUacfWrRVpOQ0e6wF2',
                    name: 'Dabang Bistro',
                    description:
                        'DabangBistro is an Indian restaurant in Canada that offers fine dining with a menu inspired by simple and honest cooking. We uses only the freshest and highest-quality ingredients and a warm & welcoming place for romantic dinners, family gatherings, or a night out with friends. The experienced chefs and friendly staff are dedicated to providing a memorable dining experience for all guests. Whether you’re a seasoned Indian food lover or a newcomer, DabangBistro invites you to try authentic Indian flavors.',
                    coverPhotoUri:
                        'https://firebasestorage.googleapis.com/v0/b/dine-a-night.appspot.com/o/images%2Frestaurants%2Fcover%2F65cc16abe290be362c1130d7?alt=media&token=b4796115-c87b-4c5e-a0f6-babc124d94c0',
                    photoUris: [
                        'https://firebasestorage.googleapis.com/v0/b/dine-a-night.appspot.com/o/images%2Frestaurants%2F65cc16abe290be362c1130d7%2F8ec07655-7d52-4d1e-aef1-c7168d1ed136?alt=media&token=86a0e6a1-d5a1-4820-9427-47acdad7e01e',
                        'https://firebasestorage.googleapis.com/v0/b/dine-a-night.appspot.com/o/images%2Frestaurants%2F65cc16abe290be362c1130d7%2Ff77bd3aa-cb3e-4e89-a71c-39c687788955?alt=media&token=c08892d5-0afb-4e0b-ab70-d53851a0f5b7',
                    ],
                    staffMembers: [],
                    cuisines: ['65c96fa210bc45215a93fa77'],
                    __v: 0,
                    rating: 4.5,
                },
            }),
        );

        return this.http.get<ReservationViewModel>(url, { headers }).pipe(
            map((res) => res['reservation']),
            map((reservation) => new ReservationViewModel(reservation)),
        );
    }

    getRestaurantReservations(
        restaurantId: string,
        getHistorical: boolean = false,
    ): Observable<ReservationViewModel[]> {
        const url = new URL(
            `${this.API_URL}/restaurants/${restaurantId}/reservations`,
        );
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
                        preOrder: reservation.preOrder
                            ? new Order(reservation.preOrder)
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
                    const startDateTime = reservation.startDateTime
                        ? new Date(reservation.startDateTime)
                        : null;
                    const endDateTime = reservation.endDateTime
                        ? new Date(reservation.endDateTime)
                        : null;

                    reservation = new ReservationViewModel({
                        ...reservation,
                        startDateTime: startDateTime,
                        endDateTime: endDateTime,
                        preOrder: reservation.preOrder
                            ? new Order(reservation.preOrder)
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

    cancelReservation(reservationId: string) {
        const url = `${this.API_URL}/reservations/${reservationId}/cancel`;
        const headers = this.authService.getAuthHeaders();

        return this.http.put(url, null, { headers });
    }
}
