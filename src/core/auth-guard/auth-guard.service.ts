import {Injectable} from '@angular/core';
import {AuthNService} from "../auth-n/auth-n.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {

  /**
   * Subscribes to authState changes and redirects to login page in a case that the user is not logged in
   * @param router
   * @param authNService
   */
  constructor(private readonly router: Router, private readonly authNService: AuthNService) {
    this.authNService.authNStateWatcher()
      .subscribe(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate([environment.pages.login_page]).then(_ => {
          });
        } else if (isLoggedIn && this.router.url == "/" + environment.pages.login_page) {
          // default route on login action. Can be overridden (example in login-page component)
          this.router.navigate([environment.pages.landing_page]).then(_ => {
          });
        }
      });
  }

  public async canActivateLoginPage() {
    const status = await this.authNService.getLoginStatus()
    return this.activateLoginPage(status)
  }

  private activateLoginPage(isLoggedIn: boolean | undefined) {
    if (isLoggedIn) {
      this.router.navigate([environment.pages.landing_page]).then(_ => {
      });
      return false;
    }
    return true;
  }

  public async canActivateAuthenticatedPage() {
    const status = await this.authNService.getLoginStatus()
    return this.activateAuthenticatedPage(status)
  }

  private activateAuthenticatedPage(isLoggedIn: boolean | undefined) {
    if (isLoggedIn) {
      return true;
    }
    this.router.navigate([environment.pages.login_page]).then(_ => {
    });
    return false;
  }

}
