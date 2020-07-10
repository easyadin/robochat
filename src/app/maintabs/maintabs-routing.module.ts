import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintabsPage } from './maintabs.page';

const routes: Routes = [
  {
    path: 'maintabs',
    component: MaintabsPage,
    children: [
      {
        path: 'chatlist',
        loadChildren: () => import('../chatlist/chatlist.module').then(m => m.ChatlistPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'contactlist',
        loadChildren: () => import('../contactlist/contactlist.module').then(m => m.ContactlistPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: '',
        redirectTo: '/maintabs/chatlist',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/maintabs/chatlist',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintabsPageRoutingModule { }
