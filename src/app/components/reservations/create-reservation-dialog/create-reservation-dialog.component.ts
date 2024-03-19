import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
    selector: 'create-reservation-dialog',
    templateUrl: './create-reservation-dialog.component.html',
    styleUrls: ['./create-reservation-dialog.component.scss'],
})
export class CreateReservationDialogComponent {
    restaurant: Restaurant;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: CreateReservationDialogParams,
        public dialogRef: MatDialogRef<CreateReservationDialogComponent>,
        private dialog: MatDialog,
        private restaurantService: RestaurantsService,
        private notificationService: MatSnackBar,
    ) {
        this.restaurant = new Restaurant(data.restaurant);
    }

    get saveDisabled() {
        return true;
    }

    onCancel() {
        this.dialogRef.close();
    }

    makeReservation() {}
}

type CreateReservationDialogParams = {
    restaurant: Restaurant;
};
