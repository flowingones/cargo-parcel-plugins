import { install } from "@twind/core";
import config from "config/twind.ts";

export function twind() {
  install(config);
}
