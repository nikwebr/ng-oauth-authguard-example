import {merge} from "lodash";
import {commonEnv} from "./environment.common";

export const prodEnv = {
  production: true,
};



export const environment = merge(commonEnv, prodEnv);
