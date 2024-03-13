import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OAuthModule, OAuthStorage} from "angular-oauth2-oidc";
import {HttpClientModule} from "@angular/common/http";

// use localStorage instead of sessionStorage to enable sso with multiple browser tabs
export function storageFactory() : OAuthStorage {
  return localStorage
}
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
        // include access token in http requests to urls included in allowedUrls
        sendAccessToken: true,
        allowedUrls: ['https://www.angular.at/api/']
      }
    }),
  ],
  exports: [],
  declarations: [],
  providers: [
    { provide: OAuthStorage, useFactory: storageFactory }
  ],
})
export class AuthNModule {
}
