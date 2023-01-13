import { inline, install, TwindConfig } from "@twind/core";
import { AfterRenderTaskContext, Plugin } from "parcel/cargo/plugin.ts";

export function TwindPlugin<T extends TwindConfig>(options: T): Plugin {
  // TODO: only default to false if islands are available
  if (typeof options.hash === "undefined") {
    options.hash = false;
  }
  install(options);

  return {
    name: "Twind Plugin",
    plugin() {
      return {
        tasks: {
          afterRender: [
            (ctx: AfterRenderTaskContext) => {
              return inline(ctx.pageHtml);
            },
          ],
        },
      };
    },
  };
}
