import { Component, OnInit } from '@angular/core';
import { ZebraStation } from '../../../../_models/_zebra/zebraStation';
import { ZebraService } from '../../../../_service/zebra.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ZebraUser } from '../../../../_models/_zebra/zebraUser';
import { ZebraTray } from '../../../../_models/_zebra/zebraTray';
import { User } from '../../../../_models/user';
import { AlertifyService } from '../../../../_service/alertify.service';

@Component({
  selector: 'app-StationDetail',
  templateUrl: './StationDetail.component.html',
  styleUrls: ['./StationDetail.component.scss']
})
export class StationDetailComponent implements OnInit {
  currentStation: ZebraStation;
  stationDetailForm: FormGroup;
  currentTrayDetail: ZebraTray;
  reAssignTrayDetail: ZebraTray = {};
  currentUser: User;
  isClick = false;
  isSearch = false;
  isPacking = false;
  isLightOn = false;
  constructor(private zebraService: ZebraService, private fb: FormBuilder, private alertify: AlertifyService) { }

  ngOnInit() {
    this.currentStation = JSON.parse(localStorage.getItem('userStation'));
    if (this.currentStation.station_ID === 7) {
      this.isPacking = true;
    }
    if (this.currentStation.station_ID === 5) {
      this.isLightOn = true;
    }
    this.createStationDetailForm();
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  createStationDetailForm() {
    this.stationDetailForm = this.fb.group({
      tray_ID: ['', Validators.required],
      scrap_Qty: ['', Validators.required],
      current_Qty: [{ value: '', disabled: true }, Validators.required]

    }, { validator: this.quantityValidator });
  }
  getTrayInfo() {
    this.zebraService.getTrayInfo(this.stationDetailForm.get('tray_ID').value).subscribe((res: ZebraTray) => {
      this.currentTrayDetail = res;
      this.currentTrayDetail.lastModifyBy = this.currentUser.user_ID;
      if (this.currentTrayDetail.isEmpty) {
        this.alertify.error('This tray is empty!');
      } else {
        if (this.currentTrayDetail.next_Station_ID !== this.currentStation.station_ID) {
          this.alertify.error('This tray is in station: ' + this.currentTrayDetail.next_Station_Name);
        } else {
          this.stationDetailForm.controls.current_Qty.setValue(this.currentTrayDetail.tray_Item_Count - this.currentTrayDetail.scrap_Count);
          this.isSearch = true;
        }
      }
    }, error => {
      this.isSearch = false;
      this.alertify.error('Can not get this tray information, Please check tray id');
    });
  }
  quantityValidator(g: FormGroup) {
    if (g.get('scrap_Qty').value < 0 || g.get('scrap_Qty').value > g.get('current_Qty').value) {
      return { 'badNumber': true };
    } else {
      return null;
    }
  }

  submitTrayDetail() {
    if (this.stationDetailForm.valid) {
      this.currentTrayDetail.current_Station_ID = this.currentStation.station_ID;
      this.currentTrayDetail.next_Station_ID = this.currentStation.next_Station_ID;
      this.currentTrayDetail.station_Name = this.currentStation.station_Name;
      this.currentTrayDetail.station_Scrap_Count = this.stationDetailForm.get('scrap_Qty').value;
      if (this.currentTrayDetail.tray_Item_Count === (this.currentTrayDetail.scrap_Count
        + Number(this.stationDetailForm.get('scrap_Qty').value))) {
        this.currentTrayDetail.isEmpty = true;
        this.zebraService.updateTrayDetail(this.currentTrayDetail).subscribe(next => {
          this.alertify.success('0 item in this tray now, tray close success');
        });
        this.isSearch = false;
        this.stationDetailForm.reset();
      } else {
        this.currentTrayDetail.current_Item_Count = this.currentTrayDetail.tray_Item_Count - this.currentTrayDetail.scrap_Count;
        this.zebraService.updateTrayDetail(this.currentTrayDetail).subscribe(next => {
          this.alertify.success('Tray update success, tray moves to next station');
        }, error => {
          this.alertify.error('Failed! Please Contact Dev Team!!');
        });
        this.stationDetailForm.reset();
        this.isSearch = false;
        this.isClick = true;
      }
    }
  }
}

