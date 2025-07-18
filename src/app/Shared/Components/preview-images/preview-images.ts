import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-images',
  imports: [],
  template: `
    <div mat-dialog-content class="dialog-image-content">
      <img [src]="data.imageUrl" alt="Imagen" class="dialog-image" />
    </div>
  `,
  styleUrl: './preview-images.css'
})
export class PreviewImages {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }) { }
}
