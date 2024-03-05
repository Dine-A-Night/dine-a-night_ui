import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from '../pages/landing-page/landing-page.component';
import { LoginComponent } from '../components/auth/login/login.component';
import { RegisterComponent } from '../components/auth/register/register.component';
import { UserManagementPageComponent } from '../pages/user-management-page/user-management-page.component';
import { ExploreRestaurantsPageComponent } from '../pages/explore-restaurants-page/explore-restaurants-page.component';
import { ManageRestaurantsComponent } from '../pages/manage-restaurants/manage-restaurants.component';
import { RestaurantAddEditComponent } from '../components/restaurants/restaurant-add-edit/restaurant-add-edit.component';
import { RestaurantDetailsPageComponent } from '../pages/restaurant-details-page/restaurant-details-page.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UserRole } from '../models/user.model';

const routes: Routes = [
    {
        path: 'home',
        pathMatch: 'full',
        component: LandingPageComponent,
    },
    {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent,
    },
    {
        path: 'register',
        pathMatch: 'full',
        component: RegisterComponent,
    },
    {
        path: 'userProfile',
        pathMatch: 'full',
        component: UserManagementPageComponent,
        canActivate: [authGuard],
    },
    {
        path: 'explore-restaurants',
        pathMatch: 'full',
        component: ExploreRestaurantsPageComponent,
    },
    {
        path: 'explore-restaurants/:id',
        pathMatch: 'full',
        component: RestaurantDetailsPageComponent,
    },
    {
        path: 'manage-restaurants',
        pathMatch: 'full',
        component: ManageRestaurantsComponent,
        canActivate: [authGuard, roleGuard(UserRole.ADMIN, '/userProfile')],
    },
    {
        path: 'manage-restaurants/create',
        pathMatch: 'full',
        component: RestaurantAddEditComponent,
        canActivate: [authGuard, roleGuard(UserRole.ADMIN, '/userProfile')],
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
            onSameUrlNavigation: 'reload',
            scrollOffset: [0, 50],
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
