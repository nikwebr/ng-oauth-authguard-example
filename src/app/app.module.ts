import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {NavBarModule} from '../modules/nav-bar/nav-bar.module';
import {CommonModule} from '@angular/common';
import {AppComponent} from "./app.component";
import {LandingPageModule} from "../modules/landing-page/landing-page.module";
import {AppRoutingModule} from "./app-routing.module";
import {AuthNModule} from "../core/auth-n/auth-n.module";
import {LoginPageModule} from "../modules/login-page/login-page.module";
import {AuthGuardService} from "../core/auth-guard/auth-guard.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NavBarModule,
    AppRoutingModule,
    AuthNModule,
    LandingPageModule,
    LoginPageModule
  ],
  bootstrap: [AppComponent],
  providers: [AuthGuardService]
})
export class AppModule {
}
