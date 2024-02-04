import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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

    async ngOnInit() {
        console.log((await firstValueFrom(this.authService.userState())).uid);
    }

    get isLandingPage() {
        return this.currentUrl === '/home';
    }

    get isLoginPage() {
        return this.currentUrl === '/login';
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
