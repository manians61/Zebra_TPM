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

  getStations(): Observable<ZebraStation[]> {
    return this.http.get<ZebraStation[]>(this.baseUrl + 'getstations/');
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
  updateTrayDetail(trayDetail: ZebraTray) {
    return this.http.post(this.baseUrl + 'updatetray/', trayDetail);
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
}
