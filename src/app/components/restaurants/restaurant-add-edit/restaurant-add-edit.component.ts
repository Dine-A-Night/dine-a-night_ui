import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Coordinates, Cuisine, Restaurant } from 'src/app/models/restaurant';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { POSTAL_CODE_REGEX } from 'src/app/utils/static-helpers';

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
            [Validators.required, Validators.maxLength(500)],
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
        private googleMapsService: GoogleMapsService,
    ) {}

    ngOnInit(): void {
        console.log(this.restaurant);

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
        console.log(
            new Restaurant({
                ...this.restaurantForm.value,
                location: {
                    ...this.restaurantForm.value.location,
                    coordinates: this.restaurantCoordinates,
                },
            }),
        );
    }

    onCoordinatesChanged(coords: Coordinates) {
        this.restaurantCoordinates = coords;
        console.log(coords);
    }
}
