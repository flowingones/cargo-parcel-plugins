import { Plugin, PluginDefintions } from "parcel/cargo/plugin.ts";
import { html } from "parcel/cargo/mod.ts";
import { BUILD_ID } from "parcel/cargo/constants.ts";
import { Get, NotFoundException } from "cargo/http/mod.ts";
import { I18n, type I18nConfig } from "./mod.ts";

export function I18nPlugin(config: I18nConfig): Plugin {
  I18n.setup(config);
  return {
    name: "I18nPlugin",
    plugin(): PluginDefintions {
      Get("/", ({ request }) => {
        return Response.redirect(
          new URL(
            `/${config.defaultLanguage || "en"}`,
            new URL(request.url).origin,
          ),
        );
      });
      return {
        entryPoints: {
          plugin_i18n: new URL("./i18n.ts", import.meta.url).href,
        },
        scripts: [
          `<script type="module">import { setup } from "/_parcel/${BUILD_ID}/plugin_i18n.js"; setup(${
            JSON.stringify(
              config,
            )
          })</script>`,
        ],
        tasks: {
          beforeRender: [
            (ctx) => {
              const lang = I18n.langFrom(new URL(ctx.request.url));
              if (typeof lang === "undefined") {
                throw new NotFoundException();
              }
              if (!I18n.getLanguages().includes(I18n.getActiveLang())) {
                throw new NotFoundException();
              }
              html({ lang });
              return ctx;
            },
          ],
        },
      };
    },
  };
}
