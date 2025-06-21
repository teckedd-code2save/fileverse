import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../../services/file.service';
import { FileSizePipe } from '../../pipes/file-size.pipe';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FileSizePipe],
  template: `
    <div class="gallery-container">
      <div class="gallery-grid">
        <div class="gallery-item">
            @for (file of files; track file) {
            <div class="file-card">
                <div class="file-icon">
                <i class="fas fa-file"></i>
                </div>
                <div class="file-info">
                <h3>{{ file.filename }}</h3>
                <p>{{ file.size | fileSize }}</p>
                <p>{{ file.created_at | date }}</p>
                </div>
                <div class="file-actions">
                <button (click)="downloadFile(file)" class="action-button">
                    <i class="fas fa-download"></i>
                </button>
                <button (click)="deleteFile(file)" class="action-button delete">
                    <i class="fas fa-trash"></i>
                </button>
                </div>
            </div>
            }
            @empty {
                <p>No files found</p>
            }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gallery-container {
      padding: 1rem;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .gallery-item {
      transition: transform 0.2s;
    }

    .gallery-item:hover {
      transform: translateY(-5px);
    }

    .file-card {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .file-icon {
      font-size: 2rem;
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
  `]
})
export class GalleryComponent implements OnInit {
  files: any[] = [];

  constructor(private fileService: FileService) {}

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.fileService.searchFiles("query").subscribe({
      next: (files) => {
        this.files = files;
      },
      error: (error) => {
        console.error('Error loading files:', error);
      }
    });
  }

  downloadFile(file: any) {
    // Implement download functionality
    console.log('Downloading file:', file);
  }

  deleteFile(file: any) {
    if (confirm('Are you sure you want to delete this file?')) {
      this.fileService.deleteFile(file.id).subscribe({
        next: () => {
          this.loadFiles();
        },
        error: (error) => {
          console.error('Error deleting file:', error);
        }
      });
    }
  }
} 