import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ImagePreviewModalComponent } from '../image-preview-modal/image-preview-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'images-grid',
    templateUrl: './images-grid.component.html',
    styleUrls: ['./images-grid.component.scss'],
})
export class ImagesGridComponent {
    @Input() imageUrls: string[] = [];
    @Input() showDelete: boolean = false;
    @Output() imageDeleted = new EventEmitter<string>();

    dialog = inject(MatDialog);

    openPreview(imageUrl: string) {
        this.dialog
            .open(ImagePreviewModalComponent, {
                data: {
                    imageUrl,
                    showDelete: this.showDelete,
                },
            })
            .afterClosed()
            .subscribe((deletedUrl) => {
                if (!!deletedUrl) {
                    this.imageDeleted.emit(imageUrl);
                }
            });
    }
}
