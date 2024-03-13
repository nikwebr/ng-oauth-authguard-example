# Sequence Diagrams PageInitV1.1
The authentication flow with Keycloak involves two protocols: OAuth and OpenID Connect. To support a better differentiation of both protocols, the terms "OAuth" and "OIDC" are appended to all protocol-related expressions.

The first sequence diagram depicts the initialization of (\<<Service\>> AuthGuardService), the second shows the initialization of (\<<Component\>> AccountButtonComponent).

## Sequence Diagram AuthGuardV1.1
![](figures/sed_auth_guard_v1.1.png)

(\<<Component\>> AppRoutingModule) checks whether a route is allowed by evaluating a per route specified "canActivate" method

(\<<Service\>> AuthGuardService) Offers canActivate methods for routes that need authentication and routes that need an unauthenticated state. Both use AuthNService to evaluate the authentication state (see state diagram).

(\<<Service\>> AuthNService) Might not be initialized on route check => getLoginStatus() waits for AuthNService to complete its initialization

## Sequence Diagram AccountButtonV1.1
![](figures/sed_account_button_init_v1.1.png)

(\<<Service\>> AuthNService) Method "checkSession()" checks on page load whether an OAuth access and OAuth refresh token exists. If so, the method tries to refresh the access token. If this fails or such tokens do not exist, the user stays unauthenticated.

(\<<Component\>> AccountButtonComponent) Method "authStateWatcher.subscribe()" sets up a subscription to the authentication state of "AuthNService" on the first render of the component (see state diagram). This propagates authentication state changes of AuthNService to AccountButtonComponent and lets the component either display a login button or a menu button with logout option.
