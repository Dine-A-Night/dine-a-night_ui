import {
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Renderer2,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'file-selector',
    templateUrl: './file-selector.component.html',
    styleUrls: ['./file-selector.component.scss'],
})
export class FileSelectorComponent {
    @Input() type: string = 'file';
    @Input() multiple: boolean = false;
    @Output() filesSelected = new EventEmitter<FileList>();
    @ContentChild('fileSelector', { read: ElementRef })
    inputTrigger: ElementRef;
    @ViewChild('coverPhotoInputField') coverPhotoInputField: ElementRef;

    constructor(private renderer: Renderer2) {}

    onFilesChanged(event) {
        this.filesSelected.emit(event.target.files);
    }

    ngAfterContentInit(): void {
        console.log(this.inputTrigger);
        this.renderer.listen(
            this.inputTrigger.nativeElement,
            'click',
            (event) => {
                this.coverPhotoInputField?.nativeElement.click();
            },
        );
    }
}
