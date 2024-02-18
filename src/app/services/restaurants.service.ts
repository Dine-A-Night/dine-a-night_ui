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

    getRestaurants(filters?: RestaurantFilters) {
        const url = `${this.API_URL}/api/restaurants`;

        return this.http.get<any>(url, {
            params: filters,
        });
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

    createRestaurant(restaurant: Restaurant): Observable<Restaurant> {
        const url = `${this.API_URL}/api/restaurants`;
        const headers = this.authService.getAuthHeaders();

        return this.http.post<Restaurant>(url, restaurant, {
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

type RestaurantFilters = {
    q?: string;
    cuisine?: string; // Cuisine Id
};
