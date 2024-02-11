import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAuthenticateDialogComponent } from './re-authenticate-dialog.component';

describe('ReAuthenticateDialogComponent', () => {
    let component: ReAuthenticateDialogComponent;
    let fixture: ComponentFixture<ReAuthenticateDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ReAuthenticateDialogComponent],
        });
        fixture = TestBed.createComponent(ReAuthenticateDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
