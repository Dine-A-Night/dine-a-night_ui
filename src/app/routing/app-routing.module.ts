import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from '../pages/landing-page/landing-page.component';
import { LoginComponent } from '../components/auth/login/login.component';
import { RegisterComponent } from '../components/auth/register/register.component';

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
