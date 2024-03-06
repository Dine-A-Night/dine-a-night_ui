// add-menu-item-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuItemsService } from '../../../../services/menu-items.service';
import { MenuItem } from '../../../../models/menu-item'; // Import the MenuItem model

@Component({
    selector: 'app-add-menu-item-dialog',
    templateUrl: './add-menu-item-dialog.component.html',
    styleUrls: ['./add-menu-item-dialog.component.scss'],
})
export class AddMenuItemDialogComponent implements OnInit {
    menuItem: MenuItem = {
        restaurantId: '', // Initialize with the restaurantId if available
        name: '',
        description: '',
        unitPrice: 0,
    };

    constructor(
        public dialogRef: MatDialogRef<AddMenuItemDialogComponent>,
        private menuItemsService: MenuItemsService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

    ngOnInit(): void {}

    onCancel(): void {
        this.dialogRef.close();
    }

    onCreate(): void {
        console.log('Creating menu item...');
        const restaurantId = this.data.restaurantId;
        this.menuItemsService
            .addMenuItem(restaurantId, this.menuItem)
            .subscribe(
                (response) => {
                    console.log('Menu item added successfully:', response);
                    this.dialogRef.close(response);
                },
                (error) => {
                    console.error('Error adding menu item:', error);
                },
            );
    }
}
