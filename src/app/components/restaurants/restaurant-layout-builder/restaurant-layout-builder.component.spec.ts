import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantLayoutBuilderComponent } from './restaurant-layout-builder.component';

describe('RestaurantLayoutBuilderComponent', () => {
    let component: RestaurantLayoutBuilderComponent;
    let fixture: ComponentFixture<RestaurantLayoutBuilderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RestaurantLayoutBuilderComponent],
        });
        fixture = TestBed.createComponent(RestaurantLayoutBuilderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
