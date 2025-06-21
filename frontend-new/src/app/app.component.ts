import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import {
    MatBottomSheet,
    MatBottomSheetModule,
    MatBottomSheetRef,
  } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FileUploadComponent, GalleryComponent,MatBottomSheetModule],
  template: `
    <div class="app-container">
      <header>
        <h1>FileVerse</h1>
        <p>Intelligent File Management</p>
      </header>
      
      <main>
        <div class="actions">
          <button (click)="openBottomSheet()" class="upload-button">
            <i class="fas" [class.fa-upload]="!showUpload" [class.fa-times]="showUpload"></i>
          </button>
        </div>

        <!-- <app-file-upload *ngIf="showUpload"></app-file-upload> -->
        <app-gallery></app-gallery>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem;
    }

    header {
      text-align: center;
      margin-bottom: 2rem;
    }

    header h1 {
      font-size: 2.5rem;
      color: #2d3748;
      margin: 0;
    }

    header p {
      font-size: 1.2rem;
      color: #4a5568;
      margin: 0.5rem 0 0;
    }

    main {
      max-width: 1200px;
      margin: 0 auto;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;
    }

    .upload-button {
      background: #4a90e2;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.2s;
    }

    .upload-button:hover {
      background: #2c5282;
    }

    .upload-button i {
      font-size: 1.2rem;
    }
  `]
})
export class AppComponent {
  showUpload = true;

  private _bottomSheet = inject(MatBottomSheet);

  openBottomSheet(): void {
    this._bottomSheet.open(FileUploadComponent);
  }
} 