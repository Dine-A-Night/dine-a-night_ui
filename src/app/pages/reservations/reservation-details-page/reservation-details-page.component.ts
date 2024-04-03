import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RescheduleReservationDialogComponent } from 'src/app/components/reservations/reschedule-reservation-dialog/reschedule-reservation-dialog.component';
import { ConfirmDialogComponent } from 'src/app/components/reusables/confirm-dialog/confirm-dialog.component';
import { SpinnerType } from 'src/app/components/reusables/loading-spinner/loading-spinner.component';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { ReservationViewModel } from 'src/app/view-models/reservation-view.model';

@Component({
    selector: 'reservation-details-page',
    templateUrl: './reservation-details-page.component.html',
    styleUrls: ['./reservation-details-page.component.scss'],
})
export class ReservationDetailsPageComponent implements OnInit {
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    reservationService = inject(ReservationService);
    restaurantService = inject(RestaurantsService);
    notificationService = inject(MatSnackBar);
    dialog = inject(MatDialog);

    reservation: ReservationViewModel;
    restaurant: Restaurant;

    spinnerType = SpinnerType.PAN;

    ngOnInit(): void {
        const reservationId = this.activatedRoute.snapshot.params['id'];

        if (reservationId) {
            this.reservationService.getReservatonById(reservationId).subscribe({
                next: (reservation) => {
                    this.reservation = reservation;

                    console.log(reservation);
                    this.restaurantService
                        .getRestaurantById(reservation.restaurant._id)
                        .subscribe((restaurant) => {
                            this.restaurant = restaurant;
                        });
                },
                error: (err) => {
                    console.error(err);

                    this.notificationService.open(
                        'Unable to fetch reservation',
                        'Oops',
                        {
                            panelClass: ['fail-snackbar'],
                        },
                    );
                },
            });
        }
    }

    get restaurantCoverImage() {
        return (
            this.reservation?.restaurant?.coverPhotoUri ??
            RestaurantsService.DEFAULT_COVER_PHOTO_URI
        );
    }

    get selectedTableInfo() {
        const table = this.reservation.tables[0];

        return table
            ? `${table.tableType.name} (${table.tableType.capacity} people)`
            : '';
    }

    onCancel() {
        this.dialog
            .open(ConfirmDialogComponent, {
                data: {
                    title: 'Cancel Reservation',
                    message:
                        'Are you sure you want to cancel this reservation?',
                },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    console.log('Cancelling');

                    if (this.reservation._id) {
                        this.reservationService
                            .cancelReservation(this.reservation._id)
                            .subscribe({
                                next: (res) => {
                                    this.notificationService.open(
                                        `Your reservation at ${this.restaurant.name} has been cancelled!`,
                                        'Ok',
                                        {
                                            duration: 3000,
                                            panelClass: ['success-snackbar'],
                                        },
                                    );

                                    this.router.navigate([
                                        '/explore-restaurants',
                                    ]);
                                },
                                error: (err) => {
                                    console.error(err);

                                    this.notificationService.open(
                                        'Failed to Cancel Reservation. Please try contacting the restaurant!',
                                        'Oops',
                                        {
                                            panelClass: ['fail-snackbar'],
                                        },
                                    );
                                },
                            });
                    }
                }
            });
    }

    onRescheduleReservationClick() {
        this.dialog
            .open(RescheduleReservationDialogComponent, {
                data: {
                    reservation: this.reservation,
                    restaurant: this.restaurant,
                },
                panelClass: ['dine-a-night-modal_large'],
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    console.log('Rescheduling Reservation');
                }
            });
    }
}
