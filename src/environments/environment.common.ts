const issuerEndpoint = "https://cm-keycloak.cloud.iai.kit.edu/realms/BestRentalApp";
export const commonEnv = {
  oidc: {
    issuer_endpoint: issuerEndpoint,

    signup_endpoint: issuerEndpoint + "/protocol/openid-connect/registrations",

    authorization_endpoint: issuerEndpoint + "/protocol/openid-connect/auth",

    user_self_management_endpoint: issuerEndpoint + "/account",

    client_id: "best-rental-app-oc-v1.2",

    scope: "openid profile email",
  },
  pages: {
    login_page: "login-page",
    landing_page: "landing-page",
  }
};
