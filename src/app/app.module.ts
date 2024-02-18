import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/app-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from 'src/environments/environment.development';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FooterComponent } from './components/footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { UserManagementPageComponent } from './pages/user-management-page/user-management-page.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ExploreRestaurantsPageComponent } from './pages/explore-restaurants-page/explore-restaurants-page.component';
import { ManageRestaurantsComponent } from './pages/manage-restaurants/manage-restaurants.component';
import { ReAuthenticateDialogComponent } from './components/auth/re-authenticate-dialog/re-authenticate-dialog.component';
import { RestaurantCardComponent } from './components/restaurants/restaurant-card/restaurant-card.component';
import { RestaurantAddEditComponent } from './components/restaurants/restaurant-add-edit/restaurant-add-edit.component';
import { MatSelectModule } from '@angular/material/select';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppAddressFormComponent } from './components/maps/app-address-form/app-address-form.component';
import { ConfirmDialogComponent } from './components/reusables/confirm-dialog/confirm-dialog.component';
import { RestaurantDetailedCardComponent } from './components/restaurants/restaurant-detailed-card/restaurant-detailed-card.component';
import { CuisineCardComponent } from './components/cuisines/cuisine-card/cuisine-card.component';
import { RestaurantDetailsPageComponent } from './pages/restaurant-details-page/restaurant-details-page.component';
import { LoadingSpinnerComponent } from './components/reusables/loading-spinner/loading-spinner.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        LandingPageComponent,
        LoginComponent,
        RegisterComponent,
        FooterComponent,
        UserManagementPageComponent,
        ExploreRestaurantsPageComponent,
        ManageRestaurantsComponent,
        ReAuthenticateDialogComponent,
        RestaurantCardComponent,
        RestaurantAddEditComponent,
        AppAddressFormComponent,
        ConfirmDialogComponent,
        RestaurantDetailedCardComponent,
        CuisineCardComponent,
        RestaurantDetailsPageComponent,
        LoadingSpinnerComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDividerModule,
        MatRippleModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatStepperModule,
        MatRadioModule,
        MatMenuModule,
        HttpClientModule,
        HttpClientJsonpModule,
        MatDialogModule,
        FormsModule,
        MatSelectModule,
        GoogleMapsModule,
        MatProgressSpinnerModule,
        MatTabsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
