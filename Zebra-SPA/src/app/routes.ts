import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from '../../_guard/auth.guard';
import { DefaultLayoutComponent } from './containers';
import { ReceivingComponent } from './views/Receiving/Receiving.component';
import { StationComponent } from './views/station/station.component';
import { StationDetailComponent } from './views/StationDetail/StationDetail.component';
import { ZebraAdminComponent } from './views/zebraAdmin/zebraAdmin.component';
import { StationAdminComponent } from './views/stationAdmin/stationAdmin.component';
import { LightOnComponent } from './views/lightOn/lightOn.component';
import { PackingComponent } from './views/packing/packing.component';

export const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
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
            },
            {
                path: 'lightOn',
                component: LightOnComponent
            },
            {
                path: 'packing',
                component: PackingComponent
            }
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];