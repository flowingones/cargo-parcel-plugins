import { get } from "assemble/mod.ts";
import { assertEquals } from "std/assert/mod.ts";
import { Label } from "label/label.ts";
import { ConfigPlugin } from "./plugin.ts";
import { BUILD_ID } from "parcel/cargo/constants.ts";

const labels = {
  name: "Anakin",
  "name!": "Luke",
};

const Plugin = ConfigPlugin({
  labels,
});

const plugin = Plugin.plugin({ assetsPath: "test" });

Deno.test(ConfigPlugin.name, async (t) => {
  await t.step('should have name "ConfigPlugin"', () => {
    assertEquals(Plugin.name, "ConfigPlugin");
  });

  await t.step("should have all expected props", () => {
    assertEquals(plugin.entryPoints, {
      "plugin_config": new URL("main.ts", import.meta.url).href,
    });
    assertEquals(plugin.scripts, [
      `<script type="module">import { config } from "/_parcel/${BUILD_ID}/plugin_config.js";config({"name!":"Luke"})</script>`,
    ]);
  });

  await t.step("should have access to label in Cargo Assemble", () => {
    assertEquals(
      get<Label<typeof labels>>("config").get("name!"),
      "Luke",
    );
    assertEquals(get<Label<typeof labels>>(Label).get("name"), "Anakin");
  });
});
