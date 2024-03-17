import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, concatMap, from, map, switchMap, zip } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { v4 as uuidv4 } from 'uuid';
import {
    Coordinates,
    Restaurant,
    RestaurantDimensions,
} from '../models/restaurant.model';
import { Tables } from '../models/table.model';
import { AuthService } from './auth.service';
import { FileUploadService } from './file-upload.service';
import { GeolocationService } from './geolocation.service';
import { UserService } from './user.service';

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

                const url = `${this.API_URL}/restaurants`;

                return this.http.get<any>(url, { params: params });
            }),
        );
    }

    getCuisines() {
        const url = `${this.API_URL}/cuisines`;
        return this.http.get<any>(url);
    }

    getOwnedRestaurants() {
        const currentUser = this.userService.currentUser();
        const url = `${this.API_URL}/restaurants/by-owner/${currentUser?.uid}`;
        const headers = this.authService.getAuthHeaders();

        return this.http
            .get<any>(url, { headers })
            .pipe(map((res) => res.restaurants));
    }

    getCuisinesList() {
        const url = `${this.API_URL}/cuisines`;
        const headers = this.authService.getAuthHeaders();

        return this.http
            .get(url, { headers })
            .pipe(map((res: any) => res.cuisines));
    }

    getRestaurantById(id: string) {
        const url = `${this.API_URL}/restaurants/${id}`;

        return this.http.get(url).pipe(map((res) => res['restaurant']));
    }

    createRestaurant(restaurant: Restaurant): Observable<Restaurant> {
        const url = `${this.API_URL}/restaurants`;
        const headers = this.authService.getAuthHeaders();

        return this.http.post<Restaurant>(url, restaurant, {
            headers,
        });
    }

    updateRestaurant(restaurant: Restaurant | any) {
        const url = `${this.API_URL}/restaurants/${restaurant._id}`;
        const headers = this.authService.getAuthHeaders();

        return this.http.put<Restaurant>(url, restaurant, {
            headers,
        });
    }

    deleteRestaurant(id: string) {
        const url = `${this.API_URL}/restaurants/${id}`;
        const headers = this.authService.getAuthHeaders();

        const deleteRestaurant$ = this.http.delete<Restaurant>(url, {
            headers,
        });

        const deleteRestaurantImages$ = this.deleteRestaurantImages(id);

        return zip(deleteRestaurant$, deleteRestaurantImages$);
    }

    private deleteRestaurantImages(restaurantId: string): Observable<any> {
        return this.fileUploadService.deleteFile(
            this.getRestaurantCoverPhotoPath(restaurantId),
        );
    }

    getRestaurantCoverPhotoPath(restaurantId: string) {
        return `images/restaurants/cover/${restaurantId}`;
    }

    uploadCoverPhoto(restaurantId, image: File): Observable<string> {
        const pathname = this.getRestaurantCoverPhotoPath(restaurantId);

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

    private generateNewRestaurantImagePath(restaurantId: string) {
        const uuid = uuidv4();

        return `images/restaurants/${restaurantId}/${uuid}`;
    }

    uploadImage(restaurant: Restaurant, image: File): Observable<Restaurant> {
        const { _id: restaurantId, photoUris } = restaurant;
        const pathname = this.generateNewRestaurantImagePath(restaurantId);

        const imageUrl$ = from(
            this.fileUploadService.uploadFile(pathname, image),
        );

        // Persist to Mongo
        return imageUrl$.pipe(
            concatMap((imageUrl) => {
                return this.updateRestaurant({
                    _id: restaurantId,
                    photoUris: [...(photoUris ?? []), imageUrl],
                });
            }),
            map((res: any) => {
                return res.restaurant as Restaurant;
            }),
        );
    }

    deleteImage(restaurantId: string, imageUrl: string) {
        // Delete image resource from firebase
        const deleteImage$ = this.fileUploadService.deleteFileAtUrl(imageUrl);

        const url = `${this.API_URL}/restaurants/${restaurantId}/delete-image`;
        const headers = this.authService.getAuthHeaders();
        // API Call to delete image from mongo
        const deleteImageRef$ = this.http.post(url, { imageUrl }, { headers });

        return zip(deleteImage$, deleteImageRef$);
    }

    getAllTables(restaurantId: string): Observable<Tables> {
        const url = `${this.API_URL}/restaurants/${restaurantId}/tables`;
        const headers = this.authService.getAuthHeaders();

        return this.http
            .get(url, { headers })
            .pipe(map((res) => res['tables'] as Tables));
    }

    updateLayout(
        restaurantId,
        layout: RestaurantDimensions,
        tables: Tables,
    ): Observable<Restaurant> {
        const url = `${this.API_URL}/restaurants/${restaurantId}/tables`;
        const headers = this.authService.getAuthHeaders();

        const body = {
            layout,
            tables,
        };

        return this.http
            .post(url, body, { headers })
            .pipe(map((res) => res['restaurant'] as Restaurant));
    }
}

export type RestaurantFilters = {
    q?: string;
    cuisine?: string; // Cuisine Id
};
