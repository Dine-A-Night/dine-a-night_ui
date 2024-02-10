import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRestaurantsComponent } from './manage-restaurants.component';

describe('ManageRestaurantsComponent', () => {
    let component: ManageRestaurantsComponent;
    let fixture: ComponentFixture<ManageRestaurantsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ManageRestaurantsComponent],
        });
        fixture = TestBed.createComponent(ManageRestaurantsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
