import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationDurationFormComponent } from './reservation-duration-form.component';

describe('ReservationDurationFormComponent', () => {
    let component: ReservationDurationFormComponent;
    let fixture: ComponentFixture<ReservationDurationFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ReservationDurationFormComponent],
        });
        fixture = TestBed.createComponent(ReservationDurationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
