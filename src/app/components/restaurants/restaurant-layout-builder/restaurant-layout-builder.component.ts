import { Component, Inject, ViewChild } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Tables } from 'src/app/models/table.model';
import { RestaurantLayoutComponent } from './restaurant-layout/restaurant-layout.component';
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
    ) {
        this.restaurant = data.restaurant;
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
        console.log(this.tables);
    }
}

type LayoutBuilderDialogParams = {
    restaurant: Restaurant;
};
