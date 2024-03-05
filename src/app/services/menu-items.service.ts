import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from '../models/menu-item';
import { environment } from 'src/environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class MenuItemsService {
    private API_URL = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getMenuItems(restaurantId: string): Observable<MenuItem[]> {
        const url = `${this.API_URL}/restaurants/${restaurantId}/menuitems`;
        return this.http.get<MenuItem[]>(url);
    }
}
