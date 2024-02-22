import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
    Subject,
    Subscription,
    debounceTime,
    distinctUntilChanged,
    filter,
} from 'rxjs';
import { Cuisine, Restaurant } from 'src/app/models/restaurant';
import {
    RestaurantFilters,
    RestaurantsService,
} from 'src/app/services/restaurants.service';
import { idToObject } from 'src/app/utils/helper-functions';

@Component({
    selector: 'explore-restaurants-page',
    templateUrl: './explore-restaurants-page.component.html',
    styleUrls: ['./explore-restaurants-page.component.scss'],
})
export class ExploreRestaurantsPageComponent implements OnInit, OnDestroy {
    isSearchFocused: boolean = false;
    restaurants: Restaurant[] = [];
    filteredRestaurants: Restaurant[] = [];
    cuisinesList: Cuisine[] = [];
    searchTerm: string = '';

    isLoading: boolean = false;
    errorMessage: string = '';

    // Property to hold the selected cuisine id
    selectedCuisine?: string;

    nearbyRestaurantsSection: ElementRef<any>;

    constructor(
        private restaurantsService: RestaurantsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    searchTextChanged = new Subject<string>();
    routerSub: Subscription;
    searchTextSubscription: Subscription;

    ngOnInit() {
        const filters = this.activatedRoute.snapshot
            .queryParams as RestaurantFilters;

        // Load filter values
        this.searchTerm = filters.q ?? '';
        this.selectedCuisine = filters.cuisine;

        this.getAllRestaurants(filters);
        this.getAllCuisines();

        this.routerSub = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event) => {
                const filters = this.activatedRoute.snapshot
                    .queryParams as RestaurantFilters;
                // Load filter values
                this.searchTerm = filters.q ?? '';
                this.selectedCuisine = filters.cuisine;

                this.getAllRestaurants(filters as RestaurantFilters);
            });

        this.searchTextSubscription = this.searchTextChanged
            .pipe(distinctUntilChanged(), debounceTime(100)) // Wait 100ms before sending a new request
            .subscribe((searchText) => {
                this.router.navigate(['./'], {
                    queryParams: {
                        q: searchText?.length ? searchText : undefined,
                    },
                    queryParamsHandling: 'merge',
                    relativeTo: this.activatedRoute,
                });
            });
    }

    ngOnDestroy(): void {
        this.routerSub?.unsubscribe();
        this.searchTextSubscription?.unsubscribe();
    }

    onFocus() {
        this.isSearchFocused = true;
    }

    onBlur() {
        this.isSearchFocused = false;
    }

    getAllRestaurants(filters?: RestaurantFilters) {
        this.isLoading = true;
        this.restaurantsService.getRestaurants(filters).subscribe({
            next: (res: any) => {
                if (res.status === 'ok' && Array.isArray(res.restaurants)) {
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
                if (Array.isArray(res.cuisines)) {
                    this.cuisinesList = res.cuisines;
                } else {
                    this.errorMessage =
                        'Invalid response format. Expected an array of cuisines.';
                }
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage =
                    'Error fetching cuisines. Please try again later.';
                this.isLoading = false;
            },
        });
    }

    searchRestaurants() {
        // Filter restaurants based on search term
        this.searchTextChanged.next(this.searchTerm);
    }

    filterByCuisine(cuisine: Cuisine) {
        // Filter restaurants based on cuisine

        if (this.selectedCuisine === cuisine._id) {
            // Remove filter
            this.router.navigate(['./'], {
                queryParams: {
                    cuisine: undefined,
                },
                queryParamsHandling: 'merge',
                relativeTo: this.activatedRoute,
            });
        } else {
            this.router.navigate(['./'], {
                queryParams: {
                    cuisine: cuisine._id,
                },
                queryParamsHandling: 'merge',
                relativeTo: this.activatedRoute,
            });
        }
    }

    get selectedCuisineName() {
        return idToObject(this.selectedCuisine ?? '', this.cuisinesList)?.name;
    }
}
