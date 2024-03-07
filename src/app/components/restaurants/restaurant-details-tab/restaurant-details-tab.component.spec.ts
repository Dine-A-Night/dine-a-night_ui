import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDetailsTabComponent } from './restaurant-details-tab.component';

describe('RestaurantDetailsTabComponent', () => {
    let component: RestaurantDetailsTabComponent;
    let fixture: ComponentFixture<RestaurantDetailsTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RestaurantDetailsTabComponent],
        });
        fixture = TestBed.createComponent(RestaurantDetailsTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
