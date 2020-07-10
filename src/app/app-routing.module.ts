import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule)
  },
  {
    path: 'splashscreen',
    loadChildren: () => import('./onboarding/splashscreen/splashscreen.module').then(m => m.SplashscreenPageModule)
  },
  {
    path: 'mainchat',
    children: [
      {
        path: ':id',
        loadChildren: () => import('./mainchat/mainchat.module').then(m => m.MainchatPageModule),
        canLoad: [AuthGuard]
      }]
  },
  {
    path: 'addfriend',
    loadChildren: () => import('./addfriend/addfriend.module').then(m => m.AddfriendPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./onboarding/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./onboarding/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'recoverpassword',
    loadChildren: () => import('./onboarding/recoverpassword/recoverpassword.module').then(m => m.RecoverpasswordPageModule),
  },
  {
    path: '',
    loadChildren: () => import('./maintabs/maintabs.module').then(m => m.MaintabsPageModule),
    canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
