import {
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
    Coordinates,
    Cuisine,
    Restaurant,
    RestaurantLocation,
} from 'src/app/models/restaurant.model';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';
import { idsToObjects } from 'src/app/utils/helper-functions';
import { POSTAL_CODE_REGEX } from 'src/app/utils/static-helpers';
import { extractAddressProps } from '../../maps/app-address-form/app-address-form.component';

@Component({
    selector: 'restaurant-add-edit',
    templateUrl: './restaurant-add-edit.component.html',
    styleUrls: ['./restaurant-add-edit.component.scss'],
})
export class RestaurantAddEditComponent implements OnInit {
    // Dialog Props
    isEdit: boolean = false;
    restaurant: Restaurant = new Restaurant({});

    cuisinesList: Cuisine[] = [];

    restaurantForm = this.fb.group({
        name: [
            this.restaurant.name,
            [Validators.required, Validators.maxLength(70)],
        ],
        description: [
            this.restaurant.description,
            [Validators.required, Validators.maxLength(1200)],
        ],
        cuisines: [
            this.restaurant.cuisines?.map((cuisine) => cuisine._id),
            Validators.required,
        ],
        location: this.fb.group({
            streetAddress: [
                this.restaurant.location?.streetAddress,
                Validators.required,
            ],
            city: [this.restaurant.location?.city, Validators.required],
            province: [this.restaurant.location?.province, Validators.required],
            postal: [
                this.restaurant.location?.postal,
                [Validators.required, Validators.pattern(POSTAL_CODE_REGEX())],
            ],
            country: [this.restaurant.location?.country, Validators.required],
        }),
    });

    restaurantCoordinates: Coordinates;

    // Button Flags to avoid redundant requests.
    createClicked = false;

    @ViewChild('cancelButton', { read: ElementRef })
    cancelButton: ElementRef<any>;

    constructor(
        private fb: FormBuilder,
        private restaurantService: RestaurantsService,
        private notificationService: MatSnackBar,
        private userService: UserService,
        private router: Router,
        private geolocationService: GeolocationService,
        @Inject(MAT_DIALOG_DATA)
        public data?: RestaurantAddEditParams,
    ) {}

    ngOnInit(): void {
        // Populate Cuisines Dropdown
        this.restaurantService.getCuisinesList().subscribe({
            next: (list) => {
                this.cuisinesList = list;
            },
            error: (err) => {
                this.notificationService.open(`Error: ${err.message}`, 'Ok', {
                    panelClass: ['fail-snackbar'],
                });
            },
        });

        this.isEdit = !!this.data?.isEdit;
        this.restaurant = this.data?.restaurant ?? new Restaurant({});

        if (this.restaurant._id) {
            this.restaurantForm.patchValue({
                ...this.restaurant,
                cuisines: this.restaurant.cuisines.map(
                    (cuisine) => cuisine._id,
                ),
            });
        }
    }

    get createDisabled(): boolean {
        return this.createClicked || this.restaurantForm.invalid;
    }

    createRestaurant() {
        const newRestaurant = new Restaurant({
            ...this.restaurantForm.value,
            location: {
                ...this.restaurantForm.value.location,
                coordinates: this.restaurantCoordinates,
            },
            ownerId: this.userService.currentUser()?.uid,
            cuisines: idsToObjects(
                this.restaurantForm.controls.cuisines.value as string[],
                this.cuisinesList,
            ),
        });

        this.restaurantService.createRestaurant(newRestaurant).subscribe({
            next: (res) => {
                this.notificationService.open(
                    `${newRestaurant.name} has been added to your list of restaurants`,
                    'Yayy',
                    {
                        panelClass: ['success-snackbar'],
                    },
                );
                this.router.navigate(['/manage-restaurants']);
            },
            error: (err) => {
                this.notificationService.open(
                    `Failed to create RestaurantL ${err.message}`,
                    'Noooooo',
                    {
                        panelClass: ['fail-snackbar'],
                    },
                );
            },
        });
    }

    updateRestaurant() {
        const updatedRestaurant = new Restaurant({
            ...this.restaurant,
            ...this.restaurantForm.value,
            location: {
                ...this.restaurantForm.value.location,
                coordinates: this.restaurantCoordinates,
            },
            ownerId: this.userService.currentUser()?.uid,
            cuisines: idsToObjects(
                this.restaurantForm.controls.cuisines.value as string[],
                this.cuisinesList,
            ),
        });

        this.restaurantService.updateRestaurant(updatedRestaurant).subscribe({
            next: (res: any) => {
                this.notificationService.open(
                    `${updatedRestaurant.name} has been successfully updated!`,
                    'Yayy',
                    {
                        panelClass: ['success-snackbar'],
                    },
                );

                this.restaurant = res.restaurant;

                setTimeout(() => {
                    this.cancelButton?.nativeElement.click();
                }, 0);
            },
            error: (err) => {
                this.notificationService.open(
                    `Failed to update RestaurantL ${err.message}`,
                    'Noooooo',
                    { panelClass: ['fail-snackbar'] },
                );
            },
        });
    }

    selectedLocation: google.maps.places.PlaceResult;

    async addressEntered(location: google.maps.places.PlaceResult) {
        const newLocation = extractAddressProps(location);
        // console.log(location.reviews);
        const updatedValues = {
            ...newLocation,
            streetAddress: `${newLocation.streetNumber} ${newLocation.route}`,
        };
        delete updatedValues.streetNumber;
        delete updatedValues.route;

        this.restaurantForm.patchValue({
            location: updatedValues,
        });

        this.restaurantForm.markAsDirty();

        this.selectedLocation = location;

        // Get coordinates from open source service
        // https://github.com/osm-search/Nominatim
        const newCoords = await this.geolocationService.getCoordinatesByAddress(
            this.restaurantForm.controls.location.value as RestaurantLocation,
        );

        const { lat, lon } = newCoords;
        this.restaurantCoordinates = {
            lat: parseFloat(lat),
            lng: parseFloat(lon),
        };
    }
}

type RestaurantAddEditParams = {
    isEdit: boolean;
    restaurant: Restaurant;
};
