import { Component, OnInit } from '@angular/core';
import { ZebraService } from '../../../../_service/zebra.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from '../../../../_service/alertify.service';
import { ZebraTray } from '../../../../_models/_zebra/zebraTray';
import { ZebraStation } from '../../../../_models/_zebra/zebraStation';
import { User } from '../../../../_models/user';

@Component({
  selector: 'app-packing',
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.scss']
})
export class PackingComponent implements OnInit {

  constructor(private zebraService: ZebraService, private fb: FormBuilder, private alertify: AlertifyService) { }
  stationDetailForm: FormGroup;
  trayDetail: ZebraTray;
  currentStation: ZebraStation;
  currentUser: User;
  ngOnInit() {
    this.createStationDetailForm();
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.currentStation = JSON.parse(localStorage.getItem('userStation'));

  }
  createStationDetailForm() {
    this.stationDetailForm = this.fb.group({
      tray_ID: ['', Validators.required]
    });
  }
  getTrayInfo() {
    this.zebraService.getTrayInfo(this.stationDetailForm.get('tray_ID').value).subscribe((res: ZebraTray) => {
      this.trayDetail = res;
      if (this.trayDetail.isEmpty) {
        this.alertify.error('This tray is already closed');
      } else {
        if (this.trayDetail.next_Station_ID !== this.currentStation.station_ID) {
          this.alertify.error('This tray is in station: ' + this.trayDetail.next_Station_Name);
        } else {
          this.stationDetailForm.controls.current_Qty.setValue(this.trayDetail.tray_Item_Count - this.trayDetail.scrap_Count);
          console.log(res);
          this.trayDetail.isEmpty = true;
          this.trayDetail.current_Station_ID = this.currentStation.station_ID;
          this.trayDetail.next_Station_ID = 0;
          this.trayDetail.station_Name = this.currentStation.station_Name;
          this.updatetrayInfo();
        }
      }
    }, error => {
      this.alertify.error('Can not get this tray information, Please check tray id');
    });

  }
  updatetrayInfo() {
    this.zebraService.updateTrayDetail(this.trayDetail).subscribe(next => {
      this.alertify.success('Tray ' + this.trayDetail.tray_ID + ' close success');
    }, error => {
      this.alertify.error('Tray ' + this.trayDetail.tray_ID + ' close failed, current status: ' + 'Open');
    });
  }


}
