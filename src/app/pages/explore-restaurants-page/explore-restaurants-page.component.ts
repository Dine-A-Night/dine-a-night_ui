import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from 'src/app/services/restaurants.service';

interface Location {
    city: string;
    country: string;
    postal: string;
    province: string;
    streetAddress: string;
}

interface Restaurant {
    name: string;
    description: string;
    photoUris?: string[];
    location: Location;
}

interface Cuisine {
    name: string;
    imageUrl?: string[];
}

@Component({
    selector: 'explore-restaurants-page',
    templateUrl: './explore-restaurants-page.component.html',
    styleUrls: ['./explore-restaurants-page.component.scss'],
})
export class ExploreRestaurantsPageComponent implements OnInit {
    isSearchFocused: boolean = false;
    restaurants: Restaurant[] = [];
    cuisines: Cuisine[] = []; // Add a cuisines array

    isLoading: boolean = false;
    errorMessage: string = '';
    $color: any;
    accent: any;

    constructor(private restaurantsService: RestaurantsService) {}

    ngOnInit() {
        this.getAllRestaurants();
        this.getAllCuisines();
    }

    onFocus() {
        this.isSearchFocused = true;
    }

    onBlur() {
        this.isSearchFocused = false;
    }

    getAllRestaurants() {
        this.isLoading = true;
        this.restaurantsService.getRestaurants().subscribe(
            (res) => {
                console.log('Response:', res);
                if (res.status === 'ok' && Array.isArray(res.restaurants)) {
                    console.log(
                        'Number of restaurants:',
                        res.restaurants.length,
                    );
                    this.restaurants = res.restaurants;
                } else {
                    this.errorMessage =
                        'Invalid response format. Expected a status of "ok" and an array of restaurants.';
                }
                this.isLoading = false;
            },
            (error) => {
                console.error('Error fetching restaurants:', error);
                this.errorMessage =
                    'Error fetching restaurants. Please try again later.';
                this.isLoading = false;
            },
        );
    }

    getAllCuisines() {
        this.isLoading = true;
        this.restaurantsService.getCuisines().subscribe(
            (res) => {
                console.log('Response:', res);
                if (Array.isArray(res.cuisines)) {
                    console.log('Number of cuisines:', res.cuisines.length);
                    this.cuisines = res.cuisines;
                } else {
                    this.errorMessage =
                        'Invalid response format. Expected an array of cuisines.';
                }
                this.isLoading = false;
            },
            (error) => {
                console.error('Error fetching cuisines:', error);
                this.errorMessage =
                    'Error fetching cuisines. Please try again later.';
                this.isLoading = false;
            },
        );
    }
}
