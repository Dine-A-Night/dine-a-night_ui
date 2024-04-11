import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
    playTransition = false;

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.playTransition = true;
    }

    navigateToExploreRestaurants() {
        this.router.navigate(['/explore-restaurants']);
    }
}
