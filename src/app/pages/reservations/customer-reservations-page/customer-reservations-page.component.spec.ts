import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReservationsPageComponent } from './customer-reservations-page.component';

describe('CustomerReservationsPageComponent', () => {
    let component: CustomerReservationsPageComponent;
    let fixture: ComponentFixture<CustomerReservationsPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CustomerReservationsPageComponent],
        });
        fixture = TestBed.createComponent(CustomerReservationsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
