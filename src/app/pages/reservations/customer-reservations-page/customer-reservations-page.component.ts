import { Component, ViewChild, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ProfileUser } from 'src/app/models/user.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';
import { ReservationViewModel } from 'src/app/view-models/reservation-view.model';

@Component({
    selector: 'customer-reservations-page',
    templateUrl: './customer-reservations-page.component.html',
    styleUrls: ['./customer-reservations-page.component.scss'],
})
export class CustomerReservationsPageComponent {
    activatedRoute = inject(ActivatedRoute);
    notificationService = inject(MatSnackBar);

    userService = inject(UserService);
    reservationService = inject(ReservationService);

    currentUser;
    reservations: ReservationViewModel[];

    // Table
    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.dataSource = new MatTableDataSource(this.reservations);
        this.dataSource.sort = ms;
    }

    dataSource: MatTableDataSource<ReservationViewModel>;

    displayedColumns = [
        'restaurantCoverPhoto',
        'restaurantName',
        'reservationDate',
        'startDateTime',
        'endDateTime',
        'totalPrice',
    ];

    ngOnInit(): void {
        this.userService.currentUser$.subscribe((user: ProfileUser) => {
            this.currentUser = user;

            this.fetchUserReservations(user.uid ?? '');
        });
    }

    fetchUserReservations(userId: string) {
        this.reservationService.getUserReservations(userId, true).subscribe({
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

    getRestaurantCoverPhoto(restaurant: Restaurant) {
        return (
            restaurant.coverPhotoUri ||
            RestaurantsService.DEFAULT_COVER_PHOTO_URI
        );
    }
}
