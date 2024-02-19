import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    effect,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { Coordinates } from 'src/app/models/restaurant';
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

type AddressType = 'establishment' | 'address' | 'geocode';

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

    @Output() markerPositionChange: EventEmitter<Coordinates> =
        new EventEmitter<Coordinates>();

    mapZoom = 12;
    mapCenter: google.maps.LatLngLiteral;
    mapOptions: google.maps.MapOptions = {};

    mapMarker: any;

    //#region Address Autocomplete

    @ViewChild('addressInputField') addressInputField: ElementRef<any>;
    @Input() addressType: AddressType[] = ['address', 'establishment'];
    @Output() addressChange: EventEmitter<any> = new EventEmitter();

    private getPlaceAutocomplete() {
        if (this.addressInputField) {
            const autocomplete = new google.maps.places.Autocomplete(
                this.addressInputField.nativeElement,
                {
                    componentRestrictions: { country: ['CA', 'US'] },
                    types: ['establishment'], // 'establishment' / 'address' / 'geocode'
                },
            );
            google.maps.event.addListener(autocomplete, 'place_changed', () => {
                const place = autocomplete.getPlace();

                if (place.geometry?.location) {
                    const newCoords = place.geometry?.location?.toJSON();

                    this.mapCenter = newCoords;
                    this.setMarkerPosition(newCoords.lat, newCoords.lng);

                    this.mapZoom = 15;
                }

                console.log(place.place_id);

                this.invokeAddressChangeEvent(place);
            });
        }
    }

    invokeAddressChangeEvent(place: Object) {
        this.addressChange.emit(place);
    }

    //#endregion

    constructor(private googleMapsService: GoogleMapsService) {
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

                setTimeout(() => {
                    this.getPlaceAutocomplete();
                }, 0);
            }
        });
    }

    ngOnInit(): void {}

    setMarkerPosition(lat: number, lng: number) {
        this.mapMarker.position = {
            lat,
            lng,
        };

        this.markerPositionChange.emit({
            lat,
            lng,
        });
    }

    mapClick(event: google.maps.MapMouseEvent) {
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();

        if (lat && lng) {
            this.setMarkerPosition(lat, lng);
        }
    }
}

export interface AddressComponents {
    streetNumber?: string;
    route?: string;
    city?: string;
    province?: string;
    postal?: string;
    country?: string;
}

export function extractAddressProps(
    placeObject: google.maps.places.PlaceResult,
): AddressComponents {
    const addressComponents: AddressComponents = {};

    // Define a mapping object for address component types
    const componentMapping: { [key: string]: string } = {
        street_number: 'streetNumber',
        route: 'route',
        locality: 'city',
        administrative_area_level_1: 'province',
        postal_code: 'postal',
        country: 'country',
    };

    // Loop through address components
    if (placeObject.address_components) {
        for (const component of placeObject.address_components) {
            // Check types to determine the type of address component
            for (const type of component.types) {
                // Map component type to variable name and store value
                const variableName = componentMapping[type];
                if (variableName) {
                    addressComponents[variableName] = component.long_name;
                }
            }
        }
    }

    return {
        ...addressComponents,
    };
}
