import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingSelectorComponent } from './rating-selector.component';

describe('RatingSelectorComponent', () => {
    let component: RatingSelectorComponent;
    let fixture: ComponentFixture<RatingSelectorComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RatingSelectorComponent],
        });
        fixture = TestBed.createComponent(RatingSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
