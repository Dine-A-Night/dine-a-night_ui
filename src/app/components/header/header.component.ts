import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    appTitle: string = 'Dine A Night';

    sideMenuTouched = false;
    sideMenuOpen: boolean = false;

    constructor(private location: Location) {}

    ngOnInit(): void {}

    get isLandingPage() {
        return this.currentUrl === '/home';
    }

    get isSurvey() {
        return this.currentUrl === '/survey';
    }

    get isRisk() {
        return this.currentUrl === '/risk';
    }

    get currentUrl(): string {
        return this.location.path().split('?')[0];
    }

    toggleSideMenu(open?: boolean) {
        this.sideMenuTouched = true;

        this.sideMenuOpen = open ?? !this.sideMenuOpen;
    }
}
