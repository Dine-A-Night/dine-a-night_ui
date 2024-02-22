import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Coordinates, Restaurant } from '../models/restaurant';
import { GeolocationService } from './geolocation.service';

@Injectable({
    providedIn: 'root',
})
export class RestaurantsService {
    private API_URL = environment.apiUrl;

    public static DEFAULT_COVER_PHOTO_URI = 'assets/images/RestaurantCover.jpg';

    constructor(
        private http: HttpClient,
        private userService: UserService,
        private authService: AuthService,
        private geoLocationService: GeolocationService,
    ) {}

    getRestaurants(filters?: RestaurantFilters): Observable<any> {
        return this.geoLocationService.getCurrentLocation().pipe(
            switchMap((coordinates: Coordinates | null) => {
                let params = new HttpParams();

                // Add other filters if any
                if (filters) {
                    Object.keys(filters).forEach((key) => {
                        params = params.append(key, filters[key]);
                    });
                }

                // Add coordinates if available
                if (coordinates) {
                    params = params.append(
                        'latitude',
                        coordinates.lat.toString(),
                    );
                    params = params.append(
                        'longitude',
                        coordinates.lng.toString(),
                    );
                }

                const url = `${this.API_URL}/api/restaurants`;

                return this.http.get<any>(url, { params: params });
            }),
        );
    }

    getCuisines() {
        const url = `${this.API_URL}/api/cuisines`;
        return this.http.get<any>(url);
    }

    getOwnedRestaurants(filters?: RestaurantFilters) {
        // TODO: This filtering needs to be done on the server
        return this.getRestaurants(filters).pipe(
            map((data) => data?.restaurants),
            map((restaurants) => {
                return restaurants.filter(
                    (restaurant) =>
                        restaurant.ownerId ===
                        this.userService.currentUser()?.uid,
                );
            }),
        );
    }

    getCuisinesList() {
        const url = `${this.API_URL}/api/cuisines`;
        const headers = this.authService.getAuthHeaders();

        return this.http
            .get(url, { headers })
            .pipe(map((res: any) => res.cuisines));
    }

    getRestaurantById(id: string) {
        const url = `${this.API_URL}/api/restaurants/${id}`;

        return this.http.get(url).pipe(map((res) => res['restaurant']));
    }

    createRestaurant(restaurant: Restaurant): Observable<Restaurant> {
        const url = `${this.API_URL}/api/restaurants`;
        const headers = this.authService.getAuthHeaders();

        return this.http.post<Restaurant>(url, restaurant, {
            headers,
        });
    }

    updateRestaurant(restaurant: Restaurant) {
        const url = `${this.API_URL}/api/restaurants/${restaurant._id}`;
        const headers = this.authService.getAuthHeaders();

        return this.http.put<Restaurant>(url, restaurant, {
            headers,
        });
    }

    deleteRestaurant(id: string) {
        const url = `${this.API_URL}/api/restaurants/${id}`;
        const headers = this.authService.getAuthHeaders();

        return this.http.delete<Restaurant>(url, {
            headers,
        });
    }
}

export type RestaurantFilters = {
    q?: string;
    cuisine?: string; // Cuisine Id
};
