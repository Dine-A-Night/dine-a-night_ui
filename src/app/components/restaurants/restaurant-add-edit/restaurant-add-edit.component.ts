import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild, effect } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, map, of } from 'rxjs';
import { Cuisine, Restaurant } from 'src/app/models/restaurant';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';

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
            postal: [this.restaurant.location?.postal, Validators.required],
            country: [this.restaurant.location?.country, Validators.required],
        }),
    });

    //#region Google Maps
    apiLoaded = this.googleMapsService.apiLoaded;
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

    mapZoom = 12;
    mapCenter: google.maps.LatLngLiteral;
    mapOptions: google.maps.MapOptions = {};

    mapMarker: any;

    setMarkerPosition(lat: number, lng: number) {
        this.mapMarker.position = {
            lat,
            lng,
        };
    }

    mapClick(event: google.maps.MapMouseEvent) {
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();

        if (lat && lng) {
            this.setMarkerPosition(lat, lng);
        }
        console.log(event);
    }
    //#endregion

    constructor(
        private fb: FormBuilder,
        private restaurantService: RestaurantsService,
        private notificationService: MatSnackBar,
        private googleMapsService: GoogleMapsService,
    ) {
        effect(() => {
            if (this.apiLoaded()) {
                this.mapMarker = {
                    label: <google.maps.MarkerLabel>{
                        text: 'Restaurant Location',
                        className: 'font-bold relative top-8 text-red-600',
                    },
                    title: 'Restaurant Location',
                    options: <google.maps.MarkerOptions>{
                        animation: google.maps.Animation.DROP,
                        draggable: true,
                        clickable: true,
                    },
                };
            }
        });
    }

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

        navigator.geolocation.getCurrentPosition((position) => {
            this.mapCenter = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            this.setMarkerPosition(
                position.coords.latitude,
                position.coords.longitude,
            );
        });
    }
}
