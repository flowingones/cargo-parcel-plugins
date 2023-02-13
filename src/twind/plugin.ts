import { inline, install } from "@twind/core";
import { join } from "https://deno.land/std@0.159.0/path/mod.ts";
import {
  AfterRenderTaskContext,
  Plugin,
  PluginDefintions,
} from "parcel/cargo/plugin.ts";
import { info } from "cargo/utils/mod.ts";

export async function TwindPlugin(): Promise<Plugin> {
  try {
    const config = (await import(join(Deno.cwd(), "./config/twind.ts")))
      .default;

    install(config || {});
  } catch (e) {
    info("Twind Plugin", "'config/twind.ts' could not be loaded", "Parcel");
    console.error(e.message);
  }

  return {
    name: "Twind Plugin",
    plugin(): PluginDefintions {
      return {
        entryPoints: {
          "plugin_twind_config": `${Deno.cwd()}/config/twind.ts`,
          "plugin_twind": new URL("./twind.ts", import.meta.url).href,
        },
        scripts: [
          `<script type="module">import { twind } from "/plugin_twind.js"; twind()</script>`,
        ],
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
