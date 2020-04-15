import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Report Hub Main',
    url: '/navbars',
    icon: 'icon-layers'
  },
  {
    divider: true
  },

  {
    name: 'Receiving',
    url: '/Receiving'
  },
  {
    name: 'Station',
    url: '/station'
  },
  {
    name: 'Your Station',
    url: '/stationDetail'
  },
  {
    name: 'Admin',
    url: '/zebraAdmin'
  },
  {
    name: 'Pages',
    url: '/pages',
    icon: 'icon-star',
    children: [

      {
        name: 'Register',
        url: '/register',
        icon: 'icon-star'
      }


    ]
  },


];
