import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { ReceivingComponent } from './views/Receiving/Receiving.component';
import { StationComponent } from './views/station/station.component';
import { StationDetailComponent } from './views/StationDetail/StationDetail.component';
import { ZebraAdminComponent } from './views/zebraAdmin/zebraAdmin.component';
import { StationAdminComponent } from './views/stationAdmin/stationAdmin.component';

export const routes: Routes = [
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'Receiving',
        component: ReceivingComponent,
        data: {
          title: 'RMA Receiving'
        }
      },
      {
        path: 'station',
        component: StationComponent,
        data: {
          title: 'Station'
        }
      },
      {
        path: 'stationDetail',
        component: StationDetailComponent
      },
      {
        path: 'zebraAdmin',
        component: ZebraAdminComponent
      },
      {
        path: 'stationAdmin',
        component: StationAdminComponent
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
