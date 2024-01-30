import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    appTitle: string = 'Dine A Night';

    sideMenuTouched = false;
    sideMenuOpen: boolean = false;

    constructor(
        private location: Location,
        private authService: AuthService,
    ) {}

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

    get user$() {
        return this.authService.userState();
    }

    logout() {
        this.authService.logout();
    }

    toggleSideMenu(open?: boolean) {
        this.sideMenuTouched = true;

        this.sideMenuOpen = open ?? !this.sideMenuOpen;
    }
}
