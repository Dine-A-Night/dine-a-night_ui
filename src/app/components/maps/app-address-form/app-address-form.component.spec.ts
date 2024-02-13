import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAddressFormComponent } from './app-address-form.component';

describe('AppAddressFormComponent', () => {
    let component: AppAddressFormComponent;
    let fixture: ComponentFixture<AppAddressFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AppAddressFormComponent],
        });
        fixture = TestBed.createComponent(AppAddressFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
