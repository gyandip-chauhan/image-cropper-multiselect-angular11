import { Component, ChangeDetectionStrategy, Inject, ViewChild, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LyTheme2, StyleRenderer, WithStyles, lyl, ThemeRef, LY_THEME,
  LY_THEME_NAME,
  LyHammerGestureConfig, ThemeVariables, LyThemeModule } from '@alyle/ui';
import { LyDialogRef, LY_DIALOG_DATA, LyDialogModule } from '@alyle/ui/dialog';
import { LySliderChange, LySliderModule, STYLES as SLIDER_STYLES } from '@alyle/ui/slider';
import {
  STYLES as CROPPER_STYLES,
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent
} from '@alyle/ui/image-cropper';

import {
  HAMMER_GESTURE_CONFIG,
  HammerModule
} from '@angular/platform-browser';

/** Import the component modules */
import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';

import { LyDialog } from '@alyle/ui/dialog';

import { CommonModule } from '@angular/common';


/** Import themes */
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { LyIconModule } from '@alyle/ui/icon';
import { FormsModule } from '@angular/forms';

const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {
  ref.renderStyleSheet(SLIDER_STYLES);
  ref.renderStyleSheet(CROPPER_STYLES);
  const slider = ref.selectorsOf(SLIDER_STYLES);
  const cropper = ref.selectorsOf(CROPPER_STYLES);

  return {
    root: lyl `{
      ${cropper.root} {
        max-width: 320px
        height: 320px
      }
    }`,
    sliderContainer: lyl `{
      position: relative
      ${slider.root} {
        width: 80%
        position: absolute
        left: 0
        right: 0
        margin: auto
        top: -32px
      }
    }`,
    slider: lyl `{
      padding: 1em
    }`
  };
};

@Component({
  templateUrl: './cropper-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    [ LyTheme2 ],
    [ StyleRenderer ],
    // [ CropperDialog ],
    // Theme that will be applied to this module
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name: `minima-dark`
    // Gestures
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig } // Required for <ly-carousel>
  ],
  // imports: [
  //   CommonModule,
  //   // BrowserModule,
  //   // BrowserAnimationsModule,
  //   // Add components
  //   FormsModule,
  //   // LyThemeModule.setTheme('minima-light'),
  //   LyToolbarModule,
  //   LyImageCropperModule,
  //   LySliderModule,
  //   LyButtonModule,
  //   LyIconModule,
  //   LyDialogModule,
  //   // ...
  //   // Gestures
  //   HammerModule
  // ],
  // standalone: true,
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CropperDialog implements WithStyles, AfterViewInit {

  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  ready = false;
  scale =  1;
  minScale = 0;
  @ViewChild(LyImageCropper, { static: true })
  cropper!: LyImageCropper;
  myConfig: ImgCropperConfig = {
    width: 150,
    height: 150,
    type: 'image/png',
    keepAspectRatio: true,
    responsiveArea: true,
    output: {
      width: 200,
      height: 200
    },
    resizableArea: true
  };

  constructor(
    @Inject(LY_DIALOG_DATA) private event: Event,
    readonly sRenderer: StyleRenderer,
    public dialogRef: LyDialogRef
  ) { }

  ngAfterViewInit() {
    this.dialogRef.afterOpened.subscribe(() => {
      this.cropper.selectInputEvent(this.event);
    });
  }

  onCropped(e: ImgCropperEvent) {
    console.log('Cropped image:', e);
  }

  onLoaded(e: ImgCropperEvent) {
    console.log('Image loaded:', e);
    this.ready = true;
  }

  onError(e: ImgCropperErrorEvent) {
    console.warn('Image cropper error:', e);
    // Close the dialog if there's an error
    this.dialogRef.close();
  }

  onSliderInput(event: LySliderChange) {
    const value = (event.value as unknown as HTMLInputElement).value;
    this.scale = parseFloat(value);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
