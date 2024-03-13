const issuerEndpoint = "https://keycloak-instance.de/realms/myRealm";
export const commonEnv = {
  oidc: {
    issuer_endpoint: issuerEndpoint,

    signup_endpoint: issuerEndpoint + "/protocol/openid-connect/registrations",

    authorization_endpoint: issuerEndpoint + "/protocol/openid-connect/auth",

    user_self_management_endpoint: issuerEndpoint + "/account",

    client_id: "my-client-id",

    scope: "openid profile email",
  },
  pages: {
    login_page: "login-page",
    landing_page: "landing-page",
  }
};
