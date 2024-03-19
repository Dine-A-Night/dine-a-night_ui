import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'restaurant-images',
    templateUrl: './restaurant-images.component.html',
    styleUrls: ['./restaurant-images.component.scss'],
})
export class RestaurantImagesComponent implements OnChanges {
    @Input() restaurant: Restaurant;
    @Input() showUploadButton = false;
    @Output() imageUploaded = new EventEmitter<Restaurant>();

    showDeleteInPreview: boolean = false;

    constructor(
        private restaurantService: RestaurantsService,
        private notificationService: MatSnackBar,
        private userService: UserService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.restaurant) {
            const currentUser = this.userService.currentUserSlim();
            this.showDeleteInPreview =
                currentUser?.uid === this.restaurant?.ownerId;
        }
    }

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
