import { Component, ChangeDetectionStrategy, Inject, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown'; // Import IDropdownSettings type
import { getLocaleId } from '@angular/common';
import { LyDialog } from '@alyle/ui/dialog';
import {
  STYLES as CROPPER_STYLES,
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent
} from '@alyle/ui/image-cropper';
import { LyTheme2, StyleRenderer, WithStyles, lyl, ThemeRef, LY_THEME,
  LY_THEME_NAME,
  LyHammerGestureConfig, ThemeVariables, Platform } from '@alyle/ui';

import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import {
  HAMMER_GESTURE_CONFIG,
  HammerModule
} from '@angular/platform-browser';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { LySliderChange, LySliderModule, STYLES as SLIDER_STYLES } from '@alyle/ui/slider';
import { CropperDialog } from './cropper-dialog';

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

interface DropdownItem {
  id: number;
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    [ LyTheme2 ],
    [ StyleRenderer ],
    [ LySliderModule ],
    // Theme that will be applied to this module
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name: `minima-dark`
    // Gestures
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig } // Required for <ly-carousel>
  ]
})
export class AppComponent implements WithStyles, AfterViewInit, OnInit {
  title = 'image-cropper';
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

  cropped?: string;
  isDialogOpen = false;

  dropdownList: DropdownItem[] = [];
  selectedItems: DropdownItem[] = [];
  dropdownSettings: IDropdownSettings = {};

  onItemSelect(item: any) {
    console.log(item);
    const itemIndex = this.selectedItems.findIndex(selectedItem => selectedItem.id === item.id);

    if (itemIndex === -1) {
      this.selectedItems.push(item);
    }
  }

  onSelectAll(items: any[]) {
    console.log(items);
    this.selectedItems = [...items];
  }

  constructor(
    @Inject(LY_DIALOG_DATA) private event: Event,
    readonly sRenderer: StyleRenderer,
    public dialogRef: LyDialogRef,
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef,
  ) { }

  ngAfterViewInit() {
    if (this.dialogRef) {
      this.dialogRef.afterOpened.subscribe(() => {
        this.cropper.selectInputEvent(this.event);
      });
    }
  }

  ngOnInit() {
    this.dropdownList = [
      { id: 1, text: 'Mumbai' },
      { id: 2, text: 'Bangaluru' },
      { id: 3, text: 'Pune' },
      { id: 4, text: 'Navsari' },
      { id: 5, text: 'New Delhi' }
    ];
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  // openCropperDialog(event: Event) {
  //   this.cropped = null!;
  //   this.isDialogOpen = true;
  //   this.dialogRef = this._dialog.open<AppComponent, Event>(AppComponent, {
  //     data: event,
  //     width: 320,
  //     disableClose: true
  //   });
  //   if (this.dialogRef) {
  //     this.dialogRef.afterOpened.subscribe(() => {
  //       this.cropper.selectInputEvent(this.event);
  //     });
  //     this.dialogRef.afterClosed.subscribe((result?: ImgCropperEvent) => {
  //       if (result) {
  //         this.cropped = result.dataURL;
  //         this._cd.markForCheck();
  //         this.isDialogOpen = false;
  //       }
  //     });
  //   }
  // }

  openCropperDialog(event: Event) {
    this.cropped = null!;
    this._dialog.open<CropperDialog, Event>(CropperDialog, {
      data: event,
      width: 320,
      disableClose: true
    }).afterClosed.subscribe((result?: ImgCropperEvent) => {
      if (result) {
        this.cropped = result.dataURL;
        this._cd.markForCheck();
      }
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
