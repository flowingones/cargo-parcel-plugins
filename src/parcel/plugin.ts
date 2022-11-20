import { inline, install } from "@twind/core";
import { AfterRenderTaskContext } from "parcel/cargo/plugin.ts";
interface TwindPluginOptions {
  version?: string;
  twindConfig: any;
}

export function TwindPlugin(options: TwindPluginOptions) {
  install(options, false);

  return {
    name: "Twind Plugin",
    plugin() {
      return {
        entryPoints: [],
        tasks: {
          afterRender: [(ctx: AfterRenderTaskContext) => {
            return inline(ctx.pageHtml);
          }],
        },
      };
    },
  };
}
