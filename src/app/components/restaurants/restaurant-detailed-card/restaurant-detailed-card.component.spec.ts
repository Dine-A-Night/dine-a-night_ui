import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDetailedCardComponent } from './restaurant-detailed-card.component';

describe('RestaurantDetailedCardComponent', () => {
    let component: RestaurantDetailedCardComponent;
    let fixture: ComponentFixture<RestaurantDetailedCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RestaurantDetailedCardComponent],
        });
        fixture = TestBed.createComponent(RestaurantDetailedCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
