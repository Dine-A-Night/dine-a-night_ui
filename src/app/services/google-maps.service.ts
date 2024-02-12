import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GoogleMapsService {
    apiLoaded: Observable<boolean>;

    constructor(private httpClient: HttpClient) {
        // If you're using the `<map-heatmap-layer>` directive, you also have to include the `visualization` library
        // when loading the Google Maps API. To do so, you can add `&libraries=visualization` to the script URL:
        // https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization

        if (!this.apiLoaded) {
            this.apiLoaded = httpClient
                .jsonp(
                    'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3OyeF8Ab7V6ZRxp884uDYq6pTXYL8aCQ',
                    'callback',
                )
                .pipe(
                    map(() => true),
                    catchError(() => of(false)),
                );
        }
    }
}
