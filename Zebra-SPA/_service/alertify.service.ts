
import { Injectable } from '@angular/core';
declare let alertify: any;
@Injectable({
  providedIn: 'root'
})
export class AlertifyService {
  constructor() { }

  confirm(message: string, okCallback: () => any) {
    // tslint:disable-next-line:only-arrow-functions
    alertify.confirm(message, function(e) {
      if (e) {
        okCallback();
      } else {
      }
    });
  }
  success(message: string) {
    alertify.success(message);
  }
  error(message: string) {
    alertify.error(message);
  }
  warning(message: string, time: number) {
    return alertify.warning(message, time);
  }
  message(message: string) {
    alertify.message(message);

  }
  dissmiss() {
    alertify.dissmiss();
  }
}

