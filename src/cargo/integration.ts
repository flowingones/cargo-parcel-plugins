import { setup } from "../mod.ts";
import { getStyleTag, virtualSheet } from "../sheets/mod.ts";

export const vsheet = virtualSheet();

export const TwindIntegration = {
  getStyles(): string {
    const styleTag = getStyleTag(vsheet);
    /* @ts-ignore */
    vsheet.reset();
    return styleTag;
  },
};

export function setupTwind(config: any): () => void {
  return () => {
    setup({ sheet: vsheet, ...config });
  };
}
