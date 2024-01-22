import { Label, Labels, LabelsOptions } from "label/label.ts";
import { assemble, get } from "assemble/assemble.ts";
import {
  PluginContext,
  PluginDefintions,
} from "parcel/cargo/plugins/plugins.ts";

export function ConfigPlugin<T extends Labels>(options: LabelsOptions<T>) {
  // Setup Label for the server
  assemble({
    token: "labels",
    value: options,
  });
  assemble({ class: Label, dependencies: ["labels"] });
  assemble({ token: "config", value: get(Label) });

  const config = <Label<T>> get("config");

  return {
    name: "ConfigPlugin",
    plugin(ctx: PluginContext): PluginDefintions {
      return {
        entryPoints: {
          plugin_config: new URL("./main.ts", import.meta.url).href,
        },
        scripts: [
          `<script type="module">import { config } from "/${ctx.assetsPath}/plugin_config.js";config(${
            JSON.stringify(filterAllowedInBrowser(config.getAll()))
          })</script>`,
        ],
      };
    },
  };
}

/**
 * Function to filter only explicitly allowed labels for the browser.
 * Only labels which are appended with a "!" are used in the browser.
 */
function filterAllowedInBrowser(labels: Labels) {
  const allowedLabels: Labels = {};
  for (const key in labels) {
    const chars = [...key];
    if (chars[chars.length - 1] === "!") {
      if (
        typeof labels[key] === "string" || typeof labels[key] === "number" ||
        typeof labels[key] === "boolean"
      ) {
        allowedLabels[key] = labels[key];
        continue;
      }
      allowedLabels[key] = filterAllowedInBrowser(<Labels> labels[key]);
    }
  }
  return allowedLabels;
}
