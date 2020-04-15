import { Component, OnInit } from '@angular/core';
import { ZebraStation } from '../../../../_models/_zebra/zebraStation';
import { ZebraService } from '../../../../_service/zebra.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from '../../../../_service/alertify.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../_models/user';
import { ZebraUser } from '../../../../_models/_zebra/zebraUser';
import { Router } from '@angular/router';
import { UserService } from '../../../../_service/user.service';
import { PermissionGroup } from '../../../../_models/permissionGroup';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent implements OnInit {
  stations: ZebraStation[];
  stationForm: FormGroup;
  currentUser: User;
  currentStation: ZebraStation;
  stationUser: ZebraUser = {};
  model: any = {};
  constructor(private zebraService: ZebraService, private fb: FormBuilder,
    private alertify: AlertifyService, private http: HttpClient, private router: Router,private userService: UserService) { }

  ngOnInit() {
    this.createStationForm();
    this.getStation();
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  getStation() {
    this.zebraService.getStations().subscribe((sts: ZebraStation[]) => {
      this.stations = sts;
    }, error => {
      this.alertify.error('Can not get stations from Database!');
    });
  }

  createStationForm() {
    this.stationForm = this.fb.group({
      station_ID: ['', Validators.required],
      isClose:[false]
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

  submitStation() {
    this.stationUser.user_ID = this.currentUser.user_ID;
    this.stationUser.user_Station_ID = this.stationForm.get('station_ID').value;
    this.zebraService.updateZebraUser(this.stationUser).subscribe(next => {
      console.log('success');
    },
      error => {
        console.log('failed!');
      });
    this.zebraService.getStation(this.stationUser.user_Station_ID.toString()).subscribe((res: ZebraStation) => {
      this.currentStation = res;
      localStorage.setItem('userStation', JSON.stringify(this.currentStation));
      if (Number(this.stationUser.user_Station_ID) === 0) {
        this.router.navigate(['Receiving']);
      } else {
        this.router.navigate(['stationDetail']);
      }
    },
      error => {
        console.log('Error to get Station');
      });
  }


}
