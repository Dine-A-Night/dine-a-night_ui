import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationalTextComponent } from './informational-text.component';

describe('InformationalTextComponent', () => {
    let component: InformationalTextComponent;
    let fixture: ComponentFixture<InformationalTextComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [InformationalTextComponent],
        });
        fixture = TestBed.createComponent(InformationalTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
