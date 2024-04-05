import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Reservation } from 'src/app/models/reservation.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ReservationService } from 'src/app/services/reservation.service';
import {
    DateAfterValidator,
    DateBeforeValidator,
} from 'src/app/utils/custom-validators';
import { ReservationViewModel } from 'src/app/view-models/reservation-view.model';

@Component({
    selector: 'reschedule-reservation-dialog',
    templateUrl: './reschedule-reservation-dialog.component.html',
    styleUrls: ['./reschedule-reservation-dialog.component.scss'],
})
export class RescheduleReservationDialogComponent implements OnInit {
    restaurant: Restaurant;
    reservation: Reservation;

    startAt: Date;

    reservationDurationForm: FormGroup;
    reservationDurationFormChangesSubscription: Subscription;

    currentReservations: ReservationViewModel[];

    slotUnavailable = false;

    rescheduleProcessing = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: RescheduleReservationDialogParams,
        private reservationService: ReservationService,
        private notificationService: MatSnackBar,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<RescheduleReservationDialogComponent>,
    ) {
        this.restaurant = this.data.restaurant;
        this.reservation = this.data.reservation;

        this.startAt = new Date(this.reservation.startDateTime ?? Date.now());
    }

    ngOnInit(): void {
        this.initForms();

        this.reservationService
            .getRestaurantReservations(this.restaurant._id, true)
            .subscribe({
                next: (reservations) => {
                    this.currentReservations = reservations;
                },
                error: (err) => {
                    console.error(err);

                    this.notificationService.open(
                        "Couldn't fetch existing reservations data!",
                        'Oops',
                        {
                            panelClass: ['fail-snackbar'],
                        },
                    );
                },
            });
    }

    private initForms() {
        this.reservationDurationForm = this.fb.group({
            reservationDate: [this.startAt, [Validators.required]],
            startDateTime: [null, [Validators.required, ,]],
            endDateTime: [null, [Validators.required]],
        });

        const startDateTimeControl =
            this.reservationDurationForm.controls['startDateTime'];
        const endDateTimeControl =
            this.reservationDurationForm.controls['endDateTime'];

        startDateTimeControl.addValidators([
            DateBeforeValidator(
                endDateTimeControl,
                new Date(
                    this.reservationDurationForm.controls[
                        'reservationDate'
                    ].value,
                ),
            ),
        ]);

        endDateTimeControl.addValidators([
            DateAfterValidator(
                startDateTimeControl,
                new Date(
                    this.reservationDurationForm.controls[
                        'reservationDate'
                    ].value,
                ),
            ),
        ]);

        this.reservationDurationFormChangesSubscription =
            this.reservationDurationForm.valueChanges.subscribe((val) => {
                this.slotUnavailable = this.getUnavailableTableIds(
                    this.currentReservations,
                    this.startDateTime,
                    this.endDateTime,
                ).includes(this.reservation.tables[0]._id!);
            });
    }

    get saveDisabled() {
        return this.reservationDurationForm.invalid || this.slotUnavailable;
    }

    onRescheduleClick() {
        if (this.reservation._id && this.startDateTime && this.endDateTime) {
            this.reservationService
                .rescheduleReservation(
                    this.reservation._id,
                    this.startDateTime,
                    this.endDateTime,
                )
                .subscribe({
                    next: (reservation) => {
                        this.notificationService.open(
                            'Successfully rescheduled reservation',
                            'Ok',
                            {
                                duration: 3000,
                            },
                        );

                        this.dialogRef.close(reservation);
                    },
                    error: (err) => {
                        console.error(err);

                        this.notificationService.open(
                            'Failed to reschedule',
                            'Oops',
                        );
                    },
                });
        }
    }

    //#region Conflicting Reservations

    getUnavailableTableIds(
        reservations: ReservationViewModel[],
        startDateTime: Date | null,
        endDateTime: Date | null,
    ): string[] {
        const unavailableTableIds = new Set<string>();

        if (startDateTime && endDateTime && reservations) {
            const conflictingReservations = reservations.filter(
                (reservation) =>
                    this.isReservationConflicting(
                        reservation,
                        startDateTime,
                        endDateTime,
                    ) &&
                    !reservation.isCancelled &&
                    !reservation.isHistorical() &&
                    !(reservation._id === this.reservation._id),
            );

            conflictingReservations.forEach((reservation) => {
                reservation.tables.forEach((table) =>
                    unavailableTableIds.add(table._id!),
                );
            });
        }

        return Array.from(unavailableTableIds);
    }

    private isReservationConflicting(
        reservation: ReservationViewModel,
        startDateTime: Date,
        endDateTime: Date,
    ) {
        return (
            reservation.startDateTime &&
            reservation.endDateTime &&
            !(
                reservation.endDateTime <= startDateTime ||
                reservation.startDateTime >= endDateTime
            )
        );
    }

    get startDateTime() {
        const startDateTime =
            this.reservationDurationForm.controls['startDateTime'].value;
        const reservationDate =
            this.reservationDurationForm.controls['reservationDate'].value;

        return this.convertTimeStringToDate(startDateTime, reservationDate);
    }

    get endDateTime() {
        const endDateTime =
            this.reservationDurationForm.controls['endDateTime'].value;
        const reservationDate =
            this.reservationDurationForm.controls['reservationDate'].value;

        return this.convertTimeStringToDate(endDateTime, reservationDate);
    }

    private convertTimeStringToDate(timeString: string, date: Date) {
        if (timeString) {
            const convertedDate = new Date(date);

            // Regular expression to match time string in the format "11:15 pm"
            const regex = /^(\d{1,2}):(\d{2})\s*(am|pm)?$/i;
            const match = timeString.match(regex);

            if (match) {
                let hours = parseInt(match[1], 10);
                const minutes = parseInt(match[2], 10);
                const period = match[3]?.toLowerCase(); // "am" or "pm" if present

                // Convert hours to 24-hour format if needed
                if (period === 'pm' && hours < 12) {
                    hours += 12;
                } else if (period === 'am' && hours === 12) {
                    hours = 0; // midnight
                }

                convertedDate.setHours(hours);
                convertedDate.setMinutes(minutes);
                convertedDate.setSeconds(0); // Optional: Set seconds to zero

                return convertedDate;
            }
        }

        return null; // Return null if the time string doesn't match the expected format
    }

    //#endregion
}

type RescheduleReservationDialogParams = {
    restaurant: Restaurant;
    reservation: Reservation;
};
