# Sequence Diagrams LoginV1.1
An unauthenticated user can either log in on the login page or use the AccountButtonComponent. Both approaches use the same functionality of AuthNService to login but
differ in post handling.

## Sequence Diagram LoginV1.1
![](figures/sed_login_v1.1.png)
(login) Manual login process triggered by Alice

(\<<Actor\>> Alice) triggers a manual login using "AccountButtonComponent". The component calls a respective method on AuthNService which in turn calls a respective method on the OIDC library "angular-oauth2-oidc.OAuthService".  

(\<<Service\>> angular-oauth2-oidc.OAuthService) opens the Keycloak OAuth authorization endpoint with a code challenge as query parameter in a new browser popup.  

(\<<Browser\>> Keycloak Login Popup) Once Alice entered the login details and the login got processed, Keycloak redirects with an OAuth authorization code as query parameter to the page "/assets/silent-refresh.html".


(listening to session changes) Updating authentication state (see state diagram)

(\<<Browser\>> /assets/silent-refresh.html) The page "/assets/silent-refresh.html" reads the authorization code, passes it to the OIDC service and closes the browser window.  

(\<<Service\>> angular-oauth2-oidc.OAuthService) Exchanges the OAuth authorization code for an OAuth access and refresh token using Keycloak. Upon reception, the service fires an "token_received" event that gets caught by "AuthNService".  

(\<<Service\>> AuthNService) Catches the "token_received" event, fetches user infos using the OpenID Connect /userinfo endpoint on Keycloak, marks the authentication state as logged in and notifies all observers.  

(\<<Component\>> AccountButtonComponent) Refreshes the isLoggedIn and userProfile value and displays a welcome message.


## Sequence Diagram LoginPageV1.1
![](figures/sed_login_page_v1.1.png)
(login) Manual login process triggered by Alice

(\<<Actor\>> Alice) triggers a manual login using "LoginPageComponent". 

(\<<Component\>> LoginPageComponent) The login page calls and waits for the async "login" method of AuthNService which in turn calls a respective method on the OIDC library "angular-oauth2-oidc.OAuthService".

... the authentication process is the same as in sequence diagram LoginV1.1 ...

(\<<Component\>> LoginPageComponent) Once the "login" method resolves, routing to landing-page is triggered

(\<<Module\>> AppRoutingModule) Checks whether redirection to landing-page is allowed

(\<<Service\>> AuthGuardService) Needs to wait for the AuthNService to propagate the authentication state as handling the OAuthEvent triggered by the authentication and navigating to the landing page happens at the same time.
This is achieved by setting the "isLoggedIn" value to undefined on the login() method and waiting for the AuthNService to resolve the getLoginStatus() method.



