// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {merge} from "lodash";
import {commonEnv} from "./environment.common";

const devEnv = {
  production: false
};

export const environment = merge(commonEnv, devEnv);
