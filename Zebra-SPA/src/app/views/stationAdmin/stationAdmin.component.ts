import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../../../../_models/user';
import { ZebraService } from '../../../../_service/zebra.service';
import { AlertifyService } from '../../../../_service/alertify.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZebraStation } from '../../../../_models/_zebra/zebraStation';
import { ZebraTray } from '../../../../_models/_zebra/zebraTray';

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
  isChange = false;
  trayDetail: ZebraTray[];
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
    this.zebraService.getAlltations().subscribe((sts: ZebraStation[]) => {
      this.stations = sts;
    }, error => {
      this.alertify.error('Can not get stations from Database!');
    });
  }

  changeStation(e) {
    this.station.setValue(e.target.value, {
      onlySelf: true
    });
    this.stationForm.controls.isClose.setValue(this.stations[e.target.value].station_Status);
    this.isChange = true;
  }

  get station() {
    return this.stationForm.get('station_ID');
  }
  submitChange() {
    if (this.stationForm.valid) {
      this.stationForUpload.lastModifyBy = this.currentUser.user_ID;
      this.stationForUpload.station_ID = this.stationForm.get('station_ID').value;
      this.stationForUpload.station_Status = this.stationForm.get('isClose').value;
      this.zebraService.getTrayInStation(this.stationForm.get('station_ID').value).subscribe((res: ZebraTray[]) => {
        this.trayDetail = res;
        if (!this.stationForUpload.station_Status) {
          if (this.trayDetail.length !== 0) {
            this.zebraService.getStation(this.trayDetail[0].next_Station_ID.toString()).subscribe((st: ZebraStation) => {
              this.trayDetail.forEach(function (value) {
                value.current_Station_ID = value.next_Station_ID;
                value.lastModifyBy = 'Admin';
                value.next_Station_ID = st.next_Station_ID;
              });
              this.zebraService.updateDetails(this.trayDetail).subscribe(() => {

                if (this.trayDetail.length > 0) {
                  this.alertify.success(this.trayDetail.length + ' trays move to next station');
                  this.zebraService.updateStation(this.stationForUpload).subscribe(next => {
                    this.alertify.success('Station tatus change success');
                    location.reload();
                  }, error => {
                    this.alertify.error('Failed');
                  });
                }
              }, error => {
                this.alertify.error('move tray failed');
              });
            });
          } else {
            this.zebraService.updateStation(this.stationForUpload).subscribe(next => {
              this.alertify.success('Station tatus change success');
              location.reload();
            }, error => {
              this.alertify.error('Failed');
            });
          }
        } else {
          this.zebraService.updateStation(this.stationForUpload).subscribe(next => {
            this.alertify.success('Station tatus change success');
            location.reload();
          }, error => {
            this.alertify.error('Failed');
          });
        }
      });

    }

  }
}