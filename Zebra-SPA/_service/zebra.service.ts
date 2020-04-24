import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../src/environments/environment';
import { Observable } from 'rxjs';
import { ZebraStation } from '../_models/_zebra/zebraStation';
import { ZebraUser } from '../_models/_zebra/zebraUser';
import { ZebraTray } from '../_models/_zebra/zebraTray';
import { ZebraRma } from '../_models/_zebra/ZebraRma';

@Injectable({
  providedIn: 'root'
})
export class ZebraService {
  baseUrl = environment.apiUrl + 'zebra/';
  constructor(private http: HttpClient) { }

  getOpenStations(): Observable<ZebraStation[]> {
    return this.http.get<ZebraStation[]>(this.baseUrl + 'getopenstations/');
  }

  getAlltations(): Observable<ZebraStation[]> {
    return this.http.get<ZebraStation[]>(this.baseUrl + 'getallstations/');
  }
  updateZebraUser(user: ZebraUser) {
    return this.http.post(this.baseUrl + 'stationuser/', user);
  }
  getStation(id: string): Observable<ZebraStation> {
    return this.http.get<ZebraStation>(this.baseUrl + 'station/' + id);
  }
  getTrayInfo(id: string): Observable<ZebraTray> {
    return this.http.get<ZebraTray>(this.baseUrl + 'tray/' + id);
  }

  getRMAInfo(id: string): Observable<ZebraRma[]> {
    return this.http.get<ZebraRma[]>(this.baseUrl + 'rma/' + id);
  }
  addRmaInfo(rma: ZebraRma) {
    return this.http.post(this.baseUrl + 'uploadReceiving', rma);
  }
  addZebraLog(zebraLog: ZebraTray) {
    return this.http.post(this.baseUrl + 'addlog', zebraLog);
  }
  updateStation(station: ZebraStation) {
    return this.http.post(this.baseUrl + 'updateStation', station);
  }
  getAvaliableTrayID(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + 'AvailableTray/');
  }
  getTrayInStation(id: string): Observable<ZebraTray[]> {
    return this.http.get<ZebraTray[]>(this.baseUrl + 'trayinstation/' + id);
  }
  updateDetails(details: ZebraTray[]) {
    return this.http.post(this.baseUrl + 'UpdateTrayList', details);
  }
  updateTrayDetail(trayDetail: ZebraTray) {
    console.log('test');
    return this.http.post(this.baseUrl + 'UpdateTrayInfo', trayDetail);
  }
}
