import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cuisine, Restaurant } from 'src/app/models/restaurant';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
    selector: 'explore-restaurants-page',
    templateUrl: './explore-restaurants-page.component.html',
    styleUrls: ['./explore-restaurants-page.component.scss'],
})
export class ExploreRestaurantsPageComponent implements OnInit {
    isSearchFocused: boolean = false;
    restaurants: Restaurant[] = [];
    filteredRestaurants: Restaurant[] = [];
    cuisines: Cuisine[] = [];
    searchTerm: string = '';

    isLoading: boolean = false;
    errorMessage: string = '';

    selectedCuisine: string = ''; // Property to hold the selected cuisine

    @ViewChild('nearbyRestaurantsSection')
    nearbyRestaurantsSection: ElementRef<any>;

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
        this.restaurantsService.getRestaurants().subscribe({
            next: (res: any) => {
                console.log('Response:', res);
                if (res.status === 'ok' && Array.isArray(res.restaurants)) {
                    console.log(
                        'Number of restaurants:',
                        res.restaurants.length,
                    );
                    this.restaurants = res.restaurants;
                    this.filteredRestaurants = [...this.restaurants]; // Initialize filteredRestaurants
                } else {
                    this.errorMessage =
                        'Invalid response format. Expected a status of "ok" and an array of restaurants.';
                }
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error fetching restaurants:', error);
                this.errorMessage =
                    'Error fetching restaurants. Please try again later.';
                this.isLoading = false;
            },
        });
    }

    getAllCuisines() {
        this.isLoading = true;
        this.restaurantsService.getCuisines().subscribe({
            next: (res: any) => {
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
            error: (error) => {
                console.error('Error fetching cuisines:', error);
                this.errorMessage =
                    'Error fetching cuisines. Please try again later.';
                this.isLoading = false;
            },
        });
    }

    searchRestaurants() {
        // Filter restaurants based on search term
        this.filteredRestaurants = this.restaurants.filter((restaurant) =>
            restaurant.name
                .toLowerCase()
                .includes(this.searchTerm.toLowerCase()),
        );
    }

    filterByCuisine(cuisineName: string) {
        // Filter restaurants based on cuisine
        this.selectedCuisine = cuisineName; // Set the selected cuisine
        this.filteredRestaurants = this.restaurants.filter((restaurant) =>
            restaurant.cuisines.some(
                (cuisine) =>
                    cuisine.name.toLowerCase() === cuisineName.toLowerCase(),
            ),
        );

        this.nearbyRestaurantsSection?.nativeElement.scrollIntoView();
    }
}
