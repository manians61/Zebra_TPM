import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../../../../_models/user';
import { ZebraService } from '../../../../_service/zebra.service';
import { AlertifyService } from '../../../../_service/alertify.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZebraStation } from '../../../../_models/_zebra/zebraStation';

@Component({
  selector: 'app-stationAdmin',
  templateUrl: './stationAdmin.component.html',
  styleUrls: ['./stationAdmin.component.scss']
})
export class StationAdminComponent implements OnInit {
  constructor(private zebraService: ZebraService, private alertify: AlertifyService, private http: HttpClient,
    private fb: FormBuilder, private changeDetectorRefs: ChangeDetectorRef) { }

  stationForm: FormGroup;
  stations: ZebraStation[];
  currentUser: User;
  stationForUpload: ZebraStation = {};
  ngOnInit() {
    this.createStationForm();
    this.getStation();
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }
  createStationForm() {
    this.stationForm = this.fb.group({
      isClose: [false],
      station_ID: ['', Validators.required]
    });

  }
  getStation() {
    this.zebraService.getStations().subscribe((sts: ZebraStation[]) => {
      this.stations = sts;
    }, error => {
      this.alertify.error('Can not get stations from Database!');
    });
  }

  changeStation(e) {
    this.station.setValue(e.target.value, {
      onlySelf: true
    });
  }

  get station() {
    return this.stationForm.get('station_ID');
  }
  submitChange() {
    this.stationForUpload.lastModifyBy = this.currentUser.user_ID;
    this.stationForUpload.station_ID = this.stationForm.get('station_ID').value;
    this.stationForUpload.station_Status = this.stationForm.get('isClose').value;
    this.zebraService.updateStation(this.stationForUpload).subscribe(next => {
      this.alertify.success('Station tatus change success');
    }, error => {
      this.alertify.error('Failed');
    })
  }
}