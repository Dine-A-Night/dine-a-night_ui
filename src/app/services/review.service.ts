import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Reviews } from '../models/review';
import { Observable, map, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReviewService {
    private apiUrl = environment.apiUrl;

    authService = inject(AuthService);
    http = inject(HttpClient);

    getReviewsByRestaurant(restaurantId): Observable<Reviews> {
        const url = `${this.apiUrl}/restaurants/${restaurantId}/reviews`;
        const headers = this.authService.getAuthHeaders();

        return this.http
            .get<Reviews>(url, {
                headers,
            })
            .pipe(
                map((res) => res['reviews'] as Reviews),
                map((reviews) =>
                    // Map date field to JS Date objects
                    reviews.map((review) => ({
                        ...review,
                        createdAt: new Date(review.createdAt),
                        updatedAt: new Date(review.updatedAt),
                    })),
                ),
            );
    }
}
