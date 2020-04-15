import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ZebraService } from '../../../../_service/zebra.service';
import { AlertifyService } from '../../../../_service/alertify.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { ZebraTray } from '../../../../_models/_zebra/zebraTray';

@Component({
  selector: 'app-zebraAdmin',
  templateUrl: './zebraAdmin.component.html',
  styleUrls: ['./zebraAdmin.component.scss']
})
export class ZebraAdminComponent implements OnInit {
  trayDetail: ZebraTray = {};
  adminForm: FormGroup;
  isSearch = false;
  constructor(private zebraService: ZebraService, private alertify: AlertifyService, private http: HttpClient,
    private fb: FormBuilder, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    this.createSearchForm();
  }

  createSearchForm() {
    this.adminForm = this.fb.group({
      tray_ID: ['', Validators.required],
      tray_Qty: ['', Validators.required],
      isClose: [false],
      scrap_Qty: ['', Validators.required]
    });
  }
  getTrayInfo() {
    this.zebraService.getTrayInfo(this.adminForm.get('tray_ID').value).subscribe((res: ZebraTray) => {
      this.trayDetail = res;
      this.isSearch = true;
      this.adminForm.controls.tray_Qty.setValue(this.trayDetail.tray_Item_Count.toString());
      this.adminForm.controls.scrap_Qty.setValue(this.trayDetail.scrap_Count.toString());
    }, error => {
      this.alertify.error('Can not find this tray ID!');
      this.isSearch = false;
    });


    this.changeDetectorRefs.detectChanges();
  }
  modifyTray() {
    if (this.adminForm.get('isClose').value === true) {
      this.trayDetail.isEmpty = true;
      this.zebraService.updateTrayDetail(this.trayDetail).subscribe(next => {
        this.alertify.success('Tray: ' + this.trayDetail.tray_ID + ' is close!');
      });
    } else {
      this.trayDetail.isEmpty = false;
      this.trayDetail.tray_Item_Count = this.adminForm.get('tray_Qty').value;
      this.trayDetail.scrap_Count = this.adminForm.get('scrap_Qty').value;
      this.trayDetail.current_Item_Count = this.trayDetail.tray_Item_Count - this.trayDetail.scrap_Count;
      console.log(this.trayDetail);
      this.zebraService.updateTrayDetail(this.trayDetail).subscribe(next => {

        this.alertify.success('Update Successfully!');
      }, error => {
        this.alertify.error('Update Failed!');
      });
    }
    this.isSearch = false;
  }
}
