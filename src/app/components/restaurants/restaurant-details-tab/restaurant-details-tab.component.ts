import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    effect,
    inject,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
    Restaurant,
    RestaurantLocation,
} from 'src/app/models/restaurant.model';
import { UserRole } from 'src/app/models/user.model';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';
import { deepEqual, isDefNotNull } from 'src/app/utils/helper-functions';
import { CreateReservationDialogComponent } from '../../reservations/create-reservation-dialog/create-reservation-dialog.component';
import { RestaurantAddEditComponent } from '../restaurant-add-edit/restaurant-add-edit.component';
import { RestaurantLayoutBuilderComponent } from '../restaurant-layout-builder/restaurant-layout-builder.component';
import { SpinnerType } from '../../reusables/loading-spinner/loading-spinner.component';

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
    userService = inject(UserService);
    dialog = inject(MatDialog);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);

    ngOnInit(): void {}

    UserRole = UserRole;

    get canMakeReservation() {
        return (
            this.currentUser?.role === UserRole.CUSTOMER &&
            this.restaurant?.hasValidLayout()
        );
    }

    get currentUser() {
        return this.userService.currentUser();
    }

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

                    const location = this.restaurant.location;

                    if (location.coordinates.lat && location.coordinates.lng) {
                        this.setMarkerPosition(
                            location.coordinates.lat,
                            location.coordinates.lng,
                        );
                    }
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
                        this.restaurant = new Restaurant({
                            ...this.restaurant,
                            coverPhotoUri: imageUrl,
                        });
                        this.restaurantUpdated.emit(this.restaurant);

                        this.notificationService.open(
                            'Successfully uploaded cover photo',
                            'Ok',
                            {
                                duration: 3000,
                                panelClass: ['success-snackbar'],
                            },
                        );
                    },
                    error: (err: any) => {
                        this.notificationService.open(
                            `Failed to upload cover photo: ${err.message}`,
                            'Oops',
                            {
                                duration: 3000,
                                panelClass: ['fail-snackbar'],
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

    onMakeReservationClick() {
        this.dialog
            .open(CreateReservationDialogComponent, {
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

    onShowReservationClick() {
        this.router.navigate(['reservations'], {
            relativeTo: this.activatedRoute,
        });
    }

    //#region Google Maps

    spinnerType = SpinnerType.PAN;

    @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

    mapZoom = 12;
    mapCenter: google.maps.LatLngLiteral;
    mapOptions: google.maps.MapOptions = {};

    mapMarker: any;

    apiLoaded = this.googleMapsService.apiLoaded;

    constructor(
        private googleMapsService: GoogleMapsService,
        private geolocationService: GeolocationService,
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
                        draggable: false,
                        clickable: true,
                    },
                };

                // Make sure addressForm is loaded
                setTimeout(async () => {
                    // Only do this after api is loaded
                    if (this.restaurant.location.streetAddress?.length) {
                        // Use the restaurant's current location in case of edit
                        const location =
                            await this.geolocationService.getCoordinatesByAddress(
                                this.restaurant.location as RestaurantLocation,
                            );

                        this.mapCenter = {
                            lat: parseFloat(location.lat),
                            lng: parseFloat(location.lon),
                        };

                        this.setMarkerPosition(
                            parseFloat(location.lat),
                            parseFloat(location.lon),
                        );
                    } else {
                        // Center at user's current location (This should be in create)
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                this.mapCenter = {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                };

                                this.setMarkerPosition(
                                    position.coords.latitude,
                                    position.coords.longitude,
                                );

                                document
                                    .getElementById('google-maps')
                                    ?.scrollIntoView();
                            },
                            undefined,
                            {
                                enableHighAccuracy: false,
                                timeout: 5000,
                                maximumAge: Infinity,
                            },
                        );
                    }
                }, 0);
            }
        });
    }

    setMarkerPosition(lat: number, lng: number) {
        this.mapMarker.position = {
            lat,
            lng,
        };
    }
    //#endregion
}
