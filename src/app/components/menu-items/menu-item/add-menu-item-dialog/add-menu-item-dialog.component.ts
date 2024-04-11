import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { concatMap, map, of } from 'rxjs';
import { MenuItem } from '../../../../models/menu-item';
import { MenuItemsService } from '../../../../services/menu-items.service';

@Component({
    selector: 'app-add-menu-item-dialog',
    templateUrl: './add-menu-item-dialog.component.html',
    styleUrls: ['./add-menu-item-dialog.component.scss'],
})
export class AddMenuItemDialogComponent implements OnInit {
    isEdit: boolean = false;
    menuItem: MenuItem = new MenuItem();

    selectedImage: File;
    selectedImageUrl: string;

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

    get imageUrl() {
        return (
            this.selectedImageUrl ??
            this.menuItem.imageUri ??
            MenuItemsService.DEFAULT_MENU_ITEM_IMAGE
        );
    }

    private createMenuItem(): void {
        const restaurantId = this.data.restaurantId;
        this.menuItemsService
            .addMenuItem(restaurantId, this.menuItem)
            .pipe(
                concatMap((newItem) => {
                    if (this.selectedImage) {
                        return this.menuItemsService
                            .uploadMenuPhoto(newItem._id!, this.selectedImage)
                            .pipe(
                                map((uploadedImageUrl) => {
                                    return {
                                        ...newItem,
                                        imageUri: uploadedImageUrl,
                                    };
                                }),
                            );
                    } else {
                        return of(newItem);
                    }
                }),
            )
            .subscribe({
                next: (newItem) => {
                    this.notificationService.open(
                        'Item successfully created',
                        'Ok',
                        {
                            duration: 3000,
                            panelClass: ['success-snackbar'],
                        },
                    );
                    this.dialogRef.close(newItem);
                },
                error: (error) => {
                    this.notificationService.open(
                        'Failed to create the item',
                        'Oops',
                        {
                            panelClass: ['fail-snackbar'],
                        },
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

        if (this.selectedImage) {
            // Upload the new image to firebase
            this.menuItemsService
                .uploadMenuPhoto(this.menuItem._id, this.selectedImage)
                .pipe(
                    concatMap((uploadedImageUrl) => {
                        this.menuItem.imageUri = uploadedImageUrl;

                        return this.menuItemsService.updateMenuItem(
                            this.menuItem._id!, // We already checked for menu item id above
                            this.menuItem,
                        );
                    }),
                )
                .subscribe({
                    next: (response) => {
                        this.notificationService.open(
                            'Item successfully updated',
                            'Ok',
                            {
                                duration: 3000,
                                panelClass: ['success-snackbar'],
                            },
                        );
                        this.dialogRef.close(response);
                    },
                    error: (error) => {
                        this.notificationService.open(
                            'Failed to update the item',
                            'Oops',
                            {
                                panelClass: ['fail-snackbar'],
                            },
                        );
                        console.error(error);
                    },
                });
        } else {
            this.menuItemsService
                .updateMenuItem(this.menuItem._id, this.menuItem)
                .subscribe({
                    next: (response) => {
                        this.notificationService.open(
                            'Item successfully updated',
                            'Ok',
                            {
                                duration: 3000,
                                panelClass: ['success-snackbar'],
                            },
                        );
                        this.dialogRef.close(response);
                    },
                    error: (error) => {
                        this.notificationService.open(
                            'Failed to update the item',
                            'Oops',
                            {
                                panelClass: ['fail-snackbar'],
                            },
                        );
                        console.error(error);
                    },
                });
        }
    }

    async imageSelected(event) {
        const files = event; // Get the selected files

        const imageFile = files[0] as File;

        this.selectedImage = imageFile;
        this.selectedImageUrl = URL.createObjectURL(imageFile);
    }
}
