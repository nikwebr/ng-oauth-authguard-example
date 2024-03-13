import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountButtonComponent} from "./account-button/account-button.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AccountButtonComponent],
  exports: [AccountButtonComponent]
})
export class AccountButtonModule {
}
