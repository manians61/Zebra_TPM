import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertifyService } from '../../../../_service/alertify.service';
import { Router } from '@angular/router';
import { ZebraService } from '../../../../_service/zebra.service';
import { ZebraRma } from '../../../../_models/_zebra/ZebraRma';
import { isBoolean } from 'util';
import { User } from '../../../../_models/user';
import { ZebraTray } from '../../../../_models/_zebra/zebraTray';
import { ZebraStation } from '../../../../_models/_zebra/zebraStation';

@Component({
  selector: 'app-Receiving',
  templateUrl: './Receiving.component.html',
  styleUrls: ['./Receiving.component.scss']
})
export class ReceivingComponent implements OnInit {
  receivingForm: FormGroup;
  constructor(private alertify: AlertifyService, private fb: FormBuilder, private router: Router, private zebraService: ZebraService) { }
  rmaList: ZebraRma[];
  rmaForAdd: ZebraRma = {};
  currentUser: User;
  trayForUpdate: ZebraTray = {};
  isSearch = false;
  currentStation: ZebraStation = {};

  ngOnInit() {
    this.createReceivingForm();
    this.currentStation = JSON.parse(localStorage.getItem('userStation'));
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  createReceivingForm() {
    this.receivingForm = this.fb.group({
      rmano: ['', Validators.required],
      pn: ['', Validators.required],
      receive_QTY: ['', Validators.required],
      tray_ID: ['', Validators.required]
    });
  }

  rmaInfo() {
    this.zebraService.getRMAInfo(this.receivingForm.get('rmano').value).subscribe((res: ZebraRma[]) => {
      this.rmaList = res;
      this.isSearch = true;
      console.log(this.rmaList);
    }, error => {
      this.alertify.error('Can not get RMA infomation from server!!');
    });
  }
  addRma() {
    this.rmaForAdd = Object.assign({}, this.receivingForm.value);
    this.rmaForAdd.createBy = this.currentUser.user_ID;
    this.zebraService.addRmaInfo(this.rmaForAdd).subscribe(next => {
      this.alertify.success('Add Successfully!');
    }, error => {
      this.alertify.error('Add Failed!!');
    });
    this.trayForUpdate.lastModifyBy = this.currentUser.user_ID;
    this.trayForUpdate.isEmpty = false;
    this.trayForUpdate.tray_ID = this.rmaForAdd.tray_ID;
    this.trayForUpdate.tray_Item_Count = this.receivingForm.get('receive_QTY').value;
    this.trayForUpdate.scrap_Count = 0;
    this.trayForUpdate.current_Station_ID = 0;
    this.trayForUpdate.station_Name = this.currentStation.station_Name;
    this.trayForUpdate.pn = this.rmaForAdd.pn;
    this.trayForUpdate.rma_No = this.rmaForAdd.rmano;
    this.zebraService.updateTrayDetail(this.trayForUpdate).subscribe(next => {
    }, error => {
      this.alertify.error('Assign items to tray failed!');
    });
    this.receivingForm.reset();
    this.isSearch = false;
  }

}
