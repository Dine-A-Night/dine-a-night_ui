import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationDetailsPageComponent } from './reservation-details-page.component';

describe('ReservationDetailsPageComponent', () => {
    let component: ReservationDetailsPageComponent;
    let fixture: ComponentFixture<ReservationDetailsPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ReservationDetailsPageComponent],
        });
        fixture = TestBed.createComponent(ReservationDetailsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
