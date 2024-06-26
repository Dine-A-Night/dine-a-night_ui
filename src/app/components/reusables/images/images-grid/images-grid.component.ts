import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewModalComponent } from '../image-preview-modal/image-preview-modal.component';

@Component({
    selector: 'images-grid',
    templateUrl: './images-grid.component.html',
    styleUrls: ['./images-grid.component.scss'],
})
export class ImagesGridComponent {
    @Input() imageUrls: string[] = [];
    @Input() showDelete: boolean = false;
    @Output() imageDeleted = new EventEmitter<string>();

    @Input() restaurantId: string;

    dialog = inject(MatDialog);

    openPreview(imageUrl: string) {
        this.dialog
            .open(ImagePreviewModalComponent, {
                data: {
                    imageUrl,
                    showDelete: this.showDelete,
                    restaurantId: this.restaurantId,
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
