import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReviewFormComponent } from './add-review-form.component';

describe('AddReviewFormComponent', () => {
    let component: AddReviewFormComponent;
    let fixture: ComponentFixture<AddReviewFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddReviewFormComponent],
        });
        fixture = TestBed.createComponent(AddReviewFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
