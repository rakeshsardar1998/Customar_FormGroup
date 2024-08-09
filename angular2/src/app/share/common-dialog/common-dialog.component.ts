import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss']
})
export class CommonDialogComponent implements OnInit {
  openDilogFor:string=null;
  zeroDept:any=null;
  returnToInvoice:any=null;
  proposalCall:any=null;


  constructor(public dialogRef: MatDialogRef<CommonDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
    this.openDilogFor=this.data.for;
  }
  onNoClick(num:any): void {
    if(num==1){
			this.zeroDept =0;
			this.returnToInvoice =0;
			this.proposalCall =false;
    }else{
			this.proposalCall =true;
    }

      const result = {proposalCall:this.proposalCall,zeroDept: this.zeroDept, returnToInvoice: this.returnToInvoice };
      this.dialogRef.close(result);
	}

}
