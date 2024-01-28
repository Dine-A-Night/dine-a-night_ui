import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    appTitle: string = 'Dine A Night';

    sideMenuTouched = false;
    sideMenuOpen: boolean = false;

    constructor(private router: Router) {}

    ngOnInit(): void {}

    get isLandingPage() {
        return this.router.url === '/';
    }

    get isSurvey() {
        return this.router.url === '/survey';
    }

    get isRisk() {
        return this.router.url === '/risk';
    }

    toggleSideMenu(open?: boolean) {
        this.sideMenuTouched = true;

        this.sideMenuOpen = open ?? !this.sideMenuOpen;
    }
}
