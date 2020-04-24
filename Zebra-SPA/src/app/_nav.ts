import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Zebra TPM Home',
    url: '/station',
    icon: 'icon-layers'
  },
  {
    divider: true
  },
  {
    name: 'Tray Admin',
    url: '/zebraAdmin'
  },
  {
    name: 'Station Admin',
    url: '/stationAdmin'
  }

];
