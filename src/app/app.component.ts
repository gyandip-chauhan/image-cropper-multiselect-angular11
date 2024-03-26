import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { LyDialog } from '@alyle/ui/dialog';
import { CropperDialog } from './cropper-dialog';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { ThemeVariables, lyl, StyleRenderer } from '@alyle/ui';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
const STYLES = (theme: ThemeVariables) => ({
  $global: lyl `{
    body {
      background-color: ${theme.background.default}
      color: ${theme.text.default}
      font-family: ${theme.typography.fontFamily}
      margin: 0
      direction: ${theme.direction}
    }
  }`,
  root: lyl `{
    display: block
  }`
});

interface DropdownItem {
  id: number;
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'image-cropper';
  // readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  // ready = false;
  // scale =  1;
  // minScale = 0;
  // @ViewChild(LyImageCropper, { static: true })
  // cropper!: LyImageCropper;
  // myConfig: ImgCropperConfig = {
  //   width: 150,
  //   height: 150,
  //   type: 'image/png',
  //   keepAspectRatio: true,
  //   responsiveArea: true,
  //   output: {
  //     width: 200,
  //     height: 200
  //   },
  //   resizableArea: true
  // };

  cropped?: string;
  // isDialogOpen = false;

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
    // @Inject(LY_DIALOG_DATA) private event: Event,
    // readonly sRenderer: StyleRenderer,
    // public dialogRef: LyDialogRef,
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef,
  ) { }

  // ngAfterViewInit() {
  //   if (this.dialogRef) {
  //     this.dialogRef.afterOpened.subscribe(() => {
  //       this.cropper.selectInputEvent(this.event);
  //     });
  //   }
  // }

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

  // onCropped(e: ImgCropperEvent) {
  //   console.log('Cropped image:', e);
  // }

  // onLoaded(e: ImgCropperEvent) {
  //   console.log('Image loaded:', e);
  //   this.ready = true;
  // }

  // onError(e: ImgCropperErrorEvent) {
  //   console.warn('Image cropper error:', e);
  //   // Close the dialog if there's an error
  //   this.dialogRef.close();
  // }

  // onSliderInput(event: LySliderChange) {
  //   const value = (event.value as unknown as HTMLInputElement).value;
  //   this.scale = parseFloat(value);
  // }

  // closeDialog() {
  //   this.dialogRef.close();
  // }
}
