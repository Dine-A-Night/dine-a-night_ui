import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'image-preview-modal',
    templateUrl: './image-preview-modal.component.html',
    styleUrls: ['./image-preview-modal.component.scss'],
})
export class ImagePreviewModalComponent {
    imageUrl: string;
    showDelete: boolean;
    restaurantId: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ImagePreviewModalParams,
        private dialog: MatDialog,
        private restaurantService: RestaurantsService,
        private notificationService: MatSnackBar,
        public dialogRef: MatDialogRef<ImagePreviewModalComponent>,
    ) {
        this.imageUrl = data.imageUrl;
        this.showDelete = data.showDelete ?? false;
        this.restaurantId = data.restaurantId;
    }

    deleteImage() {
        this.dialog
            .open(ConfirmDialogComponent, {
                data: {
                    title: 'Delete Image',
                    message: 'Are you sure you want to delete this image?',
                },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.restaurantService
                        .deleteImage(this.restaurantId, this.imageUrl)
                        .subscribe({
                            next: (res) => {
                                this.dialogRef.close(this.imageUrl);

                                this.notificationService.open(
                                    'Image successfully deleted!',
                                    'Ok',
                                    {
                                        duration: 3000,
                                    },
                                );
                            },
                            error: (err: any) => {
                                this.notificationService.open(
                                    `Failed to delete the image: ${err.message}`,
                                    'Oops',
                                );
                            },
                        });
                }
            });
    }
}

type ImagePreviewModalParams = {
    imageUrl: string;
    showDelete?: boolean;
    restaurantId: string;
};
