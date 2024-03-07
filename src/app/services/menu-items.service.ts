import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MenuItem } from '../models/menu-item';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MenuItemsService {
    private API_URL = environment.apiUrl;

    static DEFAULT_MENU_ITEM_IMAGE = 'assets/images/RestaurantCover.jpg';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {}

    getMenuItems(restaurantId: string): Observable<MenuItem[]> {
        const url = `${this.API_URL}/restaurants/${restaurantId}/menu`;
        const headers = this.authService.getAuthHeaders();
        return this.http.get<MenuItem[]>(url, { headers });
    }

    addMenuItem(
        restaurantId: string,
        menuItem: MenuItem,
    ): Observable<MenuItem> {
        const url = `${this.API_URL}/restaurants/${restaurantId}/menu`;
        const headers = this.authService.getAuthHeaders();
        return this.http
            .post<MenuItem>(url, menuItem, { headers })
            .pipe(map((res) => res['menuItem']));
    }

    deleteMenuItem(menuItemId: string): Observable<any> {
        const url = `${this.API_URL}/menuitems/${menuItemId}`;
        const headers = this.authService.getAuthHeaders();

        return this.http.delete(url, { headers });
    }
}
