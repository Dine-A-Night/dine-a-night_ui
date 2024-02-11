import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class RestaurantsService {
    private API_URL = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private userService: UserService,
    ) {}

    getRestaurants() {
        const url = `${this.API_URL}/api/restaurants`;

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
}
