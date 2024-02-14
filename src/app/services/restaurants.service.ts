import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Restaurant } from '../models/restaurant';

@Injectable({
    providedIn: 'root',
})
export class RestaurantsService {
    private API_URL = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private userService: UserService,
        private authService: AuthService,
    ) {}

    getRestaurants() {
        const url = `${this.API_URL}/api/restaurants`;

        return this.http.get<any>(url);
    }

    getCuisines() {
        const url = `${this.API_URL}/api/cuisines`;
        return this.http.get<any>(url);
    }

    getOwnedRestaurants() {
        return this.getRestaurants().pipe(
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

    createRestaurant(restaurant: Restaurant): Observable<Restaurant> {
        const url = `${this.API_URL}/api/restaurants`;
        const headers = this.authService.getAuthHeaders();

        return this.http.post<Restaurant>(url, restaurant, {
            headers,
        });
    }
}
