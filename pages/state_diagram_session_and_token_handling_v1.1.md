# State Diagram SessionAndTokenHandlingV1.1

![](figures/std_session_and_token_handling_v1.1.png)

The state diagram SessionAndTokenHandlingV1.1 models the changes of the values of the session variables isLoggedIn, userProfile in the AuthNModule and the access token and refresh token in the local storage in the transition to the different stages.

The initial state on page open is depicted as \<<Uninitialized\>> state. This refers to the unitialized state of AuthNService and is characterized by isLoggedIn and userProfile being undefined.

(checkSession()) This method is called when the landing page is opened (see sequence diagram PageInitV1.1).

([else]) (refreshToken()) (authenticate()) This is the case that Alice is already logged in. The OAuth access token gets successfully refreshed and Alice’s user details are loaded using OIDC.

(signIn()) (authenticate()) The flow of these state transitions is described by the sequence diagram LoginV1.1.

(refreshToken() before expiration of token) In the state \<<Authenticated\>>, the AuthNService of the OIDC library regularly refreshes access tokens before their expiration according to the OAuth protocol.  
([else]) In the case, a refresh of the token fails,  the AuthNService triggers an event, the AuthNService updates the user and isLoggedIn value, and the user sees that he has been logged out.

(signOut()) In the state \<<Authenticated\>> a user can sign-out which leads to the state \<<Unauthenticated\>> and a reset of all variables and tokens.
