import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ZebraService } from '../../../../_service/zebra.service';
import { AlertifyService } from '../../../../_service/alertify.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { ZebraTray } from '../../../../_models/_zebra/zebraTray';
import { User } from '../../../../_models/user';

@Component({
  selector: 'app-zebraAdmin',
  templateUrl: './zebraAdmin.component.html',
  styleUrls: ['./zebraAdmin.component.scss']
})
export class ZebraAdminComponent implements OnInit {
  trayDetail: ZebraTray = {};
  adminForm: FormGroup;
  currentUser: User;
  isSearch = false;
  constructor(private zebraService: ZebraService, private alertify: AlertifyService, private http: HttpClient,
    private fb: FormBuilder, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    this.createSearchForm();
    this.currentUser = JSON.parse(localStorage.getItem('user'));

  }

  createSearchForm() {
    this.adminForm = this.fb.group({
      tray_ID: ['', Validators.required],
      tray_Qty: ['', Validators.required],
      isClose: [false],
      scrap_Qty: ['', Validators.required]
    }, { validator: [this.quantityValidator, this.trayValidator] });
  }
  getTrayInfo() {
    this.zebraService.getTrayInfo(this.adminForm.get('tray_ID').value).subscribe((res: ZebraTray) => {
      this.trayDetail = res;
      this.isSearch = true;
      this.adminForm.controls.isClose.setValue(this.trayDetail.isEmpty);
      if (this.trayDetail.isEmpty) {
        this.trayDetail = null;
        this.alertify.warning('This tray is Empty!', 3);
      } else {
        this.adminForm.controls.tray_Qty.setValue(this.trayDetail.tray_Item_Count);
        this.adminForm.controls.scrap_Qty.setValue(this.trayDetail.scrap_Count);
      }

    }, error => {
      this.alertify.error('Can not find this tray ID!');
      this.isSearch = false;
    });


    this.changeDetectorRefs.detectChanges();
  }
  modifyTray() {
    this.trayDetail.lastModifyBy = this.currentUser.user_ID;
    this.trayDetail.station_Name = 'Tray Info Management';
    if (this.adminForm.get('isClose').value === true) {
      this.trayDetail.isEmpty = true;
      this.zebraService.updateTrayDetail(this.trayDetail).subscribe(next => {
        this.alertify.success('Tray: ' + this.trayDetail.tray_ID + ' is close!');
        this.trayDetail = null;
      });
    } else {
      this.trayDetail.isEmpty = false;
      this.trayDetail.tray_Item_Count = this.adminForm.get('tray_Qty').value;
      this.trayDetail.scrap_Count = this.adminForm.get('scrap_Qty').value;
      if (this.trayDetail.scrap_Count >= this.trayDetail.tray_Item_Count) {
        this.alertify.error('Scrap number is greater than tray quantity');
      } else {
        this.trayDetail.current_Item_Count = this.trayDetail.tray_Item_Count - this.trayDetail.scrap_Count;
        this.zebraService.updateTrayDetail(this.trayDetail).subscribe(next => {

          this.alertify.success('Update Successfully!');
        }, error => {
          this.alertify.error('Update Failed!');
        });
      }
    }
    this.isSearch = false;
    this.adminForm.reset();
  }
  trayValidator(g: FormGroup) {
    if (g.get('tray_Qty').value < 0 || g.get('tray_Qty').value > 14) {
      return { 'trayBadNumber': true };
    } else {
      return null;
    }
  }
  quantityValidator(g: FormGroup) {
    if (g.get('scrap_Qty').value < 0 || g.get('scrap_Qty').value > 14 || g.get('scrap_Qty').value > g.get('tray_Qty').value) {
      return { 'badNumber': true };
    } else {
      return null;
    }
  }
  cancel() {
    this.isSearch = false;
    this.adminForm.reset();
  }
}
