import { Component } from '@angular/core';

@Component({
    selector: 'explore-restaurants-page',
    templateUrl: './explore-restaurants-page.component.html',
    styleUrls: ['./explore-restaurants-page.component.scss'],
})
export class ExploreRestaurantsPageComponent {
    isSearchFocused: boolean = false;

    onFocus() {
        this.isSearchFocused = true;
    }

    onBlur() {
        this.isSearchFocused = false;
    }
}
