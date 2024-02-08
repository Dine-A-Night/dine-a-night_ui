import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreRestaurantsPageComponent } from './explore-restaurants-page.component';

describe('ExploreRestaurantsPageComponent', () => {
    let component: ExploreRestaurantsPageComponent;
    let fixture: ComponentFixture<ExploreRestaurantsPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ExploreRestaurantsPageComponent],
        });
        fixture = TestBed.createComponent(ExploreRestaurantsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
