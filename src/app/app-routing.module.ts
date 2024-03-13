import {NgModule} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterModule, RouterStateSnapshot,
  Routes
} from '@angular/router';
import {LandingPageComponent} from '../modules/landing-page/landing-page/landing-page.component';
import {LoginPageComponent} from "../modules/login-page/login-page/login-page.component";
import {AuthGuardService} from "../core/auth-guard/auth-guard.service";
import {inject} from "@angular/core";
import {environment} from "../environments/environment";

const canActivateAuthenticatedPage: CanActivateFn =
  (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    return inject(AuthGuardService).canActivateAuthenticatedPage();
  };

const canActivateLoginPage: CanActivateFn =
  (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    return inject(AuthGuardService).canActivateLoginPage();
  };

const routes: Routes = [
  // Home Path
  {
    path: '', redirectTo: environment.pages.login_page, pathMatch: 'full'
  },

  // Path to login page
  {
    path: environment.pages.login_page,
    component: LoginPageComponent,
    canActivate: [canActivateLoginPage]
  },

  // Path to landing page
  {
    path: environment.pages.landing_page,
    component: LandingPageComponent,
    canActivate: [canActivateAuthenticatedPage]
  },

  {path: '**', redirectTo: environment.pages.login_page}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule {
  constructor() {
  }
}
