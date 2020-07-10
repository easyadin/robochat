import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainchatPage } from './mainchat.page';

const routes: Routes = [
  {
    path: '',
    component: MainchatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainchatPageRoutingModule {}
