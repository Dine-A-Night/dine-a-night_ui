import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReservationSummaryComponent } from './create-reservation-summary.component';

describe('CreateReservationSummaryComponent', () => {
    let component: CreateReservationSummaryComponent;
    let fixture: ComponentFixture<CreateReservationSummaryComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CreateReservationSummaryComponent],
        });
        fixture = TestBed.createComponent(CreateReservationSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
