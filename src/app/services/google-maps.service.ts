import { HttpClient } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class GoogleMapsService {
    apiLoaded: Signal<boolean | undefined>;

    constructor(private httpClient: HttpClient) {
        // If you're using the `<map-heatmap-layer>` directive, you also have to include the `visualization` library
        // when loading the Google Maps API. To do so, you can add `&libraries=visualization` to the script URL:
        // https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization
        if (!this.apiLoaded) {
            this.apiLoaded = toSignal(
                httpClient
                    .jsonp(
                        `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`,
                        'callback',
                    )
                    .pipe(
                        map(() => true),
                        catchError(() => of(false)),
                    ),
            );
        }
    }
}
