import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
    selector: 'image-preview-modal',
    templateUrl: './image-preview-modal.component.html',
    styleUrls: ['./image-preview-modal.component.scss'],
})
export class ImagePreviewModalComponent implements OnInit {
    imageUrl: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private restaurantService: RestaurantsService,
        private notificationService: MatSnackBar,
        public dialogRef: MatDialogRef<ImagePreviewModalComponent>,
    ) {
        this.imageUrl = data.imageUrl;
    }

    ngOnInit(): void {
        console.log(this.data);
    }

    deleteImage() {
        this.restaurantService.deleteImage(this.imageUrl).subscribe({
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
}
