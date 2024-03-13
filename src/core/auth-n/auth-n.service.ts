import {Injectable} from '@angular/core';
import {BehaviorSubject, filter, firstValueFrom, map, Observable, of} from "rxjs";
import {AuthConfig, OAuthEvent, OAuthService} from "angular-oauth2-oidc";
import {environment} from "../../environments/environment";

/**
 * Enum for K-User-Roles.
 * In Keycloak, sets up a mapper that includes the users groups in the /userinfo endpoint
 */
export enum UserRole {
  CUSTOMER = "customer",
  FLEET_MANAGER = "fleetmanager"
}

/**
 * Enum that represents the user profile. All fields listed here must be included by Keycloak in the /userinfo endpoint
 */
export type UserProfile = {
  email: string,
  email_verified: boolean,
  preferred_username?: string,
  given_name?: string,
  family_name?: string,
  name?: string,
  exp: number,
  iat: number,
  roles: UserRole[]
}

export const authConfig: AuthConfig = {

  // Url des OIDC discovery endpoints
  issuer: environment.oidc.issuer_endpoint,

  // authorization code gets send to this url after authenticating with the OIDC provider
  redirectUri: getRedirectUri(),

  clientId: environment.oidc.client_id,

  scope: environment.oidc.scope,

  // Code Flow protocol
  responseType: 'code',
}

const openLoginInPopup: boolean = false;

/**
 * returns the url keycloak should redirect to after login.
 * Silent Refresh is needed to get the authorization code returned by keycloak as the authorization happens in a new browser window
 */
function getRedirectUri() {
  const baseUrl = location.href.slice(0, location.href.lastIndexOf("/"))
  if(openLoginInPopup) {
    return baseUrl + "/assets/silent-refresh.html"
  }
  return baseUrl;
}

@Injectable({providedIn: 'root'})
export class AuthNService {
  private isLoggedIn = new BehaviorSubject<boolean | undefined>(undefined);
  private userProfile: UserProfile | null | undefined = undefined;

  constructor(private readonly oAuthService: OAuthService) {
    this.init().then(_ => {
    }, reason => {
      // For debug purpose
      console.error(reason)
    });
  }

  public async login() {
    this.isLoggedIn.next(undefined); // sets the authState to undefined => router waits for authenticationState change
    this.oAuthService.loginUrl = environment.oidc.authorization_endpoint
    await this.oAuthService.createAndSaveNonce()
    if(openLoginInPopup) {
      await this.oAuthService.initLoginFlowInPopup();
    }
    else {
      this.oAuthService.initLoginFlow();
    }
  }

  public async signUp() {
    this.isLoggedIn.next(undefined); // sets the authState to undefined => router waits for authenticationState change
    this.oAuthService.loginUrl = environment.oidc.signup_endpoint
    await this.oAuthService.createAndSaveNonce()
    if(openLoginInPopup) {
      await this.oAuthService.initLoginFlowInPopup();
    }
    else {
      this.oAuthService.initLoginFlow();
    }
  }

  public logout() {
    this.oAuthService.revokeTokenAndLogout({}, true).then(_ => {
    }, reason => {
      // For debug purpose
      console.error(reason)
    });
  }

  public openAccountManager() {
    const url = new URL(environment.oidc.user_self_management_endpoint);
    url.searchParams.set("referrer", environment.oidc.client_id);
    url.searchParams.set("referrer_uri", window.location.href);
    window.location.href = url.href;
  }

  /*
   * Gets the user profile.
   * if auth-n service is not yet initialized, it waits for its initialization
   * @returns null if the user is not logged in
   */
  public async getUserProfile(): Promise<UserProfile | null> {
    if(this.userProfile !== undefined) {
      return this.userProfile;
    }

    // AuthNService is not yet initialized. Waiting for initialization
    // @ts-ignore
    return (await firstValueFrom(this.isLoggedIn.pipe(filter(isLoggedIn => isLoggedIn !== undefined)).pipe(map((_ => {
      return this.userProfile
    })))))
  }

  /**
   * @returns the login state
   * if auth-n service is not yet initialized, it waits for its initialization
   */
  public async getLoginStatus(): Promise<boolean> {
    if(this.isLoggedIn.getValue() !== undefined) {
      return this.isLoggedIn.getValue()!;
    }

    // AuthNService is not yet initialized. Waiting for initialization
    return (await firstValueFrom(this.isLoggedIn.pipe(filter(isLoggedIn => isLoggedIn !== undefined))))!
  }

  /**
   * @returns an observable for changes on the login state and userProfile.
   * The observable contains the new login state. The updated user profile can be read by the respective getter
   * This does not trigger switches to an undefined login state.
   */
  public authNStateWatcher(): Observable<boolean> {
    // @ts-ignore
    return this.isLoggedIn.asObservable().pipe(filter(isLoggedIn => isLoggedIn !== undefined))
  }

  /**
   * Configures angular-oauth2-oidc.OAuthService, sets up the event handler and checks the session
   * @private
   */
  private async init() {
    this.oAuthService.configure(authConfig);

    // refreshes access token prior its expiration
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.events.subscribe(
      event => this.handleEvent(event)
    );
    await this.oAuthService.loadDiscoveryDocument();

    if(!openLoginInPopup) {
      // needed to fetch the auth details from keycloak
      await this.oAuthService.tryLogin();
    }

    await this.checkSession();
  }

  /**
   * Method gets called by angular-oauth2-oidc.OAuthService on every triggered event
   * @param event
   * @private
   */
  private async handleEvent(event: OAuthEvent) {
    console.log("event:", event)
    if (event.type === "token_error" || event.type === "token_refresh_error" || event.type === "silent_refresh_error" || event.type === "token_validation_error" || event.type === "session_terminated" || event.type === "logout" || event.type === "user_profile_load_error") {
      // session terminated
      this.unAuthenticate()
    } else if (event.type === "token_received" && !this.isLoggedIn.getValue()) {
      console.log("token received")
      // user has either logged in manually or a access / refresh token is present on page load
      this.authenticate().then();
    }
  }

  /**
   * Checks whether the refresh token is still valid (e.g. has not been revoked)
   * and refreshes the access token
   *
   * @private
   */
  private async checkSession() {
    if (this.oAuthService.hasValidAccessToken()) {
      // if access token is valid, keycloak must be contacted to ensure that the token has not been revoked
      try {
        await this.oAuthService.refreshToken()
      } catch (e) {
        this.unAuthenticate()
      }
    } else {
      this.unAuthenticate();
    }
  }

  /**
   * Sets the isLoggedIn value, loads the userProfile and triggers an authenticationState update
   * @private
   */
  private async authenticate() {
      // @ts-ignore
      this.userProfile = (await this.oAuthService.loadUserProfile()).info;
      this.isLoggedIn.next(true);
  }


  /**
   * Method resets the authentication state in the frontend.
   * Typically called if a session expired
   *
   * @private
   */
  private unAuthenticate() {
    this.userProfile = null;
    this.isLoggedIn.next(false);
    this.resetStorage();
  }

  /**
   * Resets local storage items set by angular-oauth2-oidc.OAuthService
   *
   * @private
   */
  private resetStorage() {
    // removing from localstorage is necessary to reset angular-oauth2-oidc
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("id_token_expires_at");
    localStorage.removeItem("access_token_stored_at");
    localStorage.removeItem("id_token_stored_at");
    localStorage.removeItem("id_token_claims_obj");
    localStorage.removeItem("session_state");
    localStorage.removeItem("granted_scopes");
  }
}
