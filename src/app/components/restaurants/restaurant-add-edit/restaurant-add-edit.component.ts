import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Coordinates, Cuisine, Restaurant } from 'src/app/models/restaurant';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { POSTAL_CODE_REGEX } from 'src/app/utils/static-helpers';
import { extractAddressProps } from '../../maps/app-address-form/app-address-form.component';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'restaurant-add-edit',
    templateUrl: './restaurant-add-edit.component.html',
    styleUrls: ['./restaurant-add-edit.component.scss'],
})
export class RestaurantAddEditComponent implements OnInit {
    @Input() isEdit: boolean = false;
    @Input() restaurant: Restaurant = new Restaurant({});

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
        cuisines: [this.restaurant.cuisines, Validators.required],
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

    constructor(
        private fb: FormBuilder,
        private restaurantService: RestaurantsService,
        private notificationService: MatSnackBar,
        private userService: UserService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        // Populate Cuisines Dropdown
        this.restaurantService.getCuisinesList().subscribe({
            next: (list) => {
                this.cuisinesList = list;
            },
            error: (err) => {
                this.notificationService.open(`Error: ${err.message}`, 'Ok');
            },
        });
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
        });

        this.restaurantService.createRestaurant(newRestaurant).subscribe({
            next: (res) => {
                console.log(res);
                this.notificationService.open(
                    `${newRestaurant.name} has been added to your list of restaurants`,
                    'Yayy',
                );
                this.router.navigate(['/manage-restaurants']);
            },
            error: (err) => {
                this.notificationService.open(
                    `Failed to create RestaurantL ${err.message}`,
                    'Noooooo',
                );
            },
        });
    }

    onCoordinatesChanged(coords: Coordinates) {
        this.restaurantCoordinates = coords;
        console.log(coords);
    }

    selectedLocation: google.maps.places.PlaceResult;

    addressEntered(location: google.maps.places.PlaceResult) {
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

        if (location.geometry?.location) {
            this.restaurantCoordinates = location.geometry?.location?.toJSON();
        }
    }
}
