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

        // Fake data until route works
        return of(
            [
                {
                    _id: '65e0d8458f52415c27be3add',
                    restaurantId: '65cc16abe290be362c1130d7',
                    user: {
                        uid: 'p7x8l3GOR0aUacfWrRVpOQ0e6wF2',
                        displayName: 'Amnish Singh Arora',
                        profilePictureUrl:
                            'https://firebasestorage.googleapis.com/v0/b/dine-a-night.appspot.com/o/images%2Fprofile%2Fp7x8l3GOR0aUacfWrRVpOQ0e6wF2?alt=media&token=4c2862ff-c2c2-4a51-8c4e-359a89d1301d',
                    },
                    rating: 4,
                    message: 'The best place to dine in near my home.',
                    createdAt: new Date(1709234535000),
                    updatedAt: new Date(1709234535000),
                },
            ].filter((review) => review.restaurantId === restaurantId),
        );
        return this.http
            .get<Reviews>(url, {
                headers,
            })
            .pipe(map((res) => res['reviews']));
    }
}
