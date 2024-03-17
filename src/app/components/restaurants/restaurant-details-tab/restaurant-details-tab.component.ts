import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { deepEqual, isDefNotNull } from 'src/app/utils/helper-functions';
import { RestaurantAddEditComponent } from '../restaurant-add-edit/restaurant-add-edit.component';
import { RestaurantLayoutBuilderComponent } from '../restaurant-layout-builder/restaurant-layout-builder.component';

@Component({
    selector: 'restaurant-details-tab',
    templateUrl: './restaurant-details-tab.component.html',
    styleUrls: ['./restaurant-details-tab.component.scss'],
})
export class RestaurantDetailsTabComponent implements OnInit {
    @Input() restaurant: Restaurant;
    @Input() showEdit: boolean = false;

    @Output() restaurantUpdated = new EventEmitter<Restaurant>();

    restaurantService = inject(RestaurantsService);
    notificationService = inject(MatSnackBar);
    dialog = inject(MatDialog);

    ngOnInit(): void {}

    onEditClick(): void {
        this.dialog
            .open(RestaurantAddEditComponent, {
                data: {
                    isEdit: true,
                    restaurant: this.restaurant,
                },
                panelClass: ['overflow-y-auto', 'h-4/5'],
            })
            .afterClosed()
            .subscribe((result) => {
                if (!deepEqual(result, this.restaurant) && result) {
                    this.restaurant = result;
                    this.restaurantUpdated.emit(this.restaurant);
                }
            });
    }

    uploadCoverPhoto(event) {
        const files = event; // Get the selected files

        const imageFile = [...files].filter((file) =>
            file.type.startsWith('image/'),
        )[0];

        if (isDefNotNull(imageFile)) {
            this.restaurantService
                .uploadCoverPhoto(this.restaurant._id, imageFile)
                .subscribe({
                    next: (imageUrl) => {
                        this.restaurant = {
                            ...this.restaurant,
                            coverPhotoUri: imageUrl,
                        };
                        this.restaurantUpdated.emit(this.restaurant);

                        this.notificationService.open(
                            'Successfully uploaded cover photo',
                            'Ok',
                            {
                                duration: 3000,
                            },
                        );
                    },
                    error: (err: any) => {
                        this.notificationService.open(
                            `Failed to upload cover photo: ${err.message}`,
                            'Oops',
                            {
                                duration: 3000,
                            },
                        );
                    },
                });
        } else {
            this.notificationService.open(
                'Make sure you select an image file for upload!',
                'Ok',
            );
        }
    }

    formatLocation(location: any): string {
        // Implement your formatting logic here based on the structure of RestaurantLocation
        return `${location.streetAddress}, ${location.city}, ${location.province}, ${location.country} ${location.postal}`;
    }

    //#region Layout Builder

    onBuildLayoutClick() {
        this.dialog
            .open(RestaurantLayoutBuilderComponent, {
                data: {
                    restaurant: this.restaurant,
                },
                panelClass: ['dine-a-night-modal_large'],
                disableClose: true,
            })
            .afterClosed()
            .subscribe({
                next: (restaurant: Restaurant) => {
                    if (restaurant?.layout) {
                        // Save the Layout
                        this.restaurant = new Restaurant(restaurant);
                    }
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    //#endregion
}
