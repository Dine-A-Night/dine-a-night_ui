import { Location } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { Observable, firstValueFrom, map, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProfileUser } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    appTitle: string = 'Dine A Night';

    sideMenuTouched = false;
    sideMenuOpen: boolean = false;

    user: Signal<ProfileUser | null> = this.userService.currentUser;

    profilePictureUrl: string = 'assets/images/profile.jpg';

    constructor(
        private location: Location,
        private authService: AuthService,
        private userService: UserService,
    ) {}

    async ngOnInit() {}

    get isLandingPage() {
        return this.currentUrl === '/home';
    }

    get isLoginPage() {
        return this.currentUrl === '/login';
    }

    get currentUrl(): string {
        return this.location.path().split('?')[0];
    }

    get userInfoAvailable() {
        return this.user() !== undefined;
    }

    get defaultProfilePictureUrl() {
        return 'assets/images/profile.jpg';
    }

    logout() {
        this.authService.logout();
    }

    toggleSideMenu(open?: boolean) {
        this.sideMenuTouched = true;

        this.sideMenuOpen = open ?? !this.sideMenuOpen;
    }
}
