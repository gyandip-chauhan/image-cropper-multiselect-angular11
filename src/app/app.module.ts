import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';

import { AppComponent } from './app.component';
/** Import animations */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/** Import Alyle UI */
import {
  LyThemeModule,
  LY_THEME,
  LyOverlayRef,
  LyOverlay
} from '@alyle/ui';
/** Import the component modules */
import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';

/** Import themes */
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { LySliderModule } from '@alyle/ui/slider';
import { LyIconModule } from '@alyle/ui/icon';
import { HttpClientModule } from '@angular/common/http';
import { LY_DIALOG_DATA, LyDialog, LyDialogModule, LyDialogRef } from '@alyle/ui/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CropperDialog } from './cropper-dialog';


@NgModule({
  imports:      [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    // Set main theme
    LyThemeModule.setTheme('minima-light'),
    // Add components
    LyToolbarModule,
    LyImageCropperModule,
    LySliderModule,
    LyButtonModule,
    LyIconModule,
    LyDialogModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  /** Add themes */
  providers: [
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: \`minima-light\`
    { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name: \`minima-dark\`
    { provide: LY_DIALOG_DATA, useValue: {} },
    LyDialogRef,
    LyOverlayRef,
    LyDialog,
    LyOverlay
  ],
  declarations: [ AppComponent, CropperDialog ],
  bootstrap:    [ AppComponent, CropperDialog ]
})
export class AppModule { }
