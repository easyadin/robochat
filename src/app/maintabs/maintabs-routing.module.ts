import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintabsPage } from './maintabs.page';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: 'maintabs',
    component: MaintabsPage,
    children: [
      {
        path: 'chatlist',
        loadChildren: () => import('../chatlist/chatlist.module').then(m => m.ChatlistPageModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'search',
        loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'contactlist',
        loadChildren: () => import('../contactlist/contactlist.module').then(m => m.ContactlistPageModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule),
        canLoad: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/maintabs/chatlist',
        pathMatch: 'full',
        canLoad: [AuthGuard]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/maintabs/chatlist',
    pathMatch: 'full',
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintabsPageRoutingModule { }
