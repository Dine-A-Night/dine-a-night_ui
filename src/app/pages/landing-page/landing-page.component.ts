import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
    playTransition = false;

    constructor(
        private router: Router,
        private userSerice: UserService,
    ) {}

    ngOnInit(): void {
        this.playTransition = true;

        this.getAllRestaurants();
    }

    navigateToExploreRestaurants() {
        this.router.navigate(['/explore-restaurants']);
    }

    getAllRestaurants() {
        this.userSerice.getRestaurants().subscribe((res) => {
            console.log(res);
        });
    }
}
