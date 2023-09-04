import { inline, install } from "@twind/core";
import { join, toFileUrl } from "std/path/mod.ts";
import {
  AfterRenderTaskContext,
  Plugin,
  PluginContext,
  PluginDefintions,
} from "parcel/cargo/plugins/plugins.ts";
import { info } from "cargo/utils/mod.ts";

export async function TwindPlugin(config?: any): Promise<Plugin> {
  try {
    if (!config) {
      config = (
        await import(
          new URL(join(toFileUrl(Deno.cwd()).href, `./config/twind.ts`)).href
        )
      ).default;
    }

    install(config || {});
  } catch (e) {
    info("Twind Plugin", "'config/twind.ts' could not be loaded", "Parcel");
    console.error(e.message);
  }

  return {
    name: "Twind Plugin",
    plugin(ctx: PluginContext): PluginDefintions {
      return {
        entryPoints: {
          plugin_twind: new URL("./twind.ts", import.meta.url).href,
        },
        scripts: [
          `<script type="module">import { twind } from "/${ctx.assetsPath}/plugin_twind.js"; twind()</script>`,
        ],
        tasks: {
          afterRender: [
            (ctx: AfterRenderTaskContext) => {
              return {
                ...ctx,
                pageHtml: inline(ctx.pageHtml),
              };
            },
          ],
        },
      };
    },
  };
}
