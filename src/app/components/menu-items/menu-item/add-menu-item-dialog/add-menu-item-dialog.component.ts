import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuItemsService } from '../../../../services/menu-items.service';
import { MenuItem } from '../../../../models/menu-item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isDefNotNull } from 'src/app/utils/helper-functions';
import { Observable, concatMap, map, of, switchMap } from 'rxjs';

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
                        },
                    );
                    this.dialogRef.close(newItem);
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
                            },
                        );
                        this.dialogRef.close(response);
                    },
                    error: (error) => {
                        this.notificationService.open(
                            'Failed to update the item',
                            'Oops',
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
                            },
                        );
                        this.dialogRef.close(response);
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

    async imageSelected(event) {
        const files = event; // Get the selected files

        const imageFile = files[0] as File;

        this.selectedImage = imageFile;
        this.selectedImageUrl = URL.createObjectURL(imageFile);
    }
}
