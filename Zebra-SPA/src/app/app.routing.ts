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
import { AuthGuard } from '../../_guard/auth.guard';
import { LightOnComponent } from './views/lightOn/lightOn.component';
import { PackingComponent } from './views/packing/packing.component';
