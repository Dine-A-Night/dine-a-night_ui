import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePreviewModalComponent } from './image-preview-modal.component';

describe('ImagePreviewModalComponent', () => {
    let component: ImagePreviewModalComponent;
    let fixture: ComponentFixture<ImagePreviewModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ImagePreviewModalComponent],
        });
        fixture = TestBed.createComponent(ImagePreviewModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
