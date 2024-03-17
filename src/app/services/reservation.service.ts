import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment.development';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { TableType } from '../models/table.model';

@Injectable({
    providedIn: 'root',
})
export class ReservationService {
    API_URL = environment.apiUrl;

    authService = inject(AuthService);
    http = inject(HttpClient);

    getTableTypes(): Observable<TableType[]> {
        const url = `${this.API_URL}/tabletypes`;
        const headers = this.authService.getAuthHeaders();

        return this.http
            .get(url, { headers })
            .pipe(map((res) => res['tableTypes']));
    }
}
