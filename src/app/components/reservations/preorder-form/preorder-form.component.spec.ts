import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreorderFormComponent } from './preorder-form.component';

describe('PreorderFormComponent', () => {
    let component: PreorderFormComponent;
    let fixture: ComponentFixture<PreorderFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PreorderFormComponent],
        });
        fixture = TestBed.createComponent(PreorderFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
