import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reviews } from '../models/review';
import { Observable, map, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReviewService {
    private apiUrl = environment.apiUrl;

    authService = inject(AuthService);
    http = inject(HttpClient);

    getReviewsByRestaurant(restaurantId): Observable<Reviews> {
        const url = `${this.apiUrl}/restaurants/${restaurantId}/reviews`;
        return this.authService.authHeadersObservable().pipe(
            switchMap((headers: HttpHeaders) => {
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
            }),
        );
    }
}
