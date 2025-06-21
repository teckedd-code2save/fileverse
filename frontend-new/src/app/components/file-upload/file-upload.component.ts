import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../../services/file.service';
import { HttpEventType, HttpEvent } from '@angular/common/http';


@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styles: [`
    .upload-container {
      border: 2px dashed #e9ecef;
      border-radius: 24px;
      padding: 3rem 2rem;
      text-align: center;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.8);
    }

    .upload-container.drag-over {
      border-color: #007bff;
      background: rgba(0, 123, 255, 0.05);
      transform: scale(1.02);
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .upload-content i {
      font-size: 4rem;
      color: #007bff;
      opacity: 0.8;
    }

    h3 {
      color: #2c3e50;
      font-size: 1.5rem;
      margin: 0;
    }

    p {
      color: #6c757d;
      margin: 0;
    }

    .pill-button {
      padding: 0.75rem 1.5rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .pill-button:hover {
      background: #0056b3;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
    }

    .pill-button i {
      font-size: 1rem;
      color: white;
    }

    .upload-progress {
      margin-top: 2rem;
    }

    .progress-item {
      margin-bottom: 1rem;
      background: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .file-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .filename {
      color: #2c3e50;
      font-weight: 500;
    }

    .progress-text {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .progress-bar {
      height: 6px;
      background: #e9ecef;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress {
      height: 100%;
      background: #007bff;
      transition: width 0.3s ease;
      border-radius: 3px;
    }
  `]
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  private fileService = inject(FileService);
  isDragging = false;
  uploadingFiles: Array<{ name: string; progress: number }> = [];

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onBrowseClick(): void {
    console.log('Browse clicked');
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    console.log('File selected');
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  private handleFiles(files: FileList): void {
    Array.from(files).forEach(file => {
      this.uploadFile(file);
    });
  }

  private uploadFile(file: File): void {
    const uploadFile = { name: file.name, progress: 0 };
    this.uploadingFiles.push(uploadFile);

    this.fileService.uploadFile(file).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * event.loaded / (event.total || event.loaded));
          uploadFile.progress = progress;
        } else if (event.type === HttpEventType.Response) {
          setTimeout(() => {
            this.uploadingFiles = this.uploadingFiles.filter(f => f !== uploadFile);
          }, 1000);
        }
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.uploadingFiles = this.uploadingFiles.filter(f => f !== uploadFile);
      }
    });
  }
} 