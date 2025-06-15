import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FileMetadata {
  id?: string;
  filename: string;
  file_type: string;
  size: number;
  extension: string;
  width?: number;
  height?: number;
  format?: string;
  mode?: string;
  ocr_text?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {
    console.log('FileService initialized with API URL:', this.apiUrl);
  }

  uploadFile(file: File): Observable<HttpEvent<FileMetadata>> {
    const formData = new FormData();
    formData.append('file', file);
    console.log('Uploading file:', file.name, 'to:', `${this.apiUrl}/files/upload`);
    return this.http.post<FileMetadata>(`${this.apiUrl}/files/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap(event => {
        if (event.type === HttpEventType.UploadProgress) {
          console.log('Upload progress:', Math.round(100 * event.loaded / (event.total || event.loaded)));
        } else if (event.type === HttpEventType.Response) {
          console.log('Upload complete:', event.body);
        }
      })
    );
  }

  searchFiles(query: string, filters?: any, page: number = 1, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/files/search`, {
      params: {
        query,
        page: page.toString(),
        size: size.toString(),
        ...filters
      }
    });
  }

  getFileMetadata(fileId: string): Observable<FileMetadata> {
    return this.http.get<FileMetadata>(`${this.apiUrl}/files/${fileId}`);
  }

  deleteFile(fileId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/files/${fileId}`);
  }
} 