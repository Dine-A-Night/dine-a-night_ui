import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation, Reservations } from 'src/app/models/reservation.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
    selector: 'restaurant-reservations-page',
    templateUrl: './restaurant-reservations-page.component.html',
    styleUrls: ['./restaurant-reservations-page.component.scss'],
})
export class RestaurantReservationsPageComponent implements OnInit {
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    notificationService = inject(MatSnackBar);

    restaurantService = inject(RestaurantsService);
    reservationService = inject(ReservationService);

    restaurant: Restaurant;

    reservations: Reservations;

    // Table
    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.dataSource = new MatTableDataSource(this.reservations);
        this.dataSource.sort = ms;
    }

    dataSource: MatTableDataSource<Reservation>;

    displayedColumns = [
        'number',
        'userId',
        'reservationDate',
        'startDateTime',
        'endDateTime',
        'totalPrice',
    ];

    ngOnInit(): void {
        const restaurantId = this.activatedRoute.snapshot.params['id'] ?? null;

        this.fetchRestaurantInfo(restaurantId);
        this.fetchReservations(restaurantId);
    }

    get restaurantCoverImage() {
        return (
            this.restaurant.coverPhotoUri ||
            RestaurantsService.DEFAULT_COVER_PHOTO_URI
        );
    }

    fetchRestaurantInfo(restaurantId: string) {
        this.restaurantService.getRestaurantById(restaurantId).subscribe({
            next: (restaurant) => {
                this.restaurant = restaurant;
            },
            error: (error: any) => {
                console.error(error);

                this.notificationService.open(
                    'Failed to get restaurant info',
                    'Oops',
                );
            },
        });
    }

    fetchReservations(restaurantId: string) {
        this.reservationService
            .getRestaurantReservations(restaurantId, true)
            .subscribe({
                next: (reservations) => {
                    this.reservations = reservations;
                },
                error: (err) => {
                    console.error(err);

                    this.notificationService.open(
                        'Failed to fetch reservations',
                        'Oops',
                    );
                },
            });
    }
}
