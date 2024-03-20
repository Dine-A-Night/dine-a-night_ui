import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Table } from 'src/app/models/table.model';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
    selector: 'create-reservation-dialog',
    templateUrl: './create-reservation-dialog.component.html',
    styleUrls: ['./create-reservation-dialog.component.scss'],
})
export class CreateReservationDialogComponent {
    stepperOrientation: Observable<StepperOrientation>;
    restaurant: Restaurant;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: CreateReservationDialogParams,
        public dialogRef: MatDialogRef<CreateReservationDialogComponent>,
        private dialog: MatDialog,
        private restaurantService: RestaurantsService,
        private notificationService: MatSnackBar,
        private breakpointObserver: BreakpointObserver,
    ) {
        this.restaurant = new Restaurant(data.restaurant);

        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    }

    get saveDisabled() {
        return true;
    }

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
