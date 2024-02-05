import { Location } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { Observable, firstValueFrom, map, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    appTitle: string = 'Dine A Night';

    sideMenuTouched = false;
    sideMenuOpen: boolean = false;

    userInfoAvailable: boolean = false;
    profilePictureUrl: string = 'assets/images/profile.jpg';

    constructor(
        private location: Location,
        private authService: AuthService,
    ) {}

    async ngOnInit() {
        this.user$.subscribe((user) => {
            this.userInfoAvailable = true;

            this.profilePictureUrl = user.profilePictureUrl;
        });
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
