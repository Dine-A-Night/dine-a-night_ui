import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantAddEditComponent } from './restaurant-add-edit.component';

describe('RestaurantAddEditComponent', () => {
    let component: RestaurantAddEditComponent;
    let fixture: ComponentFixture<RestaurantAddEditComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RestaurantAddEditComponent],
        });
        fixture = TestBed.createComponent(RestaurantAddEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
