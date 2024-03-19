import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Review, Reviews } from '../models/review.model';
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
                            reviews.map((review) =>
                                this.getDateFormattedReview(review),
                            ),
                        ),
                    );
            }),
        );
    }

    addReview(
        restaurantId: string,
        review: Partial<Review>,
    ): Observable<Review> {
        const url = `${this.apiUrl}/restaurants/${restaurantId}/reviews`;
        const headers = this.authService.getAuthHeaders();

        return this.http
            .post(url, review, {
                headers,
            })
            .pipe(map((res) => this.getDateFormattedReview(res['review'])));
    }

    updateReviewById(
        id: string,
        updatedReview: Partial<Review>,
    ): Observable<Review> {
        const url = `${this.apiUrl}/reviews/${id}`;
        const headers = this.authService.getAuthHeaders();

        return this.http
            .put(url, updatedReview, {
                headers,
            })
            .pipe(
                map((res) => {
                    return this.getDateFormattedReview(
                        res['updatedReview'] as Review,
                    );
                }),
            );
    }

    deleteReviewById(id: string): Observable<any> {
        const url = `${this.apiUrl}/reviews/${id}`;
        const headers = this.authService.getAuthHeaders();

        return this.http.delete(url, {
            headers,
        });
    }

    private getDateFormattedReview(review: Review) {
        return {
            ...review,
            createdAt: new Date(review.createdAt),
            updatedAt: new Date(review.updatedAt),
        };
    }
}
