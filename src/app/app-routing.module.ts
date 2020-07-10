import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splashscreen',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule)
  },
  {
    path: 'chatlist',
    loadChildren: () => import('./chatlist/chatlist.module').then(m => m.ChatlistPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule)
  },
  {
    path: 'contactlist',
    loadChildren: () => import('./contactlist/contactlist.module').then(m => m.ContactlistPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'mainchat',
    children: [
      {
      path: ':id',
      loadChildren: () => import('./mainchat/mainchat.module').then(m => m.MainchatPageModule),
    }]
  },
  {
    path: 'addfriend',
    loadChildren: () => import('./addfriend/addfriend.module').then(m => m.AddfriendPageModule)
  },
  {
    path: 'splashscreen',
    loadChildren: () => import('./onboarding/splashscreen/splashscreen.module').then( m => m.SplashscreenPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./onboarding/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./onboarding/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'recoverpassword',
    loadChildren: () => import('./onboarding/recoverpassword/recoverpassword.module').then( m => m.RecoverpasswordPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
