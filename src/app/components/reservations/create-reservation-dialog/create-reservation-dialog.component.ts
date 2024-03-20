import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Table } from 'src/app/models/table.model';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
    selector: 'create-reservation-dialog',
    templateUrl: './create-reservation-dialog.component.html',
    styleUrls: ['./create-reservation-dialog.component.scss'],
})
export class CreateReservationDialogComponent implements OnInit {
    stepperOrientation: Observable<StepperOrientation>;
    restaurant: Restaurant;

    startAt: Date = new Date(Date.now());

    reservationDurationForm: FormGroup;

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

        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 1000px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    }

    ngOnInit(): void {
        this.initForms();
    }

    private initForms() {
        this.reservationDurationForm = this.fb.group({
            reservationDate: [this.startAt, [Validators.required]],
            startDateTime: [null, [Validators.required]],
            endDateTime: [null, [Validators.required]],
        });

        this.reservationDurationForm.valueChanges.subscribe((val) =>
            console.log(val),
        );
    }

    private convertTimeStringToDate(timeString: string, date: Date) {
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

        return null; // Return null if the time string doesn't match the expected format
    }

    get saveDisabled() {
        return true;
    }

    //#region Duration Limiters

    // get minStartDateTime() {
    //     return (
    //         this.reservationDurationForm.get('reservationDate')?.value ?? null
    //     );
    // }

    // get maxStartDateTime() {
    //     return this.reservationDurationForm.get('endDateTime')?.value ?? null;
    // }

    //#endregion

    //#region Table and Time selection

    selectedTable: Table | null;

    onTableSelected(table: Table | null) {
        this.selectedTable = table;

        console.log(this.selectedTable);
    }

    //#endregion

    onCancel() {
        this.dialogRef.close();
    }

    makeReservation() {}
}

type CreateReservationDialogParams = {
    restaurant: Restaurant;
};
