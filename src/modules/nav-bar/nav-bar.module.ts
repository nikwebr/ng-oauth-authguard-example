import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {AccountButtonModule} from "./account-button/account-button.module";
import { RouterLink } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    AccountButtonModule,
    RouterLink
  ],
  declarations: [NavBarComponent],
  exports: [NavBarComponent]
})
export class NavBarModule {
}

