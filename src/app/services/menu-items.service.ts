import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, concat, concatMap, forkJoin, from, map } from 'rxjs';
import { MenuItem } from '../models/menu-item';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { FileUploadService } from './file-upload.service';

@Injectable({
    providedIn: 'root',
})
export class MenuItemsService {
    private API_URL = environment.apiUrl;

    static DEFAULT_MENU_ITEM_IMAGE = 'assets/images/defaultMenuItem.jpg';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private fileUploadService: FileUploadService,
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

    updateMenuItem(
        menuItemId: string,
        updatedMenuItem: MenuItem,
    ): Observable<MenuItem> {
        const url = `${this.API_URL}/menuitems/${menuItemId}`;
        const headers = this.authService.getAuthHeaders();

        return this.http
            .put<MenuItem>(url, updatedMenuItem, { headers })
            .pipe(map((res: any) => res['menuItem']));
    }

    deleteMenuItem(menuItemId: string): Observable<any> {
        const url = `${this.API_URL}/menuitems/${menuItemId}`;
        const headers = this.authService.getAuthHeaders();

        return forkJoin([
            this.fileUploadService.deleteFile(
                this.getMenuItemPhotoPath(menuItemId),
            ),
            this.http.delete(url, { headers }),
        ]);
    }

    uploadMenuPhoto(menuItemId: string, image: File): Observable<string> {
        const pathname = this.getMenuItemPhotoPath(menuItemId);

        return from(this.fileUploadService.uploadFile(pathname, image));
    }

    private getMenuItemPhotoPath(menuItemId: string): string {
        return `images/menuItems/${menuItemId}`;
    }
}
