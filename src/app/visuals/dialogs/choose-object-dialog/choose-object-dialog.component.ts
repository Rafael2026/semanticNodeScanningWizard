import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';

export enum DialogType {
  PickFromList,
  TypeValue
}

export interface DialogChooseObject {
  title: string;
  type: DialogType;
  values?: Map<string, string>;
}

@Component({
  selector: 'app-choose-object-dialog',
  templateUrl: './choose-object-dialog.component.html',
  styleUrls: ['./choose-object-dialog.component.css']
})
export class ChooseObjectDialogComponent implements OnInit {

  optionSelected: string;
  literal: string;
  objectsKeys: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogChooseObject) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    let result: any;

    if (this.optionSelected)
      result = [this.optionSelected, this.data.values.get(this.optionSelected)];
    else if (this.literal)
      result = this.literal;

    this.dialogRef.close(result);
  }

  ngOnInit(): void {
    if (this.data.type == DialogType.PickFromList && this.data.values) {
      this.objectsKeys = Array.from(this.data.values.keys()).sort();
    }
  }

  onOptionSelected(object) {
    if (object)
      this.optionSelected = object;
  }

  showPickList(): boolean {
    return this.data.type == DialogType.PickFromList;
  }
}
