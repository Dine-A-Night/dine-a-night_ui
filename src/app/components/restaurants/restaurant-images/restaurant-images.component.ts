import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { updateProfile } from 'firebase/auth';
import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
    selector: 'restaurant-images',
    templateUrl: './restaurant-images.component.html',
    styleUrls: ['./restaurant-images.component.scss'],
})
export class RestaurantImagesComponent {
    @Input() restaurant: Restaurant;
    @Input() showUploadButton = false;
    @Output() imageUploaded = new EventEmitter<Restaurant>();

    constructor(
        private restaurantService: RestaurantsService,
        private notificationService: MatSnackBar,
    ) {}

    uploadImages(files: FileList) {
        const imageFile = files[0];

        this.restaurantService
            .uploadImage(this.restaurant, imageFile)
            .subscribe({
                next: (updatedRestaurant) => {
                    this.imageUploaded.emit(updatedRestaurant);

                    this.notificationService.open(
                        'Successfully uploaded new image!',
                        'Ok',
                        {
                            duration: 3000,
                        },
                    );
                },
                error: (err: any) => {
                    this.notificationService.open(
                        'Failed to upload the image!',
                        'Oops',
                    );
                },
            });
    }

    onImageDelete(deletedUrl: string) {
        const deleteAt = this.restaurant.photoUris?.findIndex(
            (url) => url === deletedUrl,
        )!;

        this.restaurant.photoUris?.splice(deleteAt, 1);
        this.restaurant = { ...this.restaurant };
    }
}
