import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, concatMap, filter, from, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Coordinates, Restaurant } from '../models/restaurant';
import { GeolocationService } from './geolocation.service';
import { FileUploadService } from './file-upload.service';

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
        private fileUploadService: FileUploadService,
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

    getOwnedRestaurants() {
        const currentUser = this.userService.currentUser();
        const url = `${this.API_URL}/api/restaurants/by-owner/${currentUser?.uid}`;
        const headers = this.authService.getAuthHeaders();

        return this.http
            .get<any>(url, { headers })
            .pipe(map((res) => res.restaurants));
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

    updateRestaurant(restaurant: Restaurant | any) {
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

    uploadCoverPhoto(restaurantId, image: File): Observable<string> {
        const pathname = `images/restaurants/cover/${restaurantId}`;

        const imageUrl$ = from(
            this.fileUploadService.uploadFile(pathname, image),
        );

        // Persist to Mongo
        return imageUrl$.pipe(
            concatMap((imageUrl) => {
                return this.updateRestaurant({
                    _id: restaurantId,
                    coverPhotoUri: imageUrl,
                });
            }),
            map((res: any) => {
                return res.restaurant;
            }),
            map((updatedRestaurant: Restaurant) => {
                return updatedRestaurant.coverPhotoUri;
            }),
        );
    }
}

export type RestaurantFilters = {
    q?: string;
    cuisine?: string; // Cuisine Id
};
