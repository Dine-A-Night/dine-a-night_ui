import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FileUploadService {
    constructor(private afStorage: AngularFireStorage) {}

    async uploadFile(pathname: string, file: File): Promise<string> {
        // Reference to storage bucket
        const ref = this.afStorage.ref(pathname);

        const uploadTask = this.afStorage.upload(pathname, file);

        await uploadTask;

        return firstValueFrom(ref.getDownloadURL());
    }
}
