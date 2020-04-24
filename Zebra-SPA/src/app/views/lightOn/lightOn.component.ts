import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertifyService } from '../../../../_service/alertify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ZebraService } from '../../../../_service/zebra.service';
import { ZebraTray } from '../../../../_models/_zebra/zebraTray';
import { User } from '../../../../_models/user';
import { ZebraStation } from '../../../../_models/_zebra/zebraStation';


@Component({
  selector: 'app-lightOn',
  templateUrl: './lightOn.component.html',
  styleUrls: ['./lightOn.component.scss']
})
export class LightOnComponent implements OnInit {
  stationDetailForm: FormGroup;
  currentTrayDetail: ZebraTray;
  reAssignTrayDetail: ZebraTray = {};
  validTray: ZebraTray = {};
  currentUser: User;
  isSearch = false;
  currentStation: ZebraStation;
  constructor(private alertify: AlertifyService, private fb: FormBuilder,
    private router: Router, private zebraService: ZebraService, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    this.currentStation = JSON.parse(localStorage.getItem('userStation'));
    this.createlightOnForm();
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  createlightOnForm() {
    this.stationDetailForm = this.fb.group({
      tray_ID: ['', Validators.required],
      scrap_Qty: ['', Validators.required],
      current_Qty: [{ value: '', disabled: true }, Validators.required],
      reassign_ID: []
    }, { validator: this.quantityValidator });
  }
  getTrayInfo() {
    this.zebraService.getTrayInfo(this.stationDetailForm.get('tray_ID').value).subscribe((res: ZebraTray) => {
      this.currentTrayDetail = res;
      this.currentTrayDetail.lastModifyBy = this.currentUser.user_ID;
      console.log(this.currentTrayDetail);
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
      console.log(g.get('scrap_Qty').value);
      return { 'badNumber': true };
    } else {
      return null;
    }
  }
  submitTrayDetail() {
    if (this.stationDetailForm.valid) {
      this.currentTrayDetail.current_Station_ID = this.currentStation.station_ID;
      this.currentTrayDetail.station_Name = this.currentStation.station_Name;
      this.currentTrayDetail.next_Station_ID = this.currentStation.next_Station_ID;
      console.log(this.stationDetailForm.get('reassign_ID').value);
      if (this.stationDetailForm.get('scrap_Qty').value !== 0 &&
        (this.stationDetailForm.get('reassign_ID').value !== '' && this.stationDetailForm.get('reassign_ID').value !== null)) {
        this.currentTrayDetail.scrap_Count += Number(this.stationDetailForm.get('scrap_Qty').value);
        this.reAssignTrayDetail.isEmpty = false;
        this.reAssignTrayDetail.tray_ID = this.stationDetailForm.get('reassign_ID').value;
        this.reAssignTrayDetail.tray_Item_Count = this.stationDetailForm.get('scrap_Qty').value;
        this.reAssignTrayDetail.scrap_Count = 0;
        this.reAssignTrayDetail.current_Item_Count = this.reAssignTrayDetail.tray_Item_Count - 0;
        this.reAssignTrayDetail.current_Station_ID = 0;
        console.log(this.currentTrayDetail.rmA_No);
        this.reAssignTrayDetail.rmA_No = this.currentTrayDetail.rmA_No;
        this.reAssignTrayDetail.pn = this.currentTrayDetail.pn;
        this.reAssignTrayDetail.station_Name = 'Re-Assign';
        this.reAssignTrayDetail.lastModifyBy = this.currentUser.user_ID;
        this.zebraService.getTrayInfo(this.reAssignTrayDetail.tray_ID).subscribe((res: ZebraTray) => {
          if (res.isEmpty) {
            this.zebraService.updateTrayDetail(this.reAssignTrayDetail).subscribe(next => {
              this.alertify.success('Items are re-assign to new tray ID: ' + this.reAssignTrayDetail.tray_ID);
            }, error => {
              this.alertify.error('Re-assign to tray: ' + this.reAssignTrayDetail.tray_ID + ' failed');
            });
            if (this.currentTrayDetail.tray_Item_Count === this.currentTrayDetail.scrap_Count) {
              this.currentTrayDetail.isEmpty = true;
            } else {
              this.currentTrayDetail.current_Item_Count = this.currentTrayDetail.tray_Item_Count - this.currentTrayDetail.scrap_Count;
            }
            this.currentTrayDetail.lastModifyBy = this.currentUser.user_ID;
            this.zebraService.updateTrayDetail(this.currentTrayDetail).subscribe(next => {
              if (this.currentTrayDetail.isEmpty) {
                this.alertify.success('Tray ' + this.currentTrayDetail.tray_ID + ' close success');
              } else {
                this.alertify.success('Tray update success, tray moves to next station');
              }
            });
            this.stationDetailForm.reset();
            this.isSearch = false;
          } else {
            this.alertify.error('Tray: ' + this.reAssignTrayDetail.tray_ID + ' is not empty, Please try to use another tray instead');
          }

        });
      } else {
        this.currentTrayDetail.current_Item_Count = this.currentTrayDetail.tray_Item_Count - this.currentTrayDetail.scrap_Count;
        this.zebraService.updateTrayDetail(this.currentTrayDetail).subscribe(next => {
          this.alertify.success('Tray update success, tray moves to next station');
        }, error => {
          this.alertify.error('Failed! Please Contact Dev Team!!');
        });
        this.stationDetailForm.reset();
        this.isSearch = false;
      }
    }
  }
}
