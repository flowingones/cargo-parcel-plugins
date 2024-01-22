import { Plugin, PluginDefintions } from "parcel/cargo/plugins/plugins.ts";
import { html } from "parcel/cargo/pages/html.ts";
import { BUILD_ID } from "parcel/cargo/constants.ts";
import { Get } from "cargo/http/mod.ts";
import { I18n, type I18nConfig } from "./mod.ts";
import {
  LanguageNotSupportedException,
  NoLanguageSpecifiedException,
} from "./exceptions.ts";

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
          `<script type="module">import { I18n } from "/_parcel/${BUILD_ID}/plugin_i18n.js"; I18n.setup(${
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
                throw new NoLanguageSpecifiedException();
              }
              if (!I18n.getLanguages().includes(lang)) {
                throw new LanguageNotSupportedException();
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
