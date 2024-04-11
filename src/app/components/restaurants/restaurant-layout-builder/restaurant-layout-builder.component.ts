import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Tables } from 'src/app/models/table.model';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { ConfirmDialogComponent } from '../../reusables/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'restaurant-layout-builder',
    templateUrl: './restaurant-layout-builder.component.html',
    styleUrls: ['./restaurant-layout-builder.component.scss'],
})
export class RestaurantLayoutBuilderComponent {
    restaurant: Restaurant;
    tables: Tables;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: LayoutBuilderDialogParams,
        public dialogRef: MatDialogRef<RestaurantLayoutBuilderComponent>,
        private dialog: MatDialog,
        private restaurantService: RestaurantsService,
        private notificationService: MatSnackBar,
    ) {
        this.restaurant = new Restaurant(data.restaurant);
    }

    get saveDisabled() {
        return !this.tables;
    }

    onCancel() {
        if (this.tables) {
            this.dialog
                .open(ConfirmDialogComponent, {
                    data: {
                        title: 'Close Builder',
                        message:
                            'Are you sure you want to exit Layout Builder? You will lose all your changes!',
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

    onSaveLayout() {
        this.restaurantService
            .updateLayout(
                this.restaurant._id,
                this.restaurant.layout,
                this.tables,
            )
            .subscribe({
                next: (restaurant: Restaurant) => {
                    this.notificationService.open(
                        'Layout successfully updated',
                        'Ok',
                        {
                            duration: 3000,
                            panelClass: ['success-snackbar'],
                        },
                    );

                    this.dialogRef.close(restaurant);
                },
                error: (err: any) => {
                    console.error(err);
                    this.notificationService.open(
                        'Failed to update the layout',
                        'Oops',
                        {
                            panelClass: ['fail-snackbar'],
                        },
                    );
                },
            });
    }
}

type LayoutBuilderDialogParams = {
    restaurant: Restaurant;
};
