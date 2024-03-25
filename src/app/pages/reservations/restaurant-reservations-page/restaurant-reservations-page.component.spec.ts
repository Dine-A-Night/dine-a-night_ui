import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantReservationsPageComponent } from './restaurant-reservations-page.component';

describe('RestaurantReservationsPageComponent', () => {
    let component: RestaurantReservationsPageComponent;
    let fixture: ComponentFixture<RestaurantReservationsPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RestaurantReservationsPageComponent],
        });
        fixture = TestBed.createComponent(RestaurantReservationsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
