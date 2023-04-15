import { Plugin, PluginDefintions } from "parcel/cargo/plugin.ts";
import { BUILD_ID } from "parcel/cargo/constants.ts";
import { I18nConfig, reset, set, setup } from "./i18n.ts";

export function I18nPlugin({
  languages,
  defaultLanguage,
  pattern,
}: I18nConfig): Plugin {
  setup({ defaultLanguage, languages, pattern });
  return {
    name: "I18nPlugin",
    plugin(): PluginDefintions {
      return {
        entryPoints: {
          plugin_i18n: new URL("./i18n.ts", import.meta.url).href,
        },
        scripts: [
          `<script type="module">import { setup } from "/_parcel/${BUILD_ID}/plugin_i18n.js"; setup(${
            JSON.stringify(
              { defaultLanguage, languages, pattern },
            )
          })</script>`,
        ],
        tasks: {
          beforeRender: [
            (ctx) => {
              set(ctx.request);
            },
          ],
          afterRender: [
            (ctx) => {
              reset();
              return ctx.pageHtml;
            },
          ],
        },
      };
    },
  };
}
