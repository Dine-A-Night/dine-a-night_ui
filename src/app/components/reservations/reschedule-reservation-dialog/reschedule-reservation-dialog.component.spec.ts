import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleReservationDialogComponent } from './reschedule-reservation-dialog.component';

describe('RescheduleReservationDialogComponent', () => {
    let component: RescheduleReservationDialogComponent;
    let fixture: ComponentFixture<RescheduleReservationDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RescheduleReservationDialogComponent],
        });
        fixture = TestBed.createComponent(RescheduleReservationDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
