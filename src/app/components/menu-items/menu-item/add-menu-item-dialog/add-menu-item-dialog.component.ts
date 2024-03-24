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
    isEdit: boolean = false;
    menuItem: MenuItem = new MenuItem();

    constructor(
        public dialogRef: MatDialogRef<AddMenuItemDialogComponent>,
        private menuItemsService: MenuItemsService,
        private notificationService: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

    ngOnInit(): void {
        if (this.data && this.data.menuItem) {
            this.isEdit = true;
            this.menuItem = new MenuItem(this.data.menuItem);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.isEdit) {
            this.updateMenuItem();
        } else {
            this.createMenuItem();
        }
    }

    private createMenuItem(): void {
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

    private updateMenuItem(): void {
        // Ensure menuItem has an ID
        if (!this.menuItem._id) {
            console.error('Menu item ID is missing.');
            return;
        }

        this.menuItemsService
            .updateMenuItem(this.menuItem._id, this.menuItem)
            .subscribe({
                next: (response) => {
                    this.notificationService.open(
                        'Item successfully updated',
                        'Ok',
                        {
                            duration: 3000,
                        },
                    );
                    this.dialogRef.close(response['menuItem'] as MenuItem);
                },
                error: (error) => {
                    this.notificationService.open(
                        'Failed to update the item',
                        'Oops',
                    );
                    console.error(error);
                },
            });
    }
}
