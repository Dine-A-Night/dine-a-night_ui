import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, map } from 'rxjs';
import { Reservation, Reservations } from 'src/app/models/reservation.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Table } from 'src/app/models/table.model';
import { ReservationService } from 'src/app/services/reservation.service';
import {
    DateAfterValidator,
    DateBeforeValidator,
} from 'src/app/utils/custom-validators';
import { ConfirmDialogComponent } from '../../reusables/confirm-dialog/confirm-dialog.component';
import { isDefNotNull } from 'src/app/utils/helper-functions';

@Component({
    selector: 'create-reservation-dialog',
    templateUrl: './create-reservation-dialog.component.html',
    styleUrls: ['./create-reservation-dialog.component.scss'],
})
export class CreateReservationDialogComponent implements OnInit, OnDestroy {
    stepperOrientation: Observable<StepperOrientation>;
    restaurant: Restaurant;

    startAt: Date = new Date(Date.now());

    reservationDurationForm: FormGroup;
    reservationDurationFormChangesSub: Subscription;

    currentReservations: Reservations;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: CreateReservationDialogParams,
        public dialogRef: MatDialogRef<CreateReservationDialogComponent>,
        private dialog: MatDialog,
        private reservationService: ReservationService,
        private notificationService: MatSnackBar,
        private breakpointObserver: BreakpointObserver,
        private fb: FormBuilder,
    ) {
        this.restaurant = new Restaurant(data.restaurant);

        this.stepperOrientation = this.breakpointObserver
            .observe('(min-width: 1000px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    }

    ngOnInit(): void {
        this.initForms();

        this.reservationService
            .getRestaurantReservations(this.restaurant._id)
            .subscribe({
                next: (reservations) => {
                    this.currentReservations = reservations;
                },
                error: (err) => {
                    console.error(err);

                    this.notificationService.open(
                        "Couldn't fetch existing reservations data!",
                        'Oops',
                    );
                },
            });
    }
    ngOnDestroy(): void {
        this.reservationDurationFormChangesSub?.unsubscribe();
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

        this.reservationDurationFormChangesSub =
            this.reservationDurationForm.valueChanges.subscribe((val) => {
                if (
                    this.selectedTable &&
                    this.getUnavailableTableIds(
                        this.currentReservations,
                        this.startDateTime,
                        this.endDateTime,
                    ).includes(this.selectedTable._id!)
                ) {
                    // Unselect table if not available
                    this.selectedTable = null;
                }
            });
    }

    get formDirty() {
        return (
            this.reservationDurationForm.dirty ||
            isDefNotNull(this.selectedTable)
        );
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

    get saveDisabled() {
        return this.reservationDurationForm.invalid || !this.selectedTable;
    }

    get selectionDisabled() {
        return this.reservationDurationForm.invalid;
    }

    //#region Table and Time selection

    selectedTable: Table | null = null;

    getUnavailableTableIds(
        reservations: Reservations,
        startDateTime: Date | null,
        endDateTime: Date | null,
    ): string[] {
        const unavailableTableIds = new Set<string>();

        if (startDateTime && endDateTime && reservations) {
            const conflictingReservations = reservations.filter((reservation) =>
                this.isReservationConflicting(
                    reservation,
                    startDateTime,
                    endDateTime,
                ),
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
        reservation: Reservation,
        startDateTime: Date,
        endDateTime: Date,
    ) {
        return !(
            reservation.endDateTime <= startDateTime ||
            reservation.startDateTime >= endDateTime
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

    //#endregion

    onCancel() {
        if (this.formDirty) {
            this.dialog
                .open(ConfirmDialogComponent, {
                    data: {
                        title: 'Exit Reservation Form',
                        message:
                            'Are you sure you want to exit reservation form? You will lose your changes!',
                    },
                })
                .afterClosed()
                .subscribe((result) => {
                    if (result) {
                        this.dialogRef.close();
                    }
                });
        } else {
            this.dialogRef.close();
        }
    }

    makeReservation() {}
}

type CreateReservationDialogParams = {
    restaurant: Restaurant;
};
