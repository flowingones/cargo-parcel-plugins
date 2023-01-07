import { inline, install, TwindConfig } from "@twind/core";
import { AfterRenderTaskContext } from "parcel/cargo/plugin.ts";

export function TwindPlugin<T extends TwindConfig>(options: T) {
  install(options, false);

  return {
    name: "Twind Plugin",
    plugin() {
      return {
        entryPoints: [],
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
