import { Location } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { ProfileUser, UserRole } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
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

    profilePictureUrl: string = UserService.DEFAULT_PROFILE_PHOTO_URI;

    constructor(
        private location: Location,
        private authService: AuthService,
        private userService: UserService,
    ) {}

    UserRole = UserRole;

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
        return UserService.DEFAULT_PROFILE_PHOTO_URI;
    }

    get displayName() {
        return this.user()
            ? `${this.user()?.firstName} ${this.user()?.lastName}`
            : '';
    }

    isCurrentRole(role: UserRole) {
        return this.userService.currentUser()?.role === role;
    }

    logout() {
        this.authService.logout();
    }

    toggleSideMenu(open?: boolean) {
        this.sideMenuTouched = true;

        this.sideMenuOpen = open ?? !this.sideMenuOpen;
    }
}
