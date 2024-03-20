import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuItemsService } from '../../../../services/menu-items.service';
import { MenuItem } from '../../../../models/menu-item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isDefNotNull } from 'src/app/utils/helper-functions';

@Component({
    selector: 'app-add-menu-item-dialog',
    templateUrl: './add-menu-item-dialog.component.html',
    styleUrls: ['./add-menu-item-dialog.component.scss'],
})
export class AddMenuItemDialogComponent implements OnInit {
    isEdit: boolean = false;
    menuItem: MenuItem = new MenuItem();
    showEdit: boolean = true;

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

    uploadMenuPhoto(event) {
        const files = event; // Get the selected files

        const imageFile = [...files].filter((file) =>
            file.type.startsWith('image/'),
        )[0];

        if (isDefNotNull(imageFile)) {
            if (this.isEdit) {
                // Update existing menu item
                if (!this.menuItem || !this.menuItem._id) {
                    console.error('Menu item ID is missing.');
                    return;
                }

                this.menuItemsService
                    .uploadMenuPhoto(this.menuItem._id, imageFile)
                    .subscribe({
                        next: (imageUrl) => {
                            this.menuItem = {
                                ...this.menuItem,
                                imageUri: imageUrl,
                            };

                            this.notificationService.open(
                                'Successfully uploaded menu photo',
                                'Ok',
                                {
                                    duration: 3000,
                                },
                            );
                        },
                        error: (err: any) => {
                            this.notificationService.open(
                                `Failed to upload menu photo: ${err.message}`,
                                'Oops',
                                {
                                    duration: 3000,
                                },
                            );
                        },
                    });
            } else {
                // Create new menu item
                console.error('Cannot upload photo before creating the item.');
                return;
            }
        } else {
            this.notificationService.open(
                'Make sure you select an image file for upload!',
                'Ok',
            );
        }
    }
}
