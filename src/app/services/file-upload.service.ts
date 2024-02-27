import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, catchError, firstValueFrom, of, switchMap } from 'rxjs';

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

    deleteFile(filePath: string): Observable<any> {
        // Get a reference to the image in Firebase Storage
        const imageRef = this.afStorage.ref(filePath);

        // Get the download URL for the image
        return imageRef.getDownloadURL().pipe(
            catchError((error) => {
                // If the error indicates the image was not found, handle it gracefully
                if (error.code === 'storage/object-not-found') {
                    console.warn('Image not found at path:', filePath);
                    // Return a observable indicating that the image was not found
                    return of(null);
                }
                // For other errors, re-throw the error
                throw error;
            }),
            // If no error occurred, proceed with the delete operation
            switchMap((downloadURL) => {
                if (downloadURL !== null) {
                    // If the download URL exists, it means the image exists
                    // Proceed with the delete operation
                    return this.afStorage.refFromURL(downloadURL).delete();
                } else {
                    // Image not found, return an observable indicating no action needed
                    return of(null);
                }
            }),
        );
    }
}
