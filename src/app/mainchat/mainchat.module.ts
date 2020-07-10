import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainchatPageRoutingModule } from './mainchat-routing.module';

import { MainchatPage } from './mainchat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainchatPageRoutingModule
  ],
  declarations: [MainchatPage]
})
export class MainchatPageModule {}
