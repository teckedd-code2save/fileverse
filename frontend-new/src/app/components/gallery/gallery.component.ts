import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../../services/file.service';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { MatGridListModule } from '@angular/material/grid-list';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FileSizePipe, MatGridListModule],
  templateUrl: "./gallery.component.html",
  styles: [`
    .mat-grid-list {
      padding: 1rem;
      gap: 1rem;
    }

    .gallery-item {
      transition: transform 0.2s;
    }

    .gallery-item:hover {
      transform: translateY(-5px);
    }

    .mat-grid-tile {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .file-preview {
      position: relative;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }

    .preview-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }

    .video-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.7);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .file-icon {
      font-size: 3rem;
      color: #4a90e2;
      text-align: center;
    }

    .file-info {
      text-align: center;
    }

    .file-info h3 {
      margin: 0;
      font-size: 1rem;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-info p {
      margin: 0.25rem 0;
      font-size: 0.875rem;
      color: #666;
    }

    .file-actions {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .action-button {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: #4a90e2;
      transition: color 0.2s;
    }

    .action-button:hover {
      color: #2c5282;
    }

    .action-button.delete:hover {
      color: #e53e3e;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .empty-state i {
      font-size: 4rem;
      color: #ddd;
      margin-bottom: 1rem;
    }

    .empty-state p {
      margin: 0.5rem 0;
      font-size: 1.1rem;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e9ecef;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
      padding: 0.5rem;
    }

    .close-button:hover {
      color: #333;
    }

    .modal-body {
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }

    .modal-image {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
    }

    .modal-video {
      max-width: 100%;
      max-height: 70vh;
    }

    .file-preview-fallback {
      text-align: center;
      color: #666;
    }

    .file-preview-fallback i {
      font-size: 4rem;
      color: #4a90e2;
      margin-bottom: 1rem;
    }
  `]
})
export class GalleryComponent implements OnInit {
  files$: Observable<any[]> = new Observable<any[]>();
  previewFile: any = null;

  constructor(private fileService: FileService) {}

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    // Create observable from the service call
    this.files$ = this.fileService.searchFiles("");
    console.log("files$",this.files$)
  }

  isImage(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(ext);
  }

  isVideo(filename: string): boolean {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return videoExtensions.includes(ext);
  }

  getFileIcon(filename: string): string {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    
    const iconMap: { [key: string]: string } = {
      '.pdf': 'fas fa-file-pdf',
      '.doc': 'fas fa-file-word',
      '.docx': 'fas fa-file-word',
      '.xls': 'fas fa-file-excel',
      '.xlsx': 'fas fa-file-excel',
      '.ppt': 'fas fa-file-powerpoint',
      '.pptx': 'fas fa-file-powerpoint',
      '.txt': 'fas fa-file-alt',
      '.zip': 'fas fa-file-archive',
      '.rar': 'fas fa-file-archive',
      '.mp3': 'fas fa-file-audio',
      '.wav': 'fas fa-file-audio',
      '.mp4': 'fas fa-file-video',
      '.avi': 'fas fa-file-video',
      '.mov': 'fas fa-file-video'
    };
    
    return iconMap[ext] || 'fas fa-file';
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
    event.target.parentElement.innerHTML = '<div class="file-icon"><i class="fas fa-image"></i></div>';
  }

  downloadFile(file: any) {
    // Implement download functionality
    console.log('Downloading file:', file);
    if (file.url) {
      window.open(file.url, '_blank');
    }
  }

  openPreview(file: any) {
    this.previewFile = file;
  }

  closePreview() {
    this.previewFile = null;
  }

  deleteFile(file: any) {
    if (confirm('Are you sure you want to delete this file?')) {
      // Use filename as the key for deletion since backend doesn't return id
      this.fileService.deleteFile(file.filename).subscribe({
        next: () => {
          // Reload files after deletion
          this.loadFiles();
        },
        error: (error) => {
          console.error('Error deleting file:', error);
        }
      });
    }
  }
} 