import { Component, Input, OnInit, ViewChild, effect } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
} from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoogleMapsService } from 'src/app/services/google-maps.service';

// Define a type alias for the form group controls
interface LocationFormControls {
    streetAddress: FormControl<string | null>;
    city: FormControl<string | null>;
    province: FormControl<string | null>;
    postal: FormControl<string | null>;
    country: FormControl<string | null>;
}

// Define a type alias for the form group structure
type LocationFormGroup = FormGroup<LocationFormControls>;

@Component({
    selector: 'app-address-form',
    templateUrl: './app-address-form.component.html',
    styleUrls: ['./app-address-form.component.scss'],
})
export class AppAddressFormComponent implements OnInit {
    apiLoaded = this.googleMapsService.apiLoaded;

    @Input() headerTitle: string;
    @Input() displayMapsPreview = true;

    @Input() addressForm: LocationFormGroup;
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

    mapZoom = 12;
    mapCenter: google.maps.LatLngLiteral;
    mapOptions: google.maps.MapOptions = {};

    mapMarker: any;

    constructor(
        private fb: FormBuilder,
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

                // Only do this after api is loaded
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
                    },
                    undefined,
                    {
                        enableHighAccuracy: false,
                        timeout: 5000,
                        maximumAge: Infinity,
                    },
                );
            }
        });
    }

    ngOnInit(): void {}

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
}
