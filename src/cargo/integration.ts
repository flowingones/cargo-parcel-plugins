import { setup } from "../mod.ts";
import { getStyleTag, virtualSheet } from "../sheets/mod.ts";

export const vsheet = virtualSheet();
let twindConfig: any = {};

export const TwindIntegration = {
  getStyles(): string {
    const styleTag = getStyleTag(vsheet);
    /* @ts-ignore */
    vsheet.reset();
    return styleTag;
  },
  getConfig(): any {
    const { ...config } = twindConfig;
    return config;
  },
};

export function setupTwind(config: any): () => void {
  twindConfig = config;
  return () => {
    setup({ sheet: vsheet, ...config });
  };
}
