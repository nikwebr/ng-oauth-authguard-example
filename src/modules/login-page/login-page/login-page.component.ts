import {Component} from '@angular/core';
import {AuthNService} from "../../../core/auth-n/auth-n.service";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  protected readonly logoPictureLocation = "../../../../../assets/logo.png";

  constructor(private readonly authNService: AuthNService, private readonly router: Router) {
    
  }

  protected onLoginButtonClick() {
    this.authNService.login()
    .then(_ => {
      // override default route on login defined in AuthGuard
      this.router.navigate([environment.pages.landing_page]).then(_ => {
      });
    });
  }

  protected onCreateAccountButtonClick() {
    this.authNService.signUp().then(_ => {
      // override default route on login defined in AuthGuard
      this.router.navigate([environment.pages.landing_page]).then(_ => {
      });
    });
  }
}
