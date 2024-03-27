import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/app-routing.module';

import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from 'src/environments/environment.development';
import { LoginComponent } from './components/auth/login/login.component';
import { ReAuthenticateDialogComponent } from './components/auth/re-authenticate-dialog/re-authenticate-dialog.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CuisineCardComponent } from './components/cuisines/cuisine-card/cuisine-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AppAddressFormComponent } from './components/maps/app-address-form/app-address-form.component';
import { AddMenuItemDialogComponent } from './components/menu-items/menu-item/add-menu-item-dialog/add-menu-item-dialog.component';
import { MenuItemComponent } from './components/menu-items/menu-item/menu-item.component';
import { MenuItemsComponent } from './components/menu-items/menu-items.component';
import { RestaurantAddEditComponent } from './components/restaurants/restaurant-add-edit/restaurant-add-edit.component';
import { RestaurantCardComponent } from './components/restaurants/restaurant-card/restaurant-card.component';
import { RestaurantDetailedCardComponent } from './components/restaurants/restaurant-detailed-card/restaurant-detailed-card.component';
import { RestaurantDetailsTabComponent } from './components/restaurants/restaurant-details-tab/restaurant-details-tab.component';
import { RestaurantImagesComponent } from './components/restaurants/restaurant-images/restaurant-images.component';
import { RestaurantLayoutBuilderComponent } from './components/restaurants/restaurant-layout-builder/restaurant-layout-builder.component';
import { RestaurantLayoutComponent } from './components/restaurants/restaurant-layout-builder/restaurant-layout/restaurant-layout.component';
import { AddReviewFormComponent } from './components/restaurants/reviews/add-review-form/add-review-form.component';
import { RatingSelectorComponent } from './components/restaurants/reviews/rating-selector/rating-selector.component';
import { ReviewComponent } from './components/restaurants/reviews/review/review.component';
import { ReviewsComponent } from './components/restaurants/reviews/reviews.component';
import { ConfirmDialogComponent } from './components/reusables/confirm-dialog/confirm-dialog.component';
import { FileSelectorComponent } from './components/reusables/file-selector/file-selector.component';
import { ImagePreviewModalComponent } from './components/reusables/images/image-preview-modal/image-preview-modal.component';
import { ImagesGridComponent } from './components/reusables/images/images-grid/images-grid.component';
import { LoadingSpinnerComponent } from './components/reusables/loading-spinner/loading-spinner.component';
import { ExploreRestaurantsPageComponent } from './pages/explore-restaurants-page/explore-restaurants-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ManageRestaurantsComponent } from './pages/manage-restaurants/manage-restaurants.component';
import { RestaurantDetailsPageComponent } from './pages/restaurant-details-page/restaurant-details-page.component';
import { UserManagementPageComponent } from './pages/user-management-page/user-management-page.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CreateReservationDialogComponent } from './components/reservations/create-reservation-dialog/create-reservation-dialog.component';
import { TableCellRendererComponent } from './components/restaurants/restaurant-layout-builder/restaurant-layout/table-cell-renderer/table-cell-renderer.component';
import { MetersToKmsPipe } from './pipes/meters-to-kms.pipe';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { PreorderFormComponent } from './components/reservations/preorder-form/preorder-form.component';
import { CreateReservationSummaryComponent } from './components/reservations/create-reservation-dialog/create-reservation-summary/create-reservation-summary.component';

import { MatTableModule } from '@angular/material/table';
import { CustomerReservationsPageComponent } from './pages/reservations/customer-reservations-page/customer-reservations-page.component';
import { RestaurantReservationsPageComponent } from './pages/reservations/restaurant-reservations-page/restaurant-reservations-page.component';

import { MatSortModule } from '@angular/material/sort';
import { InformationalTextComponent } from './components/reusables/informational-text/informational-text.component';
import { AgGridAngular } from 'ag-grid-angular';
import { ImageCellRendererComponent } from './components/ag-grid/cell-renderers/image-cell-renderer.component';
import { DateCellRendererComponent } from './components/ag-grid/cell-renderers/date-cell-renderer.component';
import { CurrencyCellRendererComponent } from './components/ag-grid/cell-renderers/currency-cell-renderer.component';

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
        FileSelectorComponent,
        RestaurantImagesComponent,
        ImagesGridComponent,
        ImagePreviewModalComponent,
        ReviewsComponent,
        ReviewComponent,
        RatingSelectorComponent,
        AddReviewFormComponent,
        MenuItemsComponent,
        AddMenuItemDialogComponent,
        MenuItemComponent,
        RestaurantDetailsTabComponent,
        RestaurantLayoutBuilderComponent,
        RestaurantLayoutComponent,
        TableCellRendererComponent,
        MetersToKmsPipe,
        CreateReservationDialogComponent,
        PreorderFormComponent,
        CreateReservationSummaryComponent,
        RestaurantReservationsPageComponent,
        CustomerReservationsPageComponent,
        InformationalTextComponent,
        ImageCellRendererComponent,
        DateCellRendererComponent,
        CurrencyCellRendererComponent,
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
        DragDropModule,
        NgxMaterialTimepickerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatSortModule,
        AgGridAngular,
    ],
    providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }], // Provide an empty object as a default value],
    bootstrap: [AppComponent],
})
export class AppModule {}
