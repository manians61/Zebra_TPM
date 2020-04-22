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
      rma_No: ['', Validators.required],
      pn: ['', Validators.required],
      qty: ['', Validators.required],
      tray_ID: ['', Validators.required],
      scrap_Qty: ['', Validators.required],
      pass_qty: ['', Validators.required],
      reassign_ID: ['', Validators.required],
      reassign_Qty: ['', Validators.required]
    });
  }
  getTrayInfo() {
    this.zebraService.getTrayInfo(this.stationDetailForm.get('tray_ID').value).subscribe((res: ZebraTray) => {
      this.currentTrayDetail = res;
      this.currentTrayDetail.lastModifyBy = this.currentUser.user_ID;
      console.log(this.currentTrayDetail);
      if (this.currentTrayDetail.isEmpty) {
        this.alertify.error('This tray is empty!');
      } else {
        if (this.currentTrayDetail.current_Station_ID !== this.currentStation.station_ID) {
          this.alertify.error('This tray is in station: ' + this.currentTrayDetail.station_Name);
        } else {
          this.isSearch = true;
          this.stationDetailForm.controls.qty.setValue(this.currentTrayDetail.tray_Item_Count.toString());
          this.stationDetailForm.controls.pass_qty.setValue(this.currentTrayDetail.current_Item_Count.toString());
        }
      }
    }, error => {
      this.isSearch = false;
      console.log('Can not get this tray information!');
    });
  }

  submitTrayDetail() {
    if (this.isPacking === true) {
      this.currentTrayDetail.isEmpty = true;
      this.zebraService.updateTrayDetail(this.currentTrayDetail).subscribe(next => {
        this.alertify.success('Success!');
      }, error => {
        this.alertify.error('Failed! Please Contact Dev Team!!');
      });
      this.stationDetailForm.reset();
      this.isSearch = false;
    } else {
      this.currentTrayDetail.current_Station_ID = this.currentStation.station_ID;
      this.currentTrayDetail.station_Name = this.currentStation.station_Name;

      if (this.currentTrayDetail.scrap_Count > this.currentTrayDetail.tray_Item_Count ||
        Number(this.stationDetailForm.get('scrap_Qty').value) > this.currentTrayDetail.current_Item_Count) {
        this.alertify.error('Scrap quantity is over tray item quantity, current scrap count: ' + this.currentTrayDetail.scrap_Count);

      } else if ((this.currentTrayDetail.scrap_Count + Number(this.stationDetailForm.get('scrap_Qty').value)) > 14 ||
        (this.currentTrayDetail.tray_Item_Count - this.currentTrayDetail.scrap_Count < 0)) {

        this.alertify.error('Scrap Qty greater than qty in current tray');
      } else if (this.currentTrayDetail.tray_Item_Count === this.currentTrayDetail.scrap_Count) {
        this.currentTrayDetail.isEmpty = true;
        console.log(this.currentTrayDetail);
        this.zebraService.updateTrayDetail(this.currentTrayDetail).subscribe(next => {
          this.alertify.success('Tray close');
        });
      } else {
        this.currentTrayDetail.scrap_Count += Number(this.stationDetailForm.get('scrap_Qty').value);
        this.currentTrayDetail.current_Item_Count = this.currentTrayDetail.tray_Item_Count - this.currentTrayDetail.scrap_Count;
        if (this.isLightOn === true) {
          this.reAssignTrayDetail.tray_ID = this.stationDetailForm.get('reassign_ID').value;
          this.reAssignTrayDetail.current_Item_Count = 0;
          this.reAssignTrayDetail.scrap_Count = 0;
          this.reAssignTrayDetail.current_Station_ID = 1;
          this.reAssignTrayDetail.next_Station_ID = 1;
          this.reAssignTrayDetail.tray_Item_Count = this.stationDetailForm.get('scrap_Qty').value;
          this.reAssignTrayDetail.rma_No = this.currentTrayDetail.rma_No;
          this.reAssignTrayDetail.pn = this.currentTrayDetail.pn;
          this.reAssignTrayDetail.isEmpty = false;
          this.reAssignTrayDetail.station_Name = 'Re-Assign';
          this.reAssignTrayDetail.lastModifyBy = this.currentUser.user_ID;
          console.log(this.currentTrayDetail);
          console.log(this.reAssignTrayDetail);
          if ((this.currentTrayDetail.tray_Item_Count - this.currentTrayDetail.scrap_Count) - this.reAssignTrayDetail.tray_Item_Count < 0) {
            this.alertify.error('Re-Assign qty is over current item qty: ' + this.currentTrayDetail.current_Item_Count + 'in tray');
          } else if (this.currentTrayDetail.current_Item_Count - this.reAssignTrayDetail.tray_Item_Count === 0) {
            this.currentTrayDetail.isEmpty = true;
          } else {
            this.zebraService.updateTrayDetail(this.reAssignTrayDetail).subscribe(next => {
              this.alertify.success('Re-Assign Success!');
            }, error => {
              this.alertify.error('Failed! Please Contact Dev Team!!');
            });
          }

        }
        this.zebraService.updateTrayDetail(this.currentTrayDetail).subscribe(next => {
          this.alertify.success('Success!');

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
