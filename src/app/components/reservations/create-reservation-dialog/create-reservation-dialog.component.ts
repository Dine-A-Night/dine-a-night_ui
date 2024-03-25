import { BreakpointObserver } from '@angular/cdk/layout';
import {
    StepperOrientation,
    StepperSelectionEvent,
} from '@angular/cdk/stepper';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, map } from 'rxjs';
import { MenuItem } from 'src/app/models/menu-item';
import { Order, OrderLine } from 'src/app/models/order.model';
import { Reservation, Reservations } from 'src/app/models/reservation.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Table } from 'src/app/models/table.model';
import { ProfileUser } from 'src/app/models/user.model';
import { MenuItemsService } from 'src/app/services/menu-items.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { UserService } from 'src/app/services/user.service';
import {
    DateAfterValidator,
    DateBeforeValidator,
} from 'src/app/utils/custom-validators';
import { isDefNotNull } from 'src/app/utils/helper-functions';
import { ConfirmDialogComponent } from '../../reusables/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'create-reservation-dialog',
    templateUrl: './create-reservation-dialog.component.html',
    styleUrls: ['./create-reservation-dialog.component.scss'],
})
export class CreateReservationDialogComponent implements OnInit, OnDestroy {
    stepperOrientation: Observable<StepperOrientation>;
    restaurant: Restaurant;
    menuItems: MenuItem[];

    startAt: Date = new Date(Date.now());

    reservationDurationForm: FormGroup;
    reservationDurationFormChangesSub: Subscription;

    currentReservations: Reservations;

    selectedStepIndex = ReservationStepIndex.TIME_AND_TABLE;

    currentUser: ProfileUser | null;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: CreateReservationDialogParams,
        public dialogRef: MatDialogRef<CreateReservationDialogComponent>,
        private dialog: MatDialog,
        private reservationService: ReservationService,
        private notificationService: MatSnackBar,
        private breakpointObserver: BreakpointObserver,
        private fb: FormBuilder,
        private userService: UserService,
        private menuItemsService: MenuItemsService,
    ) {
        this.restaurant = new Restaurant(data.restaurant);
        this.getMenuItems();

        this.stepperOrientation = this.breakpointObserver
            .observe('(min-width: 1000px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    }

    ngOnInit(): void {
        this.currentUser = this.userService.currentUser();

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
                    );
                },
            });
    }

    ngOnDestroy(): void {
        this.reservationDurationFormChangesSub?.unsubscribe();
    }

    private getMenuItems() {
        this.menuItemsService.getMenuItems(this.restaurant._id).subscribe({
            next: (res) => {
                this.menuItems = res['menu'];
            },
            error: (err) => {
                console.error(err);

                this.notificationService.open(
                    'Failed to fetch menu items',
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
            isDefNotNull(this.selectedTable) ||
            this.preOrder.hasOrderLines()
        );
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
            const conflictingReservations = reservations.filter(
                (reservation) =>
                    this.isReservationConflicting(
                        reservation,
                        startDateTime,
                        endDateTime,
                    ) && !reservation.isCancelled,
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

    //#region Preorder

    preOrder: Order = new Order({});

    onOrderLineChanged(orderLine: OrderLine) {
        this.preOrder.addOrderLine(orderLine);
    }

    //#endregion

    //#region Reservation Summary

    reservation: Reservation;
    specialRequests: string = '';

    onStepperSelectionChanged(event: StepperSelectionEvent) {
        if (event.selectedIndex === ReservationStepIndex.SUMMARY) {
            // Should not be effected by item/reservation price changes
            this.preOrder.totalPrice = this.preOrder.getTotalPrice();

            // Generate the reservation object
            this.reservation = new Reservation({
                userId: this.currentUser?.uid!,
                startDateTime: this.startDateTime ?? null,
                endDateTime: this.endDateTime ?? null,
                isCancelled: false,
                tables: this.selectedTable ? [this.selectedTable] : [],
                preOrder: this.preOrder.hasOrderLines() ? this.preOrder : null,
                specialRequests: this.specialRequests,
            });
        }
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

    makeReservation() {
        if (this.selectedStepIndex !== ReservationStepIndex.SUMMARY) {
            this.selectedStepIndex = ReservationStepIndex.SUMMARY;
        } else {
            const reservation = new Reservation(this.reservation);

            this.reservationService
                .createReservation(this.restaurant._id, reservation)
                .subscribe({
                    next: (reservation) => {
                        this.notificationService.open(
                            'Reservation Successfull',
                            'Ok',
                            {
                                duration: 3000,
                                panelClass: ['success-snackbar'],
                            },
                        );

                        this.dialogRef.close();
                    },
                    error: (err) => {
                        this.notificationService.open(
                            'Reservation Failed',
                            'Oops',
                            {
                                panelClass: ['fail-snackbar'],
                            },
                        );
                    },
                });
        }
    }
}

type CreateReservationDialogParams = {
    restaurant: Restaurant;
};

enum ReservationStepIndex {
    TIME_AND_TABLE = 0,
    ORDER = 1,
    SUMMARY = 2,
}
