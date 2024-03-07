// add-menu-item-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuItemsService } from '../../../../services/menu-items.service';
import { MenuItem } from '../../../../models/menu-item'; // Import the MenuItem model
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-add-menu-item-dialog',
    templateUrl: './add-menu-item-dialog.component.html',
    styleUrls: ['./add-menu-item-dialog.component.scss'],
})
export class AddMenuItemDialogComponent implements OnInit {
    menuItem: MenuItem = new MenuItem();

    constructor(
        public dialogRef: MatDialogRef<AddMenuItemDialogComponent>,
        private menuItemsService: MenuItemsService,
        private notificationService: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

    ngOnInit(): void {}

    onCancel(): void {
        this.dialogRef.close();
    }

    onCreate(): void {
        const restaurantId = this.data.restaurantId;
        this.menuItemsService
            .addMenuItem(restaurantId, this.menuItem)
            .subscribe({
                next: (response) => {
                    this.notificationService.open(
                        'Item successfully created',
                        'Ok',
                        {
                            duration: 3000,
                        },
                    );

                    this.dialogRef.close(response);
                },
                error: (error) => {
                    this.notificationService.open(
                        'Failed to create the item',
                        'Oops',
                    );
                    console.error(error);
                },
            });
    }
}
